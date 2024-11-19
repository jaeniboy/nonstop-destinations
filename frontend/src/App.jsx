import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StationSearch from './StationSearch';

function App() {

  return (
    <>
      <div className="">
        <h1 className="text-2xl">Nonstop Destinations</h1>
        <div className="w-full flex justify-center mt-8">
          <StationSearch />
        </div>
      </div>
    </>
  )
}

export default App
