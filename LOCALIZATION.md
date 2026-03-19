# 🌍 AuraFit Localization Guide

This project uses a custom **Universal Localization System** designed for high performance and easy extensibility.

## 📂 Structure
All translations live in `src/locales/` as JSON files.

- `src/locales/en.json` (English - Primary source)
- `src/locales/sr.json` (Serbian)
- `src/contexts/LanguageContext.tsx` (Logic & Provider)

---

## ➕ Adding a New Language (e.g., German `de`)

Follow these 3 simple steps to add any language:

### 1. Create the JSON File
Create `src/locales/de.json` by copying `en.json`. Translate the values:
```json
{
  "common": {
    "profile": "Profil",
    "signOut": "Abmelden"
  }
}
```

### 2. Register in LanguageContext
Open `src/contexts/LanguageContext.tsx` and register the new import:

```tsx
import de from '../locales/de.json'; // 1. Import
const initialTranslations = { en, sr, de }; // 2. Add to list
```

### 3. Usage inside Components
Use the `t()` function from `useLanguage()` hook.

#### Simple translation:
```tsx
const { t } = useLanguage();
<h1>{t('common.profile')}</h1>
```

#### Translation with variables (`{{name}}`):
In JSON: `"welcome": "Hi, {{name}} 👋"`
In Code:
```tsx
<h1>{t('home.welcome', { name: 'Boban' })}</h1>
```

---

## ⚡ Features
- **Fallback system**: If a specific key is missing in your new language, the app will automatically show the English version instead of a blank space.
- **Dynamic Change**: Change languages on the fly with `setLanguage('de')`.
- **LocalStorage**: The app remembers the user's last chosen language.
- **Browser Detection**: Detects System/Browser language on first visit.

---
*AuraFit v1.2.0 - Documentation by lead AI Assistant.*
