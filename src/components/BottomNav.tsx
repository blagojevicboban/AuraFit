import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Apple, User } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: BookOpen, label: 'Workouts', path: '/workouts' },
  { icon: Apple, label: 'Nutrition', path: '/nutrition' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#afa3ff] px-6 py-4 flex items-center justify-around z-50 shadow-[0_-4px_30px_rgba(0,0,0,0.3)]">
      {navItems.map(({ icon: Icon, label, path }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 ${isActive ? 'text-[#1c1c1c]' : 'text-white/60 hover:text-white'} transition-colors`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="text-[9px] font-bold">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
