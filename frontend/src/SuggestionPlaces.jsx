import React from "react";
import { useState, useEffect } from "react";
import { iconMapping } from "./IconMapper";
import { BsGlobe } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";

export function extractCityName(input) {
    const match = input.match(/^[^ (]+/);
    return match ? match[0] : '';
}

const SuggestionPlaces = ({ data }) => {

    const [isOpen, setIsOpen] = useState("")

    // collapse accordeon when user skips suggestion
    useEffect(() => {
        setIsOpen("")
    }, [data])

    const toggleAccordion = (id) => {
        isOpen === id ? setIsOpen("") : setIsOpen(id)
    }

    const summary = [
        {
            id: "playground",
            data: data.destinations.filter(d => d.tags.leisure == "playground" || d.tags.amenity == "playground"),
        }, {
            id: "swimming_pool",
            data: data.destinations.filter(d => d.tags.leisure == "swimming_pool"),
        }, {
            id: "museum",
            data: data.destinations.filter(d => d.tags.tourism == "museum"),
        }, {
            id: "theme_park",
            data: data.destinations.filter(d => d.tags.tourism == "theme_park"),
        }, {
            id: "zoo",
            data: data.destinations.filter(d => d.tags.tourism == "zoo"),
        }, {
            id: "park",
            data: data.destinations.filter(d => d.tags.leisure == "park"),
        }, {
            id: "castle",
            data: data.destinations.filter(d => d.tags.tourism == "castle"),
        }, {
            id: "attraction",
            data: data.destinations.filter(d => d.tags.tourism == "attraction"),
        }, {
            id: "farm_shop",
            data: data.destinations.filter(d => d.tags.shop == "farm"),
        }]

    const displaySummary = summary.map(d => {
        const iconMap = d.data.length > 0 && iconMapping(d.id)
        // const iconMap = d.data.length > 0 && iconMapping(d.data[0].tags)
        return (
            d.data.length > 0 &&
            <div key={d.id} >
                <div className="items-center flex flex-grow overflow-auto w-full py-2 px-1 justify-between border-t cursor-pointer"
                    onClick={() => toggleAccordion(d.id)}
                >
                    <div className="flex items-center">
                        <div className="p-1.5 rounded-full" style={{ background: iconMap.color }}>
                            <div className="w-12 h-12 flex justify-center items-center bg-white rounded-full">
                                <p className="text-3xl font-noto-emoji text-black">
                                    {iconMap.emoji}
                                </p>
                                {/* <img src={iconMap.image}></img> */}
                            </div>
                        </div>
                        <div className="text-lg ml-5">
                            {iconMap.name}
                        </div>
                    </div>
                    <div className="px-4 font-bold rounded-full bg-gray-900/10">
                        {d.data.length}
                    </div>
                </div>
                <div className={`
                    grid transition-[grid-template-rows] duration-500 ease-in-out
                        ${isOpen === d.id
                        ? 'grid-rows-[1fr]'
                        : 'grid-rows-[0fr]'
                    }
                    `}>
                    <div className="overflow-hidden">
                        <div className="min-h-0">

                            {d.data.map((d, i) => {
                                const addressGiven = d.tags["addr:city"] && d.tags["addr:street"] && d.tags["addr:housenumber"]
                                return (
                                    <div key={i} className="flex items-center justify-between w-full px-4 py-2 border-t">
                                        <div className="flex flex-col ml-5">
                                            <div className="flex">
                                                {d.tags.name ? d.tags.name : <div className="text-gray-400">no name provided</div>}
                                                {d.tags.website ?
                                                    <Weblink text="website" url={d.tags.website} Icon={BsGlobe} /> :
                                                    <Weblink text="web search" url={"https://duckduckgo.com/?q=" + d.tags.name + "+" + extractCityName(data.name)} Icon={BsSearch} />
                                                }
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {
                                                    addressGiven ?
                                                        `${d.tags["addr:street"]} ${d.tags["addr:housenumber"]}, ${d.tags["addr:city"]}` :
                                                        "no address provided"
                                                }

                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div >
            </div >
        )
    })

    return (
        <div className="relative flex flex-col px-5 z-[1000]}">
            <div className="pb-3 pt-5 lg:pt-0 text-lg font-semibold text-center">Places of Interest</div>
            <div className="h-full overflow-auto">
                {displaySummary}
            </div>
        </div>
    )
}

const Weblink = ({ text, url, Icon }) => {
    return (
        <a href={url} className="text-blue-500 ml-3 flex pt-1" target="_blank" rel="noopener noreferrer">
            <span className="pt-1 text-sm"><Icon /></span>
            <span className="text-sm ml-1">{text}</span>
        </a>
    );
};


export default SuggestionPlaces