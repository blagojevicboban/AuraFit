import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, User, Star, Clock, Flame, Play,
  Home, BookOpen, Headphones, ChevronLeft, Apple
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

// ─────────────────────────────────────────────
// Data (Matching UI Kit)
// ─────────────────────────────────────────────
const recommendedRecipes = [
  { id: 1, title: 'Fruit Smoothie', time: '12 Minutes', kcal: '120 Cal', isFavorite: true, image: '/assets/breakfast.png' },
  { id: 2, title: 'Salads With Quinoa', time: '12 Minutes', kcal: '120 Cal', isFavorite: true, image: '/assets/nutrition-hero.png' },
];

const recipesForYou = [
  { id: 3, title: 'Delights With\nGreek Yogurt', time: '6 Minutes', kcal: '200 Cal', isFavorite: true, image: '/assets/breakfast.png' },
  { id: 4, title: 'Baked Salmon', time: '30 Minutes', kcal: '350 Cal', isFavorite: true, image: '/assets/nutrition-hero.png' },
];

const mealIdeas = [
  { id: 5, title: 'Avocado Toast', image: '/assets/breakfast.png', tags: ['Breakfast', 'Vegan'] },
  { id: 6, title: 'Protein Bowl', image: '/assets/stretching.png', tags: ['Lunch', 'High Protein'] },
  { id: 7, title: 'Berry Smoothie', image: '/assets/cycling.png', tags: ['Snack', 'Low Cal'] },
  { id: 8, title: 'Grilled Chicken', image: '/assets/squat.png', tags: ['Dinner', 'Keto'] },
];

const Nutrition: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Meal Plans'); // Meal Plans or Meal Ideas

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-24">
      
      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/home')}
              className="text-[#d6ff3e] hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-extrabold text-[#afa3ff]">Nutrition</h1>
          </div>
          <div className="flex gap-4">
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><Search size={22} /></button>
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><Bell size={22} /></button>
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><User size={22} /></button>
          </div>
        </div>

        {/* ── Tabs (Meal Plans / Meal Ideas) ── */}
        <div className="flex bg-[#2d2d2d] rounded-full p-1 mb-6 relative">
          <motion.div 
             className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#d6ff3e] rounded-full z-0"
             animate={{ x: activeTab === 'Meal Plans' ? 0 : '100%' }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <button 
            onClick={() => setActiveTab('Meal Plans')}
            className={`flex-1 py-3 text-sm font-bold rounded-full z-10 transition-colors ${activeTab === 'Meal Plans' ? 'text-[#1c1c1c]' : 'text-zinc-400'}`}
          >
            Meal Plans
          </button>
          <button 
            onClick={() => setActiveTab('Meal Ideas')}
            className={`flex-1 py-3 text-sm font-bold rounded-full z-10 transition-colors ${activeTab === 'Meal Ideas' ? 'text-[#1c1c1c]' : 'text-zinc-400'}`}
          >
            Meal Ideas
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
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10 pointer-events-none" />
              {/* Visual Placeholder for Image */}
              <div className="h-44 bg-zinc-800 rounded-[22px] flex items-center justify-center overflow-hidden relative">
                <img 
                  src="/assets/nutrition-hero.png" 
                  alt="Recipe of the day" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute top-3 right-3 bg-[#d6ff3e] text-[#1c1c1c] text-xs font-bold px-3 py-1.5 rounded-full z-20">
                Recipe Of The Day
              </div>
              
              <button className="absolute bottom-4 right-4 text-white z-20">
                 <Star size={20} fill="currentColor" />
              </button>

              <div className="absolute bottom-4 left-4 right-12 z-20">
                <h3 className="text-[#d6ff3e] font-bold text-lg leading-tight mb-1 truncate">Carrot And Orange Smoothie</h3>
                <div className="flex items-center gap-4 text-[10px] font-medium text-zinc-200">
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-white"/>10 Minutes</span>
                  <span className="flex items-center gap-1.5"><Flame size={12} className="text-white"/>70 Cal</span>
                </div>
              </div>
            </div>
          </div>

          {activeTab === 'Meal Plans' && (
            <div className="flex-col pb-6">
              {/* ── Recommended (Horizontal Scroll) ── */}
              <div className="pl-6 mb-8">
                <h2 className="text-[#d6ff3e] text-xl font-extrabold mb-4">Recommended</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 pr-6 no-scrollbar">
                  {recommendedRecipes.map((recipe, i) => (
                    <motion.div 
                      key={recipe.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="min-w-[200px] bg-zinc-800 rounded-3xl overflow-hidden relative shadow-md flex-shrink-0 cursor-pointer"
                    >
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10" />
                       <div className="h-40 bg-zinc-700 flex items-center justify-center overflow-hidden">
                         <img src={recipe.image} className="w-full h-full object-cover opacity-80" alt={recipe.title} />
                       </div>
                       
                       <button className="absolute top-3 right-3 text-white z-20">
                         <Star size={16} fill="currentColor" />
                       </button>

                       <button className="absolute right-3 top-[100px] w-8 h-8 rounded-full bg-[#afa3ff] flex items-center justify-center z-20 shadow-lg">
                         <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                       </button>

                       <div className="absolute bottom-3 left-3 right-3 z-20">
                         <h3 className="text-[#d6ff3e] font-semibold text-sm mb-1.5 truncate">{recipe.title}</h3>
                         <div className="flex items-center gap-3 text-[10px] font-medium text-zinc-300">
                           <span className="flex items-center gap-1"><Clock size={10} className="text-[#afa3ff]"/>{recipe.time}</span>
                           <span className="flex items-center gap-1"><Flame size={10} className="text-[#afa3ff]"/>{recipe.kcal}</span>
                         </div>
                       </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ── Recipes For You (Vertical List) ── */}
              <div className="px-6">
                <h2 className="text-[#d6ff3e] text-xl font-extrabold mb-4">Recipes For You</h2>
                <div className="flex flex-col gap-4">
                  {recipesForYou.map((recipe, i) => (
                    <motion.div 
                      key={recipe.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      className="bg-white rounded-3xl overflow-hidden flex shadow-lg h-[120px] cursor-pointer"
                    >
                       {/* Text side */}
                       <div className="flex-1 p-5 flex flex-col justify-center">
                         <h3 className="text-[#1c1c1c] font-bold text-base leading-tight mb-2 whitespace-pre-line">
                           {recipe.title}
                         </h3>
                         <div className="flex items-center gap-4 text-xs font-bold text-zinc-500">
                           <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#1c1c1c]"/>{recipe.time}</span>
                           <span className="flex items-center gap-1.5"><Flame size={12} className="text-[#1c1c1c]"/>{recipe.kcal}</span>
                         </div>
                       </div>
                       {/* Image side */}
                       <div className="w-2/5 bg-zinc-800 relative flex items-center justify-center overflow-hidden">
                          <img src={recipe.image} className="w-full h-full object-cover opacity-60" alt={recipe.title} />
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
              <h2 className="text-[#d6ff3e] text-xl font-extrabold mb-4">Discover Ideas</h2>
              <div className="grid grid-cols-2 gap-4">
                {mealIdeas.map((idea, i) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="aspect-square bg-zinc-800 rounded-3xl relative overflow-hidden group cursor-pointer"
                  >
                    <img src={idea.image} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" alt={idea.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-xs mb-1">{idea.title}</p>
                      <div className="flex gap-1">
                        {idea.tags.map(tag => (
                          <span key={tag} className="text-[8px] bg-[#d6ff3e]/20 text-[#d6ff3e] px-1.5 py-0.5 rounded-full font-bold">
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

    </div>
  );
};

export default Nutrition;
