import React from "react";
import { BsRepeat } from "react-icons/bs";
import { BsClock } from "react-icons/bs";
import { BsSignpostSplit } from "react-icons/bs";

const formatDistance = (distance) => {
    const dist = distance < 1000 ? `${distance} m` : `${(distance / 1000).toFixed(0)} km`
    return dist + " from origin"
}

const formatTime = (time) => {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return time + " min"
    // return time < 60 ? `${time} min` : `${hours}h ${minutes} min`
}

const formatTimes = (times) => {
    let timesString
    if (times.length > 1) {
        const timesSorted = times.sort((a,b) => a - b)
        const timesFormatted = timesSorted.map(time => formatTime(time));
        // show only the longest and the shortest travel time
        timesString = [timesFormatted[0],timesFormatted.slice(-1)[0]].join(" - ")
    } else {
        timesString = formatTime(times[0]);
    }
    return timesString + " travel time";
}

const formatFrequency = (freq) => {
    if (freq === 1) {
        return "One connection per hour"
    }
    if (freq % 1 !== 0) {
        return `${Math.floor(freq)}-${Math.ceil(freq)} connections per hour`
    } else {
        return `${freq} connections per hour`
    }
}

const IconWithText = ({ children, icontext, value }) => {
    return (
        <div className="flex flex-row sm:flex-col md:flex-row items-center p-1 w-full sm:w-1/3">
          {/* <div className="flex items-center  mt-4 w-1/3 border border-gray-400 rounded-md p-1 m-1"> */}
            <div className="flex flex-col items-center justify-center bg-indigo-200 rounded-sm aspect-square h-7">
                <div className="text-sm text-indigo-700 font-bold">
                    {children}
                </div>
            </div>
            <div className="text-xs text-center ml-2 sm:mt-2 sm:ml-0 md:mt-0 md:ml-2 md:text-left text-gray-400 hyphens-auto">
                {value}
            </div>
        </div>
    );
}

const SuggestionInfo = ({ data }) => {
    return (
        <div className="flex flex-col mx-auto sm:flex-row justify-center mt-2 px-10">
            {/* <div class="flex-1"></div> */}
            {/* <IconWithText icontext="travel time" value={data.connectionsPerHour}> */}
            <IconWithText icontext="travel time" value={formatTimes(data.travelTime)}>
                <BsClock />
            </IconWithText>
            <IconWithText icontext="distance" value={formatDistance(data.distance)}>
                <BsSignpostSplit />
            </IconWithText>
            <IconWithText icontext="frequency" value={formatFrequency(data.connectionsPerHour)}>
                <BsRepeat />
            </IconWithText>
            {/* <div class="flex-1"></div> */}
        </div>
    );
}

export default SuggestionInfo;