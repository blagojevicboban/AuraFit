import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, User, Heart, Lock, Settings, HelpCircle, LogOut, ChevronRight,
  Home, BookOpen, Apple, Headphones
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: 'Profile', onClick: () => navigate('/profile/edit') },
    { icon: Heart, label: 'Favorite', onClick: () => {} },
    { icon: Lock, label: 'Privacy Policy', onClick: () => {} },
    { icon: Settings, label: 'Settings', onClick: () => navigate('/settings') },
    { icon: HelpCircle, label: 'Help', onClick: () => {} },
    { icon: LogOut, label: 'Logout', onClick: () => navigate('/login'), danger: true },
  ];

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-24">
      
      {/* ── Header Area ── */}
      <div className="bg-[#afa3ff] pt-12 pb-6 px-6 rounded-b-[3rem] relative z-10 shadow-lg">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 text-[#1c1c1c] hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-extrabold text-[#1c1c1c] mb-6 self-start">My Profile</h1>
            
            {/* Avatar */}
            <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-[#d6ff3e] overflow-hidden shadow-xl bg-zinc-800 flex items-center justify-center">
                    <img src="/assets/profile.png" alt="Avatar" className="w-full h-full object-cover" />
                </div>
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
                    item.danger ? 'bg-red-500/10' : 'bg-[#afa3ff]/10 group-hover:bg-[#afa3ff]'
                }`}>
                    <item.icon size={20} className={`${
                        item.danger ? 'text-red-500' : 'text-[#afa3ff] group-hover:text-[#1c1c1c]'
                    }`} />
                </div>
                <span className={`text-lg font-bold group-hover:text-[#d6ff3e] transition-colors ${item.danger ? 'text-red-500' : 'text-zinc-200'}`}>
                    {item.label}
                </span>
            </div>
            <ChevronRight size={20} className="text-zinc-500 group-hover:text-[#d6ff3e] transition-colors" />
          </motion.div>
        ))}
      </div>

      <BottomNav />

    </div>
  );
};

export default Profile;
