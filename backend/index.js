import express from 'express';
import cors from 'cors';
import { getAllNonStopStations, getStationCoords } from './controllers/hafas.js'
import { enhancedStopovers } from './controllers/osm.js';
const app = express();
// const port = 3000;
const port = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  // origin: [
  //   // 'http://localhost:5173',
  //   // 'http://192.168.0.23:5173/',
  //   // 'http://172.21.160.1:5173/'
  //   '*'
  // ],
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));

app.get('/', (req, res) => {
  res.send('Hello from Backend! How are you, dude');
});

app.get('/destinations', async (req, res) => {
  //http://localhost:3000/destinations?station=8000191&radius=2000&distmin=15000
  const stationId = req.query.station
  const radius = req.query.radius
  const mindist = req.query.distmin || 10000
  // todo: variable time value
  const time = "2024-11-09 08:00"
  const nonStopStations = await getAllNonStopStations(stationId, time)

  // apply filters
  const nonStopStationsFiltered = Object.values(nonStopStations).filter(d=>d.distance > mindist)

  const enhancedStations = await enhancedStopovers(Object.values(nonStopStationsFiltered), radius)
  res.json(enhancedStations)
})

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});