import React from "react";
import museum from './assets/Museum.svg'
import playground from './assets/Playground.svg'
import swimming from './assets/Swimming.svg'
import castle from './assets/Castle.svg'
import farmshop from './assets/Farmshop.svg'
import zoo from './assets/Zoo.svg'
import { BsBalloon } from "react-icons/bs";
import { BsStars } from "react-icons/bs";

const SuggestionInfoBox = ({ data }) => {

    const summary = [
        {
            id: "playgrounds",
            name: "playgrounds",
            data: data.destinations.filter(d => d.tags.leisure == "playground" || d.tags.amenity == "playground"),
            icon: playground
        }, {
            id: "swimmingPools",
            name: "swimmingpools",
            data: data.destinations.filter(d => d.tags.leisure == "swimming_pool"),
            icon: swimming
        }, {
            id: "parks",
            name: "parks",
            data: data.destinations.filter(d => d.tags.leisure == "parks"),
            icon: ""
        }, {
            id: "museums",
            name: "museums",
            data: data.destinations.filter(d => d.tags.tourism == "museum"),
            icon: museum
        }, {
            id: "themeParks",
            name: "theme parks",
            data: data.destinations.filter(d => d.tags.tourism == "theme_park"),
            icon: <BsBalloon />
        }, {
            id: "zoos",
            name: "zoos",
            data: data.destinations.filter(d => d.tags.tourism == "zoo"),
            icon: zoo
        }, {
            id: "castles",
            name: "castles",
            data: data.destinations.filter(d => d.tags.tourism == "castle"),
            icon: castle
        }, {
            id: "attractions",
            name: "other attractions",
            data: data.destinations.filter(d => d.tags.tourism == "attraction"),
            icon: <BsStars />
        }, {
            id: "farmShops",
            name: "farm shops",
            data: data.destinations.filter(d => d.tags.shop == "farm"),
            icon: farmshop
        }]

    const displaySummary = summary.map(d => {
        return (
            d.data.length > 0 &&
            <div key={d.id} className="w-1/4 text-center content-center flex flex-col">
                <div className="flex justify-center">
                    {typeof(d.icon) === "string" ? <img src={d.icon} className="h-10"></img> : d.icon}
                </div>
                <div>
                    {d.data.length} {d.name}
                </div>
            </div>
        )
    })

    return (
        <div className="flex justify-around flex-wrap">
            {displaySummary}
        </div>
    )
}


export default SuggestionInfoBox