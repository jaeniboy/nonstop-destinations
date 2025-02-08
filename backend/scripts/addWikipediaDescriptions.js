import axios from "axios";
import { getLatestFile, readJsonFile, writeJsonFile } from "./utils.js";

// Function to get summaries of wikipedia articles
async function fetchWikipediaSummary(title) {
    const titleFormatted = title.split(":")[1].replace(/\s+/g, "_")
    try {
        const url = `https://de.wikipedia.org/api/rest_v1/page/summary/${titleFormatted}`;
        const response = await axios.get(url);
        const data = response.data;

        return data.extract;
    } catch (error) {
        console.error(`Unable to fetch summary for ${titleFormatted}:`, error);
        return null;
    }
}

// Add summaries to json objects
async function addDescriptions(data) {
    for (const item of data) {
        if (item.tags.wikipedia) {
            console.log(`fetch data for item ${item.id}`)
            const description = await fetchWikipediaSummary(item.tags.wikipedia);
            if (description) {
                item.tags.wikipedia_description = description;
            }
        }
    }
    return data;
}

// main function
let updatedData = {}
async function main(filepath) {
    console.log(`Reading data from ${filepath}`)
    const data = await readJsonFile(filepath)
    updatedData.elements = await addDescriptions(data.elements);
    try {
        writeJsonFile(filepath,updatedData);
    } catch (error) {
        console.log(`Error on saving data: ${error}`);
    }
}

main(await getLatestFile("./../data/osm"));
