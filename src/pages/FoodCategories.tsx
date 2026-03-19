import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Search, Loader2, Trophy, X, Plus, Info,
  Apple, Beef, Fish, Wheat, Milk, Leaf, Candy, Egg, Coffee, Salad
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─────────────────────────────────────────────
// Category definitions
// ─────────────────────────────────────────────
const CATEGORIES = [
  { id: 'fruits',      label: 'Fruits',       icon: '🍎', color: 'from-rose-500/20 to-rose-900/40',    border: 'border-rose-500/20',    query: 'fresh fruit apple banana orange' },
  { id: 'vegetables',  label: 'Vegetables',   icon: '🥦', color: 'from-emerald-500/20 to-emerald-900/40', border: 'border-emerald-500/20', query: 'vegetables broccoli spinach carrot' },
  { id: 'meat',        label: 'Meat',         icon: '🥩', color: 'from-red-700/20 to-red-900/40',      border: 'border-red-500/20',     query: 'chicken breast beef pork steak' },
  { id: 'fish',        label: 'Fish & Seafood', icon: '🐟', color: 'from-blue-500/20 to-blue-900/40', border: 'border-blue-500/20',    query: 'salmon tuna fish seafood shrimp' },
  { id: 'dairy',       label: 'Dairy',        icon: '🧀', color: 'from-yellow-500/20 to-yellow-900/40', border: 'border-yellow-500/20', query: 'milk cheese yogurt dairy butter' },
  { id: 'grains',      label: 'Grains & Bread', icon: '🌾', color: 'from-amber-600/20 to-amber-900/40', border: 'border-amber-500/20', query: 'rice oats bread pasta wheat grain' },
  { id: 'eggs',        label: 'Eggs',         icon: '🥚', color: 'from-orange-400/20 to-orange-900/40', border: 'border-orange-400/20', query: 'egg boiled scrambled omelette' },
  { id: 'legumes',     label: 'Legumes',      icon: '🫘', color: 'from-lime-600/20 to-lime-900/40',    border: 'border-lime-500/20',    query: 'lentils chickpeas beans legumes tofu' },
  { id: 'snacks',      label: 'Snacks',       icon: '🍫', color: 'from-purple-500/20 to-purple-900/40', border: 'border-purple-500/20', query: 'protein bar snack nut almond' },
  { id: 'drinks',      label: 'Drinks',       icon: '🥤', color: 'from-cyan-500/20 to-cyan-900/40',   border: 'border-cyan-500/20',    query: 'juice smoothie protein shake water drink' },
  { id: 'salads',      label: 'Salads',       icon: '🥗', color: 'from-green-500/20 to-green-900/40', border: 'border-green-500/20',   query: 'salad caesar greek mixed greens' },
  { id: 'sweets',      label: 'Sweets',       icon: '🍰', color: 'from-pink-500/20 to-pink-900/40',   border: 'border-pink-500/20',    query: 'cookie cake dessert sweet honey' },
] as const;

interface FoodItem {
  food_id: string;
  food_name: string;
  food_description: string; // contains calories/macros
  brand_name?: string;
}

interface ParsedMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

// Helper: parse FatSecret food_description string like
// "Calories: 210kcal | Fat: 8.00g | Carbs: 24.00g | Protein: 10.00g"
function parseMacros(description: string): ParsedMacros {
  const get = (key: string) => {
    const match = description.match(new RegExp(`${key}:\\s*([\\d.]+)`));
    return match ? parseFloat(match[1]) : 0;
  };
  const servingMatch = description.match(/Per\s+([^-]+)\s+-/);
  return {
    calories: get('Calories'),
    protein: get('Protein'),
    carbs: get('Carbs'),
    fat: get('Fat'),
    serving: servingMatch?.[1]?.trim() ?? '100g',
  };
}

const FoodCategories: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const fetchFoods = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError('');
    setFoods([]);
    try {
      const res = await fetch(`/api/fatsecret/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      const items: FoodItem[] = data?.foods?.food ?? [];
      setFoods(Array.isArray(items) ? items : [items]);
    } catch (e) {
      setError('Failed to load foods. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCategoryClick = (cat: typeof CATEGORIES[number]) => {
    setActiveCategory(cat.id);
    setSearchQuery('');
    fetchFoods(cat.query);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveCategory(null);
      fetchFoods(searchQuery);
    }
  };

  const handleLogFood = async (food: FoodItem) => {
    if (!currentUser) return;
    setSavingId(food.food_id);
    try {
      const macros = parseMacros(food.food_description);
      await addDoc(collection(db, 'users', currentUser.uid, 'meals'), {
        mealName: food.food_name,
        calories: macros.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        description: `${food.food_name} (${macros.serving})`,
        source: 'fatsecret_category',
        timestamp: serverTimestamp(),
      });
      setSavedIds(prev => new Set([...prev, food.food_id]));
    } catch (e) {
      console.error(e);
    } finally {
      setSavingId(null);
    }
  };

  const activeCat = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col pb-24">

      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-4 space-y-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-300 bg-white/10 p-2.5 rounded-2xl hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">Food Categories</h1>
            <p className="text-zinc-500 text-xs">Powered by FatSecret</p>
          </div>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search any food..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#d6ff3e]/40 focus:ring-1 focus:ring-[#d6ff3e]/20 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3.5 bg-[#d6ff3e] text-[#1c1c1c] font-black rounded-2xl text-sm hover:bg-[#e4ff6a] transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* ── Category Grid (always visible) ── */}
      {!activeCategory && foods.length === 0 && (
        <div className="px-6 pt-2">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Browse by category</p>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleCategoryClick(cat)}
                className={`bg-gradient-to-br ${cat.color} border ${cat.border} rounded-3xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-transform`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-black text-white text-center leading-tight">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* ── Active Category / Search Results ── */}
      {(activeCategory || foods.length > 0 || isLoading || error) && (
        <div className="flex-grow px-6 pt-2">

          {/* Category header chip */}
          {activeCat && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeCat.icon}</span>
                <span className="text-base font-black text-white">{activeCat.label}</span>
                {foods.length > 0 && (
                  <span className="text-xs text-zinc-500 font-semibold">({foods.length} results)</span>
                )}
              </div>
              <button
                onClick={() => { setActiveCategory(null); setFoods([]); setError(''); }}
                className="text-zinc-400 hover:text-white bg-zinc-800 p-1.5 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Search results header */}
          {!activeCat && foods.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-zinc-400 text-sm"><span className="text-white font-bold">{foods.length}</span> results for "{searchQuery}"</p>
              <button
                onClick={() => { setFoods([]); setSearchQuery(''); }}
                className="text-zinc-400 hover:text-white bg-zinc-800 p-1.5 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center pt-16 gap-4">
              <div className="w-14 h-14 rounded-full border-4 border-[#d6ff3e]/20 border-t-[#d6ff3e] animate-spin" />
              <p className="text-zinc-500 text-sm">Loading foods…</p>
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="flex flex-col items-center pt-12 gap-3 text-center">
              <Info size={32} className="text-rose-400" />
              <p className="text-rose-400 font-bold">{error}</p>
            </div>
          )}

          {/* Food list */}
          {!isLoading && foods.length > 0 && (
            <div className="space-y-3">
              {foods.map((food, i) => {
                const macros = parseMacros(food.food_description);
                const done = savedIds.has(food.food_id);
                return (
                  <motion.div
                    key={food.food_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 space-y-3"
                  >
                    {/* Food name row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm leading-tight">{food.food_name}</p>
                        {food.brand_name && (
                          <p className="text-zinc-500 text-xs mt-0.5">{food.brand_name}</p>
                        )}
                        <p className="text-zinc-600 text-[11px] mt-1 leading-snug line-clamp-1">{food.food_description}</p>
                      </div>

                      {/* Log button */}
                      <button
                        onClick={() => handleLogFood(food)}
                        disabled={savingId === food.food_id || done}
                        className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                          done
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-[#d6ff3e]/10 border border-[#d6ff3e]/20 text-[#d6ff3e] hover:bg-[#d6ff3e] hover:text-[#1c1c1c]'
                        }`}
                      >
                        {savingId === food.food_id
                          ? <Loader2 size={16} className="animate-spin" />
                          : done
                          ? <Trophy size={16} />
                          : <Plus size={16} />
                        }
                      </button>
                    </div>

                    {/* Macro pills */}
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-xs font-bold text-white">
                        🔥 {macros.calories} kcal
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#afa3ff]/10 text-xs font-bold text-[#afa3ff]">
                        P {macros.protein}g
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#d6ff3e]/10 text-xs font-bold text-[#d6ff3e]">
                        C {macros.carbs}g
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-orange-500/10 text-xs font-bold text-orange-400">
                        F {macros.fat}g
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-[10px] text-zinc-500">
                        per {macros.serving}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default FoodCategories;
