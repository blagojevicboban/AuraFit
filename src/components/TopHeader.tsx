import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, ChevronLeft } from 'lucide-react';

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

  return (
    <div className={`px-6 pt-12 pb-4 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {showBack && (
            <button 
              onClick={() => navigate(backPath)}
              className="text-emerald-500 dark:text-[#d6ff3e] hover:text-emerald-600 dark:hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className="text-2xl font-extrabold text-[#afa3ff] tracking-tight">{title}</h1>
        </div>
        <div className="flex gap-4">
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
            {/* Notification Dot (Dynamic later) */}
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
    </div>
  );
};

export default TopHeader;
