import queryOverpass from "@derhuerst/query-overpass"
import pLimit from 'p-limit';
import RBush from "rbush";
import fs from "fs";
import * as turf from '@turf/turf';

export const findPlaces = async (latitude, longitude, radius = 1000) => {
    const query = `
        [out:json][timeout:25];
        (
            node(around:${radius},${latitude},${longitude})["amenity"="playground"];
            node(around:${radius},${latitude},${longitude})["leisure"~"park|playground|swimming_pool"];
            node(around:${radius},${latitude},${longitude})["tourism"~"zoo|theme_park|museum|attraction|castle"];
            node(around:${radius},${latitude},${longitude})["shop"="farm"];
        );
        out body;
    `;
    let result = {}
    try {
        result = await queryOverpass(query)
    } catch (error) {
        console.log(error)
    }

    return result
}
// todo: implement distance computing after batch query
export const batchFindPlaces = async (coordinates, radius) => {
    const filters = [
        '["amenity"="playground"]',
        '["leisure"~"park|playground|swimming_pool"]',
        '["tourism"~"zoo|theme_park|museum|attraction|castle"]',
        '["shop"="farm"]'
    ]
    const nodes = coordinates.map(([lat, lon]) =>
        filters.map(d =>
            `node(around:${radius},${lat},${lon})${d};`
        ).join('')
    ).join('');

    const query = `
     [out:json][timeout:25];
        (${nodes});
        out body;
    `

    let result = {}
    try {
        result = await queryOverpass(query)
    } catch (error) {
        console.log(error)
    }

    return result

    // return query
    // Implementieren Sie hier die Overpass-Abfrage mit dem zusammengefassten Query
}

export const findPlacesBoundingBox = async (bboxArray) => {
    console.log(bboxArray)
    const query = `
        [out:json]
        [bbox:47.376620,6.536865,49.543594,10.101929];
        (
        node["tourism"~"zoo|theme_park|museum|attraction|castle"];
        node["leisure"~"park|playground|swimming_pool"];
        node["amenity"="playground"];
        node["shop"="farm"];
        );
        out body;
    `;
    let result = {}
    try {
        result = await queryOverpass(query)
    } catch (error) {
        //    result = error.reponseBody
        console.log(error)
    }

    return result
}

export const batchEnhanceStopovers = async (stopovers, radius, batchSize = 25) => {
    // get osm batch query
    const coordinates = stopovers.map(d => [d.latitude, d.longitude])
    for (let i = 0; i < coordinates.length; i += batchSize) {
        const batch = coordinates.slice(i, i + batchSize)
        const places = await batchFindPlaces(batch, radius)
        console.log(places)
    }
}

export const enhancedStopovers = async (stopovers, radius) => {
    console.log("Ermittle Ziele in der Nähe der Haltestellen")

    const serializedTree = fs.readFileSync('./data/index/spatial_index.json', 'utf8');
    const rb = new RBush()
    const tree = rb.fromJSON(JSON.parse(serializedTree));
    const enhanced = await Promise.all(stopovers.map(async d => {
        return {
            ...d,
            "destinations": await getNearbyFromLocalIndex([d.longitude, d.latitude], radius, tree)
            // "destinations": await findPlaces(d.latitude, d.longitude, radius)
        }
    }))

    // const limit = pLimit(10); // Maximal gleichzeitige Anfragen
    // const enhanced = await Promise.all(stopovers.map(async d => {
    // return {
    // ...d,
    // "destinations": await findPlaces(d.latitude, d.longitude, radius)
    // }
    // const enhanced = await Promise.all(stopovers.map(async (d) => {
    //     const destinations = await limit(async () => {
    //         // return await findPlaces(d.latitude, d.longitude, radius);
    //         return await getNearbyFromLocalIndex([d.longitude,d.latitude], radius);
    //     });

    //     return { ...d, destinations };
    // }));
    return enhanced
}

export const getNearbyFromLocalIndex = async (coords, radius, tree) => {
    console.log(`Rufe Ziele in der Nähe der Koordinate ${coords[0]}, ${coords[1]} ab`)
    // const serializedTree = fs.readFileSync('./data/index/spatial_index.json', 'utf8');
    // const rb = new RBush()
    // const tree = rb.fromJSON(JSON.parse(serializedTree));

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

export const getNearbysFromLocalIndex = async (coords, radius) => {



}