import fs from 'fs';
import * as turf from '@turf/turf';

// Funktion zum Lesen der JSON-Datei
function readJsonFile(filename) {
    try {
        return JSON.parse(fs.readFileSync(filename, 'utf8'));
    } catch (err) {
        console.error(err);
        return null;
    }
}

// Funktion zum Schreiben der JSON-Datei
function writeJsonFile(filename, data) {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        console.log(`Daten erfolgreich in ${filename} geschrieben.`);
    } catch (err) {
        console.error(err);
    }
}

// Funktion zur Min-Max-Normalisierung
function minMaxNormalize(features, sizeProperty, normalizedProperty, filterFunction) {
    const filteredFeatures = features.filter(filterFunction);
    if (filteredFeatures.length === 0) return;

    const sizes = filteredFeatures.map((feature) => feature[sizeProperty]);
    const minSize = Math.min(...sizes);
    const maxSize = Math.max(...sizes);

    filteredFeatures.forEach((feature) => {
        const normalizedSize = (feature[sizeProperty] - minSize) / (maxSize - minSize);
        feature[normalizedProperty] = normalizedSize;
    });
}

// Hauptfunktion
function calculateAreaAndSave(filename) {
    console.log("Lese Daten...")
    const data = readJsonFile(filename);
    if (!data) return;

    // Berechne den Flächeninhalt für alle Objekte mit "geometry"
    console.log("Berechne Flächeninhalte...")

    // debugging 
    let errors = 0
    let relations = 0


    data.elements.forEach((feature) => {

        if (feature.type === "way") {
            // prüfe, ob erste geo-koordinate identisch mit letzter geo-koordinate
            if (feature.geometry && feature.geometry.length > 2 && feature.geometry[0].lat === feature.geometry[feature.geometry.length - 1].lat && feature.geometry[0].lon === feature.geometry[feature.geometry.length - 1].lon) {
                // Erstelle ein Polygon aus den Koordinaten
                const polygon = turf.polygon([feature.geometry.map((point) => [point.lon, point.lat])]);
    
                // Berechne den Flächeninhalt in Quadratmetern
                feature.size = turf.area(polygon);
            }
        } else if (feature.type === "relation") {
            relations++
            // Identische Berechnungen für die Umrisse einer Relation
            try {
                const outerGeometrys = feature.members.filter(d=>d.role ==="outer")
                const outerGeometry = outerGeometrys.map(item=>item.geometry).flat();
                const relationPolygon = turf.polygon([outerGeometry.map((point)=>[point.lon,point.lat])]);
                feature.size = turf.area(relationPolygon)
                if (!feature.size) {
                    console.log(outerGeometry)
                }
            } catch (e) {
                console.log(`Probleme bei der Berechnung von ID ${feature.id}: ${e}`)
                errors++
            }
            
        }

    });

    console.log("Normalisiere Flächeninhalte")
    // Min-Max-Normalisierung der Spielplätze
    minMaxNormalize(
        data.elements,
        'size',
        'size_normalized',
        (feature) => feature.tags && feature.tags.leisure === "playground" && feature.size !== undefined
    );

    // Ausgabe der Werte fürs debugging

    console.log(`Fehler bei ${errors} von ${relations} Relations`)
    const playgrounds = data.elements
        .filter(d => d.tags.leisure === "playground" && d.type === "relation" && d.size)
        .sort((a, b) => a.size - b.size)

    console.log("Drei kleinste Spielplätze:");
    playgrounds.slice(0, 3).forEach((feature) => {
        console.log(`ID: ${feature.id}, Größe: ${feature.size}`);
    });

    console.log("Drei größte Spielplätze:");
    playgrounds.slice(-3).forEach((feature) => {
        console.log(`ID: ${feature.id}, Größe: ${feature.size}`);
    });

    // Schreibe die aktualisierten Daten in eine neue Datei
    console.log("Speichere Datei...")
    const newFilename = filename.replace('.json', '_enhanced.json');
    // writeJsonFile(newFilename, data);
}

// Ausführen der Hauptfunktion
const filename = '../data/osm/osm_data_2024-12-08.json';
calculateAreaAndSave(filename);
