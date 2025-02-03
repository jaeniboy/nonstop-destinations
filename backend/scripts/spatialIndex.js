import RBush from "rbush";
import * as fs from 'fs';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import * as turf from '@turf/turf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function calculateRelationCenter(relationMembers) {
    // Funktion zur Rekursion: Extrahiert alle Koordinaten
    function extractCoordinates(members) {
        let coordinates = [];

        members.forEach(member => {
            if (member.type === 'node') {
                // Direkt die Koordinaten des Knotens hinzufügen
                coordinates.push([member.lon, member.lat]);
            } else if (member.type === 'way') {
                // Koordinaten aus dem geometry-Feld des Ways extrahieren
                if (member.geometry && Array.isArray(member.geometry)) {
                    coordinates.push(...member.geometry.map(point => [point.lon, point.lat]));
                }
            } else if (member.type === 'relation') {
                // Rekursiver Aufruf für verschachtelte Relationen
                if (member.members && Array.isArray(member.members)) {
                    coordinates.push(...extractCoordinates(member.members));
                }
            }
        });

        return coordinates;
    }

    // Alle Koordinaten der Relation extrahieren
    const allCoordinates = extractCoordinates(relationMembers);

    if (allCoordinates.length === 0) {
        throw new Error('Keine gültigen Koordinaten gefunden.');
    }

    // Erstellen eines MultiPoint-Features aus allen Koordinaten
    const multiPoint = turf.multiPoint(allCoordinates);

    // Berechnen des Zentrums
    const center = turf.center(multiPoint);

    return center.geometry.coordinates; // Rückgabe: [Längengrad, Breitengrad]
}


console.log("lade File");

try {
    const jsonPath = "./../data/osm/osm_data_2024-12-08_enhanced.json";
    const jsonData = await readFile(jsonPath, 'utf8');
    const data = JSON.parse(jsonData).elements;

    const spatialIndex = new RBush();

    // Prüfen Sie die Struktur der Daten
    console.log("Datenstruktur:", data.length);

    // Fügen Sie Nodes, Ways und Relations zum Index hinzu
    data.forEach(item => {
        // remove all items without a name
        if (item.tags.name) {
            if (item.type === 'node') {
                spatialIndex.insert({
                    minX: item.lon,
                    minY: item.lat,
                    maxX: item.lon,
                    maxY: item.lat,
                    node: item
                }); //} })
            } else if (item.type === 'way') {
                try {
                    // compute center of ways
                    const center = turf.center(turf.lineString(item.geometry.map(node => [node.lon, node.lat])));
                    const [lon, lat] = center.geometry.coordinates;

                    spatialIndex.insert({
                        minX: lon,
                        minY: lat,
                        maxX: lon,
                        maxY: lat,
                        node: {
                            ...item,
                            lat: lat,
                            lon: lon,
                            // remove unnecessary properties
                            geometry: undefined,
                            nodes: undefined,
                            bounds: undefined
                        }
                    });
                } catch (error) {
                    console.error(`Fehler beim Hinzufügen von Way ${item.id}:`, error.message);
                }
            } else if (item.type === 'relation') {
                try {
                    const center = calculateRelationCenter(item.members);
                    const [lon, lat] = center;

                    spatialIndex.insert({
                        minX: lon,
                        minY: lat,
                        maxX: lon,
                        maxY: lat,
                        node: {
                            ...item,
                            lat: lat,
                            lon: lon,
                            // remove unnecessary properties
                            members: undefined,
                            bounds: undefined
                        }
                    });
                } catch (error) {
                    console.error(`Fehler beim Hinzufügen von Relation ${item.id}:`, error.message);
                }
            }
        }
    });

    // Serialisieren des Index
    const serializedTree = JSON.stringify(spatialIndex.toJSON());

    // Speichern in einer Datei
    fs.writeFileSync('../data/index/spatial_index.json', serializedTree);


    console.log("Index erstellt");
} catch (error) {
    console.error('Fehler beim Laden der OSM-Daten:', error);
}