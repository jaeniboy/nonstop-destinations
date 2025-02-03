import RBush from "rbush";
import fs from "fs";
import * as turf from '@turf/turf';

export const enhancedStopovers = async (stopovers, radius) => {
    console.log("Get destinations next to stations")

    const serializedTree = fs.readFileSync('./data/index/spatial_index.json', 'utf8');
    const rb = new RBush()
    const tree = rb.fromJSON(JSON.parse(serializedTree));
    let enhanced = []
    for (const stop of stopovers) {
        const result = getNearbyFromLocalIndex([stop.longitude, stop.latitude], radius, tree, stop.name)
        // make deep copy of object to prevent overwriting by following objects due to same reference
        stop.destinations = JSON.parse(JSON.stringify(result));
        enhanced.push(stop)
    }

    return enhanced
}

export const getNearbyFromLocalIndex = (coords, radius, tree, name) => {

    // convert radius to degree (approximately)
    const radiusInDegrees = radius / 111000; // 1 Grad ≈ 111 km

    // define search area
    const searchBounds = {
        minX: Number(coords[0]) - radiusInDegrees,
        minY: Number(coords[1]) - radiusInDegrees,
        maxX: Number(coords[0]) + radiusInDegrees,
        maxY: Number(coords[1]) + radiusInDegrees
    };

    // looking for points in defined area
    const results = tree.search(searchBounds);

    // create turf point from station location
    // longitude latitude
    const point = turf.point(coords);

    // add distance to each point
    results.map(item => {
        const itemPoint = turf.point([item.node.lon, item.node.lat]);
        const distance = turf.distance(point, itemPoint, { units: 'meters'});
        item.node.distance = distance
    })

    // filter results based on distance from station
    const filteredResults = results.filter(item => {
        return item.node.distance <= radius;
    });

    // extrackt all node objects from filterd results
    const nodeObjects = filteredResults.map(item => item.node);

    // sort node objects based on rankingValue
    const nodesSorted = nodeObjects.sort((a,b) => b.rankingValue - a.rankingValue)

    return nodesSorted
}