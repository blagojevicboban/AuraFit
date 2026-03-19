import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, User, Heart, Lock, Settings, HelpCircle, LogOut, ChevronRight,
  Home, BookOpen, Apple, Headphones
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { userData, signOut } = useAuth();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: t('profile.editProfile'), onClick: () => navigate('/profile/edit') },
    { icon: Heart, label: t('profile.favorite'), onClick: () => navigate('/favorites') },
    { icon: Lock, label: t('profile.privacy'), onClick: () => navigate('/privacy') },
    { icon: Settings, label: t('profile.settings'), onClick: () => navigate('/settings') },
    { icon: HelpCircle, label: t('common.help'), onClick: () => navigate('/help') },
    { icon: LogOut, label: t('profile.logout'), onClick: handleLogout, danger: true },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col pb-24 transition-colors duration-300 overflow-x-hidden">
      
      {/* ── Header Area ── */}
      <div className="relative">
        <div className="bg-[#afa3ff] pt-12 pb-24 px-6 rounded-b-[4rem] relative z-10 shadow-2xl overflow-hidden">
          {/* Background Decorative Circles */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-[#d6ff3e]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <button 
              onClick={() => navigate(-1)}
              className="text-[#1c1c1c] bg-white/30 backdrop-blur-md p-2.5 rounded-2xl hover:bg-white/40 active:scale-95 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-black text-[#1c1c1c] uppercase tracking-widest">{t('common.profile')}</h1>
            <button 
              onClick={() => navigate('/settings')}
              className="text-[#1c1c1c] bg-white/30 backdrop-blur-md p-2.5 rounded-2xl hover:bg-white/40 transition-all"
            >
              <Settings size={22} />
            </button>
          </div>
  
          <div className="flex flex-col items-center relative z-10">
            {/* Avatar */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-6"
            >
              <div className="w-36 h-36 rounded-full p-1.5 bg-gradient-to-tr from-[#d6ff3e] to-white/50 shadow-2xl">
                <div className="w-full h-full rounded-full border-4 border-[#1c1c1c]/10 overflow-hidden bg-zinc-900 flex items-center justify-center relative shadow-inner">
                  {userData?.photoURL ? (
                    <img src={userData.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl font-black text-[#afa3ff]">{userData?.displayName?.charAt(0).toUpperCase() || 'A'}</span>
                  )}
                  {/* Status Indicator */}
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#d6ff3e] rounded-full border-4 border-[#1c1c1c]/20" />
                </div>
              </div>
            </motion.div>
  
            <h2 className="text-3xl font-black text-[#1c1c1c] tracking-tight text-center mb-1">
              {userData?.displayName || 'User'}
            </h2>
            <p className="text-[#1c1c1c]/60 text-base font-medium mb-3">{userData?.email || 'email@example.com'}</p>
            
            <div className="px-5 py-1.5 bg-[#1c1c1c] text-[#d6ff3e] text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg border border-white/10">
              {userData?.role || 'CLIENT'}
            </div>
          </div>
        </div>

        {/* Stats Card (Floating) - Higher Z-index and Premium Look */}
        <div className="px-6 -mt-12 relative z-20">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[2.5rem] flex items-center justify-around py-8 px-2 border border-white/20 dark:border-white/5 backdrop-blur-xl"
          >
            <div className="text-center group flex-1">
              <div className="text-zinc-900 dark:text-white font-black text-2xl mb-1 tabular-nums">
                {userData?.weight || '--'} <span className="text-xs text-zinc-400">kg</span>
              </div>
              <div className="text-zinc-500 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest">{t('profile.weight')}</div>
            </div>
            
            <div className="w-[1px] h-10 bg-zinc-100 dark:bg-zinc-800" />
            
            <div className="text-center group flex-1">
              <div className="text-zinc-900 dark:text-white font-black text-2xl mb-1 tabular-nums">
                {userData?.age || '--'}
              </div>
              <div className="text-zinc-500 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest">{t('profile.age')}</div>
            </div>
            
            <div className="w-[1px] h-10 bg-zinc-100 dark:bg-zinc-800" />
            
            <div className="text-center group flex-1">
              <div className="text-zinc-900 dark:text-white font-black text-2xl mb-1 tabular-nums">
                {userData?.height || '--'} <span className="text-xs text-zinc-400">cm</span>
              </div>
              <div className="text-zinc-500 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest">{t('profile.height')}</div>
            </div>
          </motion.div>
        </div>
      </div>
 
      {/* ── Menu List ── */}
      <div className="px-6 pt-10 pb-8 grid grid-cols-1 gap-4">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            onClick={item.onClick}
            className={`flex items-center justify-between p-4 rounded-3xl group transition-all duration-300 ${
              item.danger 
                ? 'bg-rose-500/5 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20' 
                : 'bg-white dark:bg-zinc-900/40 hover:bg-[#afa3ff]/10 border border-zinc-100 dark:border-white/5 hover:border-[#afa3ff]/30 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                item.danger 
                  ? 'bg-rose-500/20 text-rose-500' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-[#afa3ff] group-hover:bg-[#afa3ff]/20 group-hover:text-[#afa3ff]'
              }`}>
                <item.icon size={22} className="transition-transform group-active:scale-90" />
              </div>
              <span className={`text-base font-bold transition-colors ${
                item.danger ? 'text-rose-500' : 'text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white'
              }`}>
                {item.label}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/50 group-hover:bg-white dark:group-hover:bg-[#afa3ff]/10 text-zinc-300 dark:text-zinc-600 group-hover:text-[#afa3ff] transition-all">
              <ChevronRight size={18} />
            </div>
          </motion.button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
