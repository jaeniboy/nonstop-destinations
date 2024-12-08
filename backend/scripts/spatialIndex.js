import RBush from "rbush";
import * as fs from 'fs';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import * as turf from '@turf/turf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("lade File");

try {
    const jsonPath = "./../data/osm/osm_data_2024-12-08.json";
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
            }
        }
    });
    //     } else if (item.type === 'relation') {
    //         try {
    //             const members = item.members.map(member => {
    //                 if (member.type === 'node') {
    //                     return data.find(n => n.id === member.ref && n.type === 'node');
    //                 } else if (member.type === 'way') {
    //                     return data.find(w => w.id === member.ref && w.type === 'way');
    //                 }
    //                 return null;
    //             }).filter(Boolean);

    //             const bbox = turf.bbox(turf.featureCollection(members.map(member => {
    //                 if (member.type === 'node') {
    //                     return turf.point([member.lon, member.lat]);
    //                 } else if (member.type === 'way') {
    //                     return turf.lineString(member.nodes.map(nodeId => {
    //                         const node = data.find(n => n.id === nodeId && n.type === 'node');
    //                         if (!node) throw new Error(`Node ${nodeId} nicht gefunden`);
    //                         return [node.lon, node.lat];
    //                     }));
    //                 }
    //                 return null;
    //             }).filter(Boolean)));

    //             spatialIndex.insert({
    //                 minX: bbox[0],
    //                 minY: bbox[1],
    //                 maxX: bbox[2],
    //                 maxY: bbox[3],
    //                 ...item
    //             });
    //         } catch (error) {
    //             console.error(`Fehler beim Hinzufügen von Relation ${item.id}:`, error.message);
    //         }
    //     }
    // });

    // Serialisieren des Index
    const serializedTree = JSON.stringify(spatialIndex.toJSON());

    // Speichern in einer Datei
    fs.writeFileSync('../data/index/spatial_index.json', serializedTree);


    console.log("Index erstellt");
} catch (error) {
    console.error('Fehler beim Laden der OSM-Daten:', error);
}