import { useState } from "react";
import { Users, AlertCircle, FileJson, CheckCircle2, ChevronRight } from "lucide-react";
import { askAuraFitAI } from "../lib/gemini";
import { motion } from "motion/react";

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
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Coach Dashboard</h1>
          <p className="text-zinc-500 mt-1">Pregled tvojih klijenata i AI asistencija</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-3">
          <Users className="w-5 h-5 text-indigo-600" />
          <div>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Aktivni klijenti</p>
            <p className="font-bold text-zinc-900">12</p>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Client List & Alerts */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              Potrebna pažnja
            </h2>
            
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 cursor-pointer hover:bg-rose-100/50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-rose-900">Marko P.</span>
                  <span className="text-xs font-medium text-rose-600">Danas</span>
                </div>
                <p className="text-sm text-rose-700/80">
                  AI Alert: Slabiji unos proteina u poslednja 3 dana. Stagnacija na benč presu.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Svi klijenti</h2>
            <div className="space-y-2">
              {["Jelena M.", "Nikola S.", "Ana K."].map((client, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600">
                      {client.charAt(0)}
                    </div>
                    <span className="font-medium text-zinc-700">{client}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Detail / AI Assistant */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-zinc-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-700">
                  M
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">Marko P.</h2>
                  <p className="text-sm text-zinc-500">Cilj: Mišićna masa • Lite korisnik od pre 1 mesec</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors">
                Pošalji poruku
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-4">
                AI Nedeljni Rezime
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <p className="text-xs text-zinc-500 mb-1">Doslednost</p>
                  <p className="font-semibold text-zinc-900">4/4 treninga</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <p className="text-xs text-zinc-500 mb-1">Napredak (Snaga)</p>
                  <p className="font-semibold text-amber-600">Stagnacija</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <p className="text-xs text-zinc-500 mb-1">Nutritivni balans</p>
                  <p className="font-semibold text-rose-600">Nizak protein</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                  Akcija: Novi Plan
                </h3>
                <button
                  onClick={handleGenerateWorkout}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-indigo-700/30 border-t-indigo-700 rounded-full animate-spin" />
                  ) : (
                    <FileJson className="w-4 h-4" />
                  )}
                  Generiši JSON Trening (AI)
                </button>
              </div>

              {workoutPlan && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800"
                >
                  <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900">
                    <span className="text-xs font-mono text-zinc-400">workout_plan.json</span>
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Primeni plan
                    </button>
                  </div>
                  <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto">
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
