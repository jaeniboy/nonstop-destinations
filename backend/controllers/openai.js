import OpenAI from "openai";
import 'dotenv/config' 

export const getDescription = async (cityName="Hinterdupfingen") => {

    const sysprompt = `
    Please write a short text with round about 50 Words about
    why a city or village is worth visiting. Your text should include
    the city name and a short description of some places of interest.
    Here you get your data: 

    City Name: ${cityName}
    Trave Time: 67 Minutes

    Places of Interest:

    | name | type | description | size |
    |------|------|-------------|------|
    | Theaterschiff Heilbronn | attraction | Der alte französische Frachtkahn Roanber dient heute als Theaterschiff mit Platz für 124 Zuschauer |    |
    | Hagenbucher | museum |    |    |
    | Haus der Stadtgeschichte / Otto Rettenmaier Haus | museum |
    | uih! - Urban Innovation Hub | museum | | |
    | Kilianskirche | attraction | | |
    `

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