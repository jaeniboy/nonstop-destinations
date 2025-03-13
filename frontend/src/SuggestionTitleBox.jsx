import React from "react";
import { BsChevronRight } from "react-icons/bs";
import { BsChevronLeft } from "react-icons/bs";
import { IconContext } from "react-icons";
import SuggestionInfo from "./SuggestionInfo";

const NavigationIcon = ({ children }) => {
    return (
        <div className="bg-gray-300 p-3 mx-2 rounded-full shadow-md hover:bg-indigo-500 text-gray-400 hover:text-indigo-200">
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
    departureStation
}) => {
    const suggestionNumber = index + 1
    return (
        // <IconContext.Provider value={{ className: "text-2xl text-gray-400" }}>
        <div className="flex flex-col w-full justify-around px-2 pb-4 items-center bg-white" style={{ "zIndex": 1000 }}>
        {/* <div className="h-60 absolute left-0 bottom-0 flex flex-col w-full justify-around px-2 pb-4 pt-2 mt-4 items-center bg-white rounded-xl border border-solid border-gray-300 shadow-[0px_-1px_6px_1px_rgba(0,0,0,0.1)] " style={{ "zIndex": 1000 }}> */}
            <div className="flex w-full justify-between mb-2 mt-1">
                <button onClick={previousStation} className={suggestionNumber === 1 && "invisible"} >
                    <NavigationIcon>
                        <BsChevronLeft />
                    </NavigationIcon>
                </button>
                <div className="flex">
                    {/* <div className="text-center text-xs text-gray-400">{suggestionNumber}. Vorschlag</div> */}
                    <div className="flex flex-col">
                        <div className="border border-4 p-1 mt-1 rounded-full border-gray-400 border-solid"></div>
                        <div className="border-l-4 py-[14px] ml-[6px] border-gray-400 border-dotted"></div>
                        <div className="border border-4 p-1 rounded-full border-gray-400 border-solid"></div>
                    </div>
                    <div className="flex flex-col pl-4">
                        <h4 className="text-left text-sm text-gray-600 mb-3">{departureStation.name}</h4>
                        <h3 className="text-left text-xl mt-1 text-gray-700 font-semibold tracking-tight">{stationName}</h3>
                    </div>
                </div>
                <button onClick={nextStation} className={suggestionNumber === lastSuggestion ? "invisible" : undefined}>
                    <NavigationIcon>
                        <BsChevronRight />
                    </NavigationIcon>
                </button>
            </div>
            <SuggestionInfo data={station} />
        </div>
        // </IconContext.Provider>
    )
}

export default SuggestionTitleBox