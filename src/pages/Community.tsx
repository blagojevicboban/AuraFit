import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, User, Clock, Flame, Star, 
  Home, BookOpen, Apple, Headphones, ChevronLeft
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

const forumCategories = [
  { title: 'Strength Training Techniques', sub: 'Discussion on training methods', time: 'Today 17:05' },
  { title: 'Nutrition and Diet Strategies', sub: 'Meal planning, supplementation preferences', time: 'Today 17:05' },
  { title: 'Cardiovascular Fitness', sub: 'About different types of cardio workouts', time: 'Today 17:05' },
  { title: 'Flexibility and Mobility', sub: 'Strategies for improving flexibility and joint mobility', time: 'Today 17:05' },
];

const challenges = [
  { title: 'Cycling Challenge', time: '15 Minutes', kcal: '100 Kcal', image: '/assets/cycling.png' },
  { title: 'Summer Yoga Quest', time: '20 Minutes', kcal: '80 Kcal', image: '/assets/stretching.png' },
  { title: '30 Day Plank', time: '5 Minutes', kcal: '50 Kcal', image: '/assets/plank.png' },
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
          {activeTab === 'Discussion Forum' ? (
            <div className="px-6 flex-grow pb-8">
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
          ) : (
            <div className="px-6 flex-grow pb-8">
               <h2 className="text-[#d6ff3e] text-2xl font-extrabold mb-4">Active Challenges</h2>
               <div className="space-y-4">
                  {challenges.map((challenge, i) => (
                    <motion.div 
                      key={challenge.title + i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-[#2d2d2d] rounded-3xl p-1 relative overflow-hidden group cursor-pointer shadow-lg aspect-video"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                      <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center overflow-hidden">
                        <img 
                          src={challenge.image} 
                          className="w-full h-full object-cover opacity-80" 
                          alt={challenge.title} 
                        />
                      </div>
                      <button className="absolute bottom-4 right-4 text-white z-20">
                         <Star size={20} fill="currentColor" />
                      </button>
                      <div className="absolute bottom-4 left-4 z-20">
                        <h3 className="text-[#d6ff3e] font-bold text-xl leading-tight mb-1">{challenge.title}</h3>
                        <div className="flex items-center gap-4 text-xs font-medium text-zinc-200">
                          <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#afa3ff]"/>{challenge.time}</span>
                          <span className="flex items-center gap-1.5"><Flame size={12} className="text-[#afa3ff]"/>{challenge.kcal}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <BottomNav />

    </div>
  );
};

export default Community;
