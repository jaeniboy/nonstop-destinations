import React, { useState } from 'react';
import { stations } from '../data/stations';

const StationSearch = () => {
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
    console.log(`Selected station ID: ${station.id}`);
  };

  return (
    <div className="relative w-64">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Bahnhof suchen"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map(station => (
            <li 
              key={station.id} 
              onClick={() => handleSelectStation(station)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
