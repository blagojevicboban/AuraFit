import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Bell, Key, Trash2, ChevronDown,
  Home, BookOpen, Apple, User, Headphones
} from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const settingsItems = [
    { icon: Bell, label: 'Notification Setting', onClick: () => navigate('/settings/notifications') },
    { icon: Key, label: 'Password Setting', onClick: () => {} },
    { icon: User, label: 'Delete Account', onClick: () => {}, danger: true },
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
            <h1 className="text-2xl font-extrabold text-[#afa3ff]">Settings</h1>
        </div>
      </div>

      {/* ── Menu List ── */}
      <div className="flex-grow px-6 space-y-6 pt-4">
        {settingsItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={item.onClick}
            className="flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    item.danger ? 'bg-zinc-800' : 'bg-[#afa3ff]/10 group-hover:bg-[#afa3ff]'
                }`}>
                    <item.icon size={20} className={`${
                        item.danger ? 'text-zinc-200' : 'text-[#afa3ff] group-hover:text-[#1c1c1c]'
                    }`} />
                </div>
                <span className="text-lg font-bold group-hover:text-[#d6ff3e] transition-colors text-zinc-200">
                    {item.label}
                </span>
            </div>
            <ChevronDown size={20} className="text-[#d6ff3e] group-hover:scale-110 transition-transform" />
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

export default Settings;
