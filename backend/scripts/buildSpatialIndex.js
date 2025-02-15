import RBush from "rbush";
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import * as turf from '@turf/turf';
import { getOsmFiles, readJsonFile, updateStatusFile } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function calculateRelationCenter(relationMembers) {
    // recursive function: extract all coordinates
    function extractCoordinates(members) {
        let coordinates = [];

        members.forEach(member => {
            if (member.type === 'node') {
                // add coordinates of node
                coordinates.push([member.lon, member.lat]);
            } else if (member.type === 'way') {
                // extract coords of geometry
                if (member.geometry && Array.isArray(member.geometry)) {
                    coordinates.push(...member.geometry.map(point => [point.lon, point.lat]));
                }
            } else if (member.type === 'relation') {
                // recursive call if relations are netsted
                if (member.members && Array.isArray(member.members)) {
                    coordinates.push(...extractCoordinates(member.members));
                }
            }
        });

        return coordinates;
    }

    // extract all coordinates of relation
    const allCoordinates = extractCoordinates(relationMembers);

    if (allCoordinates.length === 0) {
        throw new Error('Unable to find valid coords.');
    }

    // build multipoint feature of all coords
    const multiPoint = turf.multiPoint(allCoordinates);

    // compute center of multipoint
    const center = turf.center(multiPoint);

    return center.geometry.coordinates; // return: [longitude, latitude]
}


console.log("Build spatial Index");

try {
    const jsonPath = await getOsmFiles("./../data/osm")
    console.log(`Load data from ${jsonPath}`)
    const data = readJsonFile(jsonPath).elements;

    const spatialIndex = new RBush();

    // Check data structure
    console.log("Data structure:", data.length);

    // add nodes, ways and relations to spatial index
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
                    console.error(`Unable to add relation ${item.id}:`, error.message);
                }
            }
        }
    });

    // serialization of index
    const serializedTree = JSON.stringify(spatialIndex.toJSON());

    // rename old index file
    const filename = '../data/index/spatial_index.json'
    if (fs.existsSync(filename)) {
        const backupPath = `${filename}.bak`;
        try {
            // rename
            fs.renameSync(filename, backupPath);
            console.log(`Renamed old index file: ${backupPath}`);
        } catch (error) {
            console.error(`Unable to rename old index file: ${error.message}`);
        }
    }

    // save index
    fs.writeFileSync('../data/index/spatial_index.json', serializedTree);
    updateStatusFile("builtSpatialIndex")
    console.log("Index built successfully");
} catch (error) {
    console.error('Unable to load osm data', error);
}