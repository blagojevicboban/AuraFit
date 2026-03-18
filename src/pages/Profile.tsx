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
    { icon: Heart, label: t('profile.favorite'), onClick: () => {} },
    { icon: Lock, label: t('profile.privacy'), onClick: () => {} },
    { icon: Settings, label: t('profile.settings'), onClick: () => navigate('/settings') },
    { icon: HelpCircle, label: t('common.help'), onClick: () => navigate('/help') },
    { icon: LogOut, label: t('profile.logout'), onClick: handleLogout, danger: true },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col pb-24 transition-colors duration-300">
      
      {/* ── Header Area ── */}
      <div className="bg-[#afa3ff] pt-12 pb-6 px-6 rounded-b-[3rem] relative z-10 shadow-lg">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 text-[#1c1c1c] hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
 
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-extrabold text-[#1c1c1c] mb-6 self-start">{t('common.profile')}</h1>
            
            {/* Avatar */}
            <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-[#d6ff3e] overflow-hidden shadow-xl bg-zinc-800 flex items-center justify-center">
                    {userData?.photoURL ? (
                      <img src={userData.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl">{userData?.displayName?.charAt(0).toUpperCase() || 'A'}</span>
                    )}
                </div>
            </div>
 
            <h2 className="text-2xl font-black text-[#1c1c1c] leading-tight text-center">{userData?.displayName || 'User'}</h2>
            <p className="text-[#1c1c1c]/70 text-sm font-medium">{userData?.email || 'email@example.com'}</p>
            <p className="text-[#1c1c1c] text-xs font-bold mt-1 uppercase tracking-widest">{userData?.role}</p>
 
            {/* Stats Card (Floating) */}
            <div className="mt-8 bg-white/90 dark:bg-[#afa3ff]/90 backdrop-blur-md rounded-2xl w-full flex items-center justify-around py-4 border border-white/20 shadow-lg translate-y-4">
                <div className="text-center">
                    <div className="text-[#1c1c1c] font-black text-lg">-- Kg</div>
                    <div className="text-[#1c1c1c]/60 text-[10px] font-bold uppercase tracking-wider">{t('profile.weight')}</div>
                </div>
                <div className="w-[1px] h-8 bg-[#1c1c1c]/20" />
                <div className="text-center">
                    <div className="text-[#1c1c1c] font-black text-lg">--</div>
                    <div className="text-[#1c1c1c]/60 text-[10px] font-bold uppercase tracking-wider">{t('profile.age')}</div>
                </div>
                <div className="w-[1px] h-8 bg-[#1c1c1c]/20" />
                <div className="text-center">
                    <div className="text-[#1c1c1c] font-black text-lg">-- CM</div>
                    <div className="text-[#1c1c1c]/60 text-[10px] font-bold uppercase tracking-wider">{t('profile.height')}</div>
                </div>
            </div>
        </div>
      </div>
 
      {/* ── Menu List ── */}
      <div className="flex-grow pt-12 px-6 space-y-4">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={item.onClick}
            className="flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    item.danger ? 'bg-red-500/10' : 'bg-[#afa3ff]/10 dark:group-hover:bg-[#afa3ff]'
                }`}>
                    <item.icon size={20} className={`${
                        item.danger ? 'text-red-500' : 'text-[#afa3ff] dark:group-hover:text-[#1c1c1c]'
                    }`} />
                </div>
                <span className={`text-lg font-bold group-hover:text-emerald-500 dark:group-hover:text-[#d6ff3e] transition-colors ${item.danger ? 'text-red-500' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {item.label}
                </span>
            </div>
            <ChevronRight size={20} className="text-zinc-500 dark:text-zinc-500 group-hover:text-emerald-500 dark:group-hover:text-[#d6ff3e] transition-colors" />
          </motion.div>
        ))}
      </div>

      <BottomNav />

    </div>
  );
};

export default Profile;
