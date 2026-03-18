import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Users, Activity, TrendingUp, ShieldAlert, Database, Loader2, AlertTriangle, X, ArrowRight, UserPlus } from "lucide-react";
import { seedDatabase } from "../utils/seedData";
import { useLanguage } from "../contexts/LanguageContext";

export default function AdminDashboard() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { t } = useLanguage();

  const handleSeedDatabase = async () => {
    setShowConfirmModal(false);
    setIsSeeding(true);
    setSeedMessage("");
    
    try {
      await seedDatabase();
      setSeedMessage("Baza je uspešno inicijalizovana test podacima.");
    } catch (error) {
      console.error("Greška pri inicijalizaciji baze:", error);
      setSeedMessage("Došlo je do greške pri inicijalizaciji baze.");
    } finally {
      setIsSeeding(false);
    }
  };

  const stats = [
    { label: t('nav.users'), value: "1,248", icon: Users, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10", border: "border-indigo-100 dark:border-indigo-500/20", to: "/app/admin/users" },
    { label: "Aktivni Treneri", value: "42", icon: Activity, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20" },
    { label: "Novi Klijenti (Ovaj mesec)", value: "+156", icon: TrendingUp, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-500/10", border: "border-cyan-100 dark:border-cyan-500/20" },
    { label: "Prijavljeni Problemi", value: "3", icon: ShieldAlert, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-100 dark:border-rose-500/20" },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-zinc-800"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Potvrda inicijalizacije</h2>
                  </div>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-slate-600 dark:text-zinc-400 mb-6">
                  Da li ste sigurni da želite da inicijalizujete bazu sa test podacima? Ovo će dodati nove korisnike (trenera i klijente), treninge i obroke.
                </p>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl font-medium transition-colors"
                  >
                    Odustani
                  </button>
                  <button
                    onClick={handleSeedDatabase}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Inicijalizuj
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('nav.dashboard')}</h1>
          <p className="text-slate-600 dark:text-zinc-400">Pregled sistema i aktivnosti</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Content = (
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.border} border`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          );

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white dark:bg-zinc-900/50 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800/50 shadow-sm transition-all ${stat.to ? 'hover:scale-[1.02] hover:border-indigo-500/50 cursor-pointer' : ''}`}
            >
              {stat.to ? <Link to={stat.to}>{Content}</Link> : Content}
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800/50 p-6 flex flex-col">
           <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upravljanje Korisnicima</h2>
           <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6 flex-grow">
             Pregledajte spisak svih korisnika, menjajte njihove uloge (admin, trener, klijent) ili privremeno pristupite njihovim nalozima.
           </p>
           <Link 
             to="/app/admin/users"
             className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-2xl font-black transition-all shadow-lg shadow-emerald-500/20"
           >
             <Users className="w-5 h-5" />
             Otvori Listu Korisnika
             <ArrowRight className="w-4 h-4 ml-2" />
           </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800/50 p-6">
           <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Sistemska Baza</h2>
           <div className="space-y-4">
             <p className="text-sm text-slate-500 dark:text-zinc-400">
               Inicijalizujte bazu podataka sa testnim korisnicima (trener i klijenti), treninzima i obrocima za potrebe testiranja aplikacije.
             </p>
             <button
               onClick={() => setShowConfirmModal(true)}
               disabled={isSeeding}
               className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-500 border border-indigo-500/20 rounded-2xl font-bold transition-all"
             >
               {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
               Inicijalizuj Test Podatke
             </button>
             {seedMessage && (
               <p className={`mt-4 text-sm ${seedMessage.includes('Greška') ? 'text-rose-500' : 'text-emerald-500'}`}>
                 {seedMessage}
               </p>
             )}
           </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800/50 p-6">
           <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Status Sistema</h2>
           <div className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-sm font-medium">Baza Podataka</span>
                <span className="flex items-center gap-2 text-xs text-emerald-500 font-bold uppercase"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-sm font-medium">Storage Service</span>
                <span className="flex items-center gap-2 text-xs text-emerald-500 font-bold uppercase"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
