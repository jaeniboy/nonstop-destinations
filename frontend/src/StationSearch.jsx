import React, { useState } from 'react';
import axios from 'axios'

const StationSearch = ({ sendDepartureStation }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 1) {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/autocompleteRmv?input=${value}`);
        // const response = await axios.get(`${API_URL}/autocomplete?input=${value}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectStation = (station) => {
    setInputValue(station.name);
    setSuggestions([]);
    sendDepartureStation(station.dbId)
    // sendDepartureStation(station.id)
  };

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
            border-primary
            rounded-md 
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-500 
            focus:ring-primary
            focus:border-transparent
        "
      />
      {suggestions.length > 0 && (
        <ul className="
            absolute 
            z-[1000] 
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
