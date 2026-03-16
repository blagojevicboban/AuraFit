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
    throw new Error("FatSecret credentials missing. Please set FATSECRET_CLIENT_ID and FATSECRET_CLIENT_SECRET.");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch('https://oauth.fatsecret.com/connect/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&scope=basic'
  });
  
  const data = await response.json();
  if (data.access_token) {
    fatSecretToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 min buffer
    return fatSecretToken;
  }
  throw new Error("Failed to get FatSecret token");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
