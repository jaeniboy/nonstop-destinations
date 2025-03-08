import { getDeparturesTripIds } from "./rmv.js";

export const getAllNonStopStations = async (stationId = "8000191", dateAndTime) => {
    console.log("Ermittle alle direkt angefahrenen Haltestellen")

    let initStationCoords
    let trips;
    let errorCount = 0;

    // try {
        // initStationCoords = await getStationCoords(stationId);
        initStationCoords = [8.4037, 49.0069] // zu testzwecken erstmal nur Karlsruhe
        trips = await getDeparturesTripIds(stationId, dateAndTime)

    //     if (!trips || trips.length === 0) {
    //         throw new Error(`Keine Trips gefunden für Station ID: ${stationId}`);
    //     }

    //     const nonStopStations = {}

    //     const stopoversOfTrips = await Promise.all(trips.slice(0, 50).map(trip => getStopovers(trip.tripId, trip.plannedWhen)));

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
    return trips
}