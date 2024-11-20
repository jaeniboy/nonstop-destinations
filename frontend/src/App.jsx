import { useState } from 'react'
// import './App.css'
import StationSearch from './StationSearch';
import Destinations from './Destinations';

function App() {

  const [destinations, setDestinations] = useState([])

  const sendDestinations = (destinations) => {
    console.log(destinations)
    setDestinations(destinations)
  } 

  return (
    <>
      <div className="flex flex-col justify-center ">
        <div className="w-full justify-center text-center">
          <h1 className="text-2xl">Nonstop Destinations</h1>
        </div>
        <div className="w-full flex justify-center mt-8">
          <StationSearch sendDestinations={sendDestinations}/>
        </div>
        <div className="w-full flex justify-center mt-5 text-center">
          <Destinations destinations={destinations}/>
        </div>
      </div>
    </>
  )
}

export default App
