import React from "react";
import { iconMapping } from "./IconMapper";

const SuggestionInfoBox = ({ data }) => {

    const summary = [
        {
            id: "playgrounds",
            data: data.destinations.filter(d => d.tags.leisure == "playground" || d.tags.amenity == "playground"),
        }, {
            id: "swimmingPools",
            data: data.destinations.filter(d => d.tags.leisure == "swimming_pool"),
        }, {
            id: "parks",
            data: data.destinations.filter(d => d.tags.leisure == "parks"),
        }, {
            id: "museums",
            data: data.destinations.filter(d => d.tags.tourism == "museum"),
        }, {
            id: "themeParks",
            data: data.destinations.filter(d => d.tags.tourism == "theme_park"),
        }, {
            id: "zoos",
            data: data.destinations.filter(d => d.tags.tourism == "zoo"),
        }, {
            id: "castles",
            data: data.destinations.filter(d => d.tags.tourism == "castle"),
        }, {
            id: "attractions",
            data: data.destinations.filter(d => d.tags.tourism == "attraction"),
        }, {
            id: "farmShops",
            data: data.destinations.filter(d => d.tags.shop == "farm"),
        }]

    const displaySummary = summary.map(d => {
        const iconMap = d.data.length > 0 && iconMapping(d.data[0].tags)
        return (
            d.data.length > 0 &&
            <div key={d.id} className="items-center flex w-full py-2 px-1 justify-between border-t">
                <div className="flex items-center">
                    <div className="w-10">
                        <img src={iconMap.image}></img>
                    </div>
                    <div className="text-lg ml-5">
                        {iconMap.name}
                    </div>
                </div>
                <div className="px-4 font-bold rounded-full bg-gray-900/10">
                    {d.data.length}
                </div>
            </div>
        )
    })

    return (
        <div className="relative flex flex-col px-5}" style={{"zIndex": 1000, "boxShadow": "0px -20px 15px -4px rgba(0,0,0,0.1)"}}>
            {displaySummary}
        </div>
    )
}


export default SuggestionInfoBox