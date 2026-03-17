import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Search, Bell, User, Home, BookOpen, Star, Headphones,
  Dumbbell, BarChart2, Apple, Users, Play, Clock, Flame, ChevronRight
} from 'lucide-react';

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const recommendations = [
  { id: 1, title: 'Squat Exercise', duration: '12 Minutes', kcal: '120 Kcal', bg: 'from-zinc-700 to-zinc-900', img: '/assets/squat.png' },
  { id: 2, title: 'Full Body Stretching', duration: '12 Minutes', kcal: '120 Kcal', bg: 'from-zinc-600 to-zinc-800', img: '/assets/stretching.png' },
];

const articles = [
  { id: 1, title: 'Supplement Guide...', bg: 'from-amber-900/60 to-zinc-900', icon: '🍊' },
  { id: 2, title: '15 Quick & Effective Daily Routines...', bg: 'from-slate-700 to-zinc-900', icon: '⚡' },
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col overflow-x-hidden">
      
      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-3xl font-extrabold" style={{ color: '#afa3ff' }}>
              Hi, Madison 👋
            </h1>
            <p className="text-zinc-400 text-sm mt-1">It's Time To Challenge Your Limits.</p>
          </div>
          <div className="flex gap-4 pt-1">
            <button className="text-white hover:text-[#d6ff3e] transition-colors"><Search size={22} /></button>
            <button className="text-white hover:text-[#d6ff3e] transition-colors relative">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#d6ff3e] rounded-full" />
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="text-white hover:text-[#d6ff3e] transition-colors"
            >
              <User size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Nav Icons ── */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-around">
          {[
            { icon: Dumbbell, label: 'Workout', path: '/workouts' },
            { icon: BarChart2, label: 'Progress\nTracking', path: '/progress' },
            { icon: Apple, label: 'Nutrition', path: '/nutrition' },
            { icon: Users, label: 'Community', path: '/community' },
          ].map(({ icon: Icon, label, path }, i) => (
            <React.Fragment key={label}>
              <button
                onClick={() => navigate(path)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:bg-[#afa3ff]/20 transition-colors">
                  <Icon size={24} className="text-[#afa3ff]" />
                </div>
                <span className="text-[10px] text-zinc-400 text-center leading-tight whitespace-pre-line">{label}</span>
              </button>
              {i < 3 && <div className="w-px h-10 bg-zinc-700/60" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-grow overflow-y-auto pb-24 space-y-2">

        {/* ── Recommendations ── */}
        <section className="px-6 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-extrabold" style={{ color: '#d6ff3e' }}>Recommendations</h2>
            <button className="text-[#afa3ff] text-sm font-bold flex items-center gap-1">
              See All <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {recommendations.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br ${item.bg} h-48`}
              >
                {/* Generated image bg */}
                <img src={item.img} className="absolute inset-0 w-full h-full object-cover opacity-60" alt={item.title} />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* Favorite star */}
                <button className="absolute top-3 right-3 text-yellow-400">
                  <Star size={16} fill="currentColor" />
                </button>
                {/* Play button */}
                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#afa3ff] flex items-center justify-center shadow-lg">
                  <Play size={16} className="text-white ml-0.5" fill="currentColor" />
                </button>
                {/* Info */}
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-bold text-sm text-white mb-1.5 leading-tight">{item.title}</p>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-300">
                    <span className="flex items-center gap-1"><Clock size={10} />{item.duration}</span>
                    <span className="flex items-center gap-1"><Flame size={10} />{item.kcal}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Weekly Challenge ── */}
        <section className="px-6 pt-6">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-3xl overflow-hidden bg-[#afa3ff] relative cursor-pointer"
            style={{ minHeight: 160 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c1c]/80 to-transparent z-10" />
            {/* Image for the challenge */}
            <img 
              src="/assets/plank.png" 
              className="absolute right-0 top-0 bottom-0 w-full h-full object-cover opacity-80" 
              alt="Challenge" 
            />
            <div className="relative z-20 p-6">
              <p className="text-zinc-300 text-xs font-bold uppercase tracking-widest mb-1">Weekly Challenge</p>
              <h3 className="text-3xl font-black text-[#d6ff3e] leading-tight mb-1">
                Weekly<br/>Challenge
              </h3>
              <p className="text-white text-sm font-medium">Plank With Hip Twist</p>
            </div>
          </motion.div>
        </section>

        {/* ── Articles & Tips ── */}
        <section className="px-6 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-extrabold text-white">Articles &amp; Tips</h2>
            <button className="text-[#afa3ff] text-sm font-bold flex items-center gap-1">
              See All <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {articles.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br ${item.bg} h-44`}
              >
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">{item.icon}</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <button className="absolute top-3 right-3 text-yellow-400">
                  <Star size={16} fill="currentColor" />
                </button>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-bold text-sm text-white leading-tight">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Bottom Navigation Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#afa3ff] px-6 py-4 flex items-center justify-around z-50 shadow-[0_-4px_30px_rgba(0,0,0,0.3)]">
        {[
          { icon: Home, label: 'Home', active: true, path: '/home' },
          { icon: BookOpen, label: 'Workouts', active: false, path: '/workouts' },
          { icon: Apple, label: 'Nutrition', active: false, path: '/nutrition' },
          { icon: User, label: 'Profile', active: false, path: '/profile' },
        ].map(({ icon: Icon, label, active, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 ${active ? 'text-[#1c1c1c]' : 'text-white/60 hover:text-white'} transition-colors`}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
            <span className="text-[9px] font-bold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeDashboard;
