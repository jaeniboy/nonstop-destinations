import { useState, useEffect } from 'react'
import StationSearch from './StationSearch';
import Options from './Options';
import LoadingSpinner from './LoadingSpinner';
import Destinations from './Destinations';
import Map from "./Map";
import SuggestionTitleBox from './SuggestionTitleBox';
import SuggestionPlaces from './SuggestionPlaces';
import logo from './assets/nsd_logo_all_path_white.svg';
import logoBlack from './assets/nsd_logo_all_path.svg';
import Alert from './Alert';
import { BsGear } from "react-icons/bs";
import { extractCityName } from './SuggestionPlaces';
import Example from './Example'
import BottomSheet from './BottomSheet';
import { BsSearch } from "react-icons/bs";
import { BsXLg } from "react-icons/bs";

function App() {

  const [healthy, setHealthy] = useState(false)
  const [originalStations, setOriginalStations] = useState([])
  const [stations, setStations] = useState([])
  const [stationDisplayIndex, setStationDisplayIndex] = useState(null)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [retry, setRetry] = useState(false)
  const [departureStation, setDepartureStation] = useState({})
  const [radius, setRadius] = useState(1000)
  const [showOptions, setShowOptions] = useState(false)
  const [options, setOptions] = useState({
    mindist: 20,
    maxtime: 90,
    maxwalk: 1000
  })
  const [description, setDescription] = useState("")
  const [showPlaces, setShowPlaces] = useState(false)
  const station = stations[stationDisplayIndex]

  useEffect(() => {
    originalStations.length !== 0 && showStations()
    setDescription("")
    generateDescriptions()
  }, [originalStations])

  useEffect(() => {
    generateDescriptions()
  }, [stationDisplayIndex])


  const sendDepartureStation = (stationId) => {
    setDepartureStation(stationId)
    fetchStationData(stationId.rmvId)
  }

  const sendAlert = (message, type) => {
    setRetry(false)
    setAlert({ show: true, message, type });
    setLoading(false);
  }

  const retryLoading = () => {
    setAlert({ show: false, message: '', type: '' });
    setRetry(true)
    fetchStationData(departureStation.rmvId)
  }

  const nextStation = () => {
    setDescription("")
    setStationDisplayIndex(stationDisplayIndex + 1)
  }

  const previousStation = () => {
    setStationDisplayIndex(stationDisplayIndex - 1)
  }

  const fetchStationData = async (stationId) => {
    console.log(stationId)
    setLoading(true)
    setAlert({ show: false, message: '', type: '' });
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/destinations?station=${stationId}&radius=3000`)
      // const response = await fetch(`${API_URL}/destinations?station=${stationId}&radius=${radius}`)
      const data = await response.json();

      if (!data.stations || data.stations.length === 0) {
        sendAlert('No data found', 'error')
        return;
      }

      if (!data.metadata.isComplete) {
        sendAlert(data.metadata.message, 'warning');
      }

      if (alert.show && !alert.type === "warning") {
        setAlert({ show: false, message: '', type: '' });
      }
      setLoading(false)
      setRetry(false)
      setOriginalStations(data)

    } catch (error) {

      sendAlert('Error loading data', 'error')
      console.log(error)

    }
  }

  const showStations = () => {
    const dataFiltered = filterStationData(originalStations)
    const dataSorted = sortStationData(dataFiltered)
    setStations(dataSorted)
    setRadius(options.maxwalk)
    setStationDisplayIndex(0)
  }

  const filterStationData = (data) => {
    const stationsFiltered = {
      ...data,
      stations: data.stations.filter(d => d.travelTime[0] <= options.maxtime && d.distance >= options.mindist * 1000)
    }
    const filterdByMaxwalk = {
      ...stationsFiltered,
      stations: stationsFiltered.stations.map(d => {
        return {
          ...d,
          destinations: d.destinations.filter(e => e.distance <= options.maxwalk)
        }
      })
    }
    // remove all stations without any destination
    const destinationsFiltered = {
      ...filterdByMaxwalk,
      stations: filterdByMaxwalk.stations.filter(d => d.destinations.length > 0)
    }
    return destinationsFiltered
  }

  const sortStationData = (data) => {
    // compute cummulative rankingValues
    data.stations.forEach(station => {
      station.rankingValue = station.destinations.reduce((acc, curr) => {
        return acc + curr.rankingValue
      }, 0)
    })
    console.log(data)

    return data.stations.sort((a, b) => b.rankingValue - a.rankingValue)
  }

  const generateDescriptions = async () => {

    const payload = {
      stationName: station.name,
      // cityName: extractCityName(station.name),
      destinations: station.destinations,
      language: "german"
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/description`, options)
    const data = await response.json();
    setDescription(data.choices[0].message.content)
  }

  const toggleOptions = () => {
    setShowOptions(!showOptions)
  }

  const handleSaveOptions = () => {
    originalStations.length !== 0 && showStations()
    setShowOptions(false)
  }

  const handleOptionsChange = (options) => {
    setOptions(options)
  }

  const checkHealth = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        setHealthy(true);
      } else {
        setHealthy(false);
      }
    } catch (error) {
      setHealthy(false);
    }
  };

  checkHealth()

  const ContentBox = () => {

    const toggleShowPlaces = () => {
      setShowPlaces(!showPlaces)
    }

    return (
      <div className="relative h-full">
        <div className="h-full flex-col content-start p-5">
          <div className="">
            <SuggestionTitleBox
              stationName={station.name}
              index={stationDisplayIndex}
              nextStation={nextStation}
              previousStation={previousStation}
              lastSuggestion={stations.length}
              station={station}
              departureStation={departureStation}
              sendDepartureStation={sendDepartureStation}
            />
          </div>
          <div className="mb-5 md:my-14 mt-2 md:px-0 text-gray-600 text-sm/6 tracking-wide">
            {description}
          </div>
          <div className="flex justify-center">
            <button onClick={toggleShowPlaces} className="bg-indigo-600 px-2 py-1 rounded-sm text-indigo-100 ">
              show details
            </button>
          </div>
        </div>
        <div className={`
            fixed bottom-0
            overflow-auto 
            bg-white
            w-full
            md:h-full
            top-0 absolute 
            transition-all duration-300 ease-in-out
            md:translate-y-0
            py-5
            pl-5
            ${showPlaces ? "translate-y-0 md:translate-x-0" : "translate-y-full md:-translate-x-full"}`
        }>
          <div onClick={toggleShowPlaces} className="flex justify-end pr-5 cursor-pointer">
            <BsXLg/>
          </div>
          <SuggestionPlaces data={station} />
        </div>
      </div>
    )
  }

  return (
    <>

      {!healthy ?
        <div className="flex flex-col min-h-screen justify-center items-center text-center animate-pulse">
          <img src={logoBlack} className=""></img>
          <div className="mt-8">
            ... waiting for backend server to be ready
          </div>
        </div>
        :

        <div className="flex flex-col justify-center h-full h-screen overflow-hidden bg-indigo-50">
          <div className="z-[10001]">
            <div className="w-full place-content-between flex items-center pt-3 pb-3 bg-indigo-500 px-5 h-14">
              <img src={logo} className="h-8 md:h-11 lg:h-12" />
              <div className="">

              </div>
              <div onClick={toggleOptions} className="flex ml-3 cursor-pointer items-center text-white">
                <span className="text-xl">
                  <BsGear />
                </span><div className="h-full ml-2 content-center hidden sm:block">Options</div>
              </div>
            </div>
            {stations.length != 0 && !loading && !alert.show &&
              <div className="w-full md:w-4/5 xl:w-3/5 mx-auto">
                <div className="w-full px-4 md:px-0 lg:w-4/5 mx-auto">
                  <BottomSheet>
                    {ContentBox()}
                  </BottomSheet>
                </div>
              </div>}
          </div>

          <div className='flex-1 overflow-y-scroll'>
            {showOptions &&
              <Options
                options={options}
                optionsChange={handleOptionsChange}
                onSave={handleSaveOptions}
              />
            }

            {loading &&
              <div className="h-full flex items-center">
                <LoadingSpinner />
              </div>
            }

            {alert.show && <Alert message={alert.message} type={alert.type} retry={retryLoading} />}

            {originalStations.length === 0 && !loading &&
              <div className="flex justify-center items-center h-full">
                <div className="w-full lg:w-2/3 flex flex-col justify-center items-center">
                  <blockquote class="flex flex-col justify-center w-3/4 lg:w-1/2 text-3xl font-semibold text-start mb-11 px-4 text-gray-900">
                    <div className="flex justify-center">
                      <div className="text-indigo-500 text-6xl item-end mr-4 content-end">„</div>
                      <div className="content-center">
                        <p>Changing trains sucks!</p>
                      </div>
                      <div className="text-indigo-500 text-6xl item-end ml-4 content-start">“</div>
                    </div>
                    <footer class="mt-4 text-base font-normal text-end text-gray-400">- some guy with kids</footer>
                  </blockquote>
                  <div className="w-3/4 text-start text-gray-700">Use this tool to find interesting places in your area that are accessible by public transport without transfers.</div>
                  <div className="w-3/5 mt-20 flex items-center">
                    <StationSearch
                      sendDepartureStation={sendDepartureStation}
                    />
                    <div className="text-gray-600 ml-2"><BsSearch /></div>
                  </div>
                </div>
              </div>
            }

            {stations.length === 0 && !loading && originalStations.length != 0 &&
              <div className="w-full text-center mt-7"><div>No suggestions.</div><div> Please choose different options or try another station.</div></div>
            }

            {stations.length != 0 && !loading && !alert.show &&
              <div className="w-full h-full mx-auto">
                <div className="w-full h-full flex flex-col md:flex-row">
                  <div className="hidden md:block w-1/2 h-full bg-white z-[1001] shadow-[3px_-3px_9px_0px_rgba(0,0,0,0.2)]">
                    {ContentBox()}
                  </div>
                  <div className="">
                    <div className="w-full md:w-1/2 h-96 md:h-full absolute top-0 pt-14 pr-2">
                      <Map
                        station={station}
                        radius={radius}
                      />
                    </div>
                  </div>
                </div>
              </div>}
          </div>
        </div>
      }

    </>

  )
}

export default App
