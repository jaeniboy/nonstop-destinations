import {createDbHafas} from 'db-hafas';

export const getDeparturesTripIds = async (stationId = "8000191", dateAndTime) => {
    const dbHafas = createDbHafas('janfseipel@gmail.com')
    const productFilter = ["nationalExpress", "bus"]
    try {
      const departures = await dbHafas.departures(stationId, { 
        results: 20, // Anzahl der Ergebnisse
        duration: 60, // Zeitraum in Minuten
        when: dateAndTime
      });
      const departuresFilterd = departures.departures.filter(d=>!productFilter.includes(d.line.product))
      const tripIds = departuresFilterd
        .map(dep => {return {"tripId": dep.tripId, "plannedWhen": dep.plannedWhen}});
        return tripIds
    } catch (error) {
        return `Fehler beim Abrufen der Abfahrten: ${error}`
    }
  }

export const getStopovers = async (tripId, cutByTime=null) => {
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
        return cutByTime ? stations.filter(d=>d.plannedArrival > cutByTime) : stations;
    } catch (error) {
        return `Error fetching trip data: ${error}`;
    }
}

export const getAllNonStopStations = async (stationId  = "8000191", dateAndTime) => {
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
                    count: 1
                };
            }
        });
    };
    return nonStopStations
}
  