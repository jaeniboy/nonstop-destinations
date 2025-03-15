import React from "react";
import { BsRepeat } from "react-icons/bs";
import { BsClock } from "react-icons/bs";
import { BsSignpostSplit } from "react-icons/bs";

const formatDistance = (distance) => {
    const dist = distance < 1000 ? `${distance} m` : `${(distance / 1000).toFixed(0)}`
    return dist
}

const formatTime = (time) => {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return time
    // return time < 60 ? `${time} min` : `${hours}h ${minutes} min`
}

const formatTimes = (times) => {
    let timesString
    if (times.length > 1) {
        const timesSorted = times.sort((a, b) => a - b)
        const timesFormatted = timesSorted.map(time => formatTime(time));
        // show only the longest and the shortest travel time
        timesString = [timesFormatted[0], timesFormatted.slice(-1)[0]].join("-")
    } else {
        timesString = formatTime(times[0]);
    }
    return timesString;
}

const formatFrequency = (freq) => {
    if (freq === 1) {
        return "1"
    }
    if (freq % 1 !== 0) {
        return `${Math.floor(freq)}-${Math.ceil(freq)}`
    } else {
        return `${freq}`
    }
}

const IconWithText = ({ children, label, value, unit }) => {
    return (
        <div className="flex flex-row justify-center items-center px-1 w-fit">
            <div className="flex flex-col items-center justify-center">
            {/* <div className="flex flex-col items-center justify-center bg-indigo-200 rounded-sm aspect-square h-10"> */}
                <div className="text-xl text-gray-500 ">
                    {children}
                </div>
            </div>
            <div className="flex flex-col ml-2 hyphens-auto">
                <div className="flex flex-row items-baseline text-gray-600">
                    <div className="text-xs font-semibold">
                        {value}
                    </div>
                    <div className="text-xs text-gray-400 ml-[3px]">
                        {unit}
                    </div>
                </div>
                <div className="text-xs text-gray-400">
                    {label}
                </div>
            </div>
        </div>
    );
}

const SuggestionInfo = ({ data }) => {
    return (
        <div className="flex justify-around mx-auto w-full sm:flex-row justify-center mt-2">
            {/* <div class="flex-1"></div> */}
            {/* <IconWithText icontext="travel time" value={data.connectionsPerHour}> */}
            <IconWithText label="travel time" value={formatTimes(data.travelTime)} unit="min">
                <BsClock />
            </IconWithText>
            <IconWithText label="per hour" value={formatFrequency(data.connectionsPerHour)} unit="connect.">
                <BsRepeat />
            </IconWithText>
            <IconWithText label="from origin" value={formatDistance(data.distance)} unit="km">
                <BsSignpostSplit />
            </IconWithText>
            {/* <div class="flex-1"></div> */}
        </div>
    );
}

export default SuggestionInfo;