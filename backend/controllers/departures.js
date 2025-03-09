import { createClient } from 'db-vendo-client'
import { profile as dbProfile } from 'db-vendo-client/p/db/index.js'
import { profile as dbNavProfile } from 'db-vendo-client/p/dbnav/index.js'
import { profile as dbWebProfile } from 'db-vendo-client/p/dbweb/index.js'
import fs from 'fs/promises';

const vendoDb = createClient(
    dbProfile,
    'janfseipel@gmail.com'
);
const vendoDbNav = createClient(
    dbNavProfile,
    'janfseipel@gmail.com'
);
const vendoDbWeb = createClient(
    dbWebProfile,
    'janfseipel@gmail.com'
);

const stations = [
    "8000306",
    "8000412",
    "8000191",
    "8000410",
    "8000413",
    "8000424",
    "8000419",
    "8010001",
    "8000433",
    "8000431",
    "8000434",
    "8000436",
    "8000437",
    "8000002",
    "8000442",
    "8000443",
    "8000441",
    "8011004",
    "8000414",
    "8011005",
    "8000449",
    "8000446",
    "8011003",
    "8000448",
    "8000459",
    "8000452",
    "8000404",
    "8000454",
    "8000462",
    "8000464",
    "8000466",
    "8000468",
    "8000463",
    "8000471",
    "8000475",
    "8000474",
    "8000477",
    "8000482",
    "8000420",
    "8000489",
    "8000488",
    "8000473",
    "8080040",
    "8000492",
    "8000499",
    "8000500",
    "8000496",
    "8000483",
    "8000406",
    "8000505",
    "8011011",
    "8000506"
]

function getNextDayAt9AM() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow;
}

const result = await vendoDbWeb.departures("8000412", {
    // when: getNextDayAt9AM(),
    duration: 480,
    results: 60,
    stopovers: true,
})
console.log("length:", result.departures.length)
console.log("Planned Whens:", result.departures.map(d => d.plannedWhen))
console.log("Modes: ", result.departures.map(d => d.line.mode))
console.log("Products: ", result.departures.map(d => d.line.product))
fs.writeFile("departures.json", JSON.stringify(result))


// ===================================================================
// Trying to get every trip id - seems impossible

// const getUniqueTripIds = async (stationId, formerTripIds) => {
//     console.log(`fetching for id ${stationId}`)
//     const result = await vendoDb.departures(stationId, {
//         when: getNextDayAt9AM(),
//         duration: 480,
//         results: 60,
//         // stopovers: true,
//     })
//     const newTripIds = result.departures
//         .filter(d=>{return d.line.product === "regional" || d.line.product === "suburban"})
//         .map(d=>d.tripId)
//     // console.log(newTripIds)
//     const uniqueTripIds = newTripIds.filter(tripId=>!formerTripIds.includes(tripId))
//     return formerTripIds.concat(...uniqueTripIds)
// }

// const getAllTripIds = async (stations) => {
//     let allTripIds = []
//     for (const station of stations) {
//         allTripIds = await getUniqueTripIds(station, allTripIds)
//     }
//     return allTripIds
// }

// const result = await getAllTripIds(stations)
// // console.log(result.length) 
// fs.writeFile("departures_trip_ids.json", JSON.stringify(result))


// ========================================================

// avoid: bus, tram, nationalExpress, national
// keep: suburban, rgional
// const karlsruhe = await vendo.departures("8000191", {
//     when: getNextDayAt9AM(),
//     duration: 480,
//     results: 60,
//     // stopovers: true,
// }) 

// karlsruhe.departures.map(d=>{
//     console.log(`${d.line.name}, ${d.line.product}`)
// })