import queryOverpass from "@derhuerst/query-overpass"
import pLimit from 'p-limit';

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
    } catch(error) {
        console.log(error)
    }
    
    return result
    
    // return query
    // Implementieren Sie hier die Overpass-Abfrage mit dem zusammengefassten Query
}

export const enhancedStopovers = async (stopovers, radius) => {
    const limit = pLimit(10); // Maximal gleichzeitige Anfragen
    // const enhanced = await Promise.all(stopovers.map(async d => {
        // return {
        // ...d,
        // "destinations": await findPlaces(d.latitude, d.longitude, radius)
        // }
        const enhanced = await Promise.all(stopovers.map(async (d) => {
          const destinations = await limit(async () => {
            return await findPlaces(d.latitude, d.longitude, radius);
          });
      
          return { ...d, destinations };
        }));
    return enhanced
}