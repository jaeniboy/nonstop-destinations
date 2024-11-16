import queryOverpass from "@derhuerst/query-overpass"
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const cacheAllNodes = async () => {
    const query = `
    [out:json]
    [bbox:47.3024876979,5.98865807458,54.983104153,15.0169958839];
    (
        node["tourism"~"zoo|theme_park|museum|attraction|castle"]["access"!="private"];
        node["leisure"~"park|playground|swimming_pool"]["access"!="private"];
        node["amenity"="playground"]["access"!="private"];
        node["shop"="farm"]["access"!="private"];
    );
    out body;
  `;

    try {
        const data = await queryOverpass(query);

        const timestamp = new Date().toISOString().split('T')[0];
        const dataDir = path.join(__dirname, '..', 'data', 'osm');
        const fileName = path.join(dataDir, `osm_data_${timestamp}.json`);

        // Make sure that data folder exists
        await fs.mkdir(dataDir, { recursive: true });

        await fs.writeFile(fileName, JSON.stringify(data, null, 2));
        console.log(`Daten erfolgreich in ${fileName} gespeichert`);
    } catch (error) {
        console.error('Fehler beim Abrufen oder Speichern der OSM-Daten:', error);
    }
}

console.log('Starte den Download und das Caching der OSM-Daten...');
cacheAllNodes()
  .then(() => console.log('Download und Caching erfolgreich abgeschlossen.'))
  .catch(error => console.error('Fehler beim Download und Caching:', error));