import React, { useState, useEffect } from "react";
import { 
  Dumbbell, 
  Plus, 
  History, 
  ChevronRight, 
  Timer,
  CheckCircle2,
  Play,
  Save,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { cn } from "../lib/utils";

interface ExerciseSet {
  reps: number;
  weight: number;
  completed: boolean;
}

interface Exercise {
  name: string;
  sets: ExerciseSet[];
}

export default function ClientWorkouts() {
  const { userData } = useAuth();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [isLogging, setIsLogging] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<{
    title: string;
    exercises: Exercise[];
  } | null>(null);
  const [restTimer, setRestTimer] = useState<number | null>(null);

  useEffect(() => {
    if (!userData) return;

    const q = query(
      collection(db, "workouts"),
      where("userId", "==", userData.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setWorkouts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [userData]);

  const startNewWorkout = () => {
    setActiveWorkout({
      title: "Novi Trening",
      exercises: [
        { name: "Bench Press", sets: [{ reps: 10, weight: 60, completed: false }] }
      ]
    });
    setIsLogging(true);
  };

  const addExercise = () => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      exercises: [
        ...activeWorkout.exercises,
        { name: "Nova Vežba", sets: [{ reps: 10, weight: 0, completed: false }] }
      ]
    });
  };

  const addSet = (exerciseIndex: number) => {
    if (!activeWorkout) return;
    const newExercises = [...activeWorkout.exercises];
    const lastSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];
    newExercises[exerciseIndex].sets.push({ 
      reps: lastSet.reps, 
      weight: lastSet.weight, 
      completed: false 
    });
    setActiveWorkout({ ...activeWorkout, exercises: newExercises });
  };

  const updateSet = (exerciseIndex: number, setIndex: number, data: Partial<ExerciseSet>) => {
    if (!activeWorkout) return;
    const newExercises = [...activeWorkout.exercises];
    newExercises[exerciseIndex].sets[setIndex] = {
      ...newExercises[exerciseIndex].sets[setIndex],
      ...data
    };
    setActiveWorkout({ ...activeWorkout, exercises: newExercises });
    
    if (data.completed) {
      setRestTimer(60);
    }
  };

  const saveWorkout = async () => {
    if (!activeWorkout || !userData) return;
    try {
      await addDoc(collection(db, "workouts"), {
        userId: userData.uid,
        title: activeWorkout.title,
        exercises: activeWorkout.exercises,
        createdAt: serverTimestamp()
      });
      setIsLogging(false);
      setActiveWorkout(null);
    } catch (err) {
      console.error("Error saving workout", err);
    }
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pb-20">
      <header className="max-w-7xl mx-auto px-4 py-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight mb-2">Treninzi</h1>
          <p className="text-zinc-400 font-light">Prati svoj napredak i snagu u realnom vremenu.</p>
        </div>
        {!isLogging && (
          <button
            onClick={startNewWorkout}
            className="flex items-center gap-3 px-8 py-4 brand-gradient text-zinc-950 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-5 h-5" />
            NOVI TRENING
          </button>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {isLogging && activeWorkout ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex-1">
                  <input
                    type="text"
                    value={activeWorkout.title}
                    onChange={(e) => setActiveWorkout({ ...activeWorkout, title: e.target.value })}
                    className="text-3xl font-display font-bold bg-transparent border-none focus:ring-0 text-white p-0 w-full"
                  />
                </div>
                <div className="flex items-center gap-4">
                  {restTimer && (
                    <div className="flex items-center gap-3 text-emerald-400 font-mono font-bold bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      <Timer className="w-5 h-5 animate-pulse" />
                      {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                  <button
                    onClick={() => setIsLogging(false)}
                    className="p-3 text-zinc-500 hover:text-rose-400 bg-white/5 rounded-2xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-12">
                {activeWorkout.exercises.map((exercise, exIdx) => (
                  <div key={exIdx} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-zinc-500 border border-white/5">
                        <Dumbbell className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => {
                          const newEx = [...activeWorkout.exercises];
                          newEx[exIdx].name = e.target.value;
                          setActiveWorkout({ ...activeWorkout, exercises: newEx });
                        }}
                        className="font-display font-bold text-xl bg-transparent border-none focus:ring-0 text-zinc-200 p-0"
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">
                      <div className="text-center">Serija</div>
                      <div className="text-center">Težina (kg)</div>
                      <div className="text-center">Reps</div>
                      <div className="text-center">Status</div>
                    </div>

                    <div className="space-y-3">
                      {exercise.sets.map((set, setIdx) => (
                        <div 
                          key={setIdx}
                          className={cn(
                            "grid grid-cols-4 gap-4 items-center p-3 rounded-2xl transition-all duration-300 border",
                            set.completed 
                              ? "bg-emerald-500/10 border-emerald-500/20" 
                              : "bg-zinc-950/50 border-white/5"
                          )}
                        >
                          <div className="text-center font-black text-zinc-600 text-sm">{setIdx + 1}</div>
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => updateSet(exIdx, setIdx, { weight: parseFloat(e.target.value) })}
                            className="bg-zinc-900 border border-white/10 rounded-xl py-2 text-center text-sm font-bold focus:ring-2 focus:ring-emerald-500/30 transition-all"
                          />
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSet(exIdx, setIdx, { reps: parseInt(e.target.value) })}
                            className="bg-zinc-900 border border-white/10 rounded-xl py-2 text-center text-sm font-bold focus:ring-2 focus:ring-emerald-500/30 transition-all"
                          />
                          <button
                            onClick={() => updateSet(exIdx, setIdx, { completed: !set.completed })}
                            className={cn(
                              "flex items-center justify-center p-2 rounded-xl transition-all shadow-lg",
                              set.completed 
                                ? "bg-emerald-500 text-zinc-950" 
                                : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                            )}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => addSet(exIdx)}
                      className="w-full py-3 border border-dashed border-white/10 rounded-2xl text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:border-emerald-500/30 hover:text-emerald-400 transition-all"
                    >
                      + DODAJ SERIJU
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-16 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={addExercise}
                  className="flex-1 py-5 border border-emerald-500/30 text-emerald-400 rounded-3xl font-black text-sm hover:bg-emerald-500/10 transition-all uppercase tracking-widest"
                >
                  DODAJ VEŽBU
                </button>
                <button
                  onClick={saveWorkout}
                  className="flex-1 py-5 brand-gradient text-zinc-950 rounded-3xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                  <Save className="w-5 h-5" />
                  ZAVRŠI TRENING
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workouts.length === 0 ? (
              <div className="col-span-full py-32 text-center glass-card rounded-[3rem] border border-dashed border-white/10">
                <div className="w-24 h-24 rounded-3xl bg-zinc-900 flex items-center justify-center text-zinc-700 mx-auto mb-8 border border-white/5">
                  <Dumbbell className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-display font-bold mb-4">Nema zabeleženih treninga</h3>
                <p className="text-zinc-500 mb-10 font-light">Vreme je da pokreneš svoj prvi trening i postaneš najbolja verzija sebe.</p>
                <button
                  onClick={startNewWorkout}
                  className="px-12 py-5 brand-gradient text-zinc-950 rounded-3xl font-black text-sm hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] uppercase tracking-widest"
                >
                  ZAPOČNI TRENING
                </button>
              </div>
            ) : (
              workouts.map((workout, i) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="glass-card p-8 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                      <History className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      {workout.createdAt?.toDate().toLocaleDateString('sr-RS')}
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-bold mb-6 group-hover:text-emerald-400 transition-colors">{workout.title}</h3>
                  <div className="space-y-3 mb-8">
                    {workout.exercises?.slice(0, 3).map((ex: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-zinc-400 font-light">{ex.name}</span>
                        <span className="font-mono font-bold text-zinc-200">
                          {ex.sets?.length} <span className="text-[10px] text-zinc-600 uppercase">serije</span>
                        </span>
                      </div>
                    ))}
                    {workout.exercises?.length > 3 && (
                      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">+{workout.exercises.length - 3} više vežbi</p>
                    )}
                  </div>
                  <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
                    DETALJI TRENINGA
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
