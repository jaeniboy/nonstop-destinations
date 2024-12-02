import React from "react";
import { BsChevronRight } from "react-icons/bs";
import { BsChevronLeft } from "react-icons/bs";
import { IconContext } from "react-icons";

const SuggestionTitleBox = ({ stationName, index, nextStation, previousStation, lastSuggestion }) => {
    const suggestionNumber = index + 1
    return (
        <IconContext.Provider value={{ className: "text-2xl text-gray-400" }}>
            <div className="flex justify-between px-5 py-3 shadow-lg items-center" style={{"z-index": 1000}}>
                <button onClick={previousStation} className={index <= 0 && "invisible"} >
                    <BsChevronLeft value={{ color: "blue" }} />
                </button>
                <div className="text-center h3">
                    <div className="text-xs">{suggestionNumber}. Vorschlag</div>
                    <h3 className="text-xl mt-1">{stationName}</h3>
                </div>
                <button onClick={nextStation} className={index >= lastSuggestion ? "invisible" : undefined}>
                    <BsChevronRight />
                </button>
            </div>
        </IconContext.Provider>
    )
}

export default SuggestionTitleBox