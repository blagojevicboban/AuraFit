import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Search, Bell, User, Clock, Flame, 
  ChevronLeft, Loader2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import BottomNav from '../components/BottomNav';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// ─────────────────────────────────────────────
// Data (Matching UI Kit)
// ─────────────────────────────────────────────
const MealPlanList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | number>('');
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        // 1. Try Firebase 'mealPlans'
        const snapshot = await getDocs(collection(db, 'mealPlans'));
        const fbPlans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (fbPlans.length > 0) {
          setPlans(fbPlans);
          setSelectedId(fbPlans[0].id);
        } else {
          // 2. Fallback to FatSecret recipes
          const res = await fetch('/api/fatsecret/recipes?type=Breakfast&max_results=5');
          const data = await res.json();
          const fsItems = data?.recipes?.recipe || [];
          const formatted = (Array.isArray(fsItems) ? fsItems : [fsItems]).map((r: any) => ({
            id: r.recipe_id,
            name: r.recipe_name,
            time: '15-20 Min',
            kcal: '350 Cal',
            icon: '🍏',
            isFS: true
          }));
          setPlans(formatted);
          if (formatted.length > 0) setSelectedId(formatted[0].id);
        }
      } catch (e) {
        console.error("Meal plans fetch error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col pb-24 transition-colors duration-300">
      
      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)}
              className="text-emerald-500 dark:text-[#d6ff3e] hover:opacity-70 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-black text-[#afa3ff] uppercase tracking-tighter">{t('mealPlans.title')}</h1>
          </div>
          <div className="flex gap-4">
            <button className="text-[#afa3ff] hover:opacity-70 transition-colors"><Search size={22} /></button>
            <button className="text-[#afa3ff] hover:opacity-70 transition-colors"><Bell size={22} /></button>
            <button className="text-[#afa3ff] hover:opacity-70 transition-colors"><User size={22}/></button>
          </div>
        </div>

        <div className="mb-8">
            <h2 className="text-emerald-500 dark:text-[#d6ff3e] text-2xl font-black leading-tight mb-2 italic uppercase">
                {t('mealPlans.breakfastPlanForYou')}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed font-medium">
                {t('mealPlans.planDescription')}
            </p>
        </div>
      </div>

      {/* ── Content (Selectable List) ── */}
      <div className="flex-grow px-6 overflow-y-auto space-y-4">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-emerald-500 dark:text-[#d6ff3e]" size={40} />
            </div>
        ) : plans.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 italic font-bold">
                {t('mealPlans.noPlans')}
            </div>
        ) : (
            plans.map((recipe, index) => (
                <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedId(recipe.id)}
                    className="flex items-center gap-4 cursor-pointer group"
                >
                    {/* Selection Indicator */}
                    <div className="relative flex items-center justify-center">
                        <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                            selectedId === recipe.id ? 'border-emerald-500 dark:border-[#afa3ff] bg-emerald-500/10 dark:bg-[#afa3ff]/10' : 'border-zinc-200 dark:border-zinc-800'
                        }`}>
                            {selectedId === recipe.id && (
                                <div className="w-2.5 h-2.5 bg-emerald-500 dark:bg-[#d6ff3e] rounded-full shadow-[0_0_12px_rgba(214,255,62,0.8)]" />
                            )}
                        </div>
                    </div>

                    {/* Recipe Card */}
                    <div className={`flex-1 flex bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden h-[120px] shadow-sm border border-zinc-100 dark:border-white/5 transition-all ${selectedId === recipe.id ? 'scale-[1.02] border-emerald-500/30' : 'opacity-80'}`}>
                        <div className="flex-1 p-5 flex flex-col justify-center">
                            <h3 className="text-zinc-900 dark:text-white font-black text-sm leading-[1.1] mb-2 uppercase italic tracking-tight">
                                {recipe.name || recipe.title}
                            </h3>
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <span className="flex items-center gap-1.5"><Clock size={12} className="text-emerald-500 dark:text-[#afa3ff]"/>{recipe.time ||'15 Min'}</span>
                                <span className="flex items-center gap-1.5"><Flame size={12} className="text-emerald-500 dark:text-[#afa3ff]"/>{recipe.kcal || recipe.calories || '300 Cal'}</span>
                            </div>
                        </div>
                        {/* Image side */}
                        <div className="w-1/3 bg-zinc-100 dark:bg-zinc-800 relative flex items-center justify-center overflow-hidden">
                            {recipe.isFS ? (
                                <span className="text-4xl">{recipe.icon}</span>
                            ) : (
                                <img src={recipe.image || '/assets/breakfast.png'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={recipe.name} />
                            )}
                        </div>
                    </div>
                </motion.div>
            ))
        )}
      </div>

      {/* ── Action Button ── */}
      <div className="px-6 py-6 pb-2">
          <button 
            disabled={!selectedId}
            onClick={() => navigate('/recipe', { state: { recipeId: selectedId } })}
            className="w-full bg-emerald-500 dark:bg-[#d6ff3e] text-white dark:text-[#1c1c1c] font-black py-4 rounded-full text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 uppercase tracking-tighter"
          >
            {t('mealPlans.seeRecipe')}
          </button>
      </div>

      <BottomNav />

    </div>
  );
};

export default MealPlanList;
