import { config } from 'dotenv';
import { readJsonFile, writeJsonFile } from './utils.js';
import * as turf from '@turf/turf';

config({ path: "../.env" });
const API_KEY = process.env.RMV_API_KEY;

const stations = await readJsonFile("../data/stations/stations.json")
const stationsWithRmvId = []
let count = 1
for (const station of stations) {
    const url = `https://www.rmv.de/hapi/departureBoard?lang=de&id=${station.id}&date=2025-03-08&time=09%3A00&duration=60&maxJourneys=-1&passlist=0&baim=0&rtMode=SERVER_DEFAULT&type=DEP&accessId=${API_KEY}`
    console.log(`${count}:${url}`)
    count++
    try {
        const response = await fetch(url)
        if (!response.ok) {
            console.log("Zusätzlicher Abruf erforderlich")
            try {
                const stationNameUrl = `https://www.rmv.de/hapi/location.name?format=json&lang=de&input=${encodeURIComponent(station.name)}&maxNo=10&type=S&withEquivalentLocations=0&restrictSelection=S&withProducts=0&r=1000&filterMode=DIST_PERI&withMastNames=0&accessId=${API_KEY}`
                console.log(stationNameUrl)
                const stationNameResponse = await fetch(stationNameUrl)
                const stationNameJSON = await stationNameResponse.json()
                if (stationNameResponse.ok) {

                    const stopLocation = stationNameJSON.stopLocationOrCoordLocation[0].StopLocation
                    
                    const rmvId = {
                        name: stopLocation.name,
                        rmvId: stopLocation.extId,
                        dbId: station.id,
                        weight: station.weight
                    }
                    
                    // station.rmvId = rmvId
                    
                    // berechne die entfernungen in metern
                    const point1 = [stopLocation.lon, stopLocation.lat]
                    const point2 = [station.location.longitude, station.location.latitude]
                    const distance = turf.distance(point1, point2)
                    
                    if (distance <= 0.15) {
                        stationsWithRmvId.push(rmvId)
                    } else {
                        console.log(`Station liegt nicht in der Nähe (${rmvId.rmvId})`)
                    }
                } else {
                    console.log(`${stationNameJSON.errorCode}: ${stationNameJSON.errorText}`)
                }

            } catch(error) {
                console.error(error.message)
            }
        } else {
            const rmvId = {
                name: station.name,
                rmvId: station.id,
                dbId: station.id,
                weight: station.weight
            }

            // station.rmvId = rmvId
            stationsWithRmvId.push(rmvId)
        }
    } catch (error) {
        console.error(error.message);
    }

    // kurz Luft holen
    await new Promise(resolve => setTimeout(resolve, 4500));
}

writeJsonFile("../data/stations/stationsWithRmvId.json", stationsWithRmvId)
