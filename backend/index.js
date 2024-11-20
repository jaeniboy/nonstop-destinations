import express from 'express';
import cors from 'cors';
import { getAllNonStopStations } from './controllers/hafas.js'
import { enhancedStopovers } from './controllers/osm.js';
const app = express();
// const port = 3000;
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));

app.get('/', (req, res) => {
  res.send('Hello from Backend! How are you, dude');
});

app.get('/destinations', async (req, res) => {
  //http://localhost:3000/destinations?station=8000191&radius=2000
  const stationId = req.query.station
  const radius = req.query.radius
  // todo: variable time value
  const time = "2024-11-09 08:00"
  const nonStopStations = await getAllNonStopStations(stationId, time)
  const enhancedStations = await enhancedStopovers(Object.values(nonStopStations), radius)
  res.json(enhancedStations)
})

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});