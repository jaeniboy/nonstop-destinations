import OpenAI from "openai";
import 'dotenv/config'

export const getDescription = async (cityName="Hinterdupfingen", data=testdata, language="english") => {

    const sysprompt = `
    Please write a short text with round about 40 Words about
    why a city or village is worth visiting for families. Your 
    text should include the city name and a short description of 
    the most important places of interest. Please be friendly and
    objective. Avoid typical marketing phrases. The text should
    be written in ${language}.

    Here is the data: 

    City Name: ${cityName}

    Places of Interest:

    ${JSON.stringify(data.slice(0,5))}
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