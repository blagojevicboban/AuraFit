import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Apple, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { icon: Home, label: t('nav.overview'), path: '/home' },
    { icon: BookOpen, label: t('nav.workouts'), path: '/workouts' },
    { icon: Apple, label: t('nav.nutrition'), path: '/nutrition' },
    { icon: User, label: t('common.profile'), path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#afa3ff] px-6 py-4 flex items-center justify-around z-50 shadow-[0_-4px_30px_rgba(0,0,0,0.3)]">
      {navItems.map(({ icon: Icon, label, path }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 ${isActive ? 'text-[#1c1c1c]' : 'text-[#1c1c1c]/50 hover:text-[#1c1c1c]'} transition-colors`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
