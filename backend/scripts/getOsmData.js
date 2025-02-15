import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { updateStatusFile } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function removeNodeProperties(data) {
    return data.map(obj => {
        if (obj.nodes) {
            delete obj.nodes;
        }
        return obj;
    });
}

const fetchOSMData = async (bbox) => {
    const query = `
    [out:json]
    [bbox:${bbox}];
    (
        nwr["tourism"~"zoo|theme_park|museum|attraction|castle"]["access"!="private"];
        nwr["leisure"~"park|playground|swimming_pool"]["access"!="private"];
        nwr["amenity"="playground"]["access"!="private"];
        nwr["shop"="farm"]["access"!="private"];
    );
    out geom;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`... fetched data successfully!`);
        // remove unnecessary properties
        data.elements = removeNodeProperties(data.elements)

        return data.elements;
    } catch (error) {
        console.error(`... error:`, error);
        return [];
    }
};

export const cacheAllNodes = async () => {
    const bboxes = [
        '47.3024876979,5.98865807458,51.14279592545,10.50282697924', // NW
        '47.3024876979,10.50282697924,51.14279592545,15.0169958839', // NE
        '51.14279592545,5.98865807458,54.983104153,10.50282697924', // SW
        '51.14279592545,10.50282697924,54.983104153,15.0169958839'  // SE
    ];

    let allData = [];

    for (const bbox of bboxes) {
        console.log(`Send request to overpass api for bounding box: ${bbox}`);
        const data = await fetchOSMData(bbox);
        console.log(`... number of fetched elements: ${data.length}`);
        allData = allData.concat(data);
    }

    const timestamp = new Date().toISOString().split('.')[0].replace(/:/g, "-");
    const dataDir = path.join(__dirname, './../data/osm');
    // const fileName = path.join(dataDir, `osm_data_test.json`);
    const fileName = path.join(dataDir, `osm_data_${timestamp}.json`);

    try {
        // Make sure that data folder exists
        await fs.mkdir(dataDir, { recursive: true });
        console.log(`Write data to file: ${fileName}`);
        await fs.writeFile(fileName, JSON.stringify({ elements: allData }, null, 2));
        console.log(`Saved data successfully at ${fileName}`);
    } catch (error) {
        console.error('Error on fetching osm data:', error);
    }
}

console.log('Start fetching osm data from overpass api ...');
cacheAllNodes()
    .then(() => {
        console.log('Download and saving completed.')
        updateStatusFile("fetchedOsmData")
    })
    .catch(error => console.error('Error on download and saving:', error));
