import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, User, Star, Play, Clock, Flame, 
  Home, BookOpen, Headphones, ChevronLeft
} from 'lucide-react';

// ─────────────────────────────────────────────
// Data (Matching UI Kit)
// ─────────────────────────────────────────────
const categories = ['Beginner', 'Intermediate', 'Advanced'];

interface WorkoutItem {
  id: number;
  title: string;
  duration: string;
  kcal: string;
  exercises: string;
  tag: string;
  isFavorite: boolean;
  height: string;
  image?: string;
}

const workoutsData: Record<string, WorkoutItem[]> = {
  Beginner: [
    { id: 1, title: 'Functional Training', duration: '45 Minutes', kcal: '1450 Kcal', exercises: '5 Exercises', tag: 'Training Of The Day', isFavorite: true, height: 'h-48', image: '/assets/functional.png' },
    { id: 2, title: 'Upper Body', duration: '60 Minutes', kcal: '1320 Kcal', exercises: '5 Exercises', tag: '', isFavorite: true, height: 'h-32', image: '/assets/upperbody.png' },
    { id: 3, title: 'Full Body Stretching', duration: '45 Minutes', kcal: '1450 Kcal', exercises: '5 Exercises', tag: '', isFavorite: true, height: 'h-32', image: '/assets/stretching.png' },
    { id: 4, title: 'Glutes & Abs', duration: '45 Minutes', kcal: '1200 Kcal', exercises: '4 Exercises', tag: '', isFavorite: true, height: 'h-32', image: '/assets/squat.png' },
  ],
  Intermediate: [
    { id: 5, title: 'Core Strength', duration: '50 Minutes', kcal: '1600 Kcal', exercises: '6 Exercises', tag: 'Recommended', isFavorite: false, height: 'h-48' }
  ],
  Advanced: [
    { id: 6, title: 'HIIT Extreme', duration: '30 Minutes', kcal: '2000 Kcal', exercises: '8 Exercises', tag: 'Intense', isFavorite: false, height: 'h-48' }
  ]
};

const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Beginner');
  
  const currentWorkouts = workoutsData[activeCategory as keyof typeof workoutsData] || [];

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-24">
      
      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-4 bg-zinc-900 rounded-b-[2rem] shadow-lg relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/home')}
              className="text-[#d6ff3e] hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-extrabold text-[#afa3ff]">Workout</h1>
          </div>
          <div className="flex gap-4">
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><Search size={22} /></button>
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><Bell size={22} /></button>
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><User size={22} /></button>
          </div>
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex gap-2 bg-[#1c1c1c] p-1.5 rounded-full overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 py-3 px-4 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-[#d6ff3e] text-[#1c1c1c] shadow-[0_0_15px_rgba(214,255,62,0.3)]' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-grow px-6 pt-6 overflow-y-auto">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#d6ff3e]">Let's Go {activeCategory}</h2>
            <p className="text-zinc-400 text-sm">Explore Different Workout Styles</p>
          </div>
          <button 
            onClick={() => navigate('/create-routine')}
            className="text-xs bg-[#afa3ff] text-[#1c1c1c] font-bold px-3 py-1.5 rounded-full hover:bg-white transition-colors"
          >
            + Create Custom
          </button>
        </div>

        <AnimatePresence mode="popLayout">
          <div className="flex flex-col gap-4">
            {currentWorkouts.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`relative bg-zinc-800 rounded-3xl overflow-hidden cursor-pointer group ${workout.height}`}
                onClick={() => navigate('/routine')}
              >
                {/* Visual Placeholder for Image */}
                <div className="absolute top-0 bottom-0 right-0 w-1/2 overflow-hidden flex items-center justify-center">
                   <img src={workout.image} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" alt={workout.title} />
                </div>
                
                {/* Gradient for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-800/90 to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-5 flex flex-col justify-end h-full">
                  {workout.tag && (
                    <span className="absolute top-0 right-0 bg-[#d6ff3e] text-[#1c1c1c] text-xs font-bold px-3 py-1 rounded-bl-xl">
                      {workout.tag}
                    </span>
                  )}

                  <button className={`absolute top-4 ${workout.height === 'h-48' ? 'right-4' : 'right-4'} ${workout.isFavorite ? 'text-yellow-400' : 'text-zinc-400'}`}>
                    <Star size={20} fill={workout.isFavorite ? 'currentColor' : 'none'} />
                  </button>

                  <h3 className={`font-extrabold text-white mb-2 ${workout.height === 'h-48' ? 'text-2xl w-2/3' : 'text-xl max-w-[60%]'}`}>
                    {workout.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-zinc-400">
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#afa3ff]"/>{workout.duration}</span>
                    <span className="flex items-center gap-1.5"><Flame size={12} className="text-[#afa3ff]"/>{workout.kcal}</span>
                    <span className="flex items-center gap-1.5"><Play size={12} className="text-[#afa3ff]"/>{workout.exercises}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* ── Fixed Bottom Navigation ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 flex items-center justify-around z-50">
        {[
          { icon: Home, label: 'Home', active: false, path: '/home' },
          { icon: BookOpen, label: 'Workouts', active: true, path: '/workouts' },
          { icon: Star, label: 'Favorites', active: false, path: '/favorites' },
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

export default Workouts;
