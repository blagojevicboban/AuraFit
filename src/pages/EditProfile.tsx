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

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-24">
      
      {/* ── Header Area (Similar to Profile but slightly adapted) ── */}
      <div className="bg-[#afa3ff] pt-12 pb-6 px-6 rounded-b-[3rem] relative z-10 shadow-lg">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 text-[#1c1c1c] hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-extrabold text-[#1c1c1c] mb-6 self-start">My Profile</h1>
            
            {/* Avatar with Edit Icon */}
            <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-[#d6ff3e] overflow-hidden shadow-xl bg-zinc-800 flex items-center justify-center">
                    <span className="text-6xl opacity-20">👩</span>
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#d6ff3e] rounded-full flex items-center justify-center border-4 border-[#afa3ff] shadow-lg hover:scale-110 transition-transform">
                    <Pencil size={18} className="text-[#1c1c1c]" />
                </button>
            </div>

            <h2 className="text-2xl font-black text-[#1c1c1c] leading-tight">Madison Smith</h2>
            <p className="text-[#1c1c1c]/70 text-sm font-medium">madisons@example.com</p>
            <p className="text-[#1c1c1c] text-xs font-bold mt-1">Birthday: <span className="text-white">April 1st</span></p>

            {/* Stats Card (Floating) */}
            <div className="mt-8 bg-[#afa3ff] bg-opacity-80 backdrop-blur-md rounded-2xl w-full flex items-center justify-around py-4 border border-white/20 shadow-lg translate-y-4">
                <div className="text-center">
                    <div className="text-[#1c1c1c] font-black text-lg">75 Kg</div>
                    <div className="text-[#1c1c1c]/60 text-[10px] font-bold uppercase tracking-wider">Weight</div>
                </div>
                <div className="w-[1px] h-8 bg-[#1c1c1c]/20" />
                <div className="text-center">
                    <div className="text-[#1c1c1c] font-black text-lg">28</div>
                    <div className="text-[#1c1c1c]/60 text-[10px] font-bold uppercase tracking-wider">Years Old</div>
                </div>
                <div className="w-[1px] h-8 bg-[#1c1c1c]/20" />
                <div className="text-center">
                    <div className="text-[#1c1c1c] font-black text-lg">1.65 CM</div>
                    <div className="text-[#1c1c1c]/60 text-[10px] font-bold uppercase tracking-wider">Height</div>
                </div>
            </div>
        </div>
      </div>

      {/* ── Edit Form ── */}
      <div className="flex-grow pt-14 px-6 space-y-6">
        <Input 
            label={t('profile.fullName')} 
            defaultValue={userData?.displayName || ''} 
            placeholder="Enter your name"
        />
        <Input 
            label={t('profile.email')} 
            defaultValue={userData?.email || ''} 
            placeholder="Enter your email"
            type="email"
            disabled
        />
        <Input 
            label={t('profile.mobile')} 
            defaultValue="" 
            placeholder="Enter mobile number"
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

      {/* ── Fixed Bottom Navigation ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 flex items-center justify-around z-50">
        {[
          { icon: Home, label: 'Home', active: false, path: '/home' },
          { icon: BookOpen, label: 'Workouts', active: false, path: '/workouts' },
          { icon: Apple, label: 'Nutrition', active: false, path: '/nutrition' },
          { icon: User, label: 'Profile', active: true, path: '/profile' },
        ].map(({ icon: Icon, label, active, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 ${active ? 'text-[#afa3ff]' : 'text-zinc-500 hover:text-white'} transition-colors`}
          >
            <Icon size={24} strokeWidth={active ? 2.5 : 1.5} />
            <span className="text-[10px] font-bold">{label}</span>
          </button>
        ))}
      </div>

    </div>
  );
};

export default EditProfile;
