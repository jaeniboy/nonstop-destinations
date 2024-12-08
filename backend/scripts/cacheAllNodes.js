import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fetchOSMData = async (bbox) => {
    const query = `
    [out:json]
    [bbox:${bbox}];
    (
        nwr["tourism"~"zoo|theme_park|museum|attraction|castle"]["access"!="private"];
        nwr["leisure"~"park|playground|swimming_pool"]["access"!="private"];
        nwr["amenity"="playground"]["access"!="private"];
        nwr["shop"="farm"]["access"!="private"];
    );
    out geom;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        console.log(`Sende Anfrage an Overpass API für Bounding-Box: ${bbox}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Erfolgreich Daten abgerufen für Bounding-Box: ${bbox}`);
        return data.elements;
    } catch (error) {
        console.error(`Fehler beim Abrufen der Daten für Bounding-Box ${bbox}:`, error);
        return [];
    }
};

export const cacheAllNodes = async () => {
    const bboxes = [
        '47.3024876979,5.98865807458,51.14279592545,10.50282697924', // NW
        '47.3024876979,10.50282697924,51.14279592545,15.0169958839', // NE
        '51.14279592545,5.98865807458,54.983104153,10.50282697924', // SW
        '51.14279592545,10.50282697924,54.983104153,15.0169958839'  // SE
    ];

    let allData = [];

    for (const bbox of bboxes) {
        console.log(`Beginne Abruf für Bounding-Box: ${bbox}`);
        const data = await fetchOSMData(bbox);
        console.log(`Anzahl der abgerufenen Elemente für Bounding-Box ${bbox}: ${data.length}`);
        allData = allData.concat(data);
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const dataDir = path.join(__dirname, './../data/osm');
    const fileName = path.join(dataDir, `osm_data_${timestamp}.json`);

    try {
        // Make sure that data folder exists
        await fs.mkdir(dataDir, { recursive: true });
        console.log(`Speichere Daten in Datei: ${fileName}`);
        await fs.writeFile(fileName, JSON.stringify({ elements: allData }, null, 2));
        console.log(`Daten erfolgreich in ${fileName} gespeichert`);
    } catch (error) {
        console.error('Fehler beim Abrufen oder Speichern der OSM-Daten:', error);
    }
}

console.log('Starte den Download und das Caching der OSM-Daten...');
cacheAllNodes()
    .then(() => console.log('Download und Caching erfolgreich abgeschlossen.'))
    .catch(error => console.error('Fehler beim Download und Caching:', error));