import React from "react";
import { BsRepeat } from "react-icons/bs";
import { BsClock } from "react-icons/bs";
import { BsSignpostSplit } from "react-icons/bs";

const formatDistance = (distance) => {
    return distance < 1000 ? `${distance} m` : `${(distance / 1000).toFixed(0)} km`
}

const formatTime = (time) => {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return time < 60 ? `${time} min` : `${hours}h ${minutes}min`
}

const formatTimes = (times) => {
    if (times.length >= 1) {
        return times.map(time => formatTime(time)).join(" -");
    } else {
        return formatTime(times[0]);
    }
}

const IconWithText = ({ children, icontext, value }) => {
    return (
        <div className="flex items-center  mt-4 w-1/3 border border-gray rounded-md p-1 m-1">
            <div className="flex flex-col items-center justify-center bg-gray-400 rounded-md w-10 h-10">
                <div className="text-lg text-white font-bold">
                    {children}
                </div>
                {/* <div className="text-xs mt-1">
                    {icontext}
                </div> */}

            </div>
            <div className="text-sm text-lg ml-2">
                {value}
            </div>
        </div>
    );
}

const SuggestionInfo = ({ data }) => {
    return (
        <div className="flex justify-evenly">
            {/* <div class="flex-1"></div> */}
            <IconWithText icontext="travel time" value={formatTimes(data.travelTime)}>
                <BsClock />
            </IconWithText>
            <IconWithText icontext="distance" value={formatDistance(data.distance)}>
                <BsSignpostSplit />
            </IconWithText>
            <IconWithText icontext="frequency" value={data.count + " / hour"}>
                <BsRepeat />
            </IconWithText>
            {/* <div class="flex-1"></div> */}
        </div>
    );
}

export default SuggestionInfo;