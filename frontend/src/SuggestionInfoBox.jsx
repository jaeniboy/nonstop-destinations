import React from "react";
import museum from './assets/Museum.svg'
import playground from './assets/Playground.svg'
import swimming from './assets/Swimming.svg'
import castle from './assets/Castle.svg'
import farmshop from './assets/Farmshop.svg'
import zoo from './assets/Zoo.svg'
import themepark from './assets/Themepark.svg'
import park from './assets/Park.svg'
import attractions from './assets/Attractions.svg'

const SuggestionInfoBox = ({ data }) => {

    const summary = [
        {
            id: "playgrounds",
            name: "Playgrounds",
            data: data.destinations.filter(d => d.tags.leisure == "playground" || d.tags.amenity == "playground"),
            icon: playground
        }, {
            id: "swimmingPools",
            name: "Swimmingpools",
            data: data.destinations.filter(d => d.tags.leisure == "swimming_pool"),
            icon: swimming
        }, {
            id: "parks",
            name: "Parks",
            data: data.destinations.filter(d => d.tags.leisure == "parks"),
            icon: park
        }, {
            id: "museums",
            name: "Museums",
            data: data.destinations.filter(d => d.tags.tourism == "museum"),
            icon: museum
        }, {
            id: "themeParks",
            name: "Theme Parks",
            data: data.destinations.filter(d => d.tags.tourism == "theme_park"),
            icon: themepark
        }, {
            id: "zoos",
            name: "Zoos",
            data: data.destinations.filter(d => d.tags.tourism == "zoo"),
            icon: zoo
        }, {
            id: "castles",
            name: "Castles",
            data: data.destinations.filter(d => d.tags.tourism == "castle"),
            icon: castle
        }, {
            id: "attractions",
            name: "Other Attractions",
            data: data.destinations.filter(d => d.tags.tourism == "attraction"),
            icon: attractions
        }, {
            id: "farmShops",
            name: "farm shops",
            data: data.destinations.filter(d => d.tags.shop == "farm"),
            icon: farmshop
        }]

    const displaySummary = summary.map(d => {
        return (
            d.data.length > 0 &&
            <div key={d.id} className="items-center flex w-full py-2 px-1 justify-between border-t">
                <div className="flex items-center">
                    <div className="w-10">
                        <img src={d.icon} className=""></img>
                    </div>
                    <div className="text-lg ml-5">
                        {d.name}
                    </div>
                </div>
                <div className="px-4 font-bold rounded-full bg-gray-900/10">
                    {d.data.length}
                </div>
            </div>
        )
    })

    return (
        <div className="flex flex-col px-5">
            {displaySummary}
        </div>
    )
}


export default SuggestionInfoBox