import express from 'express';
import {getAllNonStopStations, getDeparturesTripIds} from './controllers/hafas.js'
import { enhancedStopovers, findPlaces, batchFindPlaces } from './controllers/osm.js';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Backend! How are you, dude');
});

app.get('/departures/:stationId', async (req, res) => {
    const stationId = req.params.stationId;
    const time = "2024-11-09 08:00"
    const nonStopStations = await getAllNonStopStations(stationId,time)
    res.send(nonStopStations)
});

app.get('/destinations', async (req, res) => {
  const stationId = req.query.station
  const radius = req.query.radius
  const time = "2024-11-09 08:00"
  const nonStopStations = await getAllNonStopStations(stationId,time)
  const enhancedStations = await enhancedStopovers(Object.values(nonStopStations), radius)
  res.send(enhancedStations)
})

app.get('/osm', async (req, res) => {
    //http://localhost:3000/osm?lat=48.9832266&lon=8.4027654&radius=2000
    const lat = req.query.lat
    const lon = req.query.lon
    const rad = req.query.radius
    // const places = await findPlaces(lat, lon, rad)
    const coordinates = [
      [48.9739504, 8.401669],
      [49.005917, 8.403611],
      [52.520008, 13.404954],   // Berlin
      [48.137154, 11.576124],   // Munich
      [50.110922, 8.682127],    // Frankfurt
      [53.551086, 9.993682],    // Hamburg
      [51.339695, 12.373075],   // Leipzig
      [50.937531, 6.960279],    // Cologne
      [48.208174, 16.373819],   // Dresden
      [49.452102, 11.076665],   // Nuremberg
      [51.050409, 13.737262],   // Stuttgart
      [53.079296, 8.801694]     // Bremen
    ];
    
    const places = await batchFindPlaces(coordinates, 500)
    res.send(places)
})

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});