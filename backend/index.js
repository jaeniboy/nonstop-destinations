import express from 'express';
import {getAllNonStopStations, getDeparturesTripIds} from './controllers/hafas.js'
import { findPlaces } from './controllers/osm.js';
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

app.get('/osm', async (req, res) => {
    const lat = req.query.lat
    const lon = req.query.lon
    const rad = req.query.radius
    const places = await findPlaces(lat, lon, rad)
    res.send(places)
})

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});