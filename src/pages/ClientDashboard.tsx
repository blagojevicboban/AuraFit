import React, { useState, useEffect } from "react";
import { Send, Utensils, Activity, Flame, ChevronRight, Search, Plus, Sparkles, Users } from "lucide-react";
import { askAuraFitAI } from "../lib/gemini";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { cn } from "../lib/utils";

export default function ClientDashboard() {
  const { userData } = useAuth();
  const [mealInput, setMealInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentMeals, setRecentMeals] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<'ai' | 'fatsecret'>('ai');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
        <div className="flex items-center gap-4">
          <div className="bg-white dark:bg-zinc-900 px-4 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 flex items-center gap-3 w-full md:w-auto transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center transition-colors duration-200">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-wider transition-colors duration-200">Dnevni cilj</p>
              <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight transition-colors duration-200">2,400 <span className="text-sm font-normal text-slate-500 dark:text-zinc-400">kcal</span></p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
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
                  onClick={() => setActiveTab('ai')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex-1 sm:flex-none text-center",
                    activeTab === 'ai' ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
                  )}
                >
                  AI Analiza
                </button>
                <button
                  onClick={() => setActiveTab('fatsecret')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex-1 sm:flex-none text-center",
                    activeTab === 'fatsecret' ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
                  )}
                >
                  Baza
                </button>
              </div>
            </div>

            {activeTab === 'ai' ? (
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

        {/* Sidebar / Coach Connect */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-900/40 dark:to-cyan-900/40 p-6 rounded-3xl border border-indigo-200 dark:border-indigo-500/20 relative overflow-hidden transition-colors duration-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl transition-colors duration-200" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-2xl transition-colors duration-200" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20 dark:border-white/10 transition-colors duration-200">
                <Users className="w-6 h-6 text-indigo-600 dark:text-white transition-colors duration-200" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white transition-colors duration-200">Želiš brže rezultate?</h3>
              <p className="text-slate-600 dark:text-indigo-200 text-sm leading-relaxed mb-6 transition-colors duration-200">
                Poveži se sa pravim trenerom koji će pratiti tvoj napredak i prilagođavati plan.
              </p>
              
              <button className="w-full bg-indigo-600 dark:bg-white text-white dark:text-indigo-950 py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-700 dark:hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 dark:shadow-white/10">
                Pronađi mentora
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
