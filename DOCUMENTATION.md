# AuraFit Technical Documentation 📚

Welcome to the official technical documentation for **AuraFit**, a premium hybrid fitness platform. This document outlines the architecture, data strategies, and core systems implemented in the application.

---

## 🏗 Core Architecture

AuraFit is built as a highly responsive **Single Page Application (SPA)** using:
- **React 18**: Component-based UI logic.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS**: Utility-first styling with custom design tokens for light/dark modes.
- **Motion/React**: Narrative driven animations and transitions.
- **Lucide React**: Vector-based consistent iconography.

---

## 🗄 Data Strategy (The Hybrid Engine)

AuraFit uses a dual-source data strategy to ensure both control and scalability:

### 1. Firebase (Firestore)
Used for **Curated Content** and **User Data**:
- **Workouts**: Managed by administrators/coaches.
- **Forum & Challenges**: Live community engagement.
- **User Profiles & Logs**: Personal metrics, workout history, and meal totals.
- **Custom Recipes**: Featured meal plans added by the team.

### 2. FatSecret REST API
Used for **Discovery Content** and **Global Database**:
- **Food Search**: Access to millions of food items with full macro data. Proxied through server-side logic in `server.ts`.
- **Barcode Scanning**: Real-time product lookup via EAN-13/UPC-A.
- **Localized Results**: Automatically switches to the `RS` (Serbia) region and `sr` language when the app is set to Serbian, ensuring local products and descriptions are prioritized.
- **Recipe Details**: Fetches complete preparation instructions, ingredient lists, and cooking times using the `recipe.get.v2` method via the `/api/fatsecret/recipe-details` endpoint.
- **Recipe Fallback**: If no custom meal plans are found in Firebase, the app pulls fresh ideas from FatSecret.

---

## 🌐 Localization System (Multilingual)

The app features a robust localization engine located in `src/contexts/LanguageContext.tsx`:
- **JSON Based**: All strings are stored in `src/locales/en.json` and `sr.json`.
- **Dynamic Switching**: Users can toggle between English and Serbian instantly via Settings.
- **Interpolation**: Supports dynamic variables (e.g., `Hi, {{name}}`).
- **Missing Key Fallback**: If a key is missing in Serbian, the engine automatically falls back to English.

---

## 🌓 Theme Engine (Dark/Light)

Implemented via `src/contexts/ThemeContext.tsx`:
- **Tailwind Selectors**: Uses `dark:` classes for high-contrast dark mode.
- **Persistence**: Remembers the user's preference via `localStorage`.
- **System Preference**: Defaults to system settings but allows manual override.

---

## 📱 Progressive Web App (PWA)

AuraFit is fully installable:
- **Manifest**: Located in `public/manifest.json`.
- **Service Worker**: Handles caching for offline access.
- **Install Prompts**: Custom UI in the Home Dashboard to encourage installation.

---

## 🔑 Key Features & Components

### Barcode Scanner
Uses `BarcodeScannerModal.tsx` which integrates the camera to scan product codes. It proxies requests through a backend server to the FatSecret API for secure credential handling.

### AI Nutrition Log
Allows users to describe their meal in natural language. While currently simulating analysis, it is structured to connect to LLM endpoints for protein/carb/fat extraction.

### Progress Tracking
Powered by `Recharts`. It transforms raw Firestore logs into visual Area charts showing workout volume and activity trends.

---

## 🛠 Development & Deployment

### Environment Variables
Create a `.env` file in the root with:
```env
VITE_FIREBASE_API_KEY=your_key
FATSECRET_CLIENT_ID=your_id
FATSECRET_CLIENT_SECRET=your_secret
```

### Scripts
- `npm run dev`: Start dev server.
- `npm run build`: Production bundle.
- `npx tsc`: Type checking.

---

Developed with ❤️ by **Boban Blagojević**.
