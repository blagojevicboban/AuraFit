import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Activity, Brain, Users, Sparkles, Sun, Moon, Shield, X, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { LanguageToggle } from "../components/ui/LanguageToggle";

export default function Landing() {
  const { signIn, passwordSignIn, adminSignIn, userData } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
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
        navigate('/app/admin');
      } else if (userData.role === 'coach') {
        navigate('/app/coach');
      } else {
        navigate('/home');
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
      const { isNewUser } = await signIn(loginRole);
      setShowLoginModal(false);
      if (isNewUser) {
        navigate('/setup');
      } else {
        if (loginRole === 'admin') navigate('/app/admin');
        else if (loginRole === 'coach') navigate('/app/coach');
        else navigate('/home');
      }
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
      // If it's a firebase error with a code, show the code to help debugging
      const errorMessage = error.code ? `Greška: ${error.code}` : (error.message || "Pogrešno korisničko ime ili lozinka.");
      setLoginError(errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-emerald-500/30 overflow-hidden relative transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="border-b border-zinc-200 dark:border-white/5 relative z-10 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-zinc-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              AF
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">Aura Fit</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <ThemeToggle />
            <button onClick={() => handleSignIn('admin')} className="hidden md:block text-xs font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer">
              {t('landing.admin')}
            </button>
            <button onClick={() => handleSignIn('client')} className="hidden sm:block text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer">
              {t('landing.login')}
            </button>
            <button
              onClick={() => handleSignIn('coach')}
              className="text-xs sm:text-sm font-bold bg-zinc-900/5 dark:bg-white/10 text-zinc-900 dark:text-white px-6 py-2.5 rounded-full hover:bg-zinc-900/10 dark:hover:bg-white/20 transition-all border border-zinc-200 dark:border-white/10 cursor-pointer backdrop-blur-md"
            >
              {t('landing.coachPortal')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm font-bold mb-8 border border-emerald-500/20 backdrop-blur-sm uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            {t('landing.futureOfFitness')}
          </div>
          
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-black tracking-tighter mb-8 leading-[0.9] text-gradient">
            {t('landing.yourWorkout')} <br />
            <span className="text-transparent bg-clip-text brand-gradient">
              {t('landing.yourAura')}
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            {t('landing.heroDesc').split(t('landing.aiIntelligence')).map((part: string, i: number) => i === 0 ? part : <><span key={i} className="text-zinc-950 dark:text-white font-medium">{t('landing.aiIntelligence')}</span>{part}</>)}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
            <button
              onClick={() => handleSignIn('client')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 brand-gradient text-zinc-950 px-10 py-5 rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            >
              {t('landing.startTransformation')}
              <ArrowRight className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleSignIn('coach')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-900 dark:text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-white/10 backdrop-blur-sm cursor-pointer"
            >
              {t('landing.becomeMentor')}
            </button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-40">
          {[
            { icon: Brain, title: t('landing.aiNutrient'), desc: t('landing.aiNutrientDesc'), color: "emerald" },
            { icon: Activity, title: t('landing.smartWorkout'), desc: t('landing.smartWorkoutDesc'), color: "cyan" },
            { icon: Users, title: t('landing.eliteCoaching'), desc: t('landing.eliteCoachingDesc'), color: "indigo" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="glass-card p-10 rounded-[2.5rem] hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-all group cursor-default"
            >
              <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-500/20 flex items-center justify-center mb-8 border border-${feature.color}-500/20 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-8 h-8 text-${feature.color}-400`} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">{feature.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                {feature.desc}
              </p>
            </motion.div>
          ))}
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
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass-card rounded-[2.5rem] overflow-hidden p-10"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                  {loginRole === 'admin' ? <Shield className="w-7 h-7 text-emerald-400" /> : <User className="w-7 h-7 text-emerald-400" />}
                </div>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="p-3 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-white/5"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <h2 className="text-3xl font-display font-bold mb-2">
                {loginRole === 'admin' ? t('landing.adminLogin') : loginRole === 'coach' ? t('landing.coachLogin') : t('landing.clientLogin')}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-10 font-light">
                {t('landing.welcomeBack')}
              </p>

              <form onSubmit={handlePasswordLogin} className="space-y-6">
                {loginError && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-sm text-rose-400">
                    {loginError}
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-6 py-4 rounded-2xl font-bold text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {t('landing.continueWithGoogle')}
                </button>

                <div className="relative flex items-center gap-4 py-2">
                  <div className="flex-grow h-px bg-zinc-200 dark:bg-white/10"></div>
                  <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-600 uppercase tracking-[0.2em]">{t('landing.or')}</span>
                  <div className="flex-grow h-px bg-zinc-200 dark:bg-white/10"></div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-zinc-600 dark:text-zinc-500 uppercase tracking-widest mb-2 px-1">
                      {t('landing.username')}
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={t('landing.usernamePlaceholder')}
                      className="w-full px-6 py-4 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-zinc-900 dark:text-white transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-zinc-600 dark:text-zinc-500 uppercase tracking-widest mb-2 px-1">
                      {t('landing.password')}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-6 py-4 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-zinc-900 dark:text-white transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full mt-4 flex items-center justify-center gap-2 brand-gradient text-zinc-950 px-6 py-4 rounded-2xl font-black hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {loginLoading ? (
                    <div className="w-6 h-6 border-3 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                  ) : (
                    t('landing.accessAccount')
                  )}
                </button>
              </form>

              <div className="mt-8 text-center px-2">
                <p className="text-zinc-600 dark:text-zinc-500 text-sm font-medium">
                  {t('landing.noAccount')} <Link to="/signup" className="text-emerald-500 dark:text-[#d6ff3e] font-black hover:underline uppercase tracking-tighter ml-1">{t('landing.signUp')}</Link>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
