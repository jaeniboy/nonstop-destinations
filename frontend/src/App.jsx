import { useState } from 'react'
// import './App.css'
import StationSearch from './StationSearch';
import Destinations from './Destinations';
import Map from "./Map";
import logo from './assets/nsd_logo.svg'

function App() {

  const [stations, setStations] = useState([])
  const [stationDisplayIndex, setStationDisplayIndex] = useState(0)

  const sendStations = (stations) => {
    setStations(stations)
  }

  const nextStation = () => {
    setStationDisplayIndex(stationDisplayIndex + 1)
  }

  return (
    <>
      <div className="flex flex-col justify-center">
        <div className="w-full flex justify-center text-center mt-5">
          <img src={logo} />
        </div>
        <button onClick={nextStation}>next</button>
        <div className="w-full flex justify-center mt-8">
          <StationSearch sendStations={sendStations} />
        </div>
        {stations.length != 0 && <Map station={stations[stationDisplayIndex]}/>}
        <div className="w-full flex justify-center mt-5 text-center">
          <Destinations stations={stations} />
        </div>
      </div>
    </>
  )
}

export default App
