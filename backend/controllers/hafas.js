import { createDbHafas } from 'db-hafas';
import fs from 'fs/promises';
import * as turf from '@turf/turf';

export const getStationCoords = async (stationId = "8000191") => {
    try {
        const filePath = "./data/stations/stations.json";
        const data = await fs.readFile(filePath, 'utf8');
        const stations = JSON.parse(data);
        const station = stations.find(s => s.id === stationId);

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

export const getDeparturesTripIds = async (stationId = "8000191", dateAndTime) => {
    console.log("Ermittle TripIds")
    const dbHafas = createDbHafas('janfseipel@gmail.com')
    const productFilter = ["nationalExpress", "bus"]
    try {
        const departures = await dbHafas.departures(stationId, {
            results: 20, // Anzahl der Ergebnisse
            duration: 60, // Zeitraum in Minuten
            when: dateAndTime
        });
        const departuresFilterd = departures.departures.filter(d => !productFilter.includes(d.line.product))
        const tripIds = departuresFilterd
            .map(dep => { return { "tripId": dep.tripId, "plannedWhen": dep.plannedWhen } });
        return tripIds
    } catch (error) {
        console.log(`Fehler beim Abrufen der Abfahrten: ${error}`)
    }
}

export const getStopovers = async (tripId, departureTime = null) => {
    console.log("Ermittle Zwischenhalte")
    const dbHafas = createDbHafas('janfseipel@gmail.com')
    try {
        const trip = await dbHafas.trip(tripId, { stopovers: true });
        const stations = trip.trip.stopovers.map((stopover) => {
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
        console.log(`Error fetching trip data: ${error}`);
    }
}

export const getAllNonStopStations = async (stationId = "8000191", dateAndTime) => {
    console.log("Ermittle alle direkt angefahrenen Haltestellen")

    let initStationCoords
    let trips;
    let errorCount = 0;

    try { 
        initStationCoords = await getStationCoords(stationId);
        trips = await getDeparturesTripIds(stationId, dateAndTime)
        
        if (!trips || trips.length === 0) {
            throw new Error(`Keine Trips gefunden für Station ID: ${stationId}`);
        }

        const nonStopStations = {}

        for (const trip of trips) {
            try {
                const stopovers = await getStopovers(trip.tripId, trip.plannedWhen)
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
