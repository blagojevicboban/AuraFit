import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Activity, Brain, Users, Sparkles, Sun, Moon, Shield, X, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Landing() {
  const { signIn, passwordSignIn, adminSignIn, userData } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginRole, setLoginRole] = useState<'client' | 'coach' | 'admin'>('client');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

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

  const handleSignIn = async (role: 'client' | 'coach' | 'admin') => {
    setLoginRole(role);
    setShowLoginModal(true);
    setLoginError("");
    setUsername("");
    setPassword("");
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn(loginRole);
      setShowLoginModal(false);
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        console.error("Login failed", error);
      }
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      if (loginRole === 'admin') {
        await adminSignIn(username, password);
      } else {
        await passwordSignIn(username, password, loginRole);
      }
      setShowLoginModal(false);
    } catch (error: any) {
      console.error("Login failed", error);
      setLoginError(error.message || "Pogrešno korisničko ime ili lozinka.");
    } finally {
      setLoginLoading(false);
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
            <button onClick={() => handleSignIn('admin')} className="hidden md:block text-xs font-medium text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
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

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
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
                  {loginRole === 'admin' ? <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> : <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {loginRole === 'admin' ? 'Admin Prijava' : loginRole === 'coach' ? 'Portal za trenere' : 'Prijava za klijente'}
              </h2>
              <p className="text-slate-600 dark:text-zinc-400 mb-8">
                Prijavite se na svoj nalog koristeći Google ili korisničko ime.
              </p>

              <form onSubmit={handlePasswordLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl text-sm text-rose-600 dark:text-rose-400">
                    {loginError}
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 px-4 py-3 rounded-xl font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors mb-6"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Prijavi se putem Google-a
                </button>

                <div className="relative flex items-center gap-4 my-6">
                  <div className="flex-grow h-px bg-slate-200 dark:bg-zinc-800"></div>
                  <span className="text-xs font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">ili</span>
                  <div className="flex-grow h-px bg-slate-200 dark:bg-zinc-800"></div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Korisničko ime
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="npr. ana"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="npr. ana12345"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/30 text-slate-900 dark:text-white transition-colors duration-200"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loginLoading ? (
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
