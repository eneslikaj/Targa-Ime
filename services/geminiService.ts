import { GoogleGenAI, Type } from "@google/genai";
import { GeminiSuggestion } from "../types";

// Helper to get the API Key safely
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.warn("API Key not found in environment variables.");
    return "";
  }
  return key;
};

export const generatePlateIdeas = async (userInput: string): Promise<GeminiSuggestion[]> => {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 5 creative custom license plate text ideas (max 7 characters, alphanumeric only, no special symbols) based on this user input: "${userInput}". 
      Also provide a very short reasoning for each. 
      The output must be strict JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            },
            required: ["text", "reasoning"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeminiSuggestion[];
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};
