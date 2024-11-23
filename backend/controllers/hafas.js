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
        return `Fehler beim Abrufen der Abfahrten: ${error}`
    }
}

export const getStopovers = async (tripId, cutByTime = null) => {
    console.log("Ermittle Zwischenhalte")
    const dbHafas = createDbHafas('janfseipel@gmail.com')
    try {
        const trip = await dbHafas.trip(tripId, { stopovers: true });
        const stations = trip.trip.stopovers.map(stopover => ({
            id: stopover.stop.id,
            name: stopover.stop.name,
            latitude: stopover.stop.location.latitude,
            longitude: stopover.stop.location.longitude,
            plannedArrival: stopover.plannedArrival,
        }));
        // remove startpoint and stops before
        return cutByTime ? stations.filter(d => d.plannedArrival > cutByTime) : stations;
    } catch (error) {
        return `Error fetching trip data: ${error}`;
    }
}

export const getAllNonStopStations = async (stationId = "8000191", dateAndTime) => {
    console.log("Ermittle alle direkt angefahrenen Haltestellen")
    const initStationCoords = await getStationCoords(stationId)
    const trips = await getDeparturesTripIds(stationId, dateAndTime)
    const nonStopStations = {}
    for (const trip of trips) {
        const stopovers = await getStopovers(trip.tripId, trip.plannedWhen)
        stopovers.forEach(stopover => {
            if (nonStopStations[stopover.id]) {
                nonStopStations[stopover.id].count += 1;
            } else {
                nonStopStations[stopover.id] = {
                    id: stopover.id,
                    name: stopover.name,
                    latitude: stopover.latitude,
                    longitude: stopover.longitude,
                    count: 1,
                    distance: getDistance(initStationCoords, [stopover.longitude,stopover.latitude])
                };
            }
        });
    };
    return nonStopStations
}

export const getDistance = (firstPoint, secondPoint) => {
    return turf.distance(
        turf.point(firstPoint), 
        turf.point(secondPoint), 
        { units: 'meters' }
    );
}
