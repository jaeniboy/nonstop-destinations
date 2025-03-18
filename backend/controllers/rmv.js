import 'dotenv/config'
import { getNextDayAt9AM, timeDelta } from './utils.js'
import fetch from 'node-fetch-retry'
import { readJsonFile } from '../scripts/utils.js';

const API_KEY = process.env.RMV_API_KEY;

export const getStationCoords = async (stationId) => {
  const stationData = await readJsonFile("./data/stations/stationsWithRmvId.json")
  const station = stationData.find(d=>d.rmvId===stationId)

  return [station.longitude, station.latitude]
}

export const getDeparturesTripIds = async (stationId = "8000191", dateAndTime) => {
    console.log("Fetching TripIds from rmv endpoint")
    const duration = 240
    const durationInHours = duration / 60
    const maxJourneys = -1
    const departureDateAndTime = getNextDayAt9AM().toISOString()
    const departureTime = departureDateAndTime.slice(11,16)
    const departureDate = departureDateAndTime.slice(0,10)
    const url = `https://www.rmv.de/hapi/departureBoard?format=json&lang=de&id=${stationId}&date=${departureDate}&time=${encodeURIComponent(departureTime)}&duration=${duration}&maxJourneys=${maxJourneys}&passlist=0&baim=0&rtMode=SERVER_DEFAULT&type=DEP&accessId=${API_KEY}`;

    const result = await fetch(url, { method: 'GET', retry: 3 })
    const data = await result.json()

    const productFilter = ["2", "3"] // 2 = regional, 3 = suburban

    const departuresFilterd = data.Departure.filter(d => productFilter.includes(d.ProductAtStop.catCode))
    const trips = departuresFilterd.map(dep => { 
      return { 
          "tripId": dep.JourneyDetailRef.ref, 
          "plannedWhen": `${dep.date}T${dep.time}.000Z`, 
          "product": dep.ProductAtStop.name, 
          "directionFlag": dep.directionFlag 
        }
      });

    const uniqueTrips = {}
    trips.forEach(trip => {
      const key = `${trip.product}-${trip.directionFlag}`;
      if (!Object.keys(uniqueTrips).includes(key)) {
        uniqueTrips[key] = {
          ...trip,
          count: 1
        };
      } else {
        uniqueTrips[key].count++
      }
    });

    const uniqueTripsConnectionsPerHour = Object.values(uniqueTrips).map((d)=>{
      const obj = {
        ...d,
        connectionsPerHour: d.count/durationInHours
      }
      delete obj.count
      delete obj.product
      delete obj.directionFlag
      return obj
    })
    return uniqueTripsConnectionsPerHour
} 

export const getStopovers = async (tripId, plannedWhen, connectionsPerHour) => {
    console.log("Fetching journeys details")

    const url = `https://www.rmv.de/hapi/journeyDetail?format=json&lang=de&id=${encodeURIComponent(tripId)}&poly=0&showPassingPoints=0&baim=0&accessId=${API_KEY}`

    try {

      const result = await fetch(url, { method: 'GET', retry: 3, pause: 1000, callback: retry => { console.log(`Trying: ${retry}`) } })
      if (!result.ok) {
        return `Error on fetching journey details`
      }
      const data = await result.json()
      const stops = data.Stops.Stop

      // return only stops after departure station
      const stopsAfterStartStation = stops.filter(d => new Date(plannedWhen) < new Date(getDatetimeString(d)))

      const stations = stopsAfterStartStation.map((stop) => {
        const arrival = getDatetimeString(stop)
        return {
          id: stop.extId,
          name: stop.name,
          latitude: stop.lat,
          longitude: stop.lon,
          plannedArrival: arrival,
          travelTime: timeDelta(arrival, plannedWhen),
          connectionsPerHour: connectionsPerHour
        }
      })

      return stations

    } catch (error) {
      console.log(`Error on fetching journey details: ${error} ${url}`)
    }
}

const getDatetimeString = (obj) => {
  return `${obj.arrDate}T${obj.arrTime}.000Z`
}