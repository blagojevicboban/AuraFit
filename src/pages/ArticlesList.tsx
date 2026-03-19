import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Star, Clock, Tag } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const allArticles = [
  {
    id: 1,
    title: 'Supplement Guide: What You Actually Need',
    icon: '🍊',
    bg: 'from-amber-900/60 to-zinc-900',
    category: 'Nutrition',
    readTime: '5 min',
    excerpt: 'Confused by the supplement aisle? We break down exactly which supplements are worth your money and which are pure marketing.',
  },
  {
    id: 2,
    title: '15 Quick & Effective Daily Routines',
    icon: '⚡',
    bg: 'from-slate-700 to-zinc-900',
    category: 'Workout',
    readTime: '7 min',
    excerpt: 'You don\'t need hours in the gym. These 15 micro-routines fit into any busy schedule and deliver real results.',
  },
  {
    id: 3,
    title: 'How Sleep Affects Your Gains',
    icon: '😴',
    bg: 'from-indigo-900/60 to-zinc-900',
    category: 'Recovery',
    readTime: '4 min',
    excerpt: 'Sleep is the most underrated tool in your fitness arsenal. Here\'s the science behind why 8 hours can double your progress.',
  },
  {
    id: 4,
    title: 'Eating for Your Body Type',
    icon: '🥗',
    bg: 'from-emerald-900/60 to-zinc-900',
    category: 'Nutrition',
    readTime: '6 min',
    excerpt: 'Ectomorph, mesomorph, or endomorph — your body type profoundly affects how you should eat and train.',
  },
  {
    id: 5,
    title: 'The Truth About Cardio',
    icon: '🏃',
    bg: 'from-rose-900/60 to-zinc-900',
    category: 'Workout',
    readTime: '5 min',
    excerpt: 'Is cardio killing your gains? We explore when cardio helps and when it hurts your muscle-building goals.',
  },
  {
    id: 6,
    title: 'Mental Fitness: Train Your Mind',
    icon: '🧠',
    bg: 'from-violet-900/60 to-zinc-900',
    category: 'Mental Health',
    readTime: '8 min',
    excerpt: 'Physical fitness starts in the mind. Discover proven techniques to build mental resilience and stay consistent.',
  },
];

const categoryColors: Record<string, string> = {
  Nutrition: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Workout: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Recovery: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'Mental Health': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
};

const ArticlesList: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Nutrition', 'Workout', 'Recovery', 'Mental Health'];
  const filtered = filter === 'All' ? allArticles : allArticles.filter(a => a.category === filter);

  const toggleFav = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-24">

      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-300 bg-white/10 p-2.5 rounded-2xl hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white">Articles & Tips</h1>
            <p className="text-zinc-500 text-xs">{allArticles.length} articles available</p>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                filter === cat
                  ? 'bg-[#afa3ff] border-[#afa3ff] text-[#1c1c1c]'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Articles Grid ── */}
      <div className="flex-grow px-6 space-y-4">
        {filtered.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate('/article', { state: { articleId: article.id } })}
            className={`relative rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br ${article.bg} h-44 shadow-lg`}
          >
            {/* Background emoji */}
            <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-15">
              {article.icon}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Favorite */}
            <button
              onClick={(e) => toggleFav(e, article.id)}
              className={`absolute top-3 right-3 z-10 transition-colors ${favorites.includes(article.id) ? 'text-yellow-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Star size={18} fill={favorites.includes(article.id) ? 'currentColor' : 'none'} />
            </button>

            {/* Content */}
            <div className="absolute bottom-3 left-4 right-10 z-10 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${categoryColors[article.category] ?? 'bg-zinc-700 text-zinc-300 border-zinc-600'}`}>
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-[9px] text-zinc-400">
                  <Clock size={9} /> {article.readTime} read
                </span>
              </div>
              <p className="font-black text-sm text-white leading-tight">{article.title}</p>
              <p className="text-zinc-400 text-xs leading-snug line-clamp-2">{article.excerpt}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default ArticlesList;
