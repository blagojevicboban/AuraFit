import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, User, Star, Clock, Flame, Play,
  Home, BookOpen, Headphones, ChevronLeft, Apple, Plus, Sparkles, Barcode, Loader2
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { AILogModal } from '../components/nutrition/AILogModal';
import { BarcodeScannerModal } from '../components/nutrition/BarcodeScannerModal';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import TopHeader from '../components/TopHeader';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, Timestamp, getDocs, limit } from 'firebase/firestore';

const Nutrition: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('Meal Plans');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [dailyTotals, setDailyTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [recommendedRecipes, setRecommendedRecipes] = useState<any[]>([]);
  const [recipesForYou, setRecipesForYou] = useState<any[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);

  const mealIdeas = [
    { id: 5, title: t('nutrition.avocadoToast'), image: '/assets/breakfast.png', tags: [t('nutrition.breakfast'), 'Vegan'], query: 'avocado toast' },
    { id: 6, title: t('nutrition.proteinBowl'), image: '/assets/stretching.png', tags: [t('nutrition.lunch'), 'High Protein'], query: 'protein bowl' },
    { id: 7, title: t('nutrition.berrySmoothie'), image: '/assets/cycling.png', tags: [t('nutrition.snack'), 'Low Cal'], query: 'berry smoothie' },
    { id: 8, title: t('nutrition.grilledChicken'), image: '/assets/squat.png', tags: [t('nutrition.dinner'), 'Keto'], query: 'grilled chicken' },
  ];

  // Fetch today's meals
  React.useEffect(() => {
    if (!currentUser) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const q = query(
      collection(db, 'users', currentUser.uid, 'meals'),
      where('timestamp', '>=', Timestamp.fromDate(today))
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const totals = snapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        return {
          calories: acc.calories + (data.calories || 0),
          protein: acc.protein + (data.protein || 0),
          carbs: acc.carbs + (data.carbs || 0),
          fat: acc.fat + (data.fat || 0),
        };
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
      setDailyTotals(totals);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Hybrid fetch: Recommended from Firebase, Discovery from FatSecret
  React.useEffect(() => {
    const fetchRecipesData = async () => {
      setIsLoadingRecipes(true);
      try {
        // 1. Fetch RECOMMENDED from Firebase 'recipes'
        const fbQuery = query(collection(db, 'recipes'), limit(6));
        const fbSnapshot = await getDocs(fbQuery);
        const fbRecipes = fbSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            recipe_id: doc.id,
            recipe_name: data.title || data.recipe_name || 'Recipe',
            recipe_image: data.image || data.recipe_image || '/assets/breakfast.png',
            recipe_description: data.description || data.recipe_description || '',
            ...data
          };
        });

        if (fbRecipes.length > 0) {
          setRecommendedRecipes(fbRecipes);
        } else {
          // Fallback to FS for recommended
          const res1 = await fetch('/api/fatsecret/recipes?type=Breakfast&max_calories=400');
          const data1 = await res1.json();
          const items = data1?.recipes?.recipe || [];
          setRecommendedRecipes(Array.isArray(items) ? items.slice(0, 4) : [items]);
        }

        // 2. Fetch "For You" from FatSecret
        const res2 = await fetch('/api/fatsecret/recipes?max_calories=600');
        const data2 = await res2.json();
        const forYouItems = data2?.recipes?.recipe || [];
        setRecipesForYou(Array.isArray(forYouItems) ? forYouItems.slice(0, 4) : [forYouItems]);
      } catch (e) {
        console.error("Hybrid recipes fetch error:", e);
      } finally {
        setIsLoadingRecipes(false);
      }
    };
    fetchRecipesData();
  }, [currentUser]);

  const macroGoals = {
    calories: 2400,
    protein: 160,
    carbs: 280,
    fat: 70
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col pb-24 transition-colors duration-300">
      
      {/* ── Daily Tracker ── */}
      <div className="px-6 mb-6 mt-12">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-[#d6ff3e]/10 blur-3xl rounded-full" />
          
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-zinc-500 dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{t('nutrition.caloriesLeft')}</p>
              <h2 className="text-4xl font-black text-zinc-900 dark:text-white">
                {Math.max(0, macroGoals.calories - dailyTotals.calories)}
                <span className="text-sm text-zinc-400 dark:text-zinc-600 ml-2 font-bold uppercase tracking-widest">kcal</span>
              </h2>
            </div>
            <div className="text-right">
              <p className="text-emerald-500 dark:text-[#d6ff3e] text-xs font-black italic">
                {Math.round((dailyTotals.calories / macroGoals.calories) * 100)}% {t('nutrition.consumed')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: t('nutrition.protein'), current: dailyTotals.protein, goal: macroGoals.protein, color: 'bg-[#afa3ff]' },
              { label: t('nutrition.carbs'), current: dailyTotals.carbs, goal: macroGoals.carbs, color: 'bg-emerald-500 dark:bg-[#d6ff3e]' },
              { label: t('nutrition.fat'), current: dailyTotals.fat, goal: macroGoals.fat, color: 'bg-zinc-200 dark:bg-zinc-100' },
            ].map((macro) => (
              <div key={macro.label} className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{macro.label}</span>
                  <span className="text-[10px] font-bold text-zinc-900 dark:text-white">{macro.current}g</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (macro.current / macro.goal) * 100)}%` }}
                    className={`h-full ${macro.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TopHeader title={t('nutrition.title')} />

      <div className="px-6 pb-4">
        {/* ── Tabs (Meal Plans / Meal Ideas) ── */}
        <div className="flex bg-zinc-200 dark:bg-[#2d2d2d] rounded-full p-1 mb-6 relative transition-colors">
          <motion.div 
             className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-emerald-500 dark:bg-[#d6ff3e] rounded-full z-0"
             animate={{ x: activeTab === 'Meal Plans' ? 0 : '100%' }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <button 
            onClick={() => setActiveTab('Meal Plans')}
            className={`flex-1 py-3 text-sm font-bold rounded-full z-10 transition-colors ${activeTab === 'Meal Plans' ? 'text-white dark:text-[#1c1c1c]' : 'text-zinc-500 dark:text-zinc-400'}`}
          >
            {t('nutrition.mealPlans')}
          </button>
          <button 
            onClick={() => setActiveTab('Meal Ideas')}
            className={`flex-1 py-3 text-sm font-bold rounded-full z-10 transition-colors ${activeTab === 'Meal Ideas' ? 'text-white dark:text-[#1c1c1c]' : 'text-zinc-500 dark:text-zinc-400'}`}
          >
            {t('nutrition.mealIdeas')}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.2 }}
           className="flex-grow flex flex-col"
        >
          {/* ── Recipe of the Day (Shared Top Section) ── */}
          <div className="px-6 mb-8">
            <div 
              onClick={() => navigate('/meal-plan')}
              className="bg-[#afa3ff] rounded-3xl p-1 relative overflow-hidden group cursor-pointer shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10 pointer-events-none" />
              <div className="h-44 bg-zinc-800 rounded-[22px] flex items-center justify-center overflow-hidden relative">
                <img 
                  src="/assets/nutrition-hero.png" 
                  alt="Recipe of the day" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute top-3 right-3 bg-emerald-500 dark:bg-[#d6ff3e] text-white dark:text-[#1c1c1c] text-xs font-bold px-3 py-1.5 rounded-full z-20">
                {t('nutrition.recipeDay')}
              </div>
              
              <button className="absolute bottom-4 right-4 text-white z-20">
                 <Star size={20} fill="currentColor" />
              </button>

              <div className="absolute bottom-4 left-4 right-12 z-20">
                <h3 className="text-white dark:text-[#d6ff3e] font-bold text-lg leading-tight mb-1 truncate">Carrot And Orange Smoothie</h3>
                <div className="flex items-center gap-4 text-[10px] font-medium text-white/80 dark:text-zinc-200">
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-white"/>10 {t('common.minutes')}</span>
                  <span className="flex items-center gap-1.5"><Flame size={12} className="text-white"/>70 Cal</span>
                </div>
              </div>
            </div>
          </div>

          {activeTab === 'Meal Plans' && (
            <div className="flex-col pb-6">
              {/* ── Recommended (Horizontal Scroll) ── */}
              <div className="pl-6 mb-8">
                <h2 className="text-emerald-500 dark:text-[#d6ff3e] text-xl font-extrabold mb-4">{t('nutrition.recommended')}</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 pr-6 no-scrollbar min-h-[160px]">
                  {isLoadingRecipes ? (
                    <div className="flex items-center justify-center w-full py-10">
                      <Loader2 className="animate-spin text-emerald-500" size={24} />
                    </div>
                  ) : recommendedRecipes.length === 0 ? (
                    <p className="text-zinc-500 text-xs italic px-2">No recipes found.</p>
                  ) : recommendedRecipes.map((recipe, i) => (
                    <motion.div 
                      key={recipe.recipe_id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="min-w-[200px] bg-white dark:bg-zinc-800 rounded-3xl overflow-hidden relative shadow-md flex-shrink-0 cursor-pointer border border-zinc-100 dark:border-none"
                    >
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                       <div className="h-40 bg-zinc-700 flex items-center justify-center overflow-hidden">
                         <img src={recipe.recipe_image} className="w-full h-full object-cover opacity-80" alt={recipe.recipe_name} />
                       </div>
                       
                       <button className="absolute top-3 right-3 text-white z-20">
                         <Star size={16} fill="currentColor" />
                       </button>

                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           navigate('/meal-plan');
                         }}
                         className="absolute right-3 top-[100px] w-8 h-8 rounded-full bg-emerald-500 dark:bg-[#afa3ff] flex items-center justify-center z-20 shadow-lg text-white hover:scale-110 active:scale-95 transition-all"
                       >
                         <Play size={14} fill="currentColor" />
                       </button>

                       <div className="absolute bottom-3 left-3 right-3 z-20">
                         <h3 className="text-white dark:text-[#d6ff3e] font-semibold text-sm mb-1.5 truncate">{recipe.recipe_name}</h3>
                         <div className="flex items-center gap-3 text-[10px] font-medium text-zinc-300">
                           <span className="flex items-center gap-1 line-clamp-1 truncate max-w-[150px]">
                             {recipe.recipe_description}
                           </span>
                         </div>
                       </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ── Recipes For You (Vertical List) ── */}
              <div className="px-6">
                <h2 className="text-emerald-500 dark:text-[#d6ff3e] text-xl font-extrabold mb-4">{t('nutrition.recipesForYou')}</h2>
                <div className="flex flex-col gap-4">
                  {isLoadingRecipes ? (
                    <div className="flex flex-col gap-4">
                      {[1, 2].map(i => (
                        <div key={i} className="h-28 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
                      ))}
                    </div>
                  ) : recipesForYou.map((recipe, i) => (
                    <motion.div 
                      key={recipe.recipe_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      className="bg-white dark:bg-zinc-800 rounded-3xl overflow-hidden flex shadow-lg h-[120px] cursor-pointer border border-zinc-100 dark:border-none"
                    >
                       <div className="flex-1 p-5 flex flex-col justify-center">
                         <h3 className="text-zinc-900 dark:text-white font-bold text-base leading-tight mb-2 whitespace-pre-line truncate max-w-[200px]">
                           {recipe.recipe_name}
                         </h3>
                         <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                           <span className="flex items-center gap-1.5 line-clamp-2 italic">{recipe.recipe_description}</span>
                         </div>
                       </div>
                       <div className="w-2/5 bg-zinc-800 relative flex items-center justify-center overflow-hidden">
                          <img src={recipe.recipe_image} className="w-full h-full object-cover opacity-60 dark:opacity-60" alt={recipe.recipe_name} />
                          <button className="absolute top-3 right-3 text-white drop-shadow-md">
                            <Star size={16} fill="currentColor" />
                          </button>
                       </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Meal Ideas' && (
            <div className="px-6 pb-8">
              <h2 className="text-emerald-500 dark:text-[#d6ff3e] text-xl font-extrabold mb-4">{t('nutrition.discoverIdeas')}</h2>
              <div className="grid grid-cols-2 gap-4">
                {mealIdeas.map((idea, i) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => navigate('/food-categories', { state: { search: idea.query } })}
                    className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-3xl relative overflow-hidden group cursor-pointer border border-zinc-100 dark:border-none"
                  >
                    <img src={idea.image} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" alt={idea.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-[10px] mb-1 leading-tight">{idea.title}</p>
                      <div className="flex flex-wrap gap-1">
                        {idea.tags.map(tag => (
                          <span 
                            key={tag} 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/food-categories', { state: { search: tag.toLowerCase() } });
                            }}
                            className="text-[7px] bg-emerald-500/20 dark:bg-[#d6ff3e]/20 text-white dark:text-[#d6ff3e] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <BottomNav />

      {/* ── FAB Buttons ── */}
      <div className="fixed bottom-28 right-6 flex flex-col gap-3 z-50">
        {/* Food Categories FAB */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/food-categories')}
          className="w-14 h-14 bg-zinc-800 border border-white/10 rounded-full flex items-center justify-center shadow-xl group relative"
        >
          <Apple size={20} className="text-emerald-400" />
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 bg-zinc-700 text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
            Browse Categories
          </div>
        </motion.button>

        {/* Barcode Scanner FAB */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsBarcodeOpen(true)}
          className="w-14 h-14 bg-zinc-800 border border-white/10 rounded-full flex items-center justify-center shadow-xl group relative"
        >
          <Barcode size={22} className="text-[#d6ff3e]" />
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 bg-zinc-700 text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
            Scan Barcode
          </div>
        </motion.button>

        {/* AI Log FAB */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLogModalOpen(true)}
          className="w-16 h-16 bg-emerald-500 dark:bg-[#d6ff3e] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(16,185,129,0.4)] group relative"
        >
          <Sparkles size={28} className="text-white dark:text-[#1c1c1c] group-hover:animate-pulse" />
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 bg-[#afa3ff] text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
            {t('nutrition.aiQuickLog')}
          </div>
        </motion.button>
      </div>

      <AILogModal 
        isOpen={isLogModalOpen} 
        onClose={() => setIsLogModalOpen(false)}
        onSuccess={() => {}}
      />

      <BarcodeScannerModal
        isOpen={isBarcodeOpen}
        onClose={() => setIsBarcodeOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default Nutrition;
