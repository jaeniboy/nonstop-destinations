import {createDbHafas} from 'db-hafas';

const dbHafas = createDbHafas('janfseipel@gmail.com')

/* Hier die verschiedenen Bahnhöfe Karlsruhes anzeigen lassen, funktioniert gut! */

// dbHafas.locations('Karlsruhe')
//   .then(locations => {
//     console.log('Gefundene Orte:', locations);
//   })
//   .catch(error => {
//     console.error('Fehler bei der Suche:', error);
//   });


const stationId = '8000191'; // ID für Karlsruhe Hbf

async function getAndDisplayDepartures(date = new Date()) {
  const productFilter = ["nationalExpress", "bus"]
  try {
    const departures = await dbHafas.departures(stationId, { 
      results: 10, // Anzahl der Ergebnisse
      duration: 12*60, // Zeitraum in Minuten
      when: date
    });
    const departuresFilterd = departures.departures.filter(d=>!productFilter.includes(d.line.product))
    console.log(`Abfahrten vom Karlsruher Hauptbahnhof (${departuresFilterd.length} Abfahrten insgesamt):`);
    // departures.departures
    //   .filter(d=>!productFilter.includes(d.line.product))
    departuresFilterd
      .forEach(dep => {
        const date = new Date(dep.plannedWhen);
        console.log(`${date.toLocaleString()} - ${dep.line.name} nach ${dep.direction} (Gleis ${dep.platform || 'unbekannt'}) .. ${dep.tripId}`);
      });
  } catch (error) {
    console.error('Fehler beim Abrufen der Abfahrten:', error);
  }
}

// getAndDisplayDepartures("2024-11-09 08:00");


// gibt einen Array mit Trip IDs aus
const getDeparturesTripIds = async (dateAndTime) => {
  const productFilter = ["nationalExpress", "bus"]
  try {
    const departures = await dbHafas.departures(stationId, { 
      results: 20, // Anzahl der Ergebnisse
      duration: 12*60, // Zeitraum in Minuten
      when: dateAndTime
    });
    const departuresFilterd = departures.departures.filter(d=>!productFilter.includes(d.line.product))
    const tripIds = departuresFilterd
      .map(dep => {return {"tripId": dep.tripId, "plannedWhen": dep.plannedWhen}});
      return tripIds
  } catch (error) {
    console.error('Fehler beim Abrufen der Abfahrten:', error);
  }
}

// gibt alle Haltestellen eines Trips aus
async function getStationsByTripId(tripId, cutByTime=null) {
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
      console.error('Error fetching trip data:', error);
  }
}

const tripIds = await getDeparturesTripIds("2024-11-09 08:00")
console.log(await getStationsByTripId(tripIds[0].tripId, tripIds[0].plannedWhen))




/* Welche Haltestellen gibt es in einem bestimmten Radius
* um meinen Standort herum? Klappt! */

async function getNearbyStations(latitude, longitude, radius = 1000) {
  try {
      const stops = await dbHafas.nearby({
          type: 'location',
          latitude: latitude,
          longitude: longitude
      }, { distance: radius });

      return stops.map(stop => ({
          name: stop.name,
          latitude: stop.location.latitude,
          longitude: stop.location.longitude
      }));
  } catch (error) {
      console.error('Error fetching nearby stations:', error);
    }
  }
  
// Example usage: 48.9956874,8.4037444 
// getNearbyStations(48.9956874, 8.4037444).then(console.log);

/*
* Welche Haltestellen werden von diesen Verbindungen
* angefahren - bitte mit Koordinaten. Klappt!
*/


// Example usage:

// const trip = "2|#VN#1#ST#1730325184#PI#0#ZI#2201401#TA#0#DA#41124#1S#8000191#1T#2121#LS#8000189#LT#2358#PU#80#RT#1#CA#s#ZE#3#ZB#S      3#PC#4#FR#8000191#FT#2121#TO#8000189#TT#2358#"
// getStationsByTripId(trip).then(console.log);

/*
* Welche Ausflugsziele gibt es in einem bestimmten 
* Radius um einen Standort herum bei Open Street Map?
* Klappt, aber man muss auf jeden Fall übel gut filtern. 
* Momentan viel zu Kleinteilig...
*/

// const queryOverpass = require('@derhuerst/query-overpass');
import queryOverpass from "@derhuerst/query-overpass"

function findFamilyFriendlyPlaces(latitude, longitude) {
    const radius = 2000; // 1 km in meters
    const query = `
        [out:json][timeout:25];
        (
            node(around:${radius},${latitude},${longitude})["amenity"="playground"];
            node(around:${radius},${latitude},${longitude})["leisure"~"park|playground|swimming_pool"];
            node(around:${radius},${latitude},${longitude})["tourism"~"zoo|theme_park|museum|attraction|castle"];
            node(around:${radius},${latitude},${longitude})["shop"="farm"];
        );
        out body;
    `;

    return queryOverpass(query)
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

// Example usage: Ettlingen Stadt
// findFamilyFriendlyPlaces(48.9387642,8.4065436);

