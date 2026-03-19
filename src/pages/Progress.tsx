import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, User, Star, Play, Clock, Flame, 
  Home, BookOpen, Headphones, ChevronLeft
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import TopHeader from '../components/TopHeader';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, limit, Timestamp } from 'firebase/firestore';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Loader2 } from 'lucide-react';

// ─────────────────────────────────────────────
// Data (Matching UI Kit)
// ─────────────────────────────────────────────
const chartData = [
  { label: 'Jan', value: 30 }, // percentages 
  { label: 'Feb', value: 70 },
  { label: 'Mar', value: 40 },
  { label: 'Apr', value: 45 },
];

// Static historical fallback if needed, but we use dynamic data now

const workoutMetrics = [
  { muscle: 'Chest', volume: 85, color: '#afa3ff' },
  { muscle: 'Back', volume: 65, color: '#10b981' },
  { muscle: 'Legs', volume: 95, color: '#afa3ff' },
  { muscle: 'Arms', volume: 45, color: '#d6ff3e' },
];

const Progress: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('Charts');
  const [workoutLogs, setWorkoutLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    setIsLoading(true);
    const q = query(
      collection(db, 'users', currentUser.uid, 'workout_logs'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorkoutLogs(logs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Transform logs for charts and history
  const chartData = [...workoutLogs].reverse().map(log => {
    const date = log.timestamp?.toDate() || new Date();
    return {
      name: date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      value: log.totalVolume || log.total_volume || 0,
      steps: log.steps || 0
    };
  });

  const historyData = workoutLogs.map(log => {
    const date = log.timestamp?.toDate() || new Date();
    return {
      day: date.toLocaleDateString(undefined, { weekday: 'short' }),
      date: date.getDate().toString(),
      volume: (log.totalVolume || log.total_volume || 0).toLocaleString() + ' kg',
      steps: (log.steps || 0).toLocaleString(),
      duration: `${log.durationMinutes || log.duration_minutes || 0}m`
    };
  });

  const todayStr = new Date().toLocaleDateString(undefined, { 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col pb-24 transition-colors duration-300">
      
      {/* ── Header ── */}
      <TopHeader title={t('progress.title')} />

      <div className="px-6 mb-6">
        {/* ── Tabs (Workout / Charts) ── */}
        <div className="flex bg-zinc-200 dark:bg-zinc-900 rounded-full p-1 mb-6 relative transition-colors">
          <motion.div 
             className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-emerald-500 dark:bg-[#d6ff3e] rounded-full z-0"
             animate={{ x: activeTab === 'Workout' ? 0 : '100%' }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <button 
            onClick={() => setActiveTab('Workout')}
            className={`flex-1 py-3 text-sm font-bold rounded-full z-10 transition-colors ${activeTab === 'Workout' ? 'text-white dark:text-[#1c1c1c]' : 'text-zinc-500 dark:text-zinc-400'}`}
          >
            {t('progress.workoutTab')}
          </button>
          <button 
            onClick={() => setActiveTab('Charts')}
            className={`flex-1 py-3 text-sm font-bold rounded-full z-10 transition-colors ${activeTab === 'Charts' ? 'text-white dark:text-[#1c1c1c]' : 'text-zinc-500 dark:text-zinc-400'}`}
          >
            {t('progress.chartsTab')}
          </button>
        </div>

        <p className="text-emerald-500 dark:text-[#d6ff3e] font-black text-xs uppercase tracking-widest mb-1">{t('progress.myProgress')}</p>
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-[#d6ff3e]">{todayStr}</h2>
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
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm relative transition-colors overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-emerald-500 dark:text-[#d6ff3e] font-bold text-lg">{t('progress.volume')}</h3>
                  <div className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:bg-[#d6ff3e]/10 dark:text-[#d6ff3e] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                    Live Data
                  </div>
                </div>
                
                <div className="h-64 w-full -ml-8">
                  {isLoading ? (
                    <div className="flex h-full items-center justify-center translate-x-4">
                       <Loader2 className="animate-spin text-emerald-500 dark:text-[#d6ff3e]" />
                    </div>
                  ) : chartData.length === 0 ? (
                    <div className="flex h-full items-center justify-center translate-x-4 text-zinc-400 text-xs font-bold uppercase">
                       {t('progress.noData')}
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" opacity={0.3} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fill: '#71717a' }} 
                        />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1c1c1c', 
                            border: 'none', 
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorVal)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* ── History List ── */}
              <div className="flex flex-col gap-4">
                <h4 className="text-zinc-500 dark:text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em] px-2">{t('progress.history')}</h4>
                {historyData.length === 0 && !isLoading && (
                  <div className="text-center py-10 text-zinc-500 font-bold">{t('progress.noData')}</div>
                )}
                {historyData.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-3xl flex items-center p-4 relative overflow-hidden shadow-sm"
                  >
                    {/* Date Block */}
                    <div className="flex flex-col items-center justify-center border-r border-zinc-100 dark:border-white/10 pr-4 min-w-[70px]">
                      <span className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase">{item.day}</span>
                      <span className="text-zinc-900 dark:text-white text-3xl font-black">{item.date}</span>
                    </div>
                    
                    {/* Stats Block */}
                    <div className="flex-1 px-4 flex justify-between items-center">
                      <div>
                        <p className="text-zinc-400 dark:text-zinc-500 text-[9px] font-black uppercase mb-0.5">{t('progress.volume')}</p>
                        <p className="text-zinc-900 dark:text-white text-xl font-black">{item.volume}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-zinc-400 dark:text-zinc-500 text-[9px] font-black uppercase mb-0.5">{t('progress.duration')}</p>
                        <p className="text-emerald-600 dark:text-[#afa3ff] text-sm font-bold flex items-center justify-end gap-1.5"><Clock size={14}/>{item.duration}</p>
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
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm shadow-xl transition-colors">
                  <h3 className="text-emerald-500 dark:text-[#afa3ff] font-bold text-lg mb-6">{t('progress.muscleGroup')}</h3>
                  <div className="space-y-4">
                    {workoutMetrics.map((metric) => (
                      <div key={metric.muscle} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.15em] px-1">
                          <span className="text-zinc-500">{metric.muscle}</span>
                          <span className="text-zinc-900 dark:text-white">{metric.volume}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.volume}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full rounded-full shadow-lg"
                            style={{ backgroundColor: metric.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-500 dark:bg-[#afa3ff] rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl transition-all">
                  <div className="relative z-10">
                    <h3 className="text-white dark:text-[#1c1c1c] font-black text-xl mb-1 uppercase tracking-tight">{t('progress.totalVolume')}</h3>
                    <p className="text-white/70 dark:text-[#1c1c1c]/70 text-xs font-bold mb-6 italic">{t('progress.trackingGains')}</p>
                    <div className="text-5xl font-black text-white dark:text-[#1c1c1c] flex items-baseline gap-2">
                      {workoutLogs.reduce((acc, log) => acc + (log.totalVolume || log.total_volume || 0), 0).toLocaleString()} 
                      <span className="text-sm font-black opacity-60">kg</span>
                    </div>
                  </div>
                  <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-white/20 rounded-full blur-3xl animate-pulse" />
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
