import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, X, Dumbbell, Apple, ChefHat, 
  ChevronRight, Loader2, Clock, Flame, Play, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory = 'workouts' | 'food' | 'recipes';

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [query_term, setQueryTerm] = useState('');
  const [activeTab, setActiveTab] = useState<SearchCategory>('workouts');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
        setQueryTerm('');
        setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (query_term.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [query_term, activeTab]);

  const handleSearch = async () => {
    if (query_term.trim().length < 2) return;
    
    setIsLoading(true);
    try {
      if (activeTab === 'workouts') {
        // Search Firebase Workouts
        const workoutsRef = collection(db, 'workouts');
        const q = query(
            workoutsRef, 
            where('title', '>=', query_term),
            where('title', '<=', query_term + '\uf8ff'),
            limit(10)
        );
        const snapshot = await getDocs(q);
        setResults(snapshot.docs.map(doc => ({ id: doc.id, type: 'workout', ...doc.data() })));
      } else if (activeTab === 'food') {
        // Search FatSecret Food
        const res = await fetch(`/api/fatsecret/search?search_expression=${encodeURIComponent(query_term)}&lang=${language}`);
        const data = await res.json();
        const items = data?.foods?.food || [];
        setResults((Array.isArray(items) ? items : [items]).map((f: any) => ({ ...f, type: 'food' })));
      } else if (activeTab === 'recipes') {
        // Search FatSecret Recipes
        const res = await fetch(`/api/fatsecret/recipes?search_expression=${encodeURIComponent(query_term)}&lang=${language}`);
        const data = await res.json();
        const items = data?.recipes?.recipe || [];
        setResults((Array.isArray(items) ? items : [items]).map((r: any) => ({ ...r, type: 'recipe' })));
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = (item: any) => {
    if (item.type === 'workout') {
      return (
        <div 
          key={item.id} 
          onClick={() => { navigate('/routine'); onClose(); }}
          className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl cursor-pointer transition-colors border border-white/5"
        >
          <div className="w-12 h-12 rounded-xl bg-[#afa3ff]/20 flex items-center justify-center">
            <Dumbbell className="text-[#afa3ff]" size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-white text-sm">{item.title}</h4>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-black">{item.level} • {item.duration}</p>
          </div>
          <ChevronRight size={18} className="text-zinc-600" />
        </div>
      );
    }

    if (item.type === 'food') {
      return (
        <div 
          key={item.food_id}
          onClick={() => navigate('/food-categories')} // Simplification
          className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl cursor-pointer transition-colors border border-white/5"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Apple className="text-emerald-500" size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-white text-sm">{item.food_name}</h4>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-black truncate max-w-[200px]">
                {item.food_description}
            </p>
          </div>
          <ChevronRight size={18} className="text-zinc-600" />
        </div>
      );
    }

    if (item.type === 'recipe') {
      return (
        <div 
          key={item.recipe_id}
          onClick={() => {
            navigate('/recipe', { state: { recipeId: item.recipe_id, isFS: true } });
            onClose();
          }}
          className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl cursor-pointer transition-colors border border-white/5"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <ChefHat className="text-orange-500" size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-white text-sm">{item.recipe_name}</h4>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-black line-clamp-1">
                {item.recipe_description}
            </p>
          </div>
          <ChevronRight size={18} className="text-zinc-600" />
        </div>
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-6 pt-12 flex items-center gap-4">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                ref={inputRef}
                type="text"
                value={query_term}
                onChange={(e) => setQueryTerm(e.target.value)}
                placeholder={t('common.search') + "..."}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#afa3ff]/50 transition-all font-bold"
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 size={18} className="animate-spin text-[#afa3ff]" />
                </div>
              )}
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Categories */}
          <div className="flex px-6 gap-2 mb-6">
            {[
              { id: 'workouts', icon: Dumbbell, label: 'Workouts' },
              { id: 'food', icon: Apple, label: 'Food' },
              { id: 'recipes', icon: ChefHat, label: 'Recipes' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id as SearchCategory)}
                className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-2xl border transition-all ${
                  activeTab === cat.id 
                    ? 'bg-[#afa3ff] border-[#afa3ff] text-[#1c1c1c]' 
                    : 'bg-white/5 border-white/5 text-zinc-500'
                }`}
              >
                <cat.icon size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto px-6 pb-24">
            {results.length > 0 ? (
               <div className="space-y-3">
                 <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Search Results</h3>
                 {results.map(renderResult)}
               </div>
            ) : query_term.trim().length >= 2 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Search size={32} />
                    </div>
                    <p className="text-white font-bold italic">No results found for "{query_term}"</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Star size={32} />
                    </div>
                    <p className="text-white font-bold uppercase tracking-widest text-xs">Search for your favorite fitness content</p>
                </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearch;
