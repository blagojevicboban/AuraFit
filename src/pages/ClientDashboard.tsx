import { useState, useEffect } from "react";
import { Send, Utensils, Activity, Flame, ChevronRight, Search, Plus } from "lucide-react";
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
      // Pokušaj da izvučeš brojeve iz odgovora (jednostavan regex za MVP)
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
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Zdravo, {userData.displayName.split(' ')[0]} 👋</h1>
          <p className="text-zinc-500 mt-1">Tvoj dnevni pregled (Lite Mode)</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-3">
            <Flame className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Dnevni cilj</p>
              <p className="font-bold text-zinc-900">2,400 kcal</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* AI Meal Logger / FatSecret Search */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-900">Unos Obroka</h2>
              </div>
              
              <div className="flex bg-zinc-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('ai')}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                    activeTab === 'ai' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  AI Analiza
                </button>
                <button
                  onClick={() => setActiveTab('fatsecret')}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                    activeTab === 'fatsecret' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  Pretraga Baze
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
                    placeholder="Šta si pojeo? (npr. 'Dve pljeskavice u lepinji sa kajmakom')"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 pr-16 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !mealInput.trim()}
                    className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>

                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                        AI
                      </div>
                      <span className="text-sm font-semibold text-indigo-900">Aura Fit Analiza</span>
                    </div>
                    <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap text-sm">
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
                    placeholder="Pretraži namirnice (npr. 'Banana', 'Chicken breast')"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 pr-16 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    disabled={isSearching}
                  />
                  <button
                    type="submit"
                    disabled={isSearching || !searchQuery.trim()}
                    className="absolute right-2 top-2 bottom-2 aspect-square bg-zinc-900 text-white rounded-xl flex items-center justify-center hover:bg-zinc-800 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </button>
                </form>

                {searchResults.length > 0 && (
                  <div className="mt-4 space-y-2 border border-zinc-100 rounded-2xl overflow-hidden">
                    {searchResults.map((food, idx) => (
                      <div key={idx} className="p-4 bg-white hover:bg-zinc-50 border-b border-zinc-100 last:border-0 flex items-center justify-between transition-colors">
                        <div className="pr-4">
                          <h4 className="font-semibold text-zinc-900">{food.food_name}</h4>
                          <p className="text-xs text-zinc-500 mt-1">{food.food_description}</p>
                        </div>
                        <button
                          onClick={() => handleAddFatSecretFood(food)}
                          className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors cursor-pointer"
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
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-900">Današnji Obroci</h2>
              </div>
            </div>

            <div className="space-y-3">
              {recentMeals.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-4">Nema unetih obroka danas.</p>
              ) : (
                recentMeals.slice(0, 3).map((meal) => (
                  <div key={meal.id} className="p-4 rounded-2xl border border-zinc-100 hover:border-zinc-200 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-zinc-900 truncate pr-4">{meal.description}</h3>
                      <span className="text-sm font-bold text-orange-600">{meal.calories || 0} kcal</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span>P: {meal.protein || 0}g</span>
                      <span>UH: {meal.carbs || 0}g</span>
                      <span>M: {meal.fat || 0}g</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Coach Connect */}
        <div className="space-y-6">
          <div className="bg-zinc-900 p-6 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
            
            <h3 className="text-xl font-bold mb-2">Želiš brže rezultate?</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Poveži se sa pravim trenerom koji će pratiti tvoj napredak i prilagođavati plan.
            </p>
            
            <button className="w-full bg-white text-zinc-900 py-3 rounded-xl font-semibold text-sm hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 cursor-pointer">
              Pronađi mentora
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
