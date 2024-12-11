import { useState } from 'react'
import StationSearch from './StationSearch';
import Settings from './Settings';
import LoadingSpinner from './LoadingSpinner';
import Destinations from './Destinations';
import Map from "./Map";
import SuggestionTitleBox from './SuggestionTitleBox';
import SuggestionPlaces from './SuggestionPlaces';
import logo from './assets/nsd_logo_all_path_white.svg';
import Alert from './Alert';

function App() {

  const [originalStations, setOriginalStations] = useState([])
  const [stations, setStations] = useState([])
  const [stationDisplayIndex, setStationDisplayIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [retry, setRetry] = useState(false)
  const [departureStation, setDepartureStation] = useState('')
  const [mindist, setMindist] = useState(20)
  const [maxtime, setMaxtime] = useState(90)
  const [maxwalk, setMaxwalk] = useState(1000)
  const [radius, setRadius] = useState(1000)

  const station = stations[stationDisplayIndex]

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
      showStations() // call filter and sorting logic

    } catch (error) {

      sendAlert('Error loading data', 'error')
      console.log(error)

    }
  }

  const showStations = () => {
    const dataFiltered = filterStationData(originalStations)
    const dataSorted = sortStationData(dataFiltered)
    setStations(dataSorted)
    setRadius(maxwalk)
    setStationDisplayIndex(0)
  }

  const filterStationData = (data) => {
    console.log(data)
    const stationsFiltered = {
      ...data,
      stations: data.stations.filter(d => d.travelTime[0] <= maxtime && d.distance >= mindist*1000)
    }
    const destinationsFiltered = {
      ...stationsFiltered,
      stations: stationsFiltered.stations.map(d => {
        return {
          ...d,
          destinations: d.destinations.filter(e => e.distance <= maxwalk)
        }
    })}
    return destinationsFiltered
  }

  const sortStationData = (data) => {
    return data.stations.sort((a, b) => b.destinations.length - a.destinations.length)
  }

  const mindistChange = (event) => {
    const newValue = event.target.value
    setMindist(newValue)
    console.log("mindist:", mindist)
  }

  const maxtimeChange = (event) => {
    const newValue = event.target.value
    setMaxtime(newValue)
  }

  const maxwalkChange = (event) => {
    const newValue = event.target.value
    setMaxwalk(newValue)
  }

  return (
    <>
      <div className="flex flex-col justify-center h-full">
        <div>
          <div className="w-full flex justify-center text-center pt-5 pb-10 bg-primary rounded-b-3xl">
            <img src={logo} className="h-16" />
          </div>
        </div>

        <div className="w-full flex justify-center relative -translate-y-1/4">
          <StationSearch
            sendDepartureStation={sendDepartureStation}
          />
        </div>

        <Settings 
          mindistChange={mindistChange} 
          maxtimeChange={maxtimeChange}
          maxwalkChange={maxwalkChange}
          mindist={mindist}
          maxtime={maxtime} 
          maxwalk={maxwalk}
          handleSaveSettings={showStations}
        />

        {loading && <LoadingSpinner />}
        
        {alert.show && <Alert message={alert.message} type={alert.type} retry={retryLoading} />}

        {stations.length != 0 && !loading && !alert.show &&
          <div className="w-full sm:w-full md:w-4/5 lg:w-1/2 mx-auto">

            <SuggestionTitleBox
              stationName={station.name}
              index={stationDisplayIndex}
              nextStation={nextStation}
              previousStation={previousStation}
              lastSuggestion={stations.length}
              station={station}
            />

            <div className="w-full sm:w-full md:w-4/5 lg:w-1/2 mx-auto h-[400px]">
              <Map
                station={station}
                radius={radius}
              />
            </div>

            <div>
              <SuggestionPlaces data={station} />
            </div>

          </div>}
      </div>
    </>
  )
}

export default App
