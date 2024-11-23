import React, { useState } from 'react';
import { stations } from '../data/stations';

const StationSearch = ({sendStations}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const filteredSuggestions = stations.filter(station =>
      station.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSelectStation = (station) => {
    setInputValue(station.name);
    setSuggestions([]);
    fetchStationData(station.id)
  };

  const fetchStationData = async (stationId) => {
    try {
        const response = await fetch(`http://localhost:3000/destinations?station=${stationId}&radius=1000`)
        const data = await response.json();
        const dataSorted = data.sort((a,b) => b.destinations.length - a.destinations.length)
        sendStations(dataSorted)
    } catch(error) {
        console.log(error)
    }
  }

  return (
    <div className="relative w-64">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Bahnhof suchen"
        className="
            w-full 
            px-4 
            py-2 
            border 
            border-gray-300 
            rounded-md 
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-500 
            focus:border-transparent
        "
      />
      {suggestions.length > 0 && (
        <ul className="
            absolute 
            z-10 
            w-full 
            mt-1 
            bg-white 
            border 
            border-gray-300 
            rounded-md 
            shadow-lg 
            max-h-60 
            overflow-auto
        ">
          {suggestions.map(station => (
            <li 
              key={station.id} 
              onClick={() => handleSelectStation(station)}
              className="
                px-4 
                py-2 
                hover:bg-gray-100 
                cursor-pointer
              "
            >
              {station.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StationSearch;