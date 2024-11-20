// import { useState } from 'react'
// import './App.css'
import StationSearch from './StationSearch';

function App() {

  return (
    <>
      <div className="flex flex-col justify-center ">
        <div className="w-full justify-center">
          <h1 className="text-2xl">Nonstop Destinations</h1>
        </div>
        <div className="w-full flex justify-center mt-8">
          <StationSearch />
        </div>
      </div>
    </>
  )
}

export default App
