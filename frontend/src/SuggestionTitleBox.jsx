import React from "react";
import { BsChevronRight } from "react-icons/bs";
import { BsChevronLeft } from "react-icons/bs";
import { IconContext } from "react-icons";
import SuggestionInfo from "./SuggestionInfo";
import StationSearch from "./StationSearch";

const NavigationIcon = ({ children }) => {
    return (
        <div className="bg-gray-300 p-3 mt-3 rounded-full shadow-md hover:bg-indigo-500 text-gray-400 hover:text-indigo-200 cursor-pointer">
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
    departureStation,
    sendDepartureStation
}) => {
    const suggestionNumber = index + 1
    return (
        <div className="flex flex-col w-full pb-4 bg-white" style={{ "zIndex": 1000 }}>
            <div className="flex w-full mb-2 mt-1">
                <div className="w-1/5 flex content-start justify-start">
                    <div onClick={previousStation} className={suggestionNumber === 1 ? "invisible" : undefined} >
                        <NavigationIcon>
                            <BsChevronLeft />
                        </NavigationIcon>
                    </div>
                </div>
                <div className="w-3/5 flex justify-center">
                    <div className="flex flex-col">
                        <div className="border border-4 p-1 mt-1 rounded-full border-gray-400 border-solid"></div>
                        <div className="border-l-4 py-[14px] ml-[6px] border-gray-400 border-dotted"></div>
                        <div className="border border-4 p-1 rounded-full border-gray-400 border-solid"></div>
                    </div>
                    <div className="flex flex-col pl-4 transform -translate-y-3">
                        <StationSearch sendDepartureStation={sendDepartureStation} displayValue={departureStation.name} />
                        <h3 className="text-left text-md mt-4 text-gray-700 font-semibold tracking-tight hyphens-auto">{stationName}</h3>
                    </div>
                </div>
                <div className="w-1/5 flex justify-end">
                <div onClick={nextStation} className={suggestionNumber === lastSuggestion ? "invisible" : undefined}>
                    <NavigationIcon>
                        <BsChevronRight />
                    </NavigationIcon>
                </div>
                </div>
            </div>
            <SuggestionInfo data={station} />
        </div>
    )
}

export default SuggestionTitleBox