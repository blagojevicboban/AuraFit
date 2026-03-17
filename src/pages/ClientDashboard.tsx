import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame, Activity, Droplets, Dumbbell, LayoutGrid, 
  Utensils, TrendingUp, Plus, Brain, User, Users,
  ChevronRight, Save, X, Play, Timer, CheckCircle2
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, limit, getDocs } from "firebase/firestore";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";

interface Meal {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  time: string;
}

interface Workout {
  id: string;
  type: string;
  duration: string;
  date: any;
  exercises: any[];
}

export default function ClientDashboard() {
  const { userData, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'nutrition' | 'workout' | 'progress'>('overview');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [lastWorkout, setLastWorkout] = useState<Workout | null>(null);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Stats
  const [dailyCalories, setDailyCalories] = useState(0);
  const [dailyProteins, setDailyProteins] = useState(0);
  const dailyGoal = 2400;
  const proteinGoal = 180;
  const waterIntake = 2.5;

  useEffect(() => {
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mealsQuery = query(
      collection(db, "meals"),
      where("userId", "==", user.uid),
      where("date", ">=", today)
    );

    const unsubscribeMeals = onSnapshot(mealsQuery, (snapshot) => {
      const mealsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meal));
      setMeals(mealsData);
      
      const totalCal = mealsData.reduce((acc, meal) => acc + meal.calories, 0);
      const totalProt = mealsData.reduce((acc, meal) => acc + meal.proteins, 0);
      setDailyCalories(totalCal);
      setDailyProteins(totalProt);
    });

    const workoutQuery = query(
      collection(db, "workouts"),
      where("userId", "==", user.uid),
      orderBy("date", "desc"),
      limit(1)
    );

    const unsubscribeWorkout = onSnapshot(workoutQuery, (snapshot) => {
      if (!snapshot.empty) {
        setLastWorkout({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Workout);
      }
    });

    return () => {
      unsubscribeMeals();
      unsubscribeWorkout();
    };
  }, [user]);

  const handleAiLog = async () => {
    setAiLoading(true);
    // Simulate AI processing
    setTimeout(async () => {
      try {
        await addDoc(collection(db, "meals"), {
          userId: user?.uid,
          name: "AI Logged Meal",
          calories: 450,
          proteins: 30,
          date: serverTimestamp(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setAiInput("");
      } catch (error) {
        console.error("Error logging meal:", error);
      } finally {
        setAiLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pb-20">
      {/* Header */}
      <header className="bg-zinc-900/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center text-zinc-950 font-black">
              AF
            </div>
            <h1 className="text-xl font-display font-bold tracking-tight">Aura Fit</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
              <User className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-medium hidden sm:block">{userData?.displayName || 'Korisnik'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Kalorije", value: `${dailyCalories}/${dailyGoal}`, unit: "kcal", icon: Flame, color: "emerald" },
            { label: "Proteini", value: `${dailyProteins}/${proteinGoal}`, unit: "g", icon: Activity, color: "cyan" },
            { label: "Voda", value: `${waterIntake}`, unit: "L", icon: Droplets, color: "blue" },
            { label: "Trening", value: lastWorkout ? "Završen" : "Danas", unit: "", icon: Dumbbell, color: "indigo" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5 rounded-3xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl bg-${stat.color || 'emerald'}-500/10 border border-${stat.color || 'emerald'}-500/20`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color || 'emerald'}-400`} />
                </div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-display font-bold">{stat.value}</span>
                <span className="text-xs text-zinc-500 font-light">{stat.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5 w-fit">
          {[
            { id: 'overview', label: 'Pregled', icon: LayoutGrid },
            { id: 'nutrition', label: 'Ishrana', icon: Utensils },
            { id: 'workout', label: 'Trening', icon: Dumbbell },
            { id: 'progress', label: 'Napredak', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-emerald-500 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-3 gap-8">
                {/* AI Logging Card */}
                <div className="md:col-span-2 glass-card p-8 rounded-[2.5rem] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Brain className="w-32 h-32 text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-2">AI Smart Log</h2>
                  <p className="text-zinc-400 mb-8 font-light">Opiši svoj obrok ili trening prirodnim jezikom.</p>
                  
                  <div className="relative">
                    <textarea
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="npr. Pojeo sam 3 jaja, parče hleba i popio kafu..."
                      className="w-full h-32 bg-zinc-950/50 border border-white/10 rounded-3xl p-6 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all resize-none"
                    />
                    <button
                      onClick={handleAiLog}
                      disabled={aiLoading || !aiInput.trim()}
                      className="absolute bottom-4 right-4 brand-gradient text-zinc-950 px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {aiLoading ? "ANALIZIRAM..." : "LOGUJ ODMAH"}
                    </button>
                  </div>
                </div>

                {/* Coach Message Card */}
                <div className="glass-card p-8 rounded-[2.5rem] flex flex-col">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                      <Users className="w-7 h-7 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold">Poruka trenera</h3>
                      <p className="text-xs text-zinc-500">Pre 2 sata</p>
                    </div>
                  </div>
                  <p className="text-zinc-300 font-light leading-relaxed mb-8 italic">
                    "Odličan posao sa jučerašnjim treningom! Primetio sam da si povećao težinu na čučnju. Nastavi tako, danas fokus na hidrataciju."
                  </p>
                  <button className="mt-auto w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all">
                    ODGOVORI TRENERU
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 glass-card p-8 rounded-[2.5rem]">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-display font-bold">Dnevnik Ishrane</h2>
                      <button className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 hover:bg-emerald-500/20 transition-all">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {meals.length > 0 ? meals.map((meal) => (
                        <div key={meal.id} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center">
                              <Utensils className="w-5 h-5 text-zinc-500" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm">{meal.name}</h4>
                              <p className="text-xs text-zinc-500 font-light">{meal.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-display font-bold">{meal.calories}</span>
                            <span className="text-[10px] text-zinc-500 ml-1 uppercase">kcal</span>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-12 text-zinc-500 font-light">Nema unetih obroka za danas.</div>
                      )}
                    </div>
                  </div>

                  <div className="glass-card p-8 rounded-[2.5rem]">
                    <h3 className="text-xl font-display font-bold mb-8">Makronutrijenti</h3>
                    <div className="space-y-8">
                      {[
                        { label: 'Proteini', current: dailyProteins, goal: proteinGoal, color: 'emerald' },
                        { label: 'Ugljeni hidrati', current: 145, goal: 250, color: 'cyan' },
                        { label: 'Masti', current: 42, goal: 70, color: 'indigo' }
                      ].map((macro, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-3 uppercase tracking-widest font-black text-zinc-500">
                            <span>{macro.label}</span>
                            <span className="text-white">{macro.current}g / {macro.goal}g</span>
                          </div>
                          <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(macro.current / macro.goal) * 100}%` }}
                              className={`h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'workout' && (
              <div className="glass-card p-10 rounded-[2.5rem] text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-3xl brand-gradient flex items-center justify-center text-zinc-950 mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                  <Dumbbell className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-display font-bold mb-4">Vreme je za trening!</h2>
                <p className="text-zinc-400 mb-10 font-light leading-relaxed">
                  Vaš današnji plan je spreman. Pratite serije, težine i ponavljanja kako biste osigurali napredak.
                </p>
                <button 
                  onClick={() => navigate('/client/workouts')}
                  className="w-full brand-gradient text-zinc-950 py-5 rounded-3xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                >
                  ZAPOČNI TRENING
                </button>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="glass-card p-10 rounded-[2.5rem] text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-8 border border-indigo-500/20">
                  <TrendingUp className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-display font-bold mb-4">Prati svoj napredak</h2>
                <p className="text-zinc-400 mb-10 font-light leading-relaxed">
                  Vizuelizujte svoje rezultate kroz grafikone i biometrijske podatke.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-950/50 p-6 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Težina</p>
                    <p className="text-2xl font-display font-bold">84.5 <span className="text-xs font-light text-zinc-500">kg</span></p>
                  </div>
                  <div className="bg-zinc-950/50 p-6 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Body Fat</p>
                    <p className="text-2xl font-display font-bold">14.2 <span className="text-xs font-light text-zinc-500">%</span></p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
