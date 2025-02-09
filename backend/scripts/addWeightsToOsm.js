import * as turf from '@turf/turf';
import { getOsmFiles, readJsonFile, writeJsonFile } from './utils.js';

function median(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// min-max-normalization for playground and park area sizes
function minMaxNormalize(features, sizeProperty, normalizedProperty, filterFunction) {
    const filteredFeatures = features.filter(filterFunction);
    if (filteredFeatures.length === 0) return;

    const sizes = filteredFeatures
        .filter((feature) => feature[sizeProperty] !== undefined && feature[sizeProperty] !== null)
        .map((feature) => feature[sizeProperty]);

    const minSize = Math.min(...sizes);
    const maxSize = Math.max(...sizes);

    filteredFeatures.forEach((feature) => {
        const normalizedSize = (feature[sizeProperty] - minSize) / (maxSize - minSize);
        // round to four numbers after comma
        feature[normalizedProperty] = Number(normalizedSize.toFixed(4));
    });
}

// main function
function calculateAreaAndSave(filename) {
    console.log(`Reading data from ${filename}`)
    const data = readJsonFile(filename);
    if (!data) return;

    // compute area size for all features with geometry
    data.elements.forEach((feature) => {

        if (feature.type === "way") {
            // check if first and last coordinate are the same
            if (feature.geometry && feature.geometry.length > 2 && feature.geometry[0].lat === feature.geometry[feature.geometry.length - 1].lat && feature.geometry[0].lon === feature.geometry[feature.geometry.length - 1].lon) {
                // create polygon from coordinates
                const polygon = turf.polygon([feature.geometry.map((point) => [point.lon, point.lat])]);
                // compute area size
                const size = turf.area(polygon);
                const sizeRounded = Math.round(size);
                if (typeof sizeRounded !== "number") {
                    console.log(`Size: ${size}, rounded: ${sizeRounded}`)
                }
                feature.size = sizeRounded;
            }
        } else if (feature.type === "relation") {
            // same presedure for "outer"-ways of relations . todo: problems with multiple "outer"-types
            try {
                const outerGeometrys = feature.members.filter(d => d.role === "outer")
                const outerGeometry = outerGeometrys.map(item => item.geometry).flat();
                const relationPolygon = turf.polygon([outerGeometry.map((point) => [point.lon, point.lat])]);
                const size = turf.area(relationPolygon)
                const sizeRounded = Math.round(size)

                if (typeof sizeRounded !== "number") {
                    console.log(`Size: ${size}, rounded: ${sizeRounded}`)
                }
                feature.size = sizeRounded;
            } catch (e) {
                console.log(`Problems with ID ${feature.id}: ${e}`)
                // todo: ignore them for the moment but should find better solution
                feature.size = undefined
                feature.sizeNormalized = undefined
            }

            // add zero size to all playgrounds and parks that are nodes (assuming they're less important)
        } else if (feature.type === "node") {
            if (feature.tags.leisure === "playground" || feature.tags.leisure === "park") {
                feature.size = undefined
                feature.sizeNormalized = undefined;
            }
        }

    });

    // for playgrounds
    console.log("Normalize playground sizes...")
    minMaxNormalize(
        data.elements,
        'size',
        'sizeNormalized',
        (feature) => feature.tags && feature.tags.leisure === "playground" && feature.size !== undefined
    );

    // for parks
    console.log("Normalize park sizes...")
    minMaxNormalize(
        data.elements,
        'size',
        'sizeNormalized',
        (feature) => feature.tags && feature.tags.leisure !== "playground" && feature.tags.leisure === "park" && feature.size !== undefined
    );

    // add median size value to all objects without size-property
    // since they are not important for them and shouldn't lead
    // to disadvantages in ranking. 
    console.log("Add median...")

    let normalizedSizeValues = data.elements.filter(feature => feature.sizeNormalized).map(feature => feature.sizeNormalized)
    const medianValue = median(normalizedSizeValues)

    data.elements.forEach((element) => {
        if (!element.sizeNormalized) {
            element.sizeNormalized = medianValue
        }
    })

    // add ranking value for elements
    // todo: re-write to multiply with weights if necessary
    data.elements.forEach((element) => {
        let rank = 0
        if (element.tags.name) {
            rank++
        }
        if (element.tags.website || element.tags["contact:website"]) {
            rank++
        }
        if (element.tags.description || element.tags["description:de"]) {
            rank++
        }
        if (element.tags.wikipedia) {
            rank++
        }
        rank += element.sizeNormalized
        element.rankingValue = rank
    })

    // write enhanced data to file
    console.log("Safe file...")
    // const newFilename = filename.replace('.json', '_enhanced.json');
    writeJsonFile(filename, data);
}

// run main function
const filename = await getOsmFiles("./../data/osm");
calculateAreaAndSave(filename);
