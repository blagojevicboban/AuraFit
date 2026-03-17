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
    <div className="p-4 md:p-8 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Treninzi</h1>
          <p className="text-slate-500 dark:text-zinc-400">Prati svoj napredak i snagu</p>
        </div>
        {!isLogging && (
          <button
            onClick={startNewWorkout}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-5 h-5" />
            Novi Trening
          </button>
        )}
      </header>

      {isLogging && activeWorkout ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <input
                type="text"
                value={activeWorkout.title}
                onChange={(e) => setActiveWorkout({ ...activeWorkout, title: e.target.value })}
                className="text-2xl font-bold bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white p-0"
              />
              <div className="flex items-center gap-3">
                {restTimer && (
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono font-bold bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                    <Timer className="w-4 h-4 animate-pulse" />
                    {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
                  </div>
                )}
                <button
                  onClick={() => setIsLogging(false)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {activeWorkout.exercises.map((exercise, exIdx) => (
                <div key={exIdx} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => {
                        const newEx = [...activeWorkout.exercises];
                        newEx[exIdx].name = e.target.value;
                        setActiveWorkout({ ...activeWorkout, exercises: newEx });
                      }}
                      className="font-bold text-lg bg-transparent border-none focus:ring-0 text-slate-800 dark:text-zinc-200 p-0"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-2">
                    <div className="text-center">Serija</div>
                    <div className="text-center">Težina (kg)</div>
                    <div className="text-center">Ponavljanja</div>
                    <div className="text-center">Status</div>
                  </div>

                  <div className="space-y-2">
                    {exercise.sets.map((set, setIdx) => (
                      <div 
                        key={setIdx}
                        className={cn(
                          "grid grid-cols-4 gap-4 items-center p-2 rounded-xl transition-colors",
                          set.completed ? "bg-emerald-50 dark:bg-emerald-500/5" : "bg-slate-50 dark:bg-zinc-800/50"
                        )}
                      >
                        <div className="text-center font-bold text-slate-400">{setIdx + 1}</div>
                        <input
                          type="number"
                          value={set.weight}
                          onChange={(e) => updateSet(exIdx, setIdx, { weight: parseFloat(e.target.value) })}
                          className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg py-1 text-center text-sm focus:ring-2 focus:ring-indigo-500/50"
                        />
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => updateSet(exIdx, setIdx, { reps: parseInt(e.target.value) })}
                          className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg py-1 text-center text-sm focus:ring-2 focus:ring-indigo-500/50"
                        />
                        <button
                          onClick={() => updateSet(exIdx, setIdx, { completed: !set.completed })}
                          className={cn(
                            "flex items-center justify-center p-1 rounded-lg transition-all",
                            set.completed 
                              ? "bg-emerald-500 text-white" 
                              : "bg-slate-200 dark:bg-zinc-700 text-slate-400"
                          )}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addSet(exIdx)}
                    className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-400 hover:border-indigo-500/50 hover:text-indigo-500 transition-all"
                  >
                    + Dodaj seriju
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 flex gap-4">
              <button
                onClick={addExercise}
                className="flex-1 py-4 border-2 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
              >
                Dodaj vežbu
              </button>
              <button
                onClick={saveWorkout}
                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Završi trening
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
              <Dumbbell className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nema zabeleženih treninga</h3>
              <p className="text-slate-500 dark:text-zinc-400 mb-8">Vreme je da pokreneš svoj prvi trening!</p>
              <button
                onClick={startNewWorkout}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
              >
                Započni Trening
              </button>
            </div>
          ) : (
            workouts.map((workout) => (
              <motion.div
                key={workout.id}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center">
                    <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {workout.createdAt?.toDate().toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{workout.title}</h3>
                <div className="space-y-2 mb-6">
                  {workout.exercises?.slice(0, 3).map((ex: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-zinc-400">{ex.name}</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-zinc-300">
                        {ex.sets?.length} serije
                      </span>
                    </div>
                  ))}
                  {workout.exercises?.length > 3 && (
                    <p className="text-xs text-slate-400">+{workout.exercises.length - 3} više vežbi</p>
                  )}
                </div>
                <button className="w-full py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2">
                  Vidi detalje
                  <ChevronRight className="w-3 h-3" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
