import { useState } from "react";
import { Users, AlertCircle, FileJson, CheckCircle2, ChevronRight, Sparkles, MessageSquare } from "lucide-react";
import { askAuraFitAI } from "../lib/gemini";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export default function CoachDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);

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
        <div className="bg-white dark:bg-zinc-900/50 px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800/50 flex items-center gap-3 backdrop-blur-sm self-start sm:self-auto shadow-sm dark:shadow-none transition-colors duration-200">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl border border-indigo-200 dark:border-indigo-500/20 transition-colors duration-200">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400 transition-colors duration-200" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium uppercase tracking-wider transition-colors duration-200">Aktivni klijenti</p>
            <p className="font-bold text-slate-900 dark:text-white text-lg leading-none mt-1 transition-colors duration-200">12</p>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Client List & Alerts */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900/40 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm dark:shadow-none transition-colors duration-200">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-200">
              <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 transition-colors duration-200" />
              Potrebna pažnja
            </h2>
            
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-rose-700 dark:text-rose-300 transition-colors duration-200">Marko P.</span>
                  <span className="text-xs font-medium text-rose-600 dark:text-rose-400/80 bg-rose-100 dark:bg-rose-500/10 px-2 py-1 rounded-md transition-colors duration-200">Danas</span>
                </div>
                <p className="text-sm text-rose-600 dark:text-rose-200/80 leading-relaxed transition-colors duration-200">
                  <span className="font-medium text-rose-700 dark:text-rose-300 transition-colors duration-200">AI Alert:</span> Slabiji unos proteina u poslednja 3 dana. Stagnacija na benč presu.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900/40 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm dark:shadow-none transition-colors duration-200">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 transition-colors duration-200">Svi klijenti</h2>
            <div className="space-y-2">
              {["Jelena M.", "Nikola S.", "Ana K."].map((client, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-zinc-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700/50 transition-colors duration-200">
                      {client.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-700 dark:text-zinc-200 transition-colors duration-200">{client}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 dark:text-zinc-600 transition-colors duration-200" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Detail / AI Assistant */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900/40 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm dark:shadow-none transition-colors duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-zinc-800/50 transition-colors duration-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-gradient-to-br dark:from-indigo-500/20 dark:to-cyan-500/20 flex items-center justify-center text-xl font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 transition-colors duration-200">
                  M
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-200">Marko P.</h2>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 transition-colors duration-200">Cilj: Mišićna masa • Lite korisnik</p>
                </div>
              </div>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-white text-sm font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors border border-slate-200 dark:border-zinc-700">
                <MessageSquare className="w-4 h-4" />
                Pošalji poruku
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2 transition-colors duration-200">
                <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400 transition-colors duration-200" />
                AI Nedeljni Rezime
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800/50 transition-colors duration-200">
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mb-2 transition-colors duration-200">Doslednost</p>
                  <p className="font-semibold text-slate-900 dark:text-white text-lg transition-colors duration-200">4/4 <span className="text-sm text-slate-500 dark:text-zinc-500 font-normal transition-colors duration-200">treninga</span></p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 transition-colors duration-200">
                  <p className="text-xs text-amber-600 dark:text-amber-500/70 mb-2 transition-colors duration-200">Napredak (Snaga)</p>
                  <p className="font-semibold text-amber-500 dark:text-amber-400 text-lg transition-colors duration-200">Stagnacija</p>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 transition-colors duration-200">
                  <p className="text-xs text-rose-600 dark:text-rose-500/70 mb-2 transition-colors duration-200">Nutritivni balans</p>
                  <p className="font-semibold text-rose-500 dark:text-rose-400 text-lg transition-colors duration-200">Nizak protein</p>
                </div>
              </div>
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
        </div>
      </div>
    </div>
  );
}
