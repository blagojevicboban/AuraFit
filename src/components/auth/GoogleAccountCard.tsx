import React from 'react';
import { motion } from 'motion/react';
import { User } from 'lucide-react';

interface GoogleAccountCardProps {
  user: {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  };
  onContinue: () => void;
  onSwitch: () => void;
}

const GoogleAccountCard: React.FC<GoogleAccountCardProps> = ({ user, onContinue, onSwitch }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white/5 border border-white/10 backdrop-blur-xl p-4 rounded-3xl flex flex-col gap-4 shadow-xl"
    >
      <div className="flex items-center gap-4">
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user.displayName || 'User'} 
            className="w-12 h-12 rounded-full border-2 border-[#afa3ff]"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-[#afa3ff]">
            <User size={24} className="text-[#afa3ff]" />
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <h3 className="text-white font-bold truncate pr-2">{user.displayName || 'AuraFit Korisnik'}</h3>
          <p className="text-zinc-500 text-xs truncate pr-2">{user.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button 
          onClick={onContinue}
          className="bg-[#afa3ff] text-[#1c1c1c] font-black py-3 rounded-2xl hover:bg-[#d6ff3e] transition-colors uppercase tracking-tight text-sm shadow-md"
        >
          Nastavi kao {user.displayName?.split(' ')[0] || 'Korisnik'}
        </button>
        <button 
          onClick={onSwitch}
          className="text-zinc-400 hover:text-white text-[11px] font-bold transition-colors uppercase tracking-widest text-center"
        >
          Koristi drugi nalog
        </button>
      </div>
    </motion.div>
  );
};

export default GoogleAccountCard;
