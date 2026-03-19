import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Search, Bell, User, Clock, Flame, 
  Home, BookOpen, Headphones, ChevronLeft, Apple, Circle
} from 'lucide-react';

// ─────────────────────────────────────────────
// Data (Matching UI Kit)
// ─────────────────────────────────────────────
const breakfastRecipes = [
  { id: 1, name: 'Delights With Greek Yogurt', time: '6 Minutes', kcal: '200 Cal', icon: '🥣' },
  { id: 2, name: 'Spinach And Tomato Omelette', time: '10 Minutes', kcal: '220 Cal', icon: '🍳' },
  { id: 3, name: 'Avocado And Egg Toast', time: '15 Minutes', kcal: '150 Cal', icon: '🥑' },
  { id: 4, name: 'Protein Shake With Fruits', time: '9 Minutes', kcal: '180 Cal', icon: '🥤' },
];

const MealPlanList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number>(3); // Matches mockup selection

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-24">
      
      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)}
              className="text-[#d6ff3e] hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-extrabold text-[#afa3ff]">Meal Plans</h1>
          </div>
          <div className="flex gap-4">
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><Search size={22} /></button>
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><Bell size={22} /></button>
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><User size={22} /></button>
          </div>
        </div>

        <div className="mb-8">
            <h2 className="text-[#d6ff3e] text-2xl font-extrabold mb-1">Breakfast Plan For You</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
            </p>
        </div>
      </div>

      {/* ── Content (Selectable List) ── */}
      <div className="flex-grow px-6 overflow-y-auto space-y-4">
        {breakfastRecipes.map((recipe, index) => (
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
                <div className={`w-6 h-6 rounded-full border-2 transition-colors flex items-center justify-center ${
                    selectedId === recipe.id ? 'border-[#afa3ff]' : 'border-zinc-700'
                }`}>
                    {selectedId === recipe.id && (
                        <div className="w-3 h-3 bg-[#d6ff3e] rounded-full shadow-[0_0_8px_rgba(214,255,62,0.6)]" />
                    )}
                </div>
            </div>

            {/* Recipe Card */}
            <div className={`flex-1 flex bg-white rounded-3xl overflow-hidden h-[120px] shadow-lg transition-transform ${selectedId === recipe.id ? 'scale-[1.02]' : 'opacity-80'}`}>
                <div className="flex-1 p-5 flex flex-col justify-center">
                    <h3 className="text-[#1c1c1c] font-bold text-base leading-tight mb-2">
                        {recipe.name}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-zinc-500">
                        <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#1c1c1c]"/>{recipe.time}</span>
                        <span className="flex items-center gap-1.5"><Flame size={12} className="text-[#1c1c1c]"/>{recipe.kcal}</span>
                    </div>
                </div>
                {/* Image side */}
                <div className="w-2/5 bg-zinc-200 relative flex items-center justify-center">
                    <span className="text-5xl opacity-40">{recipe.icon}</span>
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Action Button ── */}
      <div className="px-6 py-6 pb-28">
          <button 
            onClick={() => navigate('/recipe', { state: { recipeId: selectedId } })}
            className="w-full bg-[#d6ff3e] text-[#1c1c1c] font-black py-4 rounded-full text-lg shadow-[0_0_20px_rgba(214,255,62,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
          >
            See Recipe
          </button>
      </div>

      {/* ── Fixed Bottom Navigation ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 flex items-center justify-around z-50">
        {[
          { icon: Home, label: 'Home', active: false, path: '/home' },
          { icon: BookOpen, label: 'Workouts', active: false, path: '/workouts' },
          { icon: Apple, label: 'Nutrition', active: true, path: '/nutrition' },
          { icon: Headphones, label: 'Support', active: false, path: '/support' },
        ].map(({ icon: Icon, label, active, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 ${active ? 'text-[#afa3ff]' : 'text-zinc-500 hover:text-white'} transition-colors`}
          >
            <Icon size={24} strokeWidth={active ? 2.5 : 1.5} />
            <span className="text-[10px] font-bold">{label}</span>
          </button>
        ))}
      </div>

    </div>
  );
};

export default MealPlanList;
