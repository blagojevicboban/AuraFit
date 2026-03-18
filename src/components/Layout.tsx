import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Activity, LayoutDashboard, Users, LogOut, Menu, X, User, Sun, Moon, Shield } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ui/ThemeToggle";
import { LanguageToggle } from "./ui/LanguageToggle";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, signOut, loading, isImpersonating, stopImpersonating } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isCoach = location.pathname.includes("/coach");
  const isClient = location.pathname.includes("/client");
  const isAdmin = location.pathname.includes("/admin");

  useEffect(() => {
    if (!loading && !userData && (isCoach || isClient || isAdmin)) {
      navigate('/');
    }
  }, [userData, loading, isCoach, isClient, isAdmin, navigate]);

  if (!isCoach && !isClient && !isAdmin) {
    return <Outlet />;
  }

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center transition-colors duration-200">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 dark:text-zinc-400 font-medium">{t('common.loading')}</p>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const clientLinks = [
    { to: "/client", icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: "/client/workouts", icon: Activity, label: t('nav.workouts') },
  ];

  const coachLinks = [
    { to: "/coach", icon: LayoutDashboard, label: t('nav.overview') },
    { to: "/coach/clients", icon: Users, label: t('nav.clients') },
  ];

  const adminLinks = [
    { to: "/app/admin", icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: "/app/admin/users", icon: Users, label: t('nav.users') },
  ];

  const links = userData.role === 'admin' ? adminLinks : userData.role === 'coach' ? coachLinks : clientLinks;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col transition-colors duration-300">
      {isImpersonating && (
        <div className="bg-emerald-600 text-zinc-950 px-4 py-2 flex items-center justify-between sticky top-0 z-[60] shadow-lg">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            <span>{t('common.impersonatingAs')} <strong>{userData.displayName}</strong></span>
          </div>
          <button 
            onClick={() => {
              stopImpersonating();
              navigate('/admin/users');
            }}
            className="bg-zinc-950/20 hover:bg-zinc-950/30 px-3 py-1 rounded-lg text-xs font-black transition-colors"
          >
            {t('common.backToAdmin')}
          </button>
        </div>
      )}
      <div className="flex flex-col md:flex-row flex-1">
      
      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-200 dark:border-white/5 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-zinc-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            AF
          </div>
          <span className="text-xl font-display font-bold tracking-tight">Aura Fit</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-zinc-900 border-l border-white/5 z-50 p-8 flex flex-col md:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-display font-bold">{t('common.profile')}</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-zinc-400 hover:text-white bg-white/5 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-10 p-6 bg-white/5 rounded-3xl border border-white/5">
                <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center text-zinc-950 font-black text-xl shadow-lg shadow-emerald-500/20">
                  {userData.displayName ? userData.displayName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <p className="font-bold text-lg">{userData.displayName}</p>
                  <p className="text-sm text-zinc-500 uppercase tracking-widest font-black text-[10px]">{userData.role}</p>
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-sm font-black text-rose-400 bg-rose-400/10 hover:bg-rose-400/20 transition-all uppercase tracking-widest"
                >
                  <LogOut className="w-5 h-5" />
                  {t('common.signOut')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-zinc-50/50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-white/5 flex-col sticky top-0 h-screen transition-colors duration-300">
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-zinc-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              AF
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">Aura Fit</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300",
                location.pathname === link.to 
                  ? "bg-emerald-500 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/5"
              )}
            >
              <link.icon className={cn("w-5 h-5", location.pathname === link.to ? "text-zinc-950" : "text-zinc-500")} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-zinc-200 dark:border-white/5 m-4 bg-white dark:bg-white/5 rounded-[2rem] shadow-sm dark:shadow-none transition-colors duration-300">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center text-zinc-500 border border-zinc-200 dark:border-white/5 overflow-hidden">
              {userData.photoURL ? (
                <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold truncate">{userData.displayName}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{userData.role}</p>
            </div>
            <ThemeToggle className="w-8 h-8 rounded-lg" />
            <LanguageToggle className="w-20 h-8 rounded-lg" />
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black text-zinc-500 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-400/10 transition-all uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            {t('common.signOut')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-200 dark:border-white/5 pb-safe z-40 transition-colors duration-300">
        <div className="flex items-center justify-around p-3">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300",
                  isActive ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500 hover:text-emerald-600 dark:hover:text-white"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl mb-1 transition-all duration-300",
                  isActive ? "bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "bg-transparent"
                )}>
                  <link.icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "scale-110" : "scale-100")} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>

  </div>
);
}
