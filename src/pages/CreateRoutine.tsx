import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, User, Star, Clock, Flame, 
  Home, BookOpen, Headphones, ChevronLeft, Plus, Check, X,
  Dumbbell, Target, Info
} from 'lucide-react';

// ─────────────────────────────────────────────
// Data (Elaborated with Images and Details)
// ─────────────────────────────────────────────
const defaultExercises = [
  { 
    id: 1, 
    name: 'Barbell Rows', 
    time: '10 Minutes', 
    reps: '12 Reps x 3', 
    isFavorite: true, 
    selected: true,
    image: '/barbell_rows_exercise_1773998985863.png',
    muscleGroup: 'Leđa (Back)',
    description: 'Veslanje u pretklonu je ključna vežba za razvoj širine i debljine leđa. Fokus je na latisimuse, trapeze i romboide.',
  },
  { 
    id: 2, 
    name: 'Hammer Curls', 
    time: '15 Minutes', 
    reps: '10 Reps x 4', 
    isFavorite: true, 
    selected: true,
    image: '/hammer_curls_exercise_1773998998777.png',
    muscleGroup: 'Biceps & Brachialis',
    description: 'Hammer pregib pogađa biceps ali i brachialis, što doprinosi debljini nadlaktice i snazi hvata.',
  },
  { 
    id: 3, 
    name: 'Leg Press', 
    time: '15 Minutes', 
    reps: '12 Reps x 4', 
    isFavorite: true, 
    selected: true,
    image: '/leg_press_exercise_1773999018352.png',
    muscleGroup: 'Kvadriceps & Gluteus',
    description: 'Nožni potisak omogućava rad sa velikim težinama uz stabilizaciju leđa. Idealno za izolaciju donjeg dela tela.',
  },
  { 
    id: 4, 
    name: 'Plank', 
    time: '10 Minutes', 
    reps: '45 Sec x 3', 
    isFavorite: true, 
    selected: false,
    image: '/plank_exercise_1773999043205.png',
    muscleGroup: 'Core (Jezgro)',
    description: 'Izdržaj u visu na podlakticama je najbolja vežba za statičku stabilnost celog trupa i donjeg dela leđa.',
  },
  { 
    id: 5, 
    name: 'Cable Chest Press', 
    time: '10 Minutes', 
    reps: '12 Reps x 3', 
    isFavorite: true, 
    selected: false,
    image: '/cable_chest_press_exercise_1773999141699.png',
    muscleGroup: 'Grudi (Chest)',
    description: 'Potisak na sajlama pruža konstantnu tenziju tokom celog pokreta, što je odlično za hipertrofiju grudnih mišića.',
  },
  { 
    id: 6, 
    name: 'Tricep Dips', 
    time: '15 Minutes', 
    reps: '10 Reps x 4', 
    isFavorite: true, 
    selected: true,
    image: '/tricep_dips_exercise_1773999075856.png',
    muscleGroup: 'Triceps',
    description: 'Propadanja na klupi ili razboju su jedna od najefikasnijih vežbi za razvoj jačine i volumena tricepsa.',
  },
  { 
    id: 7, 
    name: 'Push-Ups', 
    time: '10 Minutes', 
    reps: '15 Reps x 3', 
    isFavorite: true, 
    selected: false,
    image: '/push_ups_exercise_1773999058926.png',
    muscleGroup: 'Grudi & Triceps',
    description: 'Klasični sklekovi su osnova bodyweight treninga. Pogađaju grudi, ramena i tricepse uz aktivaciju jezgra.',
  },
  { 
    id: 8, 
    name: 'TRX Suspension', 
    time: '10 Minutes', 
    reps: '12 Reps x 3', 
    isFavorite: true, 
    selected: false,
    image: '/trx_suspension_exercise_1773999159930.png',
    muscleGroup: 'Full Body (Celokupno)',
    description: 'Vežbanje na TRX trakama zahteva maksimalnu stabilizaciju i kontrolu tela, aktivirajući mišiće za koje niste znali da postoje.',
  },
];

const CreateRoutine: React.FC = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState(defaultExercises);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const toggleSelection = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent opening details when clicking toggle
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, selected: !ex.selected } : ex
    ));
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-24 transition-colors duration-300">
      
      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)}
              className="text-[#d6ff3e] hover:text-white transition-colors bg-white/5 p-2 rounded-xl"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-black text-[#afa3ff] uppercase tracking-tighter italic">Create Routine</h1>
          </div>
          <div className="flex gap-4">
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><Search size={22} /></button>
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><Bell size={22} /></button>
            <button 
                onClick={() => navigate('/profile')}
                className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"
            >
                <User size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content (Grid) ── */}
      <div className="flex-grow px-6 pt-2 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-2 gap-4">
          {exercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedExercise(exercise)}
              className="bg-[#242424] rounded-3xl overflow-hidden shadow-2xl border border-white/5 flex flex-col relative group cursor-pointer active:scale-95 transition-all"
            >
              {/* Image Section */}
              <div className="h-32 bg-[#1c1c1c] relative overflow-hidden flex items-center justify-center">
                 <img 
                    src={exercise.image} 
                    alt={exercise.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#242424] to-transparent opacity-60" />
                 
                 {/* Favorite Star */}
                 <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                    <Star size={10} className="text-[#d6ff3e]" fill="#d6ff3e" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/70">Top</span>
                 </div>
              </div>

              {/* Toggle Button */}
              <button 
                onClick={(e) => toggleSelection(e, exercise.id)}
                className={`absolute right-3 top-[104px] w-9 h-9 rounded-2xl flex items-center justify-center z-10 shadow-2xl transform transition-all group-hover:rotate-12 ${
                  exercise.selected ? 'bg-[#d6ff3e] text-[#1c1c1c]' : 'bg-[#afa3ff] text-white'
                }`}
              >
                {exercise.selected ? <Check size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={3} />}
              </button>

              {/* Card Footer Details */}
              <div className="p-4 pt-5">
                <h3 className="text-white font-black text-xs mb-2 leading-tight uppercase tracking-tight line-clamp-1">{exercise.name}</h3>
                <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500">
                  <span className="flex items-center gap-1"><Clock size={12} className="text-[#afa3ff]"/>{exercise.time}</span>
                  <span className="flex items-center gap-1"><Flame size={12} className="text-[#d6ff3e]"/>{exercise.reps}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Exercise Detail Modal ── */}
      <AnimatePresence>
        {selectedExercise && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExercise(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-lg bg-[#242424] rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-t border-white/10"
            >
              {/* Detail Image */}
              <div className="h-64 relative">
                <img 
                    src={selectedExercise.image} 
                    alt={selectedExercise.name} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#242424] via-transparent to-transparent" />
                <button 
                    onClick={() => setSelectedExercise(null)}
                    className="absolute top-6 right-6 p-2 bg-black/50 backdrop-blur-md rounded-2xl text-white/50 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>
              </div>

              {/* Detail Info */}
              <div className="px-8 pb-10 -mt-8 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-[#d6ff3e] text-[#1c1c1c] text-[10px] font-black uppercase tracking-widest rounded-md">
                        {selectedExercise.muscleGroup}
                    </span>
                </div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">
                    {selectedExercise.name}
                </h2>

                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                        { icon: Clock, label: 'Vreme', value: selectedExercise.time, color: '#afa3ff' },
                        { icon: Target, label: 'Serije', value: selectedExercise.reps, color: '#d6ff3e' },
                        { icon: Dumbbell, label: 'Nivo', value: 'Srednji', color: '#60a5fa' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-[#1c1c1c] p-3 rounded-2xl border border-white/5">
                            <stat.icon size={16} style={{ color: stat.color }} className="mb-1" />
                            <p className="text-[10px] text-zinc-500 font-bold uppercase">{stat.label}</p>
                            <p className="text-xs font-black text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="space-y-4 mb-10">
                    <div className="flex items-start gap-4">
                        <div className="mt-1 p-2 bg-[#afa3ff]/10 rounded-xl text-[#afa3ff]">
                            <Info size={18} />
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-[#afa3ff] uppercase tracking-widest mb-1">Opis Vežbe</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                                {selectedExercise.description}
                            </p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => {
                        setExercises(exercises.map(ex => 
                            ex.id === selectedExercise.id ? { ...ex, selected: true } : ex
                        ));
                        setSelectedExercise(null);
                    }}
                    className="w-full py-4 bg-[#d6ff3e] text-[#1c1c1c] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#d6ff3e]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    <Plus size={20} strokeWidth={3} />
                    Dodaj u rutinu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Fixed Bottom Navigation ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#afa3ff] px-6 py-4 flex items-center justify-around z-50 rounded-t-3xl shadow-[0_-4px_30px_rgba(0,0,0,0.3)]">
        {[
          { icon: Home, label: 'Home', active: false, path: '/home' },
          { icon: BookOpen, label: 'Workouts', active: true, path: '/workouts' },
          { icon: Star, label: 'Favorites', active: false, path: '/favorites' },
          { icon: Headphones, label: 'Support', active: false, path: '/help' },
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
