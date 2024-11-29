import museum from './assets/Museum.svg'
import playground from './assets/Playground.svg'
import swimming from './assets/Swimming.svg'
import castle from './assets/Castle.svg'
import farmshop from './assets/Farmshop.svg'
import zoo from './assets/Zoo.svg'
import themepark from './assets/Themepark.svg'
import park from './assets/Park.svg'
import attraction from './assets/Attractions.svg'

export const iconMapping = (obj) => {
    // Check for different types and return appropriate image and color
    if (obj.leisure === "playground" || obj.amenity === "playground") {
        return {
            name: "playgrounds",
            image: playground, // assuming playground icon is imported
            color: '#4CAF50' // green color for playgrounds
        };
    }
    if (obj.tourism === "museum") {
        return {
            name: "museums",
            image: museum, // you'll need to import museum icon
            color: '#2196F3' // blue color for museums
        };
    }
    if (obj.leisure === "swimming_pool") {
        return {
            name: "swimming pools",
            image: swimming, // you'll need to import museum icon
            color: '#2196F3' // blue color for museums
        };
    }
    if (obj.leisure === "parks") {
        return {
            name: "parks",
            image: park, // you'll need to import museum icon
            color: '#2196F3' // blue color for museums
        };
    }
    if (obj.tourism === "theme_park") {
        return {
            name: "theme parks",
            image: themepark, // you'll need to import museum icon
            color: '#2196F3' // blue color for museums
        };
    }
    if (obj.tourism === "zoo") {
        return {
            name: "zoos",
            image: zoo, // you'll need to import museum icon
            color: '#2196F3' // blue color for museums
        };
    }
    if (obj.tourism === "castle") {
        return {
            name: "castles",
            image: castle, // you'll need to import museum icon
            color: '#2196F3' // blue color for museums
        };
    }
    if (obj.tourism === "attraction") {
        return {
            name: "other attractions",
            image: attraction, // you'll need to import museum icon
            color: '#2196F3' // blue color for museums
        };
    }
    if (obj.shop === "farm") {
        return {
            name: "farm shops",
            image: farmshop, // you'll need to import museum icon
            color: '#2196F3' // blue color for museums
        };
    }
    // Default return if no matching type found
    return {
        name: "other places",
        image: attraction, // you'll need to import default icon
        color: '#757575' // gray as default color
    };
};