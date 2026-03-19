import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

let fatSecretToken: string | null = null;
let tokenExpiry: number = 0;

async function getFatSecretToken() {
  if (fatSecretToken && Date.now() < tokenExpiry) {
    return fatSecretToken;
  }
  
  const clientId = process.env.FATSECRET_CLIENT_ID;
  const clientSecret = process.env.FATSECRET_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    console.error("DEBUG: FatSecret Credentials MISSING in process.env");
    throw new Error("FatSecret credentials missing. Please set FATSECRET_CLIENT_ID and FATSECRET_CLIENT_SECRET.");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  try {
    const response = await fetch('https://oauth.fatsecret.com/connect/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'scope': 'basic'
      })
    });
    
    const data = await response.json();
    if (data.access_token) {
      fatSecretToken = data.access_token;
      tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
      console.log("DEBUG: FatSecret Token REFRESHED successfully");
      return fatSecretToken;
    }
    console.error("DEBUG: FatSecret Token Error Response:", data);
    throw new Error("Failed to get FatSecret token: " + JSON.stringify(data));
  } catch (error) {
    console.error("DEBUG: FatSecret Token Request FAILED:", error);
    throw error;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set COOP header for Firebase auth popups
  app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
  });

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/fatsecret/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) return res.status(400).json({ error: "Query required" });
      
      const token = await getFatSecretToken();
      
      const searchParams = new URLSearchParams();
      searchParams.append('method', 'foods.search');
      searchParams.append('search_expression', query);
      searchParams.append('format', 'json');
      searchParams.append('max_results', '10');

      const response = await fetch('https://platform.fatsecret.com/rest/server.api', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams.toString()
      });
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("FatSecret API Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  app.get("/api/fatsecret/autocomplete", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) return res.json({ suggestions: [] });
      
      const token = await getFatSecretToken();
      
      const params = new URLSearchParams();
      params.append('method', 'foods.autocomplete');
      params.append('expression', query);
      params.append('format', 'json');
      params.append('max_results', '10');

      const response = await fetch('https://platform.fatsecret.com/rest/server.api', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("FatSecret Autocomplete Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  app.get("/api/fatsecret/recipes", async (req, res) => {
    try {
      const { type, max_calories } = req.query;
      const token = await getFatSecretToken();
      
      const params = new URLSearchParams();
      params.append('method', 'recipes.search');
      if (type) params.append('recipe_types', String(type));
      if (max_calories) params.append('calories.to', String(max_calories));
      params.append('format', 'json');
      params.append('max_results', '10');

      const response = await fetch('https://platform.fatsecret.com/rest/server.api', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("FatSecret Recipes Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // ── Barcode lookup ──
  app.get("/api/fatsecret/barcode", async (req, res) => {
    try {
      const barcode = req.query.barcode as string;
      if (!barcode) return res.status(400).json({ error: "Barcode required" });

      const token = await getFatSecretToken();

      // Step 1: resolve barcode → food_id
      const barcodeParams = new URLSearchParams();
      barcodeParams.append('method', 'food.find_id_for_barcode');
      barcodeParams.append('barcode', barcode);
      barcodeParams.append('format', 'json');

      const barcodeRes = await fetch('https://platform.fatsecret.com/rest/server.api', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: barcodeParams.toString()
      });
      const barcodeData = await barcodeRes.json();
      const foodId = barcodeData?.food_id?.value;
      if (!foodId) return res.status(404).json({ error: "Food not found for this barcode" });

      // Step 2: get food details
      const foodParams = new URLSearchParams();
      foodParams.append('method', 'food.get.v3');
      foodParams.append('food_id', foodId);
      foodParams.append('format', 'json');

      const foodRes = await fetch('https://platform.fatsecret.com/rest/server.api', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: foodParams.toString()
      });
      const foodData = await foodRes.json();
      res.json(foodData);
    } catch (error: any) {
      console.error("FatSecret Barcode Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.use((err: any, req: any, res: any, next: any) => {
    console.error("GLOBAL SERVER ERROR:", err.message);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
