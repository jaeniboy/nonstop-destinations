import { useState, useEffect } from 'react'
import StationSearch from './StationSearch';
import Options from './Options';
import LoadingSpinner from './LoadingSpinner';
import Destinations from './Destinations';
import Map from "./Map";
import SuggestionTitleBox from './SuggestionTitleBox';
import SuggestionPlaces from './SuggestionPlaces';
import logo from './assets/nsd_logo_all_path_white.svg';
import Alert from './Alert';
import { BsGear } from "react-icons/bs";
import { extractCityName } from './SuggestionPlaces';

function App() {

  const [originalStations, setOriginalStations] = useState([])
  const [stations, setStations] = useState([])
  const [stationDisplayIndex, setStationDisplayIndex] = useState(null)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [retry, setRetry] = useState(false)
  const [departureStation, setDepartureStation] = useState('')
  const [radius, setRadius] = useState(1000)
  const [showOptions, setShowOptions] = useState(false)
  const [options, setOptions] = useState({
    mindist: 20,
    maxtime: 90,
    maxwalk: 1000
  })
  const [description, setDescription] = useState("Description")
  const station = stations[stationDisplayIndex]

  useEffect(() => {
    originalStations.length !== 0 && showStations()
  }, [originalStations])

  useEffect(() => {
    generateDescriptions()
  }, [stationDisplayIndex])


  const sendDepartureStation = (stationId) => {
    setDepartureStation(stationId)
    fetchStationData(stationId)
  }

  const sendAlert = (message, type) => {
    setRetry(false)
    setAlert({ show: true, message, type });
    setLoading(false);
  }

  const retryLoading = () => {
    setAlert({ show: false, message: '', type: '' });
    setRetry(true)
    fetchStationData(departureStation)
  }

  const nextStation = () => {
    setDescription("")
    setStationDisplayIndex(stationDisplayIndex + 1)
  }

  const previousStation = () => {
    setStationDisplayIndex(stationDisplayIndex - 1)
  }

  const fetchStationData = async (stationId) => {

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
      // showStations(data) // call filter and sorting logic

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
      cityName: extractCityName(station.name),
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

  return (
    <>
      <div className="flex flex-col justify-center h-full h-screen overflow-hidden">
        {/* Header */}
        <div>
          <div className="w-full flex items-center pt-3 pb-3 bg-primary rounded-b-2xl px-5 ">
            <img src={logo} className="h-14 hidden sm:block" />
            <div className="w-full flex justify-center">
              <StationSearch
                sendDepartureStation={sendDepartureStation}
              />
            </div>
            <div onClick={toggleOptions} className="flex ml-3 cursor-pointer items-center text-white">
              <span className="text-xl">
                <BsGear />
              </span><div className="h-full ml-2 content-center hidden sm:block">Options</div>
            </div>
          </div>
          {stations.length != 0 && !loading && !alert.show &&
            <div className="w-full sm:w-full md:w-4/5 xl:w-3/5 mx-auto">
              <div className="w-full lg:w-4/5 mx-auto lg:pb-5">
                <SuggestionTitleBox
                  stationName={station.name}
                  index={stationDisplayIndex}
                  nextStation={nextStation}
                  previousStation={previousStation}
                  lastSuggestion={stations.length}
                  station={station}
                />
              </div>
          </div>}
        </div>
        {/* Main content */}
        <div className='flex-1 overflow-y-scroll'>
          {showOptions &&
            <Options
              options={options}
              optionsChange={handleOptionsChange}
              onSave={handleSaveOptions}
            />
          }

          {loading && <LoadingSpinner />}

          {alert.show && <Alert message={alert.message} type={alert.type} retry={retryLoading} />}

          {originalStations.length === 0 && !loading &&
            <div className="w-full flex justify-center items-center mt-7">
              <div className="w-3/4 text-center">Find interesting places in your area that are accessible by public transport without transfers. Please select your starting point ... </div>
            </div>
          }

          {stations.length === 0 && !loading && originalStations.length != 0 &&
            <div className="w-full text-center mt-7"><div>No suggestions.</div><div> Please choose different options or try another station.</div></div>
          }

          {stations.length != 0 && !loading && !alert.show &&
            <div className="w-full sm:w-full md:w-4/5 xl:w-3/5 mx-auto">              

              <div className="mb-5 px-5 md:px-0">
                {description}
              </div>

              <div className="w-full flex flex-col lg:flex-row">


                <div className="w-full lg:w-1/2 h-[400px]">
                  <Map
                    station={station}
                    radius={radius}
                  />
                </div>


                <div className="w-full lg:w-1/2">
                  <SuggestionPlaces data={station} />
                </div>
              </div>
            </div>}
        </div>
      </div>
    </>
  )
}

export default App
