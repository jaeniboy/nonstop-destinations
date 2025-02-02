import fs from 'fs';
import * as turf from '@turf/turf';

function median(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

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

    const sizes = filteredFeatures.map((feature) => {
        // feature[sizeProperty] && feature[sizeProperty]
        if (feature[sizeProperty]) {
            return feature[sizeProperty]
        }
    });
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
                const outerGeometrys = feature.members.filter(d => d.role === "outer")
                const outerGeometry = outerGeometrys.map(item => item.geometry).flat();
                const relationPolygon = turf.polygon([outerGeometry.map((point) => [point.lon, point.lat])]);
                feature.size = turf.area(relationPolygon)
                if (!feature.size) {
                    console.log(outerGeometry)
                }
            } catch (e) {
                console.log(`Probleme bei der Berechnung von ID ${feature.id}: ${e}`)
                // todo: ignored them for the moment but should find better solution
                feature.size = undefined
                feature.sizeNormalized = undefined
                errors++
            }
        
        // add zero size to all playgrounds and parks that are nodes (assuming they're less important)
        } else if (feature.type === "node") {
            if (feature.tags.leisure === "playground" || feature.tags.leisure === "park") {
                feature.size = undefined
                feature.sizeNormalized = undefined;
            }
        }

    });

    console.log("Normalisiere Flächeninhalte")

    // Min-Max-Normalisierung der Spielplätze
    minMaxNormalize(
        data.elements,
        'size',
        'sizeNormalized',
        (feature) => feature.tags && feature.tags.leisure === "playground" && feature.size !== undefined
    );

    // Min-Max-Normalisierung der Parks
    minMaxNormalize(
        data.elements,
        'size',
        'sizeNormalized',
        (feature) => feature.tags && feature.tags.leisure !== "playground" && feature.tags.leisure === "park" && feature.size !== undefined
    );

    // Ausgabe der Werte fürs debugging

    // console.log(`Fehler bei ${errors} von ${relations} Relations`)
    console.log("")
    const playgrounds = data.elements
        .filter(d => d.tags.leisure === "playground" && d.type !== "node" && d.size)
        .sort((a, b) => a.size - b.size)

    console.log("Drei kleinste Spielplätze:");
    playgrounds.slice(0, 3).forEach((feature) => {
        console.log(`ID: ${feature.id}, Größe: ${feature.size}, Normalisiert: ${feature.sizeNormalized}`);
    });

    console.log("Drei größte Spielplätze:");
    playgrounds.slice(-3).forEach((feature) => {
        console.log(`ID: ${feature.id}, Größe: ${feature.size}, Normalisiert: ${feature.sizeNormalized}`);
    });

    console.log("")
    const parks = data.elements
        .filter(d => d.tags.leisure === "park" && d.tags.leisure !== "playground" && d.type !== "node" && d.size)
        .sort((a, b) => a.size - b.size)

    console.log("Drei kleinste Parks:");
    parks.slice(0, 3).forEach((feature) => {
        console.log(`ID: ${feature.id}, Größe: ${feature.size}, Normalisiert: ${feature.sizeNormalized}`);
    });

    console.log("Drei größte Parks:");
    parks.slice(-3).forEach((feature) => {
        console.log(`ID: ${feature.id}, Größe: ${feature.size}, Normalisiert: ${feature.sizeNormalized}`);
    });

    console.log("")
    const parksAndPlaygrounds = data.elements.filter((feature)=>feature.tags.leisure==="playground"||feature.tags.leisure==="park")
    const nodeTypes = parksAndPlaygrounds.filter(feature=>feature.type==="node")
    const normalized = parksAndPlaygrounds.filter(feature=>feature.sizeNormalized === 0)

    console.log(`Parks und Spielplätze gesamt: ${parksAndPlaygrounds.length}`)
    console.log(`Parks und Spielplätze nodes: ${nodeTypes.length}`)
    console.log(`Parks und Spielplätze size zero: ${normalized.length}`)

    // add median size value to all objects without size-property
    // since they are not important for them and shouldn't lead
    // to disadvantages in ranking. 
    let normalizedSizeValues = data.elements.filter(feature => feature.sizeNormalized).map(feature=>feature.sizeNormalized)
    // const normalizedSizeValues = data.elements.filter(feature => feature.sizeNormalized)
    console.log(`Anzahl Elemente gesamt: ${data.elements.length}`)
    console.log(`Anzahl normalisierter Werte: ${normalizedSizeValues.length}`)
    const medianValue = median(normalizedSizeValues)
    console.log(medianValue)
    
    console.log("Füge Median hinzu")
    data.elements.forEach((element)=> {
        if (!element.sizeNormalized) {
            element.sizeNormalized = medianValue
        }
    })

    normalizedSizeValues = data.elements.filter(feature => feature.sizeNormalized).map(feature=>feature.sizeNormalized)
    console.log(`Anzahl normalisierter Werte: ${normalizedSizeValues.length}`)
    console.log(data.elements.slice(-20).map(feature=>feature.sizeNormalized))

    // add ranking value for elements
    // todo: re-write to multiply with weights if necessary

    data.elements.forEach((element)=>{
        let rank = 0
        if (element.tags.name) {
            rank++
        }
        if (element.tags.website || element.tags["contact:website"]) {
            rank++
        }
        if (element.tags.description) {
            rank++
        }
        if (element.tags.wikipedia) {
            rank++
        }
        rank += element.sizeNormalized
        element.rankingValue = rank
    })

    console.log(data.elements.slice(0,3))

    // Schreibe die aktualisierten Daten in eine neue Datei
    console.log("Speichere Datei...")
    const newFilename = filename.replace('.json', '_enhanced.json');
    writeJsonFile(newFilename, data);
}

// Ausführen der Hauptfunktion
const filename = '../data/osm/osm_data_2024-12-08.json';
calculateAreaAndSave(filename);
