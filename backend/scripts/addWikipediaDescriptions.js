import axios from "axios";
import { getOsmFiles, readJsonFile, writeJsonFile } from "./utils.js";

// Function to get summaries of wikipedia articles
async function fetchMultipleArticles(titles) {
    const url = "https://de.wikipedia.org/w/api.php";
    const params = {
        action: "query",
        titles: titles.join("|"),
        prop: "extracts",
        exintro: true,
        explaintext: true,
        format: "json",
    };

    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error("Error on fetching data:", error);
        return null;
    }
}

async function addDescriptions(data) {
    const articleTitles = data
        .filter((item) => item.tags.wikipedia)
        .map((item) => item.tags.wikipedia.split(":")[1].replace(/\s+/g, "_"));

    // split article list in batchs
    const batchSize = 50;
    for (let i = 0; i < articleTitles.length; i += batchSize) {
        console.log(`Fetching batch ${i} to ${i+batchSize} of ${articleTitles.length}`)
        const batch = articleTitles.slice(i, i + batchSize);
        const summaries = await fetchMultipleArticles(batch);

        if (summaries) {
            // add summaries to items
            for (const pageId in summaries.query.pages) {
                const page = summaries.query.pages[pageId];
                if (page.extract) {
                    const title = page.title;
                    const matchingItem = data.find(
                        (item) => 
                            item.tags.wikipedia && item.tags.wikipedia.split(":")[1].replace(/\s+/g, "_") === title
                    );
                    if (matchingItem) {
                        matchingItem.tags.wikipedia_description = page.extract;
                    }
                }
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
        writeJsonFile(filepath, updatedData);
    } catch (error) {
        console.log(`Error on saving data: ${error}`);
    }
}

main(await getOsmFiles("./../data/osm"));
