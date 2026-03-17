import { useState, useEffect } from "react";
import { Users, AlertCircle, FileJson, CheckCircle2, ChevronRight, Sparkles, MessageSquare, TrendingUp, Calendar, Camera } from "lucide-react";
import { askAuraFitAI } from "../lib/gemini";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot, getDocs, limit, orderBy } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { generateWeeklySummary } from "../services/aiService";

export default function CoachDashboard() {
  const { userData } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [weeklySummary, setWeeklySummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [activeView, setActiveView] = useState<'clients' | 'templates' | 'feedback'>('clients');
  const [templates, setTemplates] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  useEffect(() => {
    if (!userData) return;
    const q = query(collection(db, "users"), where("coachId", "==", userData.uid));
    const unsubClients = onSnapshot(q, (snapshot) => {
      setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const tQ = query(collection(db, "templates"), where("coachId", "==", userData.uid));
    const unsubTemplates = onSnapshot(tQ, (snapshot) => {
      setTemplates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const fQ = query(collection(db, "feedback"), where("coachId", "==", userData.uid));
    const unsubFeedback = onSnapshot(fQ, (snapshot) => {
      setFeedbackList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubClients();
      unsubTemplates();
      unsubFeedback();
    };
  }, [userData]);

  const handleGenerateSummary = async (client: any) => {
    setIsGeneratingSummary(true);
    try {
      // Fetch some data for the summary
      const mealsQ = query(collection(db, "meals"), where("userId", "==", client.id), limit(10));
      const workoutsQ = query(collection(db, "workouts"), where("userId", "==", client.id), limit(5));
      
      const [mealsSnap, workoutsSnap] = await Promise.all([getDocs(mealsQ), getDocs(workoutsQ)]);
      
      const data = {
        meals: mealsSnap.docs.map(d => d.data()),
        workouts: workoutsSnap.docs.map(d => d.data())
      };

      const summary = await generateWeeklySummary(data);
      setWeeklySummary(summary);
    } catch (err) {
      console.error(err);
    }
    setIsGeneratingSummary(false);
  };

  const handleGenerateWorkout = async () => {
    setIsGenerating(true);
    const prompt = "Daj mi JSON strukturu za novi trening snage za Marka, fokus na noge, 4 vežbe. Vrati samo JSON.";
    const response = await askAuraFitAI(prompt, true, true);
    setWorkoutPlan(response);
    setIsGenerating(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-24 lg:pb-8 transition-colors duration-200">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-200">Coach Dashboard</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm sm:text-base transition-colors duration-200">Pregled tvojih klijenata i AI asistencija</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-2xl border border-slate-200 dark:border-zinc-800 transition-colors duration-200">
          <button 
            onClick={() => setActiveView('clients')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeView === 'clients' ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
            )}
          >
            Klijenti
          </button>
          <button 
            onClick={() => setActiveView('templates')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeView === 'templates' ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
            )}
          >
            Šabloni
          </button>
          <button 
            onClick={() => setActiveView('feedback')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeView === 'feedback' ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
            )}
          >
            Feedback
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {activeView === 'clients' ? (
          <>
            {/* Client List & Alerts */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-zinc-900/40 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm dark:shadow-none transition-colors duration-200">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-200">
                  <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 transition-colors duration-200" />
                  Semafor (Client Health)
                </h2>
                
                <div className="space-y-3">
                  {clients.map((client) => {
                    // Mocking health status for now, in real app we'd check last activity
                    const isHealthy = Math.random() > 0.3; 
                    return (
                      <div 
                        key={client.id}
                        onClick={() => {
                          setSelectedClient(client);
                          setWeeklySummary(null);
                        }}
                        className={cn(
                          "p-4 rounded-2xl border transition-all cursor-pointer",
                          selectedClient?.id === client.id ? "ring-2 ring-indigo-500" : "",
                          isHealthy 
                            ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20" 
                            : "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn(
                            "font-semibold",
                            isHealthy ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"
                          )}>{client.displayName}</span>
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            isHealthy ? "bg-emerald-500" : "bg-rose-500"
                          )} />
                        </div>
                        <p className={cn(
                          "text-xs",
                          isHealthy ? "text-emerald-600 dark:text-emerald-400/80" : "text-rose-600 dark:text-rose-400/80"
                        )}>
                          {isHealthy ? "Sve po planu" : "Preskočen trening / obrok"}
                        </p>
                      </div>
                    );
                  })}
                  {clients.length === 0 && (
                    <p className="text-sm text-slate-500 dark:text-zinc-500 text-center py-4">Nema dodeljenih klijenata.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Client Detail / AI Assistant */}
            <div className="lg:col-span-2 space-y-6">
              {selectedClient ? (
                <div className="bg-white dark:bg-zinc-900/40 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm dark:shadow-none transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-zinc-800/50 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-gradient-to-br dark:from-indigo-500/20 dark:to-cyan-500/20 flex items-center justify-center text-xl font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 transition-colors duration-200">
                        {selectedClient.displayName?.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-200">{selectedClient.displayName}</h2>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 transition-colors duration-200">Email: {selectedClient.email}</p>
                      </div>
                    </div>
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-white text-sm font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors border border-slate-200 dark:border-zinc-700">
                      <MessageSquare className="w-4 h-4" />
                      Pošalji poruku
                    </button>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-2 transition-colors duration-200">
                        <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400 transition-colors duration-200" />
                        AI Nedeljni Rezime
                      </h3>
                      <button 
                        onClick={() => handleGenerateSummary(selectedClient)}
                        disabled={isGeneratingSummary}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50"
                      >
                        {isGeneratingSummary ? "Generisanje..." : "Generiši novi rezime"}
                      </button>
                    </div>

                    {weeklySummary ? (
                      <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {weeklySummary}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800/50 transition-colors duration-200">
                          <p className="text-xs text-slate-500 dark:text-zinc-500 mb-2 transition-colors duration-200">Doslednost</p>
                          <p className="font-semibold text-slate-900 dark:text-white text-lg transition-colors duration-200">-- <span className="text-sm text-slate-500 dark:text-zinc-500 font-normal transition-colors duration-200">treninga</span></p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800/50 transition-colors duration-200">
                          <p className="text-xs text-slate-500 dark:text-zinc-500 mb-2 transition-colors duration-200">Napredak</p>
                          <p className="font-semibold text-slate-900 dark:text-white text-lg transition-colors duration-200">--</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800/50 transition-colors duration-200">
                          <p className="text-xs text-slate-500 dark:text-zinc-500 mb-2 transition-colors duration-200">Status</p>
                          <p className="font-semibold text-slate-900 dark:text-white text-lg transition-colors duration-200">Na čekanju</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <h3 className="text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wider transition-colors duration-200">
                        Akcija: Novi Plan
                      </h3>
                      <button
                        onClick={handleGenerateWorkout}
                        disabled={isGenerating}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors disabled:opacity-50 border border-indigo-200 dark:border-indigo-500/20"
                      >
                        {isGenerating ? (
                          <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                        ) : (
                          <FileJson className="w-4 h-4" />
                        )}
                        Generiši JSON Trening
                      </button>
                    </div>

                    {workoutPlan && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="overflow-hidden rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 transition-colors duration-200">
                          <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 flex items-center gap-2 transition-colors duration-200">
                            <FileJson className="w-3.5 h-3.5" />
                            workout_plan.json
                          </span>
                          <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 font-medium bg-indigo-100 dark:bg-indigo-500/10 px-2 py-1 rounded-md transition-colors">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Primeni plan
                          </button>
                        </div>
                        <pre className="p-4 text-sm font-mono text-slate-700 dark:text-zinc-300 overflow-x-auto custom-scrollbar transition-colors duration-200">
                          {workoutPlan}
                        </pre>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900/40 p-12 rounded-3xl border border-slate-200 dark:border-zinc-800/50 backdrop-blur-sm flex flex-col items-center justify-center text-center transition-colors duration-200">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4 transition-colors duration-200">
                    <Users className="w-8 h-8 text-slate-400 dark:text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-200">Izaberi klijenta</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-500 mt-2 max-w-xs transition-colors duration-200">
                    Klikni na klijenta sa leve strane da vidiš detalje, AI analizu i upravljaš planovima.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : activeView === 'templates' ? (
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Library šablona</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
                Novi šablon
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{template.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{template.exercises?.length || 0} vežbi</span>
                    <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Dodeli klijentu</button>
                  </div>
                </div>
              ))}
              {templates.length === 0 && (
                <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800/50">
                  <p className="text-slate-500 dark:text-zinc-500">Nema kreiranih šablona.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Video Feedback (Markup)</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbackList.map((feedback) => (
                <div key={feedback.id} className="bg-white dark:bg-zinc-900/40 p-5 rounded-3xl border border-slate-200 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm">
                  <div className="aspect-video bg-slate-100 dark:bg-zinc-800 rounded-2xl mb-4 flex items-center justify-center group relative overflow-hidden">
                    <Camera className="w-10 h-10 text-slate-300 dark:text-zinc-700 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="px-4 py-2 bg-white text-slate-900 rounded-xl text-sm font-bold">Pregledaj</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">{feedback.exerciseName || 'Vežba'}</h4>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-full",
                      feedback.status === 'reviewed' ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                    )}>
                      {feedback.status === 'reviewed' ? 'PREGLEDANO' : 'NOVO'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mb-4">Klijent: {feedback.clientName || 'Nepoznato'}</p>
                  <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
                    Dodaj Markup & Glas
                  </button>
                </div>
              ))}
              {feedbackList.length === 0 && (
                <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800/50">
                  <Camera className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-zinc-500">Nema novih video snimaka za pregled.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
