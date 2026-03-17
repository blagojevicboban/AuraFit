import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, User, Clock, Flame, Star, ChevronRight,
  Home, BookOpen, Apple, Headphones, ChevronLeft
} from 'lucide-react';

const forumCategories = [
  { title: 'Strength Training Techniques', sub: 'Discussion on training methods', time: 'Today 17:05' },
  { title: 'Nutrition and Diet Strategies', sub: 'Meal planning, supplementation preferences', time: 'Today 17:05' },
  { title: 'Cardiovascular Fitness', sub: 'About different types of cardio workouts', time: 'Today 17:05' },
  { title: 'Flexibility and Mobility', sub: 'Strategies for improving flexibility and joint mobility', time: 'Today 17:05' },
];

const Community: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Discussion Forum');

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-24">
      
      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)}
              className="text-[#d6ff3e] hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-extrabold text-[#afa3ff]">Community</h1>
          </div>
          <div className="flex gap-4">
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><Search size={22} /></button>
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><Bell size={22} /></button>
            <button 
                onClick={() => navigate('/profile')}
                className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"
            >
                <User size={22} />
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex bg-[#2d2d2d] rounded-full p-1 mb-6 relative">
          <motion.div 
             className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#d6ff3e] rounded-full z-0"
             animate={{ x: activeTab === 'Discussion Forum' ? 0 : '100%' }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <button 
            onClick={() => setActiveTab('Discussion Forum')}
            className={`flex-1 py-3 text-sm font-bold rounded-full z-10 transition-colors ${activeTab === 'Discussion Forum' ? 'text-[#1c1c1c]' : 'text-zinc-400'}`}
          >
            Discussion Forum
          </button>
          <button 
            onClick={() => setActiveTab('Challenges')}
            className={`flex-1 py-3 text-sm font-bold rounded-full z-10 transition-colors ${activeTab === 'Challenges' ? 'text-[#1c1c1c]' : 'text-zinc-400'}`}
          >
            Challenges
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.2 }}
           className="flex-grow flex flex-col"
        >
          {/* ── Featured Challenge ── */}
          <div className="px-6 mb-8">
            <div className="bg-[#afa3ff] rounded-3xl p-1 relative overflow-hidden group cursor-pointer shadow-lg aspect-video">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                <span className="text-6xl opacity-20">🚴‍♀️</span>
              </div>
              
              <button className="absolute bottom-4 right-4 text-white z-20">
                 <Star size={20} fill="currentColor" />
              </button>

              <div className="absolute bottom-4 left-4 z-20">
                <h3 className="text-[#d6ff3e] font-bold text-xl leading-tight mb-1">Cycling Challenge</h3>
                <div className="flex items-center gap-4 text-xs font-medium text-zinc-200">
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-white"/>15 Minutes</span>
                  <span className="flex items-center gap-1.5"><Flame size={12} className="text-white"/>100 Kcal</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Forums Section ── */}
          <div className="px-6 flex-grow">
            <h2 className="text-[#d6ff3e] text-2xl font-extrabold mb-4">Forums</h2>
            
            <div className="bg-[#afa3ff] bg-opacity-90 rounded-[2.5rem] p-6 space-y-6 shadow-xl">
              {forumCategories.map((forum, i) => (
                <div key={forum.title + i} className="group">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 pr-4">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="text-[#1c1c1c] font-black text-sm leading-tight uppercase tracking-tight">{forum.title}</h4>
                            <span className="text-[#1c1c1c]/60 text-[10px] whitespace-nowrap">See All</span>
                        </div>
                        <p className="text-[#1c1c1c]/70 text-[11px] leading-snug">{forum.sub}</p>
                    </div>
                  </div>
                  <div className="text-right">
                      <span className="text-[#1c1c1c]/40 text-[9px] font-bold">{forum.time}</span>
                  </div>
                  {i < forumCategories.length - 1 && (
                    <div className="h-px bg-[#1c1c1c]/10 mt-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Fixed Bottom Navigation ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 flex items-center justify-around z-50">
        {[
          { icon: Home, label: 'Home', active: false, path: '/home' },
          { icon: BookOpen, label: 'Workouts', active: false, path: '/workouts' },
          { icon: Apple, label: 'Nutrition', active: false, path: '/nutrition' },
          { icon: User, label: 'Profile', active: false, path: '/profile' },
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

export default Community;
