import React from "react";
import { BsChevronRight } from "react-icons/bs";
import { BsChevronLeft } from "react-icons/bs";
import { IconContext } from "react-icons";
import SuggestionInfo from "./SuggestionInfo";

const NavigationIcon = ({ children }) => {
    return (
        <div className="bg-gray-300 p-2 rounded-full mx-3 shadow-md hover:bg-indigo-500 text-gray-400 hover:text-indigo-200">
            <IconContext.Provider value={{ className: "text-2xl" }}>
                {children}
            </IconContext.Provider>
        </div>
    )
}

const SuggestionTitleBox = ({
    stationName,
    index,
    nextStation,
    previousStation,
    lastSuggestion,
    station,
}) => {
    const suggestionNumber = index + 1
    return (
        // <IconContext.Provider value={{ className: "text-2xl text-gray-400" }}>
        <div className="flex justify-around px-5 pb-4 pt-2 mt-4 items-center bg-white rounded-md border border-solid border-gray-300 shadow " style={{ "zIndex": 1000 }}>
            <button onClick={previousStation} className={suggestionNumber === 1 && "invisible"} >
                <NavigationIcon>
                    <BsChevronLeft />
                </NavigationIcon>
            </button>
            <div className="flex flex-col flex-auto">
                <div className="text-center text-xs text-gray-400">{suggestionNumber}. Vorschlag</div>
                <h3 className="text-center text-lg mt-1 text-gray-700 font-semibold tracking-tight">{stationName}</h3>
                <SuggestionInfo data={station} />
            </div>
            <button onClick={nextStation} className={suggestionNumber === lastSuggestion ? "invisible" : undefined}>
                <NavigationIcon>
                    <BsChevronRight />
                </NavigationIcon>
            </button>
        </div>
        // </IconContext.Provider>
    )
}

export default SuggestionTitleBox