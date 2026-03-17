import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Search, Bell, User, Star, Clock, Flame, 
  Home, BookOpen, Headphones, ChevronLeft, Plus, Check
} from 'lucide-react';

// ─────────────────────────────────────────────
// Data (Matching UI Kit)
// ─────────────────────────────────────────────
const defaultExercises = [
  { id: 1, name: 'Barbell Rows', time: '10 Minutes', reps: '3 Rep', isFavorite: true, selected: true },
  { id: 2, name: 'Hammer Curls', time: '15 Minutes', reps: '4 Rep', isFavorite: true, selected: true },
  { id: 3, name: 'Leg Press', time: '15 Minutes', reps: '4 Rep', isFavorite: true, selected: true },
  { id: 4, name: 'Plank', time: '10 Minutes', reps: '3 Rep', isFavorite: true, selected: false },
  { id: 5, name: 'Cable Chest Press', time: '10 Minutes', reps: '3 Rep', isFavorite: true, selected: false },
  { id: 6, name: 'Tricep Dips', time: '15 Minutes', reps: '4 Rep', isFavorite: true, selected: true },
  { id: 7, name: 'Push-Ups', time: '10 Minutes', reps: '3 Rep', isFavorite: true, selected: false },
  { id: 8, name: 'TRX Suspension', time: '10 Minutes', reps: '3 Rep', isFavorite: true, selected: false },
];

const CreateRoutine: React.FC = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState(defaultExercises);

  const toggleSelection = (id: number) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, selected: !ex.selected } : ex
    ));
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-24">
      
      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)}
              className="text-[#d6ff3e] hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-extrabold text-[#afa3ff]">Create Your Routine</h1>
          </div>
          <div className="flex gap-4">
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><Search size={22} /></button>
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><Bell size={22} /></button>
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><User size={22} /></button>
          </div>
        </div>
      </div>

      {/* ── Content (Grid) ── */}
      <div className="flex-grow px-6 pt-2 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {exercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#242424] rounded-2xl overflow-hidden shadow-lg border border-zinc-800/50 flex flex-col relative"
            >
              {/* Image Placeholder */}
              <div className="h-28 bg-zinc-700 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                 <span className="text-4xl opacity-20">🏋️</span>
                 
                 {/* Favorite Star */}
                 {exercise.isFavorite && (
                   <button className="absolute top-2 right-2 text-[#d6ff3e]">
                     <Star size={16} fill="currentColor" />
                   </button>
                 )}
              </div>

              {/* Toggle Button Overlapping Image & Content */}
              <button 
                onClick={() => toggleSelection(exercise.id)}
                className={`absolute right-3 top-[88px] w-8 h-8 rounded-full flex items-center justify-center z-10 shadow-md transform transition-transform hover:scale-110 ${
                  exercise.selected ? 'bg-[#d6ff3e] text-[#1c1c1c]' : 'bg-[#afa3ff] text-white'
                }`}
              >
                {exercise.selected ? <Check size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
              </button>

              {/* Card Footer Details */}
              <div className="p-3 pt-4 flex-grow flex flex-col justify-end">
                <h3 className="text-[#d6ff3e] font-semibold text-sm mb-1.5 leading-tight">{exercise.name}</h3>
                <div className="flex items-center justify-between text-[10px] font-medium text-zinc-400">
                  <span className="flex items-center gap-1"><Clock size={10} className="text-[#afa3ff]"/>{exercise.time}</span>
                  <span className="flex items-center gap-1"><Flame size={10} className="text-[#afa3ff]"/>{exercise.reps}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Fixed Bottom Navigation ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#afa3ff] px-6 py-4 flex items-center justify-around z-50 rounded-t-3xl shadow-[0_-4px_30px_rgba(0,0,0,0.3)]">
        {[
          { icon: Home, label: 'Home', active: false, path: '/home' },
          { icon: BookOpen, label: 'Workouts', active: true, path: '/workouts' },
          { icon: Star, label: 'Favorites', active: false, path: '/favorites' },
          { icon: Headphones, label: 'Support', active: false, path: '/support' },
        ].map(({ icon: Icon, label, active, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 ${active ? 'text-white' : 'text-[#1c1c1c]/50 hover:text-white'} transition-colors`}
          >
            <Icon size={24} strokeWidth={active ? 2.5 : 1.5} />
            <span className="text-[10px] font-bold">{label}</span>
          </button>
        ))}
      </div>

    </div>
  );
};

export default CreateRoutine;
