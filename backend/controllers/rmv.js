import fetch from 'node-fetch';
import 'dotenv/config'
const API_KEY = process.env.RMV_API_KEY;

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
    // "8000468",
    "8000463",
    // "8000471",
    "8000475",
    "8000474",
    "8000477",
    "8000482",
    "8000420",
    "8000489",
    "8000488",
    "8000473",
    // "8080040",
    // "8000492",
    "8000499",
    "8000500",
    "8000496",
    "8000483",
    "8000406",
    // "8000505",
    // "8011011",
    // "8000506"
]


export const getDeparturesTripIds = async (stationId = "8000191", dateAndTime) => {
    console.log("Fetching TripIds")
    const duration = 60
    const maxJourneys = 50
    const url = `https://www.rmv.de/hapi/departureBoard?format=json&lang=de&id=${stationId}&duration=${duration}&maxJourneys=${maxJourneys}&passlist=0&baim=0&rtMode=SERVER_DEFAULT&type=DEP&accessId=${API_KEY}`;

    const result = await fetch(url)
    const data = await result.json()

    const productFilter = ["2", "3"] // 2 = regional, 3 = suburban

    const departuresFilterd = data.Departure.filter(d => productFilter.includes(d.ProductAtStop.catCode))
    const tripIds = departuresFilterd
        .map(dep => { return { "tripId": dep.JourneyDetailRef.ref, "plannedWhen": `${dep.date}T${dep.time}.000`, "product": dep.ProductAtStop.name } });
    return tripIds
} 


/**
 * Ruft die Abfahrtsdaten von RMV für eine bestimmte Haltestelle ab.
 *
 * @param {string} haltestellenId - Die ID der Haltestelle (z.B. "8000191").
 * @param {number} [duration=60] - Die Dauer in Minuten, für die Abfahrten angezeigt werden sollen.
 * @param {number} [maxJourneys=-1] - Die maximale Anzahl der zurückzugebenden Fahrten. -1 bedeutet unbegrenzt.
 * @returns {Promise<object>} - Ein Promise, das mit den Abfahrtsdaten im JSON-Format aufgelöst wird.
 * @throws {Error} - Wenn beim Abrufen der Daten ein Fehler auftritt.
 */
// async function getRmvDepartures(haltestellenId, duration = 60, maxJourneys = -1) {
//   const url = `https://www.rmv.de/hapi/departureBoard?lang=de&id=${haltestellenId}&duration=${duration}&maxJourneys=${maxJourneys}&passlist=0&baim=0&rtMode=SERVER_DEFAULT&type=DEP&accessId=8e5e0618-1ce3-4fcf-bb44-045c1c49fc30`;
//   console.log(url)
//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'accept': 'application/json'
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Fehler beim Abrufen der RMV-Daten:", error);
//     throw error; // Wirf den Fehler erneut, damit der Aufrufer ihn behandeln kann.
//   }
// }

// async function getRmvJourneyDetails() {
//     const url = `https://www.rmv.de/hapi/journeyDetail?lang=de&id=2%7C%23VN%231%23ST%231741196749%23PI%230%23ZI%23218834%23TA%230%23DA%2360325%231S%238007201%231T%232032%23LS%23723572%23LT%232142%23PU%2380%23RT%231%23CA%23S%23ZE%23S1%23ZB%23%20%20%20%20%20%20S1%23PC%233%23FR%238007201%23FT%232032%23TO%23723572%23TT%232142%23&poly=0&polyEnc=N&showPassingPoints=0&baim=0&accessId=8e5e0618-1ce3-4fcf-bb44-045c1c49fc30`
//     try {
//         const response = await fetch(url, {
//           method: 'GET',
//           headers: {
//             'accept': 'application/json'
//           }
//         });
    
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
    
//         const data = await response.json();
//         return data;
//       } catch (error) {
//         console.error("Fehler beim Abrufen der Journey-Daten:", error);
//         throw error; // Wirf den Fehler erneut, damit der Aufrufer ihn behandeln kann.
//       }
// }

// // Beispielaufruf:
// async function main() {
//   try {
//     const departures = await getRmvDepartures("8000068");
//     console.log(JSON.stringify(departures, null, 2)); // Gib die Daten formatiert aus
//     fs.writeFile("rmv.json", JSON.stringify(departures, null, 2))
    
//     departures.Departure.map(d=>{
//         console.log(`Name: ${d.ProductAtStop.name}, catcode: ${d.ProductAtStop.catCode}`)
//     })

//   } catch (error) {
//     console.error("Fehler beim Abrufen der Abfahrten:", error);
//   }
// }

// // main();

// // for (const station of stations) {
// //     const departures = await getRmvDepartures(station);
// //     if (departures) {
// //         console.log(`${station} erfolgreich abgerufen`)
// //     }
// // }

// // catcode 2: regional
// // catcode 3: suburban

// async function checkRateLimit(station) {
//     let count = 0;
//     const startTime = Date.now();
//     const timeWindow = 60000; // 1 Minute in Millisekunden
  
//     while (true) {
//       try {
//         const departures = await getRmvJourneyDetails();
//         // const departures = await getRmvDepartures(station);
//         if (departures) {
//           count++;
//           console.log(`Anfrage ${count} erfolgreich`);
//         }
//       } catch (error) {
//         if (error.status === 429 || error.message.includes('Too many requests')) {
//           console.log(`Rate Limit erreicht nach ${count} Anfragen`);
//           return count;
//         }
//         console.error(`Fehler: ${error.message}`);
//       }
  
//       if (Date.now() - startTime >= timeWindow) {
//         console.log(`Kein Rate Limit gefunden. ${count} Anfragen in einer Minute möglich.`);
//         return count;
//       }
  
//       // Kurze Pause zwischen den Anfragen
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//   }
  
//   async function testRateLimit() {
//     const testStation = stations[0]; // Verwenden Sie eine Teststation
//     const limit = await checkRateLimit(testStation);
//     console.log(`Geschätztes Rate Limit: ${limit} Anfragen pro Minute`);
//   }
  
// //   testRateLimit();

// // console.log(await getRmvJourneyDetails())

// // console.log(await getRmvDepartures("3000010", 60, -1))
// console.log(await getRmvDepartures("8001252", 60, -1))
  