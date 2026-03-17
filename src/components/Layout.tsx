import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Activity, LayoutDashboard, Users, LogOut, Menu, X, User, Sun, Moon, Shield } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, signOut, loading, isImpersonating, stopImpersonating } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
        <p className="text-slate-500 dark:text-zinc-400 font-medium">Učitavanje Aura Fit...</p>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const clientLinks = [
    { to: "/client", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/client/workouts", icon: Activity, label: "Treninzi" },
  ];

  const coachLinks = [
    { to: "/coach", icon: LayoutDashboard, label: "Pregled" },
    { to: "/coach/clients", icon: Users, label: "Klijenti" },
  ];

  const adminLinks = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/users", icon: Users, label: "Korisnici" },
  ];

  const links = userData.role === 'admin' ? adminLinks : userData.role === 'coach' ? coachLinks : clientLinks;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 flex flex-col transition-colors duration-200">
      {isImpersonating && (
        <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-between sticky top-0 z-[60] shadow-lg">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Shield className="w-4 h-4" />
            <span>Prijavljeni ste kao: <strong>{userData.displayName}</strong> ({userData.role})</span>
          </div>
          <button 
            onClick={() => {
              stopImpersonating();
              navigate('/admin/users');
            }}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-xs font-bold transition-colors"
          >
            Nazad na Admin
          </button>
        </div>
      )}
      <div className="flex flex-col md:flex-row flex-1">
      
      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
            {userData.displayName ? userData.displayName.charAt(0).toUpperCase() : 'A'}
          </div>
          <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-zinc-400">Aura Fit</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-out Menu (Profile & Settings) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 z-50 p-6 flex flex-col md:hidden shadow-2xl transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profil</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-slate-100 dark:bg-zinc-800/50 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 dark:bg-zinc-800/30 rounded-2xl border border-slate-200 dark:border-zinc-800/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                  {userData.displayName ? userData.displayName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{userData.displayName}</p>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 capitalize">{userData.role}</p>
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-400/10 hover:bg-red-100 dark:hover:bg-red-400/20 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Odjavi se
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800/50 flex-col sticky top-0 h-screen transition-colors duration-200">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
              {userData.displayName ? userData.displayName.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-zinc-400">Aura Fit</span>
          </div>
          <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                location.pathname === link.to 
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]" 
                  : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-200"
              )}
            >
              <link.icon className={cn("w-5 h-5", location.pathname === link.to ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-zinc-500")} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-zinc-800/50 m-4 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl transition-colors">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-300">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 dark:text-zinc-200 truncate">{userData.displayName}</p>
              <p className="text-xs text-slate-500 dark:text-zinc-500 capitalize">{userData.role}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Odjavi se
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 bg-slate-50 dark:bg-zinc-950 transition-colors duration-200">
        <div className="max-w-5xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-slate-200 dark:border-zinc-800/50 pb-safe z-40 transition-colors duration-200">
        <div className="flex items-center justify-around p-2">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-200",
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full mb-1 transition-all duration-300",
                  isActive ? "bg-indigo-100 dark:bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]" : "bg-transparent"
                )}>
                  <link.icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "scale-110" : "scale-100")} />
                </div>
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  </div>
);
}
