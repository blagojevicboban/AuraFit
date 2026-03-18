import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'sr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string) => string;
}

const translations = {
  en: {
    common: {
      profile: "Profile",
      signOut: "Sign Out",
      loading: "Loading Aura Fit...",
      backToAdmin: "BACK TO ADMIN",
      impersonatingAs: "Logged in as:",
      search: "Search",
      notifications: "Notifications",
      seeAll: "See All",
      minutes: "Minutes",
      kcal: "Kcal",
    },
    nav: {
      dashboard: "Dashboard",
      workouts: "Workouts",
      clients: "Clients",
      users: "Users",
      overview: "Overview",
      nutrition: "Nutrition",
      progress: "Progress",
      community: "Community",
    },
    home: {
      welcome: "Hi, {{name}} 👋",
      challengeLimits: "It's Time To Challenge Your Limits.",
      stayNotified: "Stay Notified!",
      notificationDesc: "Get real-time updates on your workouts and nutrition plans.",
      enableNotifications: "Enable Notifications",
      recommendations: "Recommendations",
      weeklyChallenge: "Weekly Challenge",
      articlesTips: "Articles & Tips",
      workout: "Workout",
      progressTracking: "Progress Tracking",
    },
    landing: {
      futureOfFitness: "The future of fitness is here",
      yourWorkout: "YOUR WORKOUT.",
      yourAura: "YOUR AURA.",
      heroDesc: "A hybrid platform that combines AI intelligence with elite coaching expertise. Results you can see, support you can feel.",
      startTransformation: "START TRANSFORMATION",
      becomeMentor: "BECOME A MENTOR",
      aiNutrient: "AI Nutritionist",
      aiNutrientDesc: "Just describe the meal, AI does the rest. Precise tracking without tedious typing.",
      smartWorkout: "Smart Workout",
      smartWorkoutDesc: "Intelligent progress tracking. The app knows when you're ready for a bigger challenge.",
      eliteCoaching: "Elite Coaching",
      eliteCoachingDesc: "Direct connection to your mentor. Personalized plans and video feedback.",
      admin: "Admin",
      login: "Login",
      coachPortal: "COACH PORTAL",
    },
    help: {
      title: "Help & Support",
      pwaTitle: "PWA Installation",
      pwaDesc: "To install AuraFit on your phone, open it in Chrome (Android) or Safari (iOS) and select 'Add to Home Screen'.",
      notifyTitle: "Push Notifications",
      notifyDesc: "Enable notifications in the Home Dashboard prompt to stay updated on your workout goals.",
      supportTitle: "Support",
      supportDesc: "If you encounter any issues, please contact our support team at support@aurafit.com.",
      versionTitle: "App Version",
      versionDesc: "AuraFit v1.2.0 - Premium Edition",
      designedFor: "Designed for Excellence",
    },
    pwa: {
      promptTitle: "Install AuraFit",
      promptDesc: "Install our app for a faster and smoother premium fitness experience. Access all features directly from your home screen.",
      installButton: "Install App",
      cancelButton: "Later",
    }
  },
  sr: {
    common: {
      profile: "Profil",
      signOut: "Odjavi se",
      loading: "Učitavanje Aura Fit...",
      backToAdmin: "NAZAD NA ADMIN",
      impersonatingAs: "Prijavljeni ste kao:",
      search: "Pretraga",
      notifications: "Obaveštenja",
      seeAll: "Vidi sve",
      minutes: "minuta",
      kcal: "Kcal",
    },
    nav: {
      dashboard: "Kontrolna tabla",
      workouts: "Treninzi",
      clients: "Klijenti",
      users: "Korisnici",
      overview: "Pregled",
      nutrition: "Ishrana",
      progress: "Napredak",
      community: "Zajednica",
    },
    home: {
      welcome: "Zdravo, {{name}} 👋",
      challengeLimits: "Vreme je da srušiš svoje granice.",
      stayNotified: "Ostani obavešten!",
      notificationDesc: "Dobijaj ažuriranja o svojim treninzima i planovima ishrane u realnom vremenu.",
      enableNotifications: "Uključi obaveštenja",
      recommendations: "Preporuke",
      weeklyChallenge: "Nedeljni izazov",
      articlesTips: "Članci i saveti",
      workout: "Trening",
      progressTracking: "Merenje napretka",
    },
    landing: {
      futureOfFitness: "Budućnost fitnesa je ovde",
      yourWorkout: "TVOJ TRENING.",
      yourAura: "TVOJA AURA.",
      heroDesc: "Hibridna platforma koja spaja AI inteligenciju sa stručnošću vrhunskih trenera. Rezultati koji se vide, podrška koja se oseća.",
      startTransformation: "ZAPOČNI TRANSFORMACIJU",
      becomeMentor: "POSTANI MENTOR",
      aiNutrient: "AI Nutricionista",
      aiNutrientDesc: "Samo opiši obrok, AI radi ostalo. Precizno praćenje bez zamornog kucanja.",
      smartWorkout: "Smart Workout",
      smartWorkoutDesc: "Inteligentno praćenje progresa. Aplikacija zna kada si spreman za veći izazov.",
      eliteCoaching: "Elite Coaching",
      eliteCoachingDesc: "Direktna veza sa mentorom. Personalizovani planovi i video feedback.",
      admin: "Admin",
      login: "Prijava",
      coachPortal: "PORTAL ZA TRENERE",
    },
    help: {
      title: "Pomoć i podrška",
      pwaTitle: "Instalacija aplikacije (PWA)",
      pwaDesc: "Da biste instalirali AuraFit na svoj telefon, otvorite ga u Chrome (Android) ili Safari (iOS) pretraživaču i izaberite 'Add to Home Screen'.",
      notifyTitle: "Obaveštenja",
      notifyDesc: "Uključite obaveštenja na početnom ekranu kako biste dobijali informacije o svojim ciljevima.",
      supportTitle: "Podrška",
      supportDesc: "Ako naiđete na bilo kakve probleme, kontaktirajte naš tim za podršku na support@aurafit.com.",
      versionTitle: "Verzija aplikacije",
      versionDesc: "AuraFit v1.2.0 - Premium Edition",
      designedFor: "Dizajnirano za izvrsnost",
    },
    pwa: {
      promptTitle: "Instaliraj AuraFit",
      promptDesc: "Instalirajte aplikaciju za brže i lakše vrhunsko fitnes iskustvo. Pristupite svim funkcijama direktno sa početnog ekrana.",
      installButton: "Instaliraj",
      cancelButton: "Kasnije",
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'sr') return saved;
    // Check browser language
    return navigator.language.startsWith('sr') ? 'sr' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (keyPath: string) => {
    const keys = keyPath.split('.');
    let current: any = translations[language];
    
    for (const key of keys) {
      if (current[key] === undefined) return keyPath;
      current = current[key];
    }
    
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
