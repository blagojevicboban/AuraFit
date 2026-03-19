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
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  React.useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setIsLoading(true);
        const q = query(collection(db, 'workouts'), where('level', '==', activeCategory));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({
          id: doc.id as any,
          ...doc.data()
        })) as any[];
        setWorkouts(items);
      } catch (e) {
        console.error("Error fetching workouts:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkouts();
  }, [activeCategory]);

  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const currentWorkouts = workouts.filter(w => 
    w.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col pb-24 transition-colors duration-300">
      
      {/* ── Header ── */}
      <TopHeader 
        title={t('workouts.title')} 
        onSearch={() => setIsSearchOpen(!isSearchOpen)}
        className="bg-white dark:bg-zinc-900 rounded-b-[2rem] shadow-lg sticky top-0 z-30" 
      />

      {/* ── Search Overlay ── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-4 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-white/5 overflow-hidden transition-colors"
          >
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search') + "..."}
                className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-10 py-4 text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-[#d6ff3e]/20 transition-all font-semibold"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-emerald-500 dark:text-[#d6ff3e]" size={40} />
              <p className="text-zinc-500 font-bold">{t('common.loading') || 'Loading Workouts...'}</p>
            </div>
          ) : currentWorkouts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-500">{t('common.noResults') || 'No workouts found for this level.'}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {currentWorkouts.map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`relative bg-white dark:bg-zinc-800 rounded-3xl overflow-hidden cursor-pointer group shadow-sm border border-zinc-100 dark:border-none ${workout.height || 'h-40'}`}
                  onClick={() => navigate('/routine')}
                >
                  <div className="absolute top-0 bottom-0 right-0 w-1/2 overflow-hidden flex items-center justify-center">
                     <img src={workout.image || '/assets/functional.png'} className="w-full h-full object-cover opacity-60 dark:opacity-60 group-hover:scale-110 transition-transform duration-500" alt={workout.title} />
                  </div>
                  
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
          )}
        </AnimatePresence>
      </div>

      <BottomNav />

    </div>
  );
};

export default Workouts;
