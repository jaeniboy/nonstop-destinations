import * as turf from '@turf/turf';
import { createClient } from 'db-vendo-client'
// import { profile as dbProfile } from 'db-vendo-client/p/db/index.js'
// import { profile as dbProfile } from 'db-vendo-client/p/dbweb/index.js'
import {withRetrying} from 'db-vendo-client/retry.js'
import { profile as dbProfile } from 'db-vendo-client/p/dbnav/index.js'
import { readStations } from 'db-stations'
import { nanoid } from 'nanoid';

// Utility function for retry logic
const withRetry = async (operation, operationName) => {
    const MAX_RETRIES = 3;
    const DELAY_MS = 1000;
    let lastError;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`${operationName} (Versuch ${attempt}/${MAX_RETRIES})`);
            return await operation();
        } catch (error) {
            lastError = error;
            console.log(`Fehler bei ${operationName} (Versuch ${attempt}): ${error}`);

            if (attempt < MAX_RETRIES) {
                await delay(DELAY_MS);
                continue;
            }
        }
    }
    throw new Error(`${operationName} nach ${MAX_RETRIES} Versuchen fehlgeschlagen: ${lastError}`);
};

export async function findStationById(targetId) {
    for await (const station of readStations()) {
        if (station.id === targetId) {
            return station;
        }
    }
    return null; // station not found
}

export const getStationCoords = async (stationId = "8000191") => {
    try {

        const station = await findStationById(stationId)

        if (station && station.location) {
            return [
                station.location.longitude,
                station.location.latitude
            ];
        } else {
            throw new Error(`Keine Koordinaten gefunden für Station ID: ${stationId}`);
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Stationskoordinaten:', error);
        throw error;
    }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getDeparturesTripIds = async (client, stationId = "8000191", dateAndTime) => {

    const productFilter = ["nationalExpress", "bus"]

    const result = await withRetry(async () => {
        const departures = await client.departures(stationId, {
            // const departures = await vendo.departures(stationId, {
            results: 20, // Anzahl der Ergebnisse
            duration: 60, // Zeitraum in Minuten
            when: dateAndTime
        })
        return departures;
    }, `fetching departures`);

    console.log(`Found ${result.departures.length} departures.`)

    const departuresFilterd = result.departures.filter(d => !productFilter.includes(d.line.product))
    const tripIds = departuresFilterd
        .map(dep => { return { "tripId": dep.tripId, "plannedWhen": dep.plannedWhen } })
    console.log(`Reduced to ${tripIds.length} tripIds by filtering`)

    const finalTripIds = tripIds.slice(0,20)
    console.log(`Finally picked the first ${finalTripIds.length} of them`)

    return finalTripIds
}

export const getStopovers = async (client, tripId, departureTime = null) => {

    try {
        const result = await client.trip(tripId, { stopovers: true });
        const stations = result.trip.stopovers.map((stopover) => {
            return {
                id: stopover.stop.id,
                name: stopover.stop.name,
                latitude: stopover.stop.location.latitude,
                longitude: stopover.stop.location.longitude,
                plannedArrival: stopover.plannedArrival,
                travelTime: timeDelta(stopover.plannedArrival, departureTime)
            }
        });

        // remove startpoint and stops before departure time
        return departureTime ? stations.filter(d => d.plannedArrival > departureTime) : stations;
    } catch (error) {
        console.log("Error on getting stopovers: ", error)
        throw error;
    }
}

export const getAllNonStopStations = async (stationId = "8000191", dateAndTime) => {
    console.log("Get all non-stop stations")

    const hash = nanoid()
    const clientId = `janfseipel@gmail.com`
    const client = createClient(
        dbProfile, clientId)

    let initStationCoords
    let trips;
    let errorCount = 0;

    try {
        initStationCoords = await getStationCoords(stationId);
        trips = await getDeparturesTripIds(client, stationId, dateAndTime)

        if (!trips || trips.length === 0) {
            throw new Error(`Keine Trips gefunden für Station ID: ${stationId}`);
        }

        const nonStopStations = {}

        const stopoversOfTrips = await Promise.all(trips.slice(0, 50).map(trip => getStopovers(client, trip.tripId, trip.plannedWhen)));

        for (const stopovers of stopoversOfTrips) {
            try {
                if (!stopovers) continue;

                stopovers.forEach(stopover => {
                    if (nonStopStations[stopover.id]) {
                        nonStopStations[stopover.id].count += 1;
                        if (!nonStopStations[stopover.id].travelTime.includes(stopover.travelTime)) {
                            nonStopStations[stopover.id].travelTime.push(stopover.travelTime);
                        }
                    } else {
                        nonStopStations[stopover.id] = {
                            id: stopover.id,
                            name: stopover.name,
                            latitude: stopover.latitude,
                            longitude: stopover.longitude,
                            count: 1,
                            distance: getDistance(initStationCoords, [stopover.longitude, stopover.latitude]),
                            travelTime: [stopover.travelTime]
                        };
                    }
                });
            } catch (error) {
                console.log(`Error fetching stopovers: ${error}`, error.message);
                errorCount++;
                continue;
            }
        };
        // setActiveProfile()
        return {
            stations: nonStopStations,
            metadata: {
                total: trips.length,
                errors: errorCount,
                isComplete: errorCount === 0,
                message: errorCount > 0 ? `${errorCount} Verbindungen konnten nicht geladen werden` : null
            }
        };
    } catch (error) {
        throw {
            type: 'StationSearchError',
            message: error.message,
            stationId,
            originalError: error
        }
    }
}

export const getDistance = (firstPoint, secondPoint) => {
    return turf.distance(
        turf.point(firstPoint),
        turf.point(secondPoint),
        { units: 'meters' }
    );
}

const timeDelta = (dateString1, dateString2) => {

    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    const differenceInMilliseconds = Math.abs(date2 - date1);
    const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));

    return differenceInMinutes;

}
