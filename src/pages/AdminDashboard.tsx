import { motion } from "motion/react";
import { Users, Activity, TrendingUp, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-zinc-400">Pregled sistema i aktivnosti</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Ukupno Korisnika", value: "1,248", icon: Users, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10", border: "border-indigo-100 dark:border-indigo-500/20" },
          { label: "Aktivni Treneri", value: "42", icon: Activity, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20" },
          { label: "Novi Klijenti (Ovaj mesec)", value: "+156", icon: TrendingUp, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-500/10", border: "border-cyan-100 dark:border-cyan-500/20" },
          { label: "Prijavljeni Problemi", value: "3", icon: ShieldAlert, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-100 dark:border-rose-500/20" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-zinc-900/50 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800/50 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.border} border`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800/50 p-6">
           <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Nedavne Aktivnosti</h2>
           <div className="space-y-4">
             <p className="text-sm text-slate-500 dark:text-zinc-400">Uskoro: Prikaz logova i aktivnosti na platformi.</p>
           </div>
        </div>
        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800/50 p-6">
           <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Sistemske Postavke</h2>
           <div className="space-y-4">
             <p className="text-sm text-slate-500 dark:text-zinc-400">Uskoro: Konfiguracija globalnih parametara aplikacije.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
