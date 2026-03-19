import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, User, Star, Play, Clock, Flame, 
  Home, BookOpen, Headphones, ChevronLeft
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useLanguage } from '../contexts/LanguageContext';
import TopHeader from '../components/TopHeader';

// ─────────────────────────────────────────────
// Data (Matching UI Kit)
// ─────────────────────────────────────────────

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

const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const categories = [
    { id: 'Beginner', label: t('workouts.beginner') },
    { id: 'Intermediate', label: t('workouts.intermediate') },
    { id: 'Advanced', label: t('workouts.advanced') }
  ];
  
  const [activeCategory, setActiveCategory] = useState('Beginner');
  
  const workoutsData: Record<string, WorkoutItem[]> = {
    Beginner: [
      { id: 1, title: t('workouts.functional'), duration: '45 Minutes', kcal: '1450 Kcal', exercises: '5 Exercises', tag: t('workouts.trainingDay'), isFavorite: true, height: 'h-48', image: '/assets/functional.png' },
      { id: 2, title: t('workouts.upperBody'), duration: '60 Minutes', kcal: '1320 Kcal', exercises: '5 Exercises', tag: '', isFavorite: true, height: 'h-32', image: '/assets/upperbody.png' },
      { id: 3, title: t('workouts.fullStretching'), duration: '45 Minutes', kcal: '1450 Kcal', exercises: '5 Exercises', tag: '', isFavorite: true, height: 'h-32', image: '/assets/stretching.png' },
      { id: 4, title: t('workouts.glutesAbs'), duration: '45 Minutes', kcal: '1200 Kcal', exercises: '4 Exercises', tag: '', isFavorite: true, height: 'h-32', image: '/assets/squat.png' },
    ],
    Intermediate: [
      { id: 5, title: t('workouts.coreStrength'), duration: '50 Minutes', kcal: '1600 Kcal', exercises: '6 Exercises', tag: '', isFavorite: false, height: 'h-48', image: '/assets/plank.png' }
    ],
    Advanced: [
      { id: 6, title: t('workouts.hiitExtreme'), duration: '30 Minutes', kcal: '2000 Kcal', exercises: '8 Exercises', tag: '', isFavorite: false, height: 'h-48', image: '/assets/cycling.png' }
    ]
  };

  const [favorites, setFavorites] = useState<number[]>([1, 2, 3, 4]); // Pre-fill with existing ones

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const currentWorkouts = workoutsData[activeCategory] || [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col pb-24 transition-colors duration-300">
      
      {/* ── Header ── */}
      <TopHeader title={t('workouts.title')} className="bg-white dark:bg-zinc-900 rounded-b-[2rem] shadow-lg sticky top-0 z-30" />

      <div className="px-6 pt-4">
        {/* ── Category Tabs ── */}
        <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-full overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-1 py-3 px-4 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat.id 
                  ? 'bg-emerald-500 text-white dark:bg-[#d6ff3e] dark:text-[#1c1c1c] shadow-lg' 
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-grow px-6 pt-6 overflow-y-auto">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#10b981] dark:text-[#d6ff3e]">
              {t('workouts.letsGo', { level: categories.find(c => c.id === activeCategory)?.label || activeCategory })}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">{t('workouts.exploreStyles')}</p>
          </div>
          <button 
            onClick={() => navigate('/create-routine')}
            className="text-xs bg-[#afa3ff] text-[#1c1c1c] font-bold px-3 py-1.5 rounded-full hover:bg-emerald-500 hover:text-white transition-colors"
          >
            {t('workouts.createCustom')}
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
                className={`relative bg-white dark:bg-zinc-800 rounded-3xl overflow-hidden cursor-pointer group shadow-sm border border-zinc-100 dark:border-none ${workout.height}`}
                onClick={() => navigate('/routine')}
              >
                {/* Visual Placeholder for Image */}
                <div className="absolute top-0 bottom-0 right-0 w-1/2 overflow-hidden flex items-center justify-center">
                   <img src={workout.image} className="w-full h-full object-cover opacity-60 dark:opacity-60 group-hover:scale-110 transition-transform duration-500" alt={workout.title} />
                </div>
                
                {/* Gradient for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-zinc-800 dark:via-zinc-800/90 dark:to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-5 flex flex-col justify-end h-full">
                  {workout.tag && (
                    <span className="absolute top-0 right-0 bg-emerald-500 dark:bg-[#d6ff3e] text-white dark:text-[#1c1c1c] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-lg">
                      {workout.tag}
                    </span>
                  )}

                  <button 
                    onClick={(e) => toggleFavorite(e, workout.id)}
                    className={`absolute top-4 right-4 ${favorites.includes(workout.id) ? 'text-yellow-500' : 'text-zinc-300 dark:text-zinc-500'}`}
                  >
                    <Star size={20} fill={favorites.includes(workout.id) ? 'currentColor' : 'none'} />
                  </button>

                  <h3 className={`font-extrabold text-zinc-900 dark:text-white mb-2 ${workout.height === 'h-48' ? 'text-2xl w-2/3' : 'text-xl max-w-[60%]'}`}>
                    {workout.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-emerald-500 dark:text-[#afa3ff]"/>{workout.duration}</span>
                    <span className="flex items-center gap-1.5"><Flame size={12} className="text-emerald-500 dark:text-[#afa3ff]"/>{workout.kcal}</span>
                    <span className="flex items-center gap-1.5"><Play size={12} className="text-emerald-500 dark:text-[#afa3ff]"/>{workout.exercises}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      <BottomNav />

    </div>
  );
};

export default Workouts;
