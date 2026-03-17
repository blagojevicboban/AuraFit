import React, { useState, useEffect } from "react";
import { Send, Utensils, Activity, Flame, ChevronRight, Search, Plus, Sparkles, Users, Timer, Dumbbell, TrendingUp, Camera, Bell } from "lucide-react";
import { askAuraFitAI } from "../lib/gemini";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, limit } from "firebase/firestore";
import { cn } from "../lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function RestTimer({ duration, onComplete }: { duration: number, onComplete: () => void }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono font-bold">
      <Timer className="w-4 h-4 animate-pulse" />
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}

export default function ClientDashboard() {
  const { userData } = useAuth();
  const [mealInput, setMealInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentMeals, setRecentMeals] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<'meals' | 'biometrics' | 'workout' | 'feedback'>('meals');
  const [mealLogMode, setMealLogMode] = useState<'ai' | 'search'>('ai');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Biometrics
  const [biometrics, setBiometrics] = useState<any[]>([]);
  const [weightInput, setWeightInput] = useState("");
  const [isLoggingBiometrics, setIsLoggingBiometrics] = useState(false);

  // Workouts
  const [previousWorkout, setPreviousWorkout] = useState<any>(null);
  const [isLoggingWorkout, setIsLoggingWorkout] = useState(false);
  const [restTimer, setRestTimer] = useState<number | null>(null);

  const [feedbackVideos, setFeedbackVideos] = useState<any[]>([]);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  useEffect(() => {
    if (!userData) return;

    // Fetch biometrics
    const bioQ = query(
      collection(db, "biometrics"),
      where("userId", "==", userData.uid),
      orderBy("createdAt", "asc")
    );
    const unsubBio = onSnapshot(bioQ, (snapshot) => {
      setBiometrics(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate().toLocaleDateString()
      })));
    });

    // Fetch last workout
    const workQ = query(
      collection(db, "workouts"),
      where("userId", "==", userData.uid),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const unsubWork = onSnapshot(workQ, (snapshot) => {
      if (!snapshot.empty) {
        setPreviousWorkout(snapshot.docs[0].data());
      }
    });

    // Fetch feedback videos
    const feedQ = query(
      collection(db, "feedback"),
      where("userId", "==", userData.uid),
      orderBy("createdAt", "desc")
    );
    const unsubFeed = onSnapshot(feedQ, (snapshot) => {
      setFeedbackVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubBio();
      unsubWork();
      unsubFeed();
    };
  }, [userData]);

  const handleLogBiometrics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightInput || !userData) return;
    setIsLoggingBiometrics(true);
    try {
      await addDoc(collection(db, "biometrics"), {
        userId: userData.uid,
        weight: parseFloat(weightInput),
        createdAt: serverTimestamp()
      });
      setWeightInput("");
    } catch (err) {
      console.error(err);
    }
    setIsLoggingBiometrics(false);
  };

  useEffect(() => {
    if (!userData) return;

    const q = query(
      collection(db, "meals"),
      where("userId", "==", userData.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentMeals(meals);
    }, (error) => {
      console.error("Error fetching meals:", error);
    });

    return () => unsubscribe();
  }, [userData]);

  const handleAnalyzeMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealInput.trim() || !userData) return;

    setIsLoading(true);
    const prompt = `Klijent je uneo sledeći obrok: "${mealInput}". Analiziraj ga prema tvojim instrukcijama. Vrati odgovor u formatu:
    Kalorije: [broj] kcal
    Proteini: [broj] g
    Ugljeni hidrati: [broj] g
    Masti: [broj] g
    Savet: [tvoj savet]`;
    
    const response = await askAuraFitAI(prompt, false);
    setAiResponse(response);
    
    try {
      const calMatch = response.match(/Kalorije:\s*(\d+)/i);
      const protMatch = response.match(/Proteini:\s*(\d+)/i);
      const carbMatch = response.match(/Ugljeni hidrati:\s*(\d+)/i);
      const fatMatch = response.match(/Masti:\s*(\d+)/i);

      await addDoc(collection(db, "meals"), {
        userId: userData.uid,
        description: mealInput,
        calories: calMatch ? parseInt(calMatch[1]) : 0,
        protein: protMatch ? parseInt(protMatch[1]) : 0,
        carbs: carbMatch ? parseInt(carbMatch[1]) : 0,
        fat: fatMatch ? parseInt(fatMatch[1]) : 0,
        aiAdvice: response,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving meal:", error);
    }

    setIsLoading(false);
    setMealInput("");
  };

  const handleSearchFatSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`/api/fatsecret/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (data.foods && data.foods.food) {
        const foodsArray = Array.isArray(data.foods.food) ? data.foods.food : [data.foods.food];
        setSearchResults(foodsArray);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error", err);
    }
    setIsSearching(false);
  };

  const handleAddFatSecretFood = async (food: any) => {
    if (!userData) return;
    
    const desc = food.food_description || "";
    const calMatch = desc.match(/Calories:\s*(\d+)kcal/i);
    const protMatch = desc.match(/Protein:\s*([\d.]+)g/i);
    const carbMatch = desc.match(/Carbs:\s*([\d.]+)g/i);
    const fatMatch = desc.match(/Fat:\s*([\d.]+)g/i);

    try {
      await addDoc(collection(db, "meals"), {
        userId: userData.uid,
        description: food.food_name + " (" + desc.split('-')[0].trim() + ")",
        calories: calMatch ? parseInt(calMatch[1]) : 0,
        protein: protMatch ? parseFloat(protMatch[1]) : 0,
        carbs: carbMatch ? parseFloat(carbMatch[1]) : 0,
        fat: fatMatch ? parseFloat(fatMatch[1]) : 0,
        aiAdvice: "Uneto iz FatSecret baze.",
        createdAt: serverTimestamp()
      });
      
      setSearchQuery("");
      setSearchResults([]);
      setActiveTab('ai');
    } catch (error) {
      console.error("Error saving meal:", error);
    }
  };

  if (!userData) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 transition-colors duration-200">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-200">Zdravo, {userData.displayName.split(' ')[0]} 👋</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm md:text-base transition-colors duration-200">Tvoj dnevni pregled (Lite Mode)</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-zinc-950 p-1 rounded-2xl border border-slate-200 dark:border-zinc-800 transition-colors duration-200">
          <button
            onClick={() => setActiveTab('meals')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeTab === 'meals' ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
            )}
          >
            Ishrana
          </button>
          <button
            onClick={() => setActiveTab('biometrics')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeTab === 'biometrics' ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
            )}
          >
            Biometrija
          </button>
          <button
            onClick={() => setActiveTab('workout')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeTab === 'workout' ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
            )}
          >
            Trening
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeTab === 'feedback' ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
            )}
          >
            Feedback
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {activeTab === 'meals' ? (
          <>
            {/* AI Meal Logger / FatSecret Search */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-zinc-800 transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center transition-colors duration-200">
                      <Utensils className="w-5 h-5 text-indigo-600 dark:text-indigo-400 transition-colors duration-200" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white transition-colors duration-200">Unos Obroka</h2>
                  </div>
                  
                  <div className="flex bg-slate-50 dark:bg-zinc-950 p-1 rounded-xl border border-slate-200 dark:border-zinc-800/50 transition-colors duration-200">
                    <button
                      onClick={() => setMealLogMode('ai')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex-1 sm:flex-none text-center",
                        mealLogMode === 'ai' ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
                      )}
                    >
                      AI Analiza
                    </button>
                    <button
                      onClick={() => setMealLogMode('search')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex-1 sm:flex-none text-center",
                        mealLogMode === 'search' ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
                      )}
                    >
                      Baza
                    </button>
                  </div>
                </div>

                {mealLogMode === 'ai' ? (
                  <>
                    <form onSubmit={handleAnalyzeMeal} className="relative">
                      <input
                        type="text"
                        value={mealInput}
                        onChange={(e) => setMealInput(e.target.value)}
                        placeholder="Šta si pojeo? (npr. 'Dve pljeskavice...')"
                        className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-4 pr-16 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        disabled={isLoading}
                      />
                      <button
                        type="submit"
                        disabled={isLoading || !mealInput.trim()}
                        className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Sparkles className="w-5 h-5" />
                        )}
                      </button>
                    </form>

                    {aiResponse && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-5 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold transition-colors duration-200">
                            AI
                          </div>
                          <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 transition-colors duration-200">Aura Fit Analiza</span>
                        </div>
                        <p className="text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap text-sm transition-colors duration-200">
                          {aiResponse}
                        </p>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <form onSubmit={handleSearchFatSecret} className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Pretraži namirnice (npr. 'Banana')"
                        className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-4 pr-16 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        disabled={isSearching}
                      />
                      <button
                        type="submit"
                        disabled={isSearching || !searchQuery.trim()}
                        className="absolute right-2 top-2 bottom-2 aspect-square bg-slate-800 dark:bg-zinc-800 text-white rounded-xl flex items-center justify-center hover:bg-slate-700 dark:hover:bg-zinc-700 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {isSearching ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Search className="w-5 h-5" />
                        )}
                      </button>
                    </form>

                    {searchResults.length > 0 && (
                      <div className="mt-4 space-y-2 border border-slate-200 dark:border-zinc-800/50 rounded-2xl overflow-hidden bg-slate-50 dark:bg-zinc-950/50 transition-colors duration-200">
                        {searchResults.map((food, idx) => (
                          <div key={idx} className="p-4 hover:bg-slate-100 dark:hover:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800/50 last:border-0 flex items-center justify-between transition-colors">
                            <div className="pr-4">
                              <h4 className="font-semibold text-slate-900 dark:text-white text-sm md:text-base transition-colors duration-200">{food.food_name}</h4>
                              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1 transition-colors duration-200">{food.food_description}</p>
                            </div>
                            <button
                              onClick={() => handleAddFatSecretFood(food)}
                              className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Recent Meals */}
              <div className="bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-zinc-800 transition-colors duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center transition-colors duration-200">
                      <Flame className="w-5 h-5 text-orange-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white transition-colors duration-200">Današnji Obroci</h2>
                  </div>
                </div>

                <div className="space-y-3">
                  {recentMeals.length === 0 ? (
                    <div className="text-center py-8 px-4 bg-slate-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-200 dark:border-zinc-800/50 border-dashed transition-colors duration-200">
                      <Utensils className="w-8 h-8 text-slate-400 dark:text-zinc-700 mx-auto mb-3 transition-colors duration-200" />
                      <p className="text-sm text-slate-500 dark:text-zinc-500 transition-colors duration-200">Nema unetih obroka danas.</p>
                    </div>
                  ) : (
                    recentMeals.slice(0, 3).map((meal) => (
                      <div key={meal.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate pr-4 text-sm md:text-base transition-colors duration-200">{meal.description}</h3>
                          <span className="text-sm font-bold text-orange-500 dark:text-orange-400 whitespace-nowrap transition-colors duration-200">{meal.calories || 0} kcal</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-500 transition-colors duration-200">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500/50"></span> P: {meal.protein || 0}g</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500/50"></span> UH: {meal.carbs || 0}g</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500/50"></span> M: {meal.fat || 0}g</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar / Stats & Tools */}
            <div className="space-y-6">
              {/* Smart Reminders */}
              <div className="bg-indigo-600 dark:bg-indigo-500 p-6 rounded-3xl text-white shadow-lg shadow-indigo-500/20 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-5 h-5" />
                  <h3 className="font-bold">Pametni Podsetnik</h3>
                </div>
                <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                  "Primetio sam da nisi uneo ručak, a cilj nam je visok unos proteina danas. Treba ti ideja?"
                </p>
                <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-colors backdrop-blur-sm">
                  Prikaži predloge obroka
                </button>
              </div>
            </div>
          </>
        ) : activeTab === 'biometrics' ? (
          <div className="lg:col-span-3 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-zinc-800 transition-colors duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center transition-colors duration-200">
                    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors duration-200">Biometrija</h2>
                </div>
              </div>

              <div className="h-64 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={biometrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#88888822" />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#10b981' }}
                    />
                    <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <form onSubmit={handleLogBiometrics} className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="Težina (kg)"
                  className="flex-1 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white transition-all"
                />
                <button
                  type="submit"
                  disabled={isLoggingBiometrics || !weightInput}
                  className="bg-emerald-600 dark:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Log
                </button>
              </form>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Cilj i Napredak</h3>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase">Preostalo do cilja</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">5.5 kg</p>
                </div>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Sa trenutnim tempom od 0.5kg nedeljno, tvoj cilj ćeš dostići za otprilike 11 nedelja.
                </p>
              </div>
            </div>
          </div>
        ) : activeTab === 'workout' ? (
          <div className="lg:col-span-3 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-zinc-800 transition-colors duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center transition-colors duration-200">
                    <Dumbbell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors duration-200">Trening Dnevnik</h2>
                </div>
                {restTimer && <RestTimer duration={restTimer} onComplete={() => setRestTimer(null)} />}
              </div>

              {previousWorkout ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800/50">
                    <p className="text-xs text-slate-500 dark:text-zinc-500 mb-1 uppercase font-bold tracking-wider">Prošli trening</p>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">{previousWorkout.title}</h4>
                    <div className="space-y-2">
                      {previousWorkout.exercises?.slice(0, 2).map((ex: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-zinc-400">{ex.name}</span>
                          <span className="font-mono text-slate-900 dark:text-white">{ex.sets?.[0]?.weight}kg x {ex.sets?.[0]?.reps}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => setRestTimer(60)}
                    className="w-full py-3 rounded-xl bg-blue-600 dark:bg-blue-500 text-white font-bold text-sm hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Započni novi trening
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 dark:bg-zinc-950/50 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800/50">
                  <p className="text-sm text-slate-500 dark:text-zinc-500">Nema zabeleženih treninga.</p>
                  <button className="mt-4 text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline">Započni prvi trening</button>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Tajmer za odmor</h3>
              <div className="flex flex-wrap gap-2">
                {[30, 60, 90, 120].map(s => (
                  <button 
                    key={s}
                    onClick={() => setRestTimer(s)}
                    className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 text-center">
              <Camera className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Video Feedback</h2>
              <p className="text-slate-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
                Snimi svoju seriju i pošalji treneru na analizu. Dobićeš video sa markup korekcijama i glasovnom porukom.
              </p>
              <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
                Otpremi video
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbackVideos.map((video) => (
                <div key={video.id} className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-slate-200 dark:border-zinc-800">
                  <div className="aspect-video bg-slate-100 dark:bg-zinc-800 rounded-2xl mb-3 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{video.exerciseName || 'Vežba'}</h4>
                  <p className="text-xs text-slate-500 mt-1">{new Date(video.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-full",
                      video.status === 'reviewed' ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                    )}>
                      {video.status === 'reviewed' ? 'PREGLEDANO' : 'NA ČEKANJU'}
                    </span>
                    {video.status === 'reviewed' && (
                      <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Vidi feedback</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
