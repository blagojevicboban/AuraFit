import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Pencil,
  Home, BookOpen, Apple, User, Headphones
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import BottomNav from '../components/BottomNav';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1c1c] text-zinc-900 dark:text-white font-sans flex flex-col pb-24 transition-colors duration-300">
      
      {/* ── Header Area ── */}
      <div className="bg-[#afa3ff] pt-12 pb-6 px-6 rounded-b-[3rem] relative z-10 shadow-lg">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 text-[#1c1c1c] hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-extrabold text-[#1c1c1c] mb-6 self-start">{t('profile.myProfile')}</h1>
            
            {/* Avatar with Edit Icon */}
            <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-[#d6ff3e] overflow-hidden shadow-xl bg-zinc-800 flex items-center justify-center">
                    {userData?.photoURL ? (
                      <img src={userData.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl">{userData?.displayName?.charAt(0).toUpperCase() || 'A'}</span>
                    )}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#d6ff3e] rounded-full flex items-center justify-center border-4 border-[#afa3ff] shadow-lg hover:scale-110 transition-transform">
                    <Pencil size={18} className="text-[#1c1c1c]" />
                </button>
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

      {/* ── Edit Form ── */}
      <div className="flex-grow pt-14 px-6 space-y-6">
        <Input 
            label={t('profile.fullName')} 
            defaultValue={userData?.displayName || ''} 
            placeholder={language === 'sr' ? "Unesite ime" : "Enter your name"}
        />
        <Input 
            label={t('profile.email')} 
            defaultValue={userData?.email || ''} 
            placeholder={language === 'sr' ? "Unesite email" : "Enter your email"}
            type="email"
            disabled
        />
        <Input 
            label={t('profile.mobile')} 
            defaultValue="" 
            placeholder={language === 'sr' ? "Unesite broj telefona" : "Enter mobile number"}
        />
        <Input 
            label={t('profile.dob')} 
            defaultValue="" 
            placeholder="DD / MM / YYYY"
        />
        <div className="flex gap-4">
            <Input 
                label={t('profile.weight')} 
                defaultValue="" 
                placeholder="-- Kg"
                className="flex-1"
            />
            <Input 
                label={t('profile.height')} 
                defaultValue="" 
                placeholder="-- CM"
                className="flex-1"
            />
        </div>

        <Button 
            className="w-full mt-4 bg-emerald-500 dark:bg-[#d6ff3e] text-white dark:text-[#1c1c1c] border-none hover:opacity-90 transition-opacity"
            onClick={() => navigate('/profile')}
        >
            {t('profile.update')}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default EditProfile;
