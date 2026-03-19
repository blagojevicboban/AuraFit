import React, { createContext, useContext, useEffect, useState } from 'react';
import en from '../locales/en.json';
import sr from '../locales/sr.json';

// Initial dictionary of available languages
const initialTranslations: Record<string, any> = { en, sr };

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (keyPath: string, variables?: Record<string, string | number>) => string;
  availableLanguages: string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>(() => {
    const saved = localStorage.getItem('language');
    if (saved && initialTranslations[saved]) return saved;
    return navigator.language.startsWith('sr') ? 'sr' : 'en';
  });

  const [translations, setTranslations] = useState(initialTranslations);

  const setLanguage = async (lang: string) => {
    // If we don't have the translation yet, we could fetch it here
    // For now we assume en and sr are pre-loaded
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
    } else {
      console.warn(`Language ${lang} not loaded.`);
    }
  };

  /**
   * Advanced translation function with support for:
   * 1. Nested keys (e.g. 'home.welcome')
   * 2. Variable interpolation (e.g. {{name}})
   */
  const t = (keyPath: string, variables?: Record<string, string | number>) => {
    const keys = keyPath.split('.');
    let current: any = translations[language] || translations['en']; // Fallback to EN
    
    for (const key of keys) {
      if (!current || current[key] === undefined) {
        // Fallback to English if key missing in current language
        let fallback: any = translations['en'];
        for (const fKey of keys) {
          if (!fallback || fallback[fKey] === undefined) return keyPath;
          fallback = fallback[fKey];
        }
        current = fallback;
        break;
      }
      current = current[key];
    }
    
    let text = String(current);

    // Dynamic variable interpolation
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        text = text.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      });
    }

    return text;
  };

  const availableLanguages = Object.keys(translations);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
