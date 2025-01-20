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
  try {
    const stationId = req.query.station
    const radius = req.query.radius
    const mindist = req.query.distmin || 10000
    // todo: variable time value
    const time = "2024-12-09 08:00"
    const nonStopStations = await getAllNonStopStations(stationId, time)

    const nonStopStationsFiltered = {
      ...nonStopStations,
      stations: Object.values(nonStopStations.stations)
        .filter(d => d.distance > mindist)
    }

    const foo = await enhancedStopovers(Object.values(nonStopStationsFiltered.stations), radius)
    const enhancedStations = {
      ...nonStopStationsFiltered,
      stations: foo
    }
   
    res.json(enhancedStations)
    
  } catch (error) {
    res.status(500).json({
      error: error.message,
      metadata: {
        isComplete: false,
        message: "Fehler bei der Verarbeitung der Anfrage"
      }
    }) 
  }
})

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});