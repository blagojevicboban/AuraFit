import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Activity, Brain, Users, Sparkles, Sun, Moon, Shield, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useEffect, useState } from "react";

export default function Landing() {
  const { signIn, adminSignIn, userData } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    if (userData) {
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'coach') {
        navigate('/coach');
      } else {
        navigate('/client');
      }
    }
  }, [userData, navigate]);

  const handleSignIn = async (role: 'client' | 'coach') => {
    try {
      await signIn(role);
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        console.error("Login failed", error);
      }
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setAdminLoading(true);
    try {
      await adminSignIn(adminUsername, adminPassword);
      setShowAdminModal(false);
    } catch (error: any) {
      console.error("Admin login failed", error);
      if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
        setAdminError("Nemate dozvolu za pristup. Kontaktirajte podršku.");
      } else {
        setAdminError("Pogrešno korisničko ime ili lozinka.");
      }
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 selection:bg-indigo-500/30 overflow-hidden relative transition-colors duration-200">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none transition-colors duration-200" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none transition-colors duration-200" />

      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-white/5 relative z-10 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
              A
            </div>
            <span className="text-xl font-bold tracking-tight">Aura Fit</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setShowAdminModal(true)} className="hidden md:block text-xs font-medium text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Admin
            </button>
            <button onClick={() => handleSignIn('client')} className="hidden sm:block text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Prijava za klijente
            </button>
            <button
              onClick={() => handleSignIn('coach')}
              className="text-xs sm:text-sm font-medium bg-slate-900 dark:bg-white/10 text-white px-4 py-2 rounded-full hover:bg-slate-800 dark:hover:bg-white/20 transition-colors border border-transparent dark:border-white/10 cursor-pointer"
            >
              Portal za trenere
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center md:text-left md:mx-0"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-medium mb-8 border border-indigo-200 dark:border-indigo-500/20 backdrop-blur-sm transition-colors duration-200">
            <Sparkles className="w-4 h-4" />
            Faza 1: MVP Dostupan
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-6 sm:mb-8 leading-[1.1]">
            Tvoj trening, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500 dark:from-indigo-400 dark:via-cyan-400 dark:to-emerald-400">
              tvoja aura,
            </span>{" "}
            <br />
            tvoj mentor.
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 mb-10 sm:mb-12 max-w-2xl mx-auto md:mx-0 leading-relaxed transition-colors duration-200">
            Hibridna fitnes platforma koja spaja snagu veštačke inteligencije sa stručnošću pravih trenera. 
            Prati ishranu, beleži treninge i ostvari rezultate brže nego ikada.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button
              onClick={() => handleSignIn('client')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-zinc-950 px-8 py-4 rounded-full font-bold hover:bg-slate-800 dark:hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg dark:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              Započni besplatno
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleSignIn('coach')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/50 dark:bg-zinc-900/50 text-slate-700 dark:text-zinc-300 px-8 py-4 rounded-full font-medium hover:bg-white dark:hover:bg-zinc-800 transition-all border border-slate-200 dark:border-zinc-800 backdrop-blur-sm cursor-pointer"
            >
              Ja sam trener
            </button>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-24 sm:mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/60 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-900/60 transition-colors shadow-sm dark:shadow-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-200 dark:border-indigo-500/20 transition-colors duration-200">
              <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white transition-colors duration-200">AI Analiza Ishrane</h3>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base transition-colors duration-200">
              Samo opiši šta si pojeo, a Aura Fit AI će automatski izračunati kalorije i makronutrijente.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/60 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-900/60 transition-colors shadow-sm dark:shadow-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center mb-6 border border-cyan-200 dark:border-cyan-500/20 transition-colors duration-200">
              <Activity className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white transition-colors duration-200">Pametni Treninzi</h3>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base transition-colors duration-200">
              Prati svoj progres i "Progressive Overload". AI prepoznaje kada stagniraš i predlaže promene.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/60 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-900/60 transition-colors sm:col-span-2 md:col-span-1 shadow-sm dark:shadow-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-200 dark:border-emerald-500/20 transition-colors duration-200">
              <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white transition-colors duration-200">Coach Connect</h3>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base transition-colors duration-200">
              Poveži se sa pravim trenerom koji će pratiti tvoje rezultate i prilagođavati plan tvojim potrebama.
            </p>
          </motion.div>
        </div>
      </main>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/20">
                  <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Admin Prijava</h2>
              <p className="text-slate-600 dark:text-zinc-400 mb-8">
                Unesite vaše administratorske podatke za pristup kontrolnom panelu.
              </p>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                {adminError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl text-sm text-rose-600 dark:text-rose-400">
                    {adminError}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Korisničko ime
                  </label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="npr. admin"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/30 text-slate-900 dark:text-white transition-colors duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Lozinka
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/30 text-slate-900 dark:text-white transition-colors duration-200"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {adminLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Prijavi se"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
