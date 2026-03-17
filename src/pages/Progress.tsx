import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, User, Star, Play, Clock, Flame, 
  Home, BookOpen, Headphones, ChevronLeft
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

// ─────────────────────────────────────────────
// Data (Matching UI Kit)
// ─────────────────────────────────────────────
const chartData = [
  { label: 'Jan', value: 30 }, // percentages 
  { label: 'Feb', value: 70 },
  { label: 'Mar', value: 40 },
  { label: 'Apr', value: 45 },
];

const historyData = [
  { day: 'Thu', date: '14', steps: '3,679', duration: '1hr40m' },
  { day: 'Wen', date: '20', steps: '5,789', duration: '1hr20m' },
  { day: 'Sat', date: '22', steps: '1,859', duration: '1hr10m' },
];

const workoutMetrics = [
  { muscle: 'Chest', volume: 85, color: '#afa3ff' },
  { muscle: 'Back', volume: 65, color: '#d6ff3e' },
  { muscle: 'Legs', volume: 95, color: '#7c3aed' },
  { muscle: 'Arms', volume: 45, color: '#f59e0b' },
];

const Progress: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Charts'); // Workout or Charts

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-24">
      
      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/home')}
              className="text-[#d6ff3e] hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-extrabold text-[#afa3ff]">Progress Tracking</h1>
          </div>
          <div className="flex gap-4">
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><Search size={22} /></button>
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><Bell size={22} /></button>
            <button className="text-[#afa3ff] hover:text-[#d6ff3e] transition-colors"><User size={22} /></button>
          </div>
        </div>

        {/* ── Tabs (Workout / Charts) ── */}
        <div className="flex bg-[#2d2d2d] rounded-full p-1 mb-6 relative">
          {/* Animated Background Pill */}
          <motion.div 
             className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#d6ff3e] rounded-full z-0"
             animate={{ x: activeTab === 'Workout' ? 0 : '100%' }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <button 
            onClick={() => setActiveTab('Workout')}
            className={`flex-1 py-3 text-sm font-bold rounded-full z-10 transition-colors ${activeTab === 'Workout' ? 'text-[#1c1c1c]' : 'text-zinc-400'}`}
          >
            Workout
          </button>
          <button 
            onClick={() => setActiveTab('Charts')}
            className={`flex-1 py-3 text-sm font-bold rounded-full z-10 transition-colors ${activeTab === 'Charts' ? 'text-[#1c1c1c]' : 'text-zinc-400'}`}
          >
            Charts
          </button>
        </div>

        <p className="text-[#d6ff3e] font-semibold text-sm mb-1">My Progress</p>
        <h2 className="text-3xl font-extrabold text-[#d6ff3e] mb-6">January 12th</h2>
      </div>

      {/* ── Content ── */}
      <div className="flex-grow px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'Charts' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* ── Chart Card ── */}
              <div className="border border-zinc-700 rounded-3xl p-6 bg-[#1c1c1c] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <h3 className="text-[#d6ff3e] font-bold text-lg mb-8">Steps</h3>
                
                <div className="h-48 flex items-end justify-between relative px-2">
                  {/* Y Axis labels */}
                  <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-[#d6ff3e] font-medium z-10 pointer-events-none">
                    <span>170</span>
                    <span>165</span>
                    <span>155</span>
                    <span>150</span>
                  </div>

                  {/* Bars */}
                  {chartData.map((data, i) => (
                     <div key={i} className="flex flex-col items-center gap-4 w-12 z-0 ml-8">
                       {/* Max height pill */}
                       <div className="w-4 h-32 bg-zinc-300 rounded-full relative overflow-hidden flex items-end">
                         {/* Fill pill */}
                         <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: `${data.value}%` }}
                           transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                           className="w-full bg-[#d6ff3e] rounded-b-full" 
                         />
                       </div>
                       <span className="text-[#d6ff3e] text-xs font-bold">{data.label}</span>
                     </div>
                  ))}

                  {/* X Axis Line */}
                  <div className="absolute bottom-8 left-0 right-0 h-px bg-zinc-600" />
                </div>
              </div>

              {/* ── History List ── */}
              <div className="flex flex-col gap-4">
                {historyData.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="bg-[#afa3ff] rounded-2xl flex items-center p-4 relative overflow-hidden"
                  >
                    {/* Date Block */}
                    <div className="flex flex-col items-center justify-center border-r border-[#1c1c1c]/10 pr-4 min-w-[70px]">
                      <span className="text-white text-base font-bold">{item.day}</span>
                      <span className="text-white text-3xl font-black">{item.date}</span>
                    </div>
                    
                    {/* Stats Block */}
                    <div className="flex-1 px-4 flex justify-between items-center">
                      <div>
                        <p className="text-white text-xs font-bold mb-0.5">Steps</p>
                        <p className="text-white text-2xl font-bold">{item.steps}</p>
                      </div>
                      <div>
                        <p className="text-white text-xs font-bold mb-0.5 whitespace-nowrap">Duration</p>
                        <p className="text-white text-sm font-bold flex items-center gap-1.5"><Clock size={14} className="text-white"/>{item.duration}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Workout' && (
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-6"
             >
                <div className="bg-[#1c1c1c] border border-zinc-700 rounded-3xl p-6 shadow-xl">
                  <h3 className="text-[#afa3ff] font-bold text-lg mb-6">Muscle Group Distribution</h3>
                  <div className="space-y-4">
                    {workoutMetrics.map((metric) => (
                      <div key={metric.muscle} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                          <span className="text-zinc-400">{metric.muscle}</span>
                          <span className="text-white">{metric.volume}%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.volume}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: metric.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#afa3ff] rounded-3xl p-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-[#1c1c1c] font-black text-xl mb-1">Total Volume</h3>
                    <p className="text-[#1c1c1c]/70 text-sm font-bold mb-4">You've reached 85% of your weekly goal!</p>
                    <div className="text-4xl font-black text-[#1c1c1c]">12,450 <span className="text-sm font-bold opacity-60">kg</span></div>
                  </div>
                  <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />

    </div>
  );
};

export default Progress;
