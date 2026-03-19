import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Heart, Clock, Flame, Play, Star, Dumbbell } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useLanguage } from '../contexts/LanguageContext';

interface WorkoutItem {
  id: number;
  title: string;
  duration: string;
  kcal: string;
  exercises: string;
  tag: string;
  image?: string;
  category: string;
}

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // These mirror the workouts marked as favorite in Workouts.tsx
  // In the future this can be driven by Firestore user.favoriteWorkouts[]
  const favoriteWorkouts: WorkoutItem[] = [
    {
      id: 1,
      title: t('workouts.functional'),
      duration: '45 Minutes',
      kcal: '1,450 Kcal',
      exercises: '5 Exercises',
      tag: t('workouts.trainingDay'),
      image: '/assets/functional.png',
      category: t('workouts.beginner'),
    },
    {
      id: 2,
      title: t('workouts.upperBody'),
      duration: '60 Minutes',
      kcal: '1,320 Kcal',
      exercises: '5 Exercises',
      tag: '',
      image: '/assets/upperbody.png',
      category: t('workouts.beginner'),
    },
    {
      id: 3,
      title: t('workouts.fullStretching'),
      duration: '45 Minutes',
      kcal: '1,450 Kcal',
      exercises: '5 Exercises',
      tag: '',
      image: '/assets/stretching.png',
      category: t('workouts.beginner'),
    },
    {
      id: 4,
      title: t('workouts.glutesAbs'),
      duration: '45 Minutes',
      kcal: '1,200 Kcal',
      exercises: '4 Exercises',
      tag: '',
      image: '/assets/squat.png',
      category: t('workouts.beginner'),
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col pb-24 transition-colors duration-300">

      {/* ── Header ── */}
      <div className="bg-[#afa3ff] pt-12 pb-8 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-20%] right-[-10%] w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-5%] w-40 h-40 bg-[#d6ff3e]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-[#1c1c1c] bg-white/30 backdrop-blur-md p-2.5 rounded-2xl hover:bg-white/40 transition-all"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-xl font-black text-[#1c1c1c] uppercase tracking-widest">
            {t('profile.favorite')}
          </h1>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center shadow-lg">
            <Heart size={26} className="text-[#1c1c1c]" fill="currentColor" />
          </div>
          <div>
            <p className="text-3xl font-black text-[#1c1c1c]">{favoriteWorkouts.length}</p>
            <p className="text-[#1c1c1c]/60 text-sm font-medium">saved workouts</p>
          </div>
        </div>
      </div>

      {/* ── List ── */}
      <div className="flex-grow px-6 pt-8 space-y-4">
        {favoriteWorkouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-4 text-center">
            <div className="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <Dumbbell size={34} className="text-zinc-400" />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold">No favorites yet</p>
            <p className="text-zinc-400 dark:text-zinc-500 text-sm">
              Tap the ⭐ on any workout to save it here.
            </p>
            <button
              onClick={() => navigate('/workouts')}
              className="mt-2 px-6 py-3 bg-[#afa3ff] text-[#1c1c1c] font-black rounded-2xl text-sm uppercase tracking-wider"
            >
              Browse Workouts
            </button>
          </div>
        ) : (
          favoriteWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => navigate('/routine')}
              className="relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden cursor-pointer group shadow-sm border border-zinc-100 dark:border-zinc-800 h-28 flex items-stretch"
            >
              {/* Image */}
              <div className="absolute top-0 right-0 bottom-0 w-2/5 overflow-hidden">
                {workout.image && (
                  <img
                    src={workout.image}
                    alt={workout.title}
                    className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500"
                  />
                )}
              </div>
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent dark:from-zinc-900 dark:via-zinc-900/95 dark:to-transparent" />

              {/* Content */}
              <div className="relative z-10 p-5 flex flex-col justify-center gap-1.5 flex-1">
                {workout.tag && (
                  <span className="inline-block bg-emerald-500 dark:bg-[#d6ff3e] text-white dark:text-[#1c1c1c] text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full w-fit">
                    {workout.tag}
                  </span>
                )}
                <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white leading-tight">
                  {workout.title}
                </h3>
                <div className="flex items-center gap-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1"><Clock size={11} className="text-[#afa3ff]" />{workout.duration}</span>
                  <span className="flex items-center gap-1"><Flame size={11} className="text-[#afa3ff]" />{workout.kcal}</span>
                  <span className="flex items-center gap-1"><Play size={11} className="text-[#afa3ff]" />{workout.exercises}</span>
                </div>
              </div>

              {/* Heart badge */}
              <div className="absolute top-3 right-3 z-10">
                <Star size={18} className="text-yellow-500" fill="currentColor" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Favorites;
