import { getDeparturesTripIds, getStopovers, getStationCoords } from "./rmv.js";
import * as turf from '@turf/turf';

async function fetchStopoversInBatches(trips, batchSize = 10) {
    const totalBatches = Math.ceil(trips.length / batchSize);
    const stopoversOfTrips = [];

    for (let batchNumber = 0; batchNumber < totalBatches; batchNumber++) {
        const startIndex = batchNumber * batchSize;
        const endIndex = Math.min(startIndex + batchSize, trips.length);
        const currentBatch = trips.slice(startIndex, endIndex);

        console.log(`Processing batch ${batchNumber + 1} of ${totalBatches}`);

        const stopovers = await Promise.all(
            currentBatch.map(trip => getStopovers(trip.tripId, trip.plannedWhen, trip.connectionsPerHour))
        );

        stopoversOfTrips.push(...stopovers);
    }

    return stopoversOfTrips;
}


export const getAllNonStopStations = async (stationId = "8000191", dateAndTime) => {
    console.log(`Fetching direct connections from station id ${stationId}`)

    let trips;
    let errorCount = 0;

    try {
        const stationCoords = await getStationCoords(stationId);
        trips = await getDeparturesTripIds(stationId, dateAndTime)

        if (!trips || trips.length === 0) {
            throw new Error(`No trips found for Station ID: ${stationId}`);
        } else {
            console.log(`${trips.length} tripsIds found`)
        }

        // const stopoversOfTrips = await Promise.all(trips.map(trip => getStopovers(trip.tripId, trip.plannedWhen, trip.connectionsPerHour)));
        const stopoversOfTrips = await fetchStopoversInBatches(trips, 10);
        
        const nonStopStations = {}
        for (const stopovers of stopoversOfTrips) {
            try {
                stopovers.forEach(stopover => {
                    if (nonStopStations[stopover.id]) {
                        nonStopStations[stopover.id].connectionsPerHour = nonStopStations[stopover.id].connectionsPerHour + stopover.connectionsPerHour;
                        if (!nonStopStations[stopover.id].travelTime.includes(stopover.travelTime)) {
                            nonStopStations[stopover.id].travelTime.push(stopover.travelTime);
                        }
                    } else {
                        nonStopStations[stopover.id] = {
                            ...stopover,
                            distance: getDistance(stationCoords, [stopover.longitude, stopover.latitude]),
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

export function getNextDayAt9AM() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow;
}

export const timeDelta = (dateString1, dateString2) => {

    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    const differenceInMilliseconds = Math.abs(date2 - date1);
    const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));

    return differenceInMinutes;

}

export const getDistance = (firstPoint, secondPoint) => {
    return turf.distance(
        turf.point(firstPoint),
        turf.point(secondPoint),
        { units: 'meters' }
    );
}