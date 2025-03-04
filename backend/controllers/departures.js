import { createClient } from 'db-vendo-client'
import { profile as dbProfile } from 'db-vendo-client/p/db/index.js'
import fs from 'fs/promises';

const vendo = createClient(
    dbProfile,
    'janfseipel@gmail.com'
);

const stations = [
    "8000410",
    "8000412",
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

const result = await vendo.departures("8000412", {
    when: getNextDayAt9AM(),
    duration: 480,
    results: 60,
    // stopovers: true,
})
console.log("length:", result.departures.length)
console.log("Planned Whens:", result.departures.map(d => d.plannedWhen))
console.log("Modes: ", result.departures.map(d => d.line.mode))
console.log("Products: ", result.departures.map(d => d.line.product))
fs.writeFile("departures.json", JSON.stringify(result))

const getDepartures = async (id) => {
    const result = await vendo.departures("8000412", {
        when: getNextDayAt9AM(),
        duration: 480,
        results: 60,
        // stopovers: true,
    })
}