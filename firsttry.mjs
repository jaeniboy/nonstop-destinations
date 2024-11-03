import {createDbHafas} from 'db-hafas';

const dbHafas = createDbHafas('nonstop-destinations')

// ### Hier die verschiedenen Bahnhöfe Karlsruhes anzeigen lassen, funktioniert gut!

// dbHafas.locations('Karlsruhe')
//   .then(locations => {
//     console.log('Gefundene Orte:', locations);
//   })
//   .catch(error => {
//     console.error('Fehler bei der Suche:', error);
//   });


const stationId = '8000191'; // ID für Karlsruhe Hbf

async function getAndDisplayDepartures() {
  try {
    const departures = await dbHafas.departures(stationId, { 
      results: 20, // Anzahl der Ergebnisse
      duration: 10 // Zeitraum in Minuten
    });
    console.log(departures.departures[0])
    console.log('Abfahrten vom Karlsruher Hauptbahnhof:');
    departures.departures.forEach(dep => {
      const date = new Date(dep.plannedWhen);
      console.log(`${date.toLocaleTimeString()} - ${dep.line.name} nach ${dep.direction} (Gleis ${dep.platform || 'unbekannt'})`);
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Abfahrten:', error);
  }
}

// Funktion aufrufen
getAndDisplayDepartures();