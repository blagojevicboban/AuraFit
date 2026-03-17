import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft,
  Home, BookOpen, Apple, User, Headphones
} from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    general: true,
    sound: true,
    dnd: true,
    vibrate: false,
    lockScreen: false,
    reminders: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const rows = [
    { key: 'general' as const, label: 'General Notification' },
    { key: 'sound' as const, label: 'Sound' },
    { key: 'dnd' as const, label: "Don't Disturb Mode" },
    { key: 'vibrate' as const, label: 'Vibrate' },
    { key: 'lockScreen' as const, label: 'Lock Screen' },
    { key: 'reminders' as const, label: 'Reminders' },
  ];

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-24">
      
      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-8">
        <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)}
              className="text-[#d6ff3e] hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-extrabold text-[#afa3ff]">Notifications Settings</h1>
        </div>
      </div>

      {/* ── Settings List ── */}
      <div className="flex-grow px-6 space-y-8 pt-4">
        {rows.map((row, index) => (
          <motion.div
            key={row.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between"
          >
            <span className="text-lg font-bold text-zinc-200">{row.label}</span>
            
            {/* Custom Toggle Switch */}
            <button 
              onClick={() => toggle(row.key)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                settings[row.key] ? 'bg-[#d6ff3e]' : 'bg-[#afa3ff]/30'
              }`}
            >
              <motion.div 
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-shadow ${
                    settings[row.key] ? 'shadow-[0_0_8px_white]' : ''
                }`}
                animate={{ x: settings[row.key] ? 28 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </motion.div>
        ))}
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

export default NotificationSettings;
