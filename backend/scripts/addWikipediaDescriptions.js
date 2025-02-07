import axios from "axios";
import jsonData from "../data/osm/osm_data_2024-12-08_enhanced.json" assert { type: 'json' };
import { writeFileSync } from "fs";

// console.log(jsonData[0])

// Beispiel-Array von JSON-Objekten
const data = [{
    "type": "node",
    "id": 25393491,
    "lat": 53.8603842,
    "lon": 10.6856317,
    "tags": {
        "dog": "no",
        "lastcheck": "2015-04-23",
        "name": "Museum für Natur und Umwelt",
        "opening_hours": "Tu-Th 09:00-17:00; Sa-Su 10:00-17:00",
        "toilets:wheelchair": "no",
        "tourism": "museum",
        "website": "https://museum-fuer-natur-und-umwelt.de/",
        "wheelchair": "limited",
        "wikidata": "Q1360933",
        "wikipedia": "de:Museum für Natur und Umwelt Lübeck"
    }
}, {
    "type": "node",
    "id": 25393497,
    "lat": 53.871379,
    "lon": 10.6899139,
    "tags": {
        "addr:city": "Lübeck",
        "addr:country": "DE",
        "addr:housenumber": "11",
        "addr:postcode": "23552",
        "addr:street": "Koberg",
        "contact:website": "http://www.heiligen-geist-hospital.de/",
        "fee": "no",
        "name": "Heiligen-Geist-Hospital",
        "opening_hours": "Apr-Sep: Tu-Su 10:00-17:00; Oct-Mar: Tu-Su 10:00-16:00",
        "tourism": "museum",
        "wheelchair": "limited",
        "wikidata": "Q317608",
        "wikipedia": "de:Heiligen-Geist-Hospital (Lübeck)"
    }
}];

// Funktion, um Wikipedia-Beschreibungen abzurufen
async function fetchWikipediaSummary(title) {
    const titleFormatted = title.split(":")[1].replace(/\s+/g, "_")
    try {
        const url = `https://de.wikipedia.org/api/rest_v1/page/summary/${titleFormatted}`;
        const response = await axios.get(url);
        const data = response.data;

        return data.extract;
    } catch (error) {
        console.error(`Fehler beim Abrufen der Zusammenfassung für ${titleFormatted}:`, error);
        return null;
    }
}

// Funktion, um die Beschreibungen zu den JSON-Objekten hinzuzufügen
async function addDescriptions(data) {
    for (const item of data) {
        if (item.tags.wikipedia) {
            console.log(`fetch data for item ${item.id}`)
            const description = await fetchWikipediaSummary(item.tags.wikipedia);
            if (description) {
                item.tags.wikipedia_description = description;
            }
        }
    }
    return data;
}

// Hauptfunktion
let updatedData = {}
async function main() {
    updatedData.elements = await addDescriptions(jsonData.elements);
    try {
        const filepath = "../data/osm/wikipedia_descriptions.json"; 
        writeFileSync(filepath,JSON.stringify(updatedData, null, 2));
        console.log(`Data saved successfully at ${filepath}`);
    } catch (error) {
        console.log(`Error on saving data: ${error}`);
    }
}

main();
