import { createClient } from 'db-vendo-client'
import { profile as dbProfile } from 'db-vendo-client/p/dbnav/index.js'
// import { profile as dbProfile } from 'db-vendo-client/p/dbnav/index.js'
import { readStations } from 'db-stations'
import Bottleneck from 'bottleneck'
import fs from 'fs/promises';

const vendo = createClient(
    dbProfile,
    'janfseipel@gmail.com'
);

// let results = []

// Karlsurhe, Achern, Tübingen, Stuttgart
// const stationIds = ["8000191", "8000412", "8000141", "8000096"]

// Zufallssample
const stationIds = [
    "8000410",
    "8000412",
    "8000413",
    "8000424",
    "8000419",
    // "8010001",
    // "8000433",
    // "8000431",
    // "8000434",
    // "8000436",
    // "8000437",
  ]

// Erstelle einen Limiter mit 60 Anfragen pro Minute
const limiter = new Bottleneck({
    minTime: 1000 / 20, // Minimale Zeit zwischen Anfragen (ca. 16.67 ms)
    maxConcurrent: 1,   // Anzahl der gleichzeitigen Anfragen
});

function getNextDayAt8AM() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);
    return tomorrow;
}

function getTimesPerHour(arr) {
    const timestamps = arr.map()
}

async function getJourneys(origin, destination) {
    const journeys = await vendo.journeys(origin, destination, {
        departure: getNextDayAt8AM(),
        results: 10,
        transfers: 0,
        remarks: false,
        products: {
            bus: false,
            nationalExpress: false,
            national: false
        }
    })
    const connectedDirectly = journeys.journeys.length > 0
    // const timesPerHour = 
    return connectedDirectly
}

async function checkConnection(originId, destinationId) {
    try {
        const connectedDirectly = await getJourneys(originId, destinationId);
        console.log("Origin:", originId, ", Destination:", destinationId, ", ConnectedDirectly:", connectedDirectly);
        const res = {
            "origin": originId, 
            "destination": destinationId,
            "connectedDirectly": connectedDirectly
        };
        // results.push(res)
        await fs.appendFile('results.json', JSON.stringify(res)+",\n");
    } catch (error) {
        console.error(`Error checking connection from ${originId} to ${destinationId}:`, error);
    }
}

async function checkAllConnections(stationIds) {
    fs.appendFile('results.json', '[\n')
    const tasks = [];
    for (const originId of stationIds) {
        for (const destinationId of stationIds) {
            if (originId !== destinationId) {
                // Füge jede Anfrage als Task zum Limiter hinzu
                tasks.push(limiter.schedule(() => checkConnection(originId, destinationId)));
            }
        }
    }
    await Promise.all(tasks);

}

await checkAllConnections(stationIds);

let content = await fs.readFile('results.json')
content = content.slice(0,-2)
fs.appendFile('results.json', content + '\n]')
console.log("Finished")