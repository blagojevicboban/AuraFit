import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Search, Bell, User, Star, Clock, Flame, 
  Home, BookOpen, Headphones, ChevronLeft, Play
} from 'lucide-react';

// ─────────────────────────────────────────────
// Data (Matching UI Kit)
// ─────────────────────────────────────────────
const routineData = {
  title: 'Functional Training',
  level: 'Beginner',
  duration: '45 Minutes',
  kcal: '1450 Kcal',
  rounds: [
    {
      title: 'Round 1',
      exercises: [
        { id: 1, name: 'Dumbbell Rows', time: '00:30', reps: 'Repetition 3x', color: 'bg-[#afa3ff]' },
        { id: 2, name: 'Russian Twists', time: '00:15', reps: 'Repetition 2x', color: 'bg-[#d6ff3e]' },
        { id: 3, name: 'Squats', time: '00:30', reps: 'Repetition 3x', color: 'bg-[#d6ff3e]' },
      ]
    },
    {
      title: 'Round 2',
      exercises: [
        { id: 4, name: 'Tabata Intervals', time: '00:10', reps: 'Repetition 2x', color: 'bg-[#afa3ff]' },
        { id: 5, name: 'Bicycle Crunches', time: '00:10', reps: 'Repetition 4x', color: 'bg-[#afa3ff]' },
      ]
    }
  ]
};

const RoutineDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-24">
      
      {/* ── Top App Bar ── */}
      <div className="px-6 pt-12 pb-4 bg-[#afa3ff] relative z-10 w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)}
              className="text-[#d6ff3e] hover:text-[#1c1c1c] transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-extrabold text-[#1c1c1c]">{routineData.level}</h1>
          </div>
          <div className="flex gap-4">
            <button className="text-[#1c1c1c] hover:text-[#d6ff3e] transition-colors"><Search size={22} /></button>
            <button className="text-[#1c1c1c] hover:text-[#d6ff3e] transition-colors"><Bell size={22} /></button>
            <button className="text-[#1c1c1c] hover:text-[#d6ff3e] transition-colors"><User size={22} /></button>
          </div>
        </div>

        {/* ── Routine Banner Card ── */}
        <div className="mt-4 relative bg-zinc-800 rounded-3xl overflow-hidden h-48 shadow-lg">
           <div className="absolute inset-0 bg-gradient-to-r from-zinc-700 to-zinc-900 flex items-center justify-center">
             <span className="text-6xl opacity-20">🏋️‍♀️</span>
           </div>
           
           {/* Tag */}
           <div className="absolute top-0 right-0 bg-[#d6ff3e] text-[#1c1c1c] text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
              {routineData.title}
           </div>

           {/* Gradient Overlay for bottom text */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

           {/* Footer Stats */}
           <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-medium text-zinc-300">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><Clock size={12} className="text-white"/>{routineData.duration}</span>
                <span className="flex items-center gap-1.5"><Flame size={12} className="text-white"/>{routineData.kcal}</span>
                <span className="flex items-center gap-1.5"><User size={12} className="text-white"/>{routineData.level}</span>
              </div>
              <button className="text-white">
                <Star size={18} fill="currentColor" />
              </button>
           </div>
        </div>
      </div>

      {/* ── Content (Rounds List) ── */}
      <div className="flex-grow px-6 pt-6 overflow-y-auto">
        {routineData.rounds.map((round, rIndex) => (
          <div key={rIndex} className="mb-8">
            <h2 className="text-2xl font-bold text-[#d6ff3e] mb-4">{round.title}</h2>
            
            <div className="flex flex-col gap-4">
              {round.exercises.map((exercise, eIndex) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (rIndex * 0.1) + (eIndex * 0.05) }}
                  // Interactive white pill card
                  className="bg-white rounded-[2rem] p-3 flex items-center justify-between shadow-md cursor-pointer hover:scale-[1.02] transition-transform"
                  onClick={() => navigate(`/workout-player/${routineData.title.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full ${exercise.color} flex items-center justify-center`}>
                       <Play size={24} className="text-white ml-1" fill="currentColor" />
                    </div>
                    <div>
                      <h3 className="text-[#1c1c1c] font-bold text-lg leading-tight">{exercise.name}</h3>
                      <div className="flex items-center gap-1 mt-1 text-zinc-500 text-xs font-bold">
                        <Clock size={12} className="text-[#afa3ff]" />
                        {exercise.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-[#afa3ff] font-bold text-sm pr-4">
                    {exercise.reps}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
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

export default RoutineDetail;
