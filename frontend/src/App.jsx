import { useState } from 'react'
// import './App.css'
import StationSearch from './StationSearch';
import LoadingSpinner from './LoadingSpinner';
import Destinations from './Destinations';
import Map from "./Map";
import SuggestionTitleBox from './SuggestionTitleBox';
import SuggestionInfoBox from './SuggestionInfoBox';
// import logo from './assets/nsd_logo.svg'
import logo from './assets/nsd_logo_all_path_white.svg'

function App() {

  const [stations, setStations] = useState([])
  const [stationDisplayIndex, setStationDisplayIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const station = stations[stationDisplayIndex]

  const sendStations = (stations) => {
    setLoading(false)
    setStations(stations)
  }

  const startLoading = () => {
    setLoading(true)
  }

  const nextStation = () => {
    setStationDisplayIndex(stationDisplayIndex + 1)
  }

  const previousStation = () => {
    setStationDisplayIndex(stationDisplayIndex - 1)
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
            <StationSearch sendStations={sendStations} startLoading={startLoading} />
          </div>
        {loading && <LoadingSpinner />}

        {stations.length != 0 && !loading &&
          <>
            <SuggestionTitleBox
              stationName={station.name}
              index={stationDisplayIndex}
              nextStation={nextStation}
              previousStation={previousStation}
              lastSuggestion={stations.length} />
            <div className="w-full aspect-square md:w-1/2 lg:w-3/10 p-4">
              <Map 
              station={station} 
              radius={1000}
              />
            </div>
            <div>
              <SuggestionInfoBox data={station} />
            </div>
          </>}
      </div>
    </>
  )
}

export default App
