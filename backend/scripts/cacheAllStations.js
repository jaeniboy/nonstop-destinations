import { readStations } from 'db-stations';
import fs from 'fs/promises';

async function saveStationsToJson() {
  const stations = [];

  try {
    // Lese alle Stationen aus dem Stream
    for await (const station of readStations()) {
      stations.push(station);
    }

    // Konvertiere das Array in einen JSON-String
    const jsonData = JSON.stringify(stations, null, 2);

    // Speichere die Daten in einer Datei
    await fs.writeFile('../data/stations/stations.json', jsonData, 'utf8');

    console.log('stations data saved successfully');
  } catch (error) {
    console.error('error while saving stations data:', error);
  }
}

saveStationsToJson();
