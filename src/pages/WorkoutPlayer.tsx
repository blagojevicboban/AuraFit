import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Play, Pause, RotateCcw, 
  CheckCircle2, Plus, Trash2, Trophy, Clock, Flame, 
  ChevronRight, Dumbbell, Timer
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface SetRecord {
  id: string;
  weight: string;
  reps: string;
  completed: boolean;
}

interface Exercise {
  id: number;
  name: string;
  time: string;
  reps: string;
  color: string;
  sets: SetRecord[];
}

// Mock data based on RoutineDetail structure, normally this would come from a context or API
const routineData = {
  id: 'functional-training-1',
  title: 'Functional Training',
  level: 'Beginner',
  duration: '45 Minutes',
  kcal: '1450 Kcal',
  exercises: [
    { id: 1, name: 'Dumbbell Rows', time: '00:30', reps: '3x', color: 'bg-[#afa3ff]' },
    { id: 2, name: 'Russian Twists', time: '00:15', reps: '2x', color: 'bg-[#d6ff3e]' },
    { id: 3, name: 'Squats', time: '00:30', reps: '3x', color: 'bg-[#d6ff3e]' },
    { id: 4, name: 'Tabata Intervals', time: '00:10', reps: '2x', color: 'bg-[#afa3ff]' },
    { id: 5, name: 'Bicycle Crunches', time: '00:10', reps: '4x', color: 'bg-[#afa3ff]' },
  ]
};

const WorkoutPlayer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutItems, setWorkoutItems] = useState<Exercise[]>([]);
  const [sessionStartTime] = useState(Date.now());
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  
  // Initialize workout items from routineData
  useEffect(() => {
    const initialized = routineData.exercises.map(ex => ({
      ...ex,
      sets: [
        { id: '1', weight: '', reps: '', completed: false }
      ]
    }));
    setWorkoutItems(initialized);
  }, []);

  // Timer logic for Rest
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTime > 0) {
      interval = setInterval(() => setRestTime(prev => prev - 1), 1000);
    } else if (restTime === 0) {
      setIsResting(false);
      setRestTime(60);
    }
    return () => clearInterval(interval);
  }, [isResting, restTime]);

  const currentExercise = workoutItems[currentExerciseIndex];

  const handleAddSet = () => {
    if (!currentExercise) return;
    const newWorkoutItems = [...workoutItems];
    const exercise = newWorkoutItems[currentExerciseIndex];
    const lastSet = exercise.sets[exercise.sets.length - 1];
    
    exercise.sets.push({
      id: Date.now().toString(),
      weight: lastSet?.weight || '',
      reps: lastSet?.reps || '',
      completed: false
    });
    setWorkoutItems(newWorkoutItems);
  };

  const handleSetChange = (setId: string, field: 'weight' | 'reps', value: string) => {
    const newWorkoutItems = [...workoutItems];
    const exercise = newWorkoutItems[currentExerciseIndex];
    const set = exercise.sets.find(s => s.id === setId);
    if (set) {
      set[field] = value;
      setWorkoutItems(newWorkoutItems);
    }
  };

  const toggleSetComplete = (setId: string) => {
    const newWorkoutItems = [...workoutItems];
    const exercise = newWorkoutItems[currentExerciseIndex];
    const set = exercise.sets.find(s => s.id === setId);
    
    if (set) {
      const wasCompleted = set.completed;
      set.completed = !set.completed;
      setWorkoutItems(newWorkoutItems);
      
      if (!wasCompleted) {
        setIsResting(true);
        setRestTime(60);
      }
    }
  };

  const handleFinishWorkout = async () => {
    if (!currentUser) return;
    
    const durationMs = Date.now() - sessionStartTime;
    const totalVolume = workoutItems.reduce((acc, ex) => 
      acc + ex.sets.reduce((sAcc, s) => sAcc + (Number(s.weight) * Number(s.reps) || 0), 0)
    , 0);

    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'workout_logs'), {
        routineTitle: routineData.title,
        totalVolume,
        durationMinutes: Math.floor(durationMs / 60000),
        exercises: workoutItems,
        timestamp: serverTimestamp()
      });
      setIsFinished(true);
    } catch (err) {
      console.error('Error saving workout:', err);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col items-center justify-center p-8 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-[#d6ff3e] rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(214,255,62,0.4)]"
        >
          <Trophy size={64} className="text-[#1c1c1c]" />
        </motion.div>
        <h1 className="text-4xl font-black mb-2 uppercase italic tracking-tighter">Workout Finished!</h1>
        <p className="text-zinc-500 mb-8 font-bold tracking-widest uppercase text-sm">You've crushed it today</p>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-10">
          <div className="bg-zinc-900 border border-white/5 p-4 rounded-3xl">
            <Clock className="text-[#afa3ff] mx-auto mb-2" size={20} />
            <div className="text-xl font-black">{Math.floor((Date.now() - sessionStartTime) / 60000)}m</div>
            <div className="text-[10px] text-zinc-600 font-bold uppercase">Duration</div>
          </div>
          <div className="bg-zinc-900 border border-white/5 p-4 rounded-3xl">
            <Flame className="text-[#d6ff3e] mx-auto mb-2" size={20} />
            <div className="text-xl font-black">450</div>
            <div className="text-[10px] text-zinc-600 font-bold uppercase">Est. Burn</div>
          </div>
        </div>

        <Button fullWidth size="xl" onClick={() => navigate('/home')} className="rounded-3xl">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!currentExercise) return <div className="min-h-screen bg-[#1c1c1c] p-10">Initializing...</div>;

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between bg-zinc-900/50 backdrop-blur-xl border-b border-white/5">
        <button onClick={() => navigate(-1)} className="text-[#afa3ff] hover:scale-110 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-black uppercase tracking-[0.3em] text-[#d6ff3e]">{routineData.title}</h1>
          <p className="text-[10px] text-zinc-500 font-bold">EXERCISE {currentExerciseIndex + 1} OF {workoutItems.length}</p>
        </div>
        <button className="text-rose-500 font-black text-xs uppercase tracking-widest" onClick={handleFinishWorkout}>
          Finish
        </button>
      </div>

      {/* ── Exercise Header ── */}
      <div className="p-8 bg-gradient-to-b from-zinc-900 to-transparent">
        <motion.div 
          key={currentExercise.id}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-6"
        >
          <div className={`w-20 h-20 rounded-3xl ${currentExercise.color} flex items-center justify-center shadow-2xl`}>
            <Dumbbell size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black italic uppercase leading-none mb-2">{currentExercise.name}</h2>
            <div className="flex gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Timer size={14} className="text-[#afa3ff]"/>{currentExercise.time}</span>
              <span className="flex items-center gap-1.5"><RotateCcw size={14} className="text-[#afa3ff]"/>{currentExercise.reps}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Set Logger ── */}
      <div className="flex-grow px-6 overflow-y-auto no-scrollbar pb-32">
        <div className="space-y-4">
          <div className="grid grid-cols-4 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">
            <span>Set</span>
            <span>Weight (kg)</span>
            <span>Reps</span>
            <span className="text-right">Done</span>
          </div>

          <AnimatePresence mode="popLayout">
            {currentExercise.sets.map((set, index) => (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`grid grid-cols-4 items-center bg-zinc-900 border ${set.completed ? 'border-[#d6ff3e]/40' : 'border-white/5'} p-4 rounded-3xl transition-all duration-300`}
              >
                <span className="text-lg font-black italic text-zinc-700">#{index + 1}</span>
                <input 
                  type="number"
                  value={set.weight}
                  onChange={(e) => handleSetChange(set.id, 'weight', e.target.value)}
                  placeholder="0"
                  disabled={set.completed}
                  className="bg-transparent text-xl font-black text-white focus:outline-none w-16"
                />
                <input 
                  type="number"
                  value={set.reps}
                  onChange={(e) => handleSetChange(set.id, 'reps', e.target.value)}
                  placeholder="0"
                  disabled={set.completed}
                  className="bg-transparent text-xl font-black text-white focus:outline-none w-16"
                />
                <div className="flex justify-end">
                  <button 
                    onClick={() => toggleSetComplete(set.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      set.completed 
                        ? 'bg-[#d6ff3e] text-[#1c1c1c] shadow-[0_0_20px_rgba(214,255,62,0.3)]' 
                        : 'bg-zinc-800 text-zinc-600 border border-white/5'
                    }`}
                  >
                    <CheckCircle2 size={24} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button 
            onClick={handleAddSet}
            className="w-full py-4 border-2 border-dashed border-white/5 rounded-3xl text-zinc-600 flex items-center justify-center gap-2 font-bold hover:border-[#afa3ff]/30 hover:text-[#afa3ff] transition-all"
          >
            <Plus size={20} /> ADD SET
          </button>
        </div>
      </div>

      {/* ── Rest Timer Modal ── */}
      <AnimatePresence>
        {isResting && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed bottom-0 left-0 right-0 h-40 bg-[#afa3ff] rounded-t-[3rem] z-[100] p-8 flex flex-col items-center justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute top-4 w-12 h-1.5 bg-white/20 rounded-full" />
            <h3 className="text-[#1c1c1c] font-black text-sm uppercase tracking-widest mb-1">Rest Timer</h3>
            <div className="text-5xl font-black text-[#1c1c1c] italic">00:{restTime < 10 ? `0${restTime}` : restTime}</div>
            <button 
              onClick={() => setIsResting(false)}
              className="mt-2 text-[#1c1c1c]/60 font-bold text-xs hover:underline"
            >
              SKIP REST
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer Navigation ── */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c] to-transparent flex gap-4">
        <button 
          onClick={() => setCurrentExerciseIndex(prev => Math.max(0, prev - 1))}
          disabled={currentExerciseIndex === 0}
          className="flex-1 py-5 bg-zinc-900 border border-white/5 rounded-3xl text-zinc-500 font-black disabled:opacity-20 flex items-center justify-center gap-2"
        >
          <ChevronLeft size={20} /> PREV
        </button>
        <button 
          onClick={() => {
            if (currentExerciseIndex < workoutItems.length - 1) {
              setCurrentExerciseIndex(prev => prev + 1);
            } else {
              handleFinishWorkout();
            }
          }}
          className="flex-1 py-5 bg-[#afa3ff] text-white rounded-3xl font-black shadow-xl flex items-center justify-center gap-2"
        >
          {currentExerciseIndex === workoutItems.length - 1 ? 'FINISH' : 'NEXT'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default WorkoutPlayer;
