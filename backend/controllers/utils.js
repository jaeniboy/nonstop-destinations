import { getDeparturesTripIds, getStopovers } from "./rmv.js";

export const getAllNonStopStations = async (stationId = "8000191", dateAndTime) => {
    console.log(`Fetching direct connections from station id ${stationId}`)

    let initStationCoords
    let trips;
    let errorCount = 0;

    // try {
        // initStationCoords = await getStationCoords(stationId);
        initStationCoords = [8.4037, 49.0069] // zu testzwecken erstmal nur Karlsruhe
        trips = await getDeparturesTripIds(stationId, dateAndTime)

        if (!trips || trips.length === 0) {
            throw new Error(`No trips found for Station ID: ${stationId}`);
        }
        
        const nonStopStations = {}
        const journeyDetails = getStopovers(trips[0].tripId, trips[0].plannedWhen)
        // const journeyDetails = getStopovers(trips[0].tripId, stationId)

        
        const stopoversOfTrips = await Promise.all(trips.map(trip => getStopovers(trip.tripId, trip.plannedWhen, trip.connectionsPerHour)));
        return stopoversOfTrips

    //     for (const stopovers of stopoversOfTrips) {
    //         try {
    //             if (!stopovers) continue;

    //             stopovers.forEach(stopover => {
    //                 if (nonStopStations[stopover.id]) {
    //                     nonStopStations[stopover.id].count += 1;
    //                     if (!nonStopStations[stopover.id].travelTime.includes(stopover.travelTime)) {
    //                         nonStopStations[stopover.id].travelTime.push(stopover.travelTime);
    //                     }
    //                 } else {
    //                     nonStopStations[stopover.id] = {
    //                         id: stopover.id,
    //                         name: stopover.name,
    //                         latitude: stopover.latitude,
    //                         longitude: stopover.longitude,
    //                         count: 1,
    //                         distance: getDistance(initStationCoords, [stopover.longitude, stopover.latitude]),
    //                         travelTime: [stopover.travelTime]
    //                     };
    //                 }
    //             });
    //         } catch (error) {
    //             console.log(`Error fetching stopovers: ${error}`, error.message);
    //             errorCount++;
    //             continue;
    //         }
    //     };
    //     return {
    //         stations: nonStopStations,
    //         metadata: {
    //             total: trips.length,
    //             errors: errorCount,
    //             isComplete: errorCount === 0,
    //             message: errorCount > 0 ? `${errorCount} Verbindungen konnten nicht geladen werden` : null
    //         }
    //     };
    // } catch (error) {
    //     throw {
    //         type: 'StationSearchError',
    //         message: error.message,
    //         stationId,
    //         originalError: error
    //     }
    // }
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