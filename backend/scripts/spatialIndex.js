import RBush from "rbush";
// import data from '../data/osm/osm_data_2024-11-16.json' assert { type: 'json' };    
import * as fs from 'fs'
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("lade File")

try {
    const jsonPath = path.join(__dirname, '../data/osm/osm_data_2024-11-16.json');
    const jsonData = await readFile(jsonPath, 'utf8');
    const data = JSON.parse(jsonData);
    // Verwenden Sie data hier

    console.log("erstelle räumlichen index")

    // Erstellen Sie einen neuen RBush-Index
    const tree = new RBush();

    // Laden Sie Ihre JSON-Daten
    // const data = require('./path/to/your/json/file.json');

    // Fügen Sie die Daten zum Index hinzu
    const items = data.map(item => ({
        minX: item.lon,
        minY: item.lat,
        maxX: item.lon,
        maxY: item.lat,
        node: item // Speichern Sie das gesamte Node-Objekt
    }));

    tree.load(items);

    // Serialisieren des Index
    const serializedTree = JSON.stringify(tree.toJSON());

    // Speichern in einer Datei
    fs.writeFileSync('./data/index/spatial_index.json', serializedTree);

    console.log("fertig")
} catch (error) {
    console.error('Fehler beim Lesen der JSON-Datei:', error);
}