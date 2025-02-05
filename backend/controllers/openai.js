import OpenAI from "openai";
import 'dotenv/config'

const testdata = [
    {
      "tags": {
        "addr:city": "Heilbronn",
        "addr:country": "DE",
        "addr:housenumber": "31",
        "addr:postcode": "74072",
        "addr:street": "Obere Neckarstraße",
        "alt_name": "Roanber",
        "amenity": "theatre",
        "building": "ship",
        "capacity": "124",
        "description:de": "Der alte französische Frachtkahn Roanber dient heute als Theaterschiff mit Platz für 124 Zuschauer.",
        "historic": "ship",
        "image": "https://de.wikipedia.org/wiki/Datei:Heilbronn-theaterschiff.jpg",
        "name": "Theaterschiff Heilbronn",
        "ship:type": "cargo_riverboat",
        "short_name": "Theaterschiff",
        "tourism": "attraction",
        "website": "http://www.theaterschiff-heilbronn.de/",
        "wheelchair": "no"
      },
      "size": 188.33874990585215,
      "distance": 615.0893857427563
    },
    {
      "tags": {
        "addr:city": "Heilbronn",
        "addr:country": "DE",
        "addr:housenumber": "14",
        "addr:postcode": "74072",
        "addr:street": "Kranenstraße",
        "building": "yes",
        "email": "info@experimenta-heilbronn.de",
        "fee": "yes",
        "height": "25",
        "museum": "science",
        "name": "Hagenbucher",
        "opening_hours": "Mo-Fr 09:00-18:00; Sa,Su,PH 10:00-18:00",
        "phone": "+49 7131 887950",
        "tourism": "museum",
        "website": "https://www.experimenta.science/",
        "wheelchair": "yes",
        "wikipedia": "de:Experimenta Heilbronn"
      },
      "size": 1174.3522441354626,
      "distance": 543.6861558026475
    },
    {
      "tags": {
        "addr:city": "Heilbronn",
        "addr:country": "DE",
        "addr:housenumber": "1",
        "addr:postcode": "74072",
        "addr:street": "Eichgasse",
        "building": "public",
        "building:levels": "3",
        "name": "Haus der Stadtgeschichte / Otto Rettenmaier Haus",
        "tourism": "museum",
        "website": "http://www.stadtarchiv-heilbronn.de",
        "wheelchair": "yes",
        "wikidata": "Q1206182",
        "wikipedia": "de:Haus der Stadtgeschichte (Heilbronn)"
      },
      "size": 759.3776093600966,
      "distance": 817.2799300207166
    },
    {
      "tags": {
        "check_date": "2024-08-12",
        "fee": "no",
        "name": "uih! - Urban Innovation Hub",
        "opening_hours": "Th-Fr 14:00-18:00; Sa 11:00-16:00",
        "tourism": "museum",
        "website": "https://urbaninnovationhub.de"
      },
      "distance": 945.8063876815821
    },
    {
      "tags": {
        "name": "Foto-Spot 1",
        "tourism": "attraction",
        "website": "https://www.heilbronn.de/tourismus/tourist-information-heilbronn/heilbronner-fotospots.html",
        "wheelchair": "yes"
      },
      "distance": 696.4730335417291
    },
    {
      "tags": {
        "addr:city": "Heilbronn",
        "addr:country": "DE",
        "addr:housenumber": "38",
        "addr:postcode": "74072",
        "addr:street": "Kaiserstraße",
        "amenity": "place_of_worship",
        "building": "church",
        "building:material": "sandstone",
        "check_date": "2023-09-19",
        "denomination": "protestant",
        "name": "Kilianskirche",
        "religion": "christian",
        "service_times": "Su 09:30-10:10,11:00-11:40; We 17:00-17:15",
        "start_date": "~1280",
        "tourism": "attraction",
        "wheelchair": "limited",
        "wheelchair:description": "Barriererfreier Zugang über die Südseite der Kirche",
        "wikidata": "Q878243",
        "wikipedia": "de:Kilianskirche (Heilbronn)"
      },
      "size": 1640.9417450164433,
      "distance": 876.3030295876932
    }
  ]

export const getDescription = async (cityName="Hinterdupfingen", data=testdata) => {

    const sysprompt = `
    Please write a short text with round about 40 Words about
    why a city or village is worth visiting for families. Your 
    text should include the city name and a short description of 
    the most important places of interest. Please be friendly ans
    objective and avoid typical marketing phrases.

    Here you get your data: 

    City Name: ${cityName}

    Places of Interest:

    ${JSON.stringify(data.slice(0,5))}
    `
    console.log(sysprompt)
    const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
            {"role": "system", "content": sysprompt}
        ]
    });
    
    return completion
}