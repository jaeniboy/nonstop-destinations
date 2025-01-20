import RBush from "rbush";
import fs from "fs";
import * as turf from '@turf/turf';

export const enhancedStopovers = async (stopovers, radius) => {
    console.log("Ermittle Ziele in der Nähe der Haltestellen")

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

    // Konvertiere den Radius von Metern zu Grad (ungefähre Umrechnung)
    const radiusInDegrees = radius / 111000; // 1 Grad ≈ 111 km

    // Definiere den Suchbereich
    const searchBounds = {
        minX: Number(coords[0]) - radiusInDegrees,
        minY: Number(coords[1]) - radiusInDegrees,
        maxX: Number(coords[0]) + radiusInDegrees,
        maxY: Number(coords[1]) + radiusInDegrees
    };

    // Suche nach Punkten im definierten Bereich
    const results = tree.search(searchBounds);

    // Erstelle ein Turf Point aus den Eingabekoordinaten
    // longitude latitude
    const point = turf.point(coords);

    // add distance to each point
    results.map(item => {
        const itemPoint = turf.point([item.node.lon, item.node.lat]);
        const distance = turf.distance(point, itemPoint, { units: 'meters'});
        item.node.distance = distance
    })

    // Filtere die Ergebnisse basierend auf der genauen Entfernung mit Turf
    const filteredResults = results.filter(item => {
        return item.node.distance <= radius;
    });

    // Extrahiere die vollständigen Node-Objekte aus den gefilterten Ergebnissen
    const foo = filteredResults.map(item => item.node);

    return foo
}