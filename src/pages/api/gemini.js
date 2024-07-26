import { GoogleGenerativeAI } from "@google/generative-ai";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

/**
 * api key from env
 */
const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    if (prompt === "") {
      return res.status(400).json({ error: "fill all fields" });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: {
          parts: [
            {
              text: `You are a helpful assistant. Please be concise and precise. 
               **Your response must always be a valid JSON object with the following structure:
      
               * **text_content:** the generated content.
              `,
            },
          ],
          role: "model",
        },
      });

      const parts = [{ text: prompt }];

      /**
       * generation config for gemini api calls
       * setting responseMimeType to JSON to get back response in json format
       */
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      };

      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
      });
      let response = "";

      if (
        result.response.promptFeedback &&
        result.response.promptFeedback.blockReason
      ) {
        response = {
          error: `Blocked for ${result.response.promptFeedback.blockReason}`,
        };
        return res.status(200).json(response);
      }

      response = result.response.candidates[0].content.parts[0].text;
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Failed to get a response from Gemini" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
