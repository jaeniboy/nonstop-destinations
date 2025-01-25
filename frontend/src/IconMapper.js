import museum from './assets/Museum.svg'
import playground from './assets/Playground.svg'
import swimming from './assets/Swimming.svg'
import castle from './assets/Castle.svg'
import farmshop from './assets/Farmshop.svg'
import zoo from './assets/Zoo.svg'
import themepark from './assets/Themepark.svg'
import park from './assets/Park.svg'
import attraction from './assets/Attractions.svg'
import {colors} from '../colors'

export const iconMapping = (obj) => {
    if (obj.tourism === "museum") {
        return {
            name: "museums",
            image: museum,
            color: 'rgb(59 130 246)' // blue-500
        };
    }
    if (obj.leisure === "swimming_pool") {
        return {
            name: "swimming pools",
            image: swimming,
            color: 'rgb(14 165 233)' // sky-500
        };
    }
    if (obj.tourism === "theme_park") {
        return {
            name: "theme parks",
            image: themepark,
            color: 'rgb(249 115 22)' // orange-500
        };
    }
    if (obj.tourism === "zoo") {
        return {
            name: "zoos",
            image: zoo,
            color: 'rgb(168 85 247)' // purple-500
        };
    }
    if (obj.leisure === "playground" || obj.amenity === "playground") {
        return {
            name: "playgrounds",
            image: playground,
            color: 'rgb(22 163 74)' // green-600
        };
    }
    if (obj.leisure === "park") {
        return {
            name: "parks",
            image: park,
            color: 'rgb(34 197 94)' // green-500
        };
    }
    if (obj.tourism === "castle") {
        return {
            name: "castles",
            image: castle,
            color: 'rgb(99 102 241)' // indigo-500
        };
    }
    if (obj.tourism === "attraction") {
        return {
            name: "other attractions",
            image: attraction,
            // color: 'rgb(236 72 153)' // pink-500
            color: colors.secondary
        };
    }
    if (obj.shop === "farm") {
        return {
            name: "farm shops",
            image: farmshop,
            color: 'rgb(234 179 8)' // yellow-500
        };
    }
    return {
        name: "other places",
        image: attraction,
        color: 'rgb(107 114 128)' // gray-500
    };
};