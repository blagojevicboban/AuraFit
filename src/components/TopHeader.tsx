import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, ChevronLeft, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

interface TopHeaderProps {
  title: string;
  showBack?: boolean;
  backPath?: string;
  className?: string;
}

const TopHeader: React.FC<TopHeaderProps> = ({ 
  title, 
  showBack = true, 
  backPath = '/home',
  className = ''
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { userData } = useAuth();

  return (
    <div className={cn("sticky top-0 z-50 bg-[#1c1c1c]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between", className)}>
      <div className="flex items-center gap-4">
        {showBack && (
          <button 
            onClick={() => navigate(backPath)}
            className="text-zinc-400 hover:text-white transition-colors p-1"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-black text-white uppercase tracking-wider">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {userData?.role === 'admin' && (
          <button 
            onClick={() => navigate('/app/admin')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d6ff3e]/10 border border-[#d6ff3e]/30 rounded-full text-[#d6ff3e] text-[10px] font-black uppercase tracking-widest hover:bg-[#d6ff3e] hover:text-[#1c1c1c] transition-all"
            title="Admin Panel"
          >
            <Shield size={14} />
            <span>Admin</span>
          </button>
        )}
        <button 
          className="text-zinc-400 hover:text-zinc-600 dark:text-[#afa3ff] dark:hover:text-[#d6ff3e] transition-colors"
          title="Search"
        >
          <Search size={22} />
        </button>
        <button 
          onClick={() => navigate('/settings/notifications')}
          className="text-zinc-400 hover:text-zinc-600 dark:text-[#afa3ff] dark:hover:text-[#d6ff3e] transition-colors relative"
          title="Notifications"
        >
          <Bell size={22} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 dark:bg-[#d6ff3e] rounded-full border border-white dark:border-zinc-900" />
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className="text-zinc-400 hover:text-zinc-600 dark:text-[#afa3ff] dark:hover:text-[#d6ff3e] transition-colors"
          title="Profile"
        >
          <User size={22} />
        </button>
      </div>
    </div>
  );
};

export default TopHeader;
