import React, { useState } from 'react';
import axios from 'axios'
import { BsSearch } from "react-icons/bs";

const StationSearch = ({ sendDepartureStation, displayValue = "" }) => {
  const [inputValue, setInputValue] = useState(displayValue);
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 1) {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/autocompleteRmv?input=${value}`);
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
    sendDepartureStation(station)
    // sendDepartureStation(station.id)
  };

  return (
    <div className="relative w-full">
      <div className="flex">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="search station"
          onFocus={(e) => e.target.select()}
          className="
            text-sm
            text-gray-600
            w-full
            py-2
            border-b-2
            border-solid
            border-gray-400 
            bg-transparent
            focus:border-b-3
            focus:border-indigo-500
            focus:outline-none
        "
        />
      </div>

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
              key={station.rmvId}
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
