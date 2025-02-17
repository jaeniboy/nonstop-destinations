import express from 'express';
import cors from 'cors';
import { getAllNonStopStations, getStationCoords, getDeparturesTripIds } from './controllers/hafas.js'
import { enhancedStopovers } from './controllers/osm.js';
import { createClient } from 'db-vendo-client'
import { profile as dbProfile } from 'db-vendo-client/p/dbnav/index.js'
import { autocomplete } from 'db-stations-autocomplete';
import { findStationById } from './controllers/hafas.js';
import { getDescription } from './controllers/openai.js';
import { exec } from 'child_process';
import { readJsonFile } from './scripts/utils.js';

const app = express();
// const port = 4000;
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware für JSON-Daten

app.use(cors({
  origin: '*',
  // origin: [
  //   // 'http://localhost:5173',
  //   // 'http://192.168.0.23:5173/',
  //   // 'http://172.21.160.1:5173/'
  //   '*'
  // ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.get('/', (req, res) => {
  res.send('Hello from Backend! How are you, today?');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/destinations', async (req, res) => {
  //http://localhost:3000/destinations?station=8000191&radius=2000&distmin=15000
  try {
    const stationId = req.query.station
    const radius = req.query.radius
    const mindist = req.query.distmin || 10000
    // todo: variable time value
    const time = "2025-01-17 08:00"
    const nonStopStations = await getAllNonStopStations(stationId, time)

    const nonStopStationsFiltered = {
      ...nonStopStations,
      stations: Object.values(nonStopStations.stations)
        .filter(d => d.distance > mindist)
    }

    const enhancedStations = {
      ...nonStopStationsFiltered,
      stations: await enhancedStopovers(Object.values(nonStopStationsFiltered.stations), radius)
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

app.get("/autocomplete", async (req, res) => {
  //http://localhost:3000/autocomplete?input=kar
  try {
    const input = req.query.input
    const suggestions = autocomplete(input, 10)

    const withStations = await Promise.all(suggestions.map(async d => {
      const station = await findStationById(d.id)
      return {
        ...d,
        name: station.name
      }
    }))
    res.json(withStations)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "autocomplete error" });
  }
})

app.post("/description", async (req, res) => {
  const { cityName, destinations, language } = req.body
  // const desc = await getDescription(cityName, destinations, language)
  const desc = { "choices": [{ "message": { "content": `${cityName} Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren` } }] }
  res.json(desc)
})

app.get('/updateData', (req, res) => {

  console.log("Start updating data...")
  const command = "npm run fetchData";

  exec(command, {
    maxBuffer: undefined // Keine Begrenzung
  }, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      res.status(500).send({ message: 'Unable to run command' });
    } else if (stderr) {
      console.error(`stderr: ${stderr}`);
      res.status(500).send({ message: 'Unable to run command' });
    } else {
      console.log(`stdout:\n${stdout}`);
      res.send({ message: 'Data updated successfully' });
    }
  });
});

app.get('/getUpdateStatus', async (req, res) => {
  console.log("reading update status file")
  const jsonData = readJsonFile("./updateStatus.json")
  res.json(jsonData)
})

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});