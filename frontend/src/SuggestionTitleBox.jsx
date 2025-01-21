import React from "react";
import { BsChevronRight } from "react-icons/bs";
import { BsChevronLeft } from "react-icons/bs";
import { IconContext } from "react-icons";
import SuggestionInfo from "./SuggestionInfo";

const NavigationIcon = ({children}) => {
    return (
        <IconContext.Provider value={{ className: "text-2xl text-gray-400" }}>
            {children}
        </IconContext.Provider>
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
    console.log("lastSuggestion",lastSuggestion)
    const suggestionNumber = index + 1
    console.log("suggestionNumer",suggestionNumber)
    return (
        // <IconContext.Provider value={{ className: "text-2xl text-gray-400" }}>
            <div className="flex justify-around px-5 py-3 items-center" style={{"zIndex": 1000}}>
                <button onClick={previousStation} className={suggestionNumber === 1 && "invisible"} >
                    <NavigationIcon>
                        <BsChevronLeft />
                    </NavigationIcon>
                </button>
                <div className="flex flex-col flex-auto">
                    <div className="text-center text-xs">{suggestionNumber}. Vorschlag</div>
                    <h3 className="text-center text-xl mt-1">{stationName}</h3>
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