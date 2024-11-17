import RBush from "rbush";
import fs from "fs";
import * as turf from '@turf/turf';

export const enhancedStopovers = async (stopovers, radius) => {
    console.log("Ermittle Ziele in der Nähe der Haltestellen")

    const serializedTree = fs.readFileSync('./data/index/spatial_index.json', 'utf8');
    const rb = new RBush()
    const tree = rb.fromJSON(JSON.parse(serializedTree));
    const enhanced = await Promise.all(stopovers.map(async d => {
        return {
            ...d,
            "destinations": await getNearbyFromLocalIndex([d.longitude, d.latitude], radius, tree)
        }
    }))

    return enhanced
}

export const getNearbyFromLocalIndex = async (coords, radius, tree) => {
    // console.log(`Rufe Ziele in der Nähe der Koordinate ${coords[0]}, ${coords[1]} ab`)

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

    // Filtere die Ergebnisse basierend auf der genauen Entfernung mit Turf
    const filteredResults = results.filter(item => {
        const itemPoint = turf.point([item.node.lon, item.node.lat]);
        const distance = turf.distance(point, itemPoint, { units: 'meters' });
        return distance <= radius;
    });

    // Extrahiere die vollständigen Node-Objekte aus den gefilterten Ergebnissen
    return filteredResults.map(item => item.node);
}