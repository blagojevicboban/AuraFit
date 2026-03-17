import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API Key is not set. Please configure GEMINI_API_KEY or VITE_GEMINI_API_KEY.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export interface ParsedMeal {
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  aiAdvice: string;
}

export async function parseMealWithAI(input: string): Promise<ParsedMeal> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analiziraj sledeći opis obroka na srpskom jeziku i izvuci nutritivne vrednosti. 
    Input: "${input}"
    
    Vrati podatke u JSON formatu sa sledećim poljima:
    - description: Kratak opis (npr. "3 jaja i parče hleba")
    - calories: Procenjen broj kalorija (broj)
    - protein: Procenjen broj proteina u gramima (broj)
    - carbs: Procenjen broj ugljenih hidrata u gramima (broj)
    - fat: Procenjen broj masti u gramima (broj)
    - aiAdvice: Kratak savet trenera o ovom obroku (npr. "Odličan izvor proteina, ali pripazi na unos masti iz žumanca.")`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fat: { type: Type.NUMBER },
          aiAdvice: { type: Type.STRING }
        },
        required: ["description", "calories", "protein", "carbs", "fat", "aiAdvice"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateWeeklySummary(clientData: any): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Ti si stručni fitnes trener. Analiziraj podatke klijenta za proteklu nedelju i sastavi kratak, motivacioni izveštaj za trenera.
    Podaci: ${JSON.stringify(clientData)}
    
    Izveštaj treba da sadrži:
    1. Procenat urađenih treninga.
    2. Analizu ishrane (da li su kalorije i makrosi u cilju).
    3. Trend snage ili težine.
    4. Preporuku za sledeću nedelju.`,
  });

  return response.text;
}
