import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Bell, Key, Trash2, ChevronDown, UserPlus,
  LogOut, Globe, Moon, Sun
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { CoachApplicationModal } from '../components/auth/CoachApplicationModal';
import BottomNav from '../components/BottomNav';
import TopHeader from '../components/TopHeader';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { userData, logOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showCoachModal, setShowCoachModal] = useState(false);
  const isClient = userData?.role === 'client';

  const settingsItems = [
    { icon: Bell, label: t('settings.notifications'), onClick: () => navigate('/settings/notifications') },
    { icon: Key, label: t('settings.password'), onClick: () => navigate('/settings/password') },
    ...(isClient ? [{ icon: UserPlus, label: t('settings.becomeCoach'), onClick: () => setShowCoachModal(true), highlight: true }] : []),
    { icon: Trash2, label: t('settings.deleteAccount'), onClick: () => navigate('/settings/delete-account'), danger: true },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col pb-24 transition-colors duration-300">
      
      {/* ── Header ── */}
      <TopHeader title={t('settings.title')} />

      {/* ── Preferences Section ── */}
      <div className="px-6 space-y-6 pt-6">
        <h3 className="text-zinc-400 dark:text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] px-2">Preferences</h3>
        
        {/* Language Switcher */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-white/5">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                 <Globe size={18} />
              </div>
              <span className="font-bold">{t('settings.language')}</span>
           </div>
           <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${language === 'en' ? 'bg-emerald-500 text-white shadow-md' : 'text-zinc-500'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('sr')}
                className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${language === 'sr' ? 'bg-emerald-500 text-white shadow-md' : 'text-zinc-500'}`}
              >
                SR
              </button>
           </div>
        </div>

        {/* Theme Switcher */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-white/5">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#afa3ff]/10 flex items-center justify-center text-[#afa3ff]">
                 {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              </div>
              <span className="font-bold">{t('settings.theme')}</span>
           </div>
           <button 
             onClick={toggleTheme}
             className="relative w-14 h-7 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 transition-colors"
           >
              <motion.div 
                animate={{ x: theme === 'dark' ? 28 : 0 }}
                className="w-5 h-5 bg-white dark:bg-[#d6ff3e] rounded-full shadow-md"
              />
           </button>
        </div>
      </div>

      <div className="h-px bg-zinc-100 dark:bg-white/5 mx-6 my-8" />

      {/* ── Menu List ── */}
      <div className="px-6 space-y-4">
        <h3 className="text-zinc-400 dark:text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] px-2">Account</h3>
        {settingsItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={item.onClick}
            className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-white/5 group cursor-pointer active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    item.danger ? 'bg-red-500/10 text-red-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:bg-emerald-500 group-hover:text-white'
                }`}>
                    <item.icon size={18} />
                </div>
                <span className="font-bold text-zinc-700 dark:text-zinc-200">
                    {item.label}
                </span>
            </div>
            <ChevronDown size={18} className="text-zinc-300 dark:text-zinc-600 group-hover:text-emerald-500" />
          </motion.div>
        ))}

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full mt-6 flex items-center justify-center gap-3 p-5 bg-zinc-100 dark:bg-zinc-900/50 text-red-500 font-black uppercase text-xs tracking-widest rounded-3xl border border-zinc-200 dark:border-white/5 hover:bg-red-500 hover:text-white transition-all shadow-sm"
        >
          <LogOut size={16} />
          {t('settings.logout')}
        </button>
      </div>

      <BottomNav />

      <AnimatePresence>
        {showCoachModal && (
          <CoachApplicationModal onClose={() => setShowCoachModal(false)} />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Settings;
