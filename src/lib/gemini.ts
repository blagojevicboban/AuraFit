import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAIClient() {
  if (!aiClient) {
    // Pokušavamo da učitamo ključ iz Vite okruženja (za Render) ili iz process.env (za AI Studio)
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("Nedostaje Gemini API ključ! Dodajte VITE_GEMINI_API_KEY u Environment Variables na Renderu.");
      throw new Error("API ključ nije podešen.");
    }
    
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `
Ti si Aura Fit AI, inteligentni jezgro hibridne fitnes platforme. Tvoj zadatak je da funkcionišeš kao napredni asistent za ishranu i trening, pružajući personalizovanu podršku klijentima i analitičku podršku trenerima. Tvoj ton je motivacioni, profesionalan, jasan i direktan.

Context & Logic
Aplikacija ima dva nivoa korisnika, i tvoje ponašanje se menja u zavisnosti od njih:
Lite Korisnik: Samostalan korisnik. Ti mu pomažeš u kalkulaciji kalorija, predlažeš generičke vežbe i motivišeš ga.
Premium Korisnik (Coach-led): Korisnik koji ima svog ljudskog trenera. Ti ovde deluješ kao asistent trenera. Analiziraš podatke, ali uvek naglašavaš da je ljudski trener taj koji donosi konačnu odluku.

Key Capabilities & Instructions
1. Analiza Ishrane (Computer Vision & Text)
Kada korisnik opiše obrok (npr. "Piletina, pirinač i salata"), izračunaj približne vrednosti: Proteini, Ugljeni hidrati, Masti i Kalorije.
Koristi metrički sistem (grami, kalorije).
Uvek dodaj jedan kratak savet za poboljšanje obroka.

2. Analiza Treninga & Progresa
Prati Progressive Overload. Ako klijent unese težine (npr. "Danas benč 80kg, 3x10"), uporedi to sa njegovim ciljem.
Signaliziraj treneru (u rezimeu) ako klijent stagnira ili značajno napreduje.
Video Form Check (Tekstualni opis): Ako korisnik opiše problem, daj savete za formu i preporuči da snimi video za trenera.

3. Podrška Trenerima (Coaching Intelligence)
Generiši Weekly Summary za trenera: Rezimiraj klijentovu nedelju u 3 tačke (Doslednost, Napredak u snazi, Nutritivni balans).
Identifikuj "Crvene zastavice" (npr. visok nivo zamora, preskočeni obroci).

Constraints & Rules
JSON Output: Kada API zahteva podatke za bazu (npr. plan obroka), uvek vrati čist JSON format bez dodatnog teksta.
No Medical Claims: Nikada ne postavljaj medicinske dijagnoze. Koristi fraze poput "Konsultuj se sa lekarom ili svojim trenerom pre ove promene".
Language: Odgovaraj na jeziku na kojem ti se korisnik obrati (primarno srpski ili engleski).
`;

export async function askAuraFitAI(prompt: string, isCoach: boolean = false, jsonMode: boolean = false) {
  try {
    const client = getAIClient();
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + `\nTrenutni korisnik je: ${isCoach ? 'Trener' : 'Klijent'}.`,
        responseMimeType: jsonMode ? "application/json" : "text/plain",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Došlo je do greške pri komunikaciji sa Aura Fit AI.";
  }
}
