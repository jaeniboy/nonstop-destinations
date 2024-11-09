import queryOverpass from "@derhuerst/query-overpass"

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
    } catch(error) {
        console.log(error)
    }
    
    return result
}