import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Clock, Star, Tag, Share2, BookOpen } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const articles: Record<number, {
  title: string;
  icon: string;
  category: string;
  readTime: string;
  bg: string;
  intro: string;
  sections: { heading: string; body: string }[];
  tags: string[];
}> = {
  1: {
    title: 'Supplement Guide: What You Actually Need',
    icon: '🍊',
    category: 'Nutrition',
    readTime: '5 min',
    bg: 'from-amber-900/80 to-zinc-950',
    intro: 'Walk into any supplement store and you\'ll be overwhelmed. Protein powders, pre-workouts, BCAAs, creatine, fat burners — the list is endless. Here\'s what the science actually says.',
    sections: [
      {
        heading: '💪 Creatine — The Most Researched Supplement',
        body: 'Creatine monohydrate is arguably the best-researched sports supplement of all time. It increases phosphocreatine stores, helping you produce more ATP during high-intensity exercise. Take 3-5g per day — no loading phase necessary.',
      },
      {
        heading: '🥛 Protein Powder — Convenience, Not Magic',
        body: 'Protein powder is just food in a convenient form. If you\'re hitting 1.6–2.2g of protein per kg of bodyweight through whole foods, you don\'t need it. Whey isolate is superior for post-workout absorption.',
      },
      {
        heading: '☕ Caffeine — The Original Pre-Workout',
        body: 'Caffeine improves endurance, focus, and power output. 3-6mg per kg of bodyweight 30-60 minutes before training is the sweet spot. Skip the fancy pre-workouts — plain coffee or caffeine tabs work just as well.',
      },
      {
        heading: '🦴 Vitamin D3 + Magnesium',
        body: 'Deficiency in both is extremely common, especially in urban populations. Low vitamin D correlates with low testosterone and poor recovery. Pair 2000-4000 IU of D3 with 300-400mg magnesium glycinate before bed.',
      },
      {
        heading: '🚫 Skip These',
        body: 'BCAAs (useless if you eat enough protein), Glutamine (same reasoning), "testosterone boosters" (virtually no evidence), fat burners (marginally effective at best, often contain stimulants with side effects).',
      },
    ],
    tags: ['Creatine', 'Protein', 'Nutrition', 'Beginner'],
  },
  2: {
    title: '15 Quick & Effective Daily Routines',
    icon: '⚡',
    category: 'Workout',
    readTime: '7 min',
    bg: 'from-slate-700/80 to-zinc-950',
    intro: 'The biggest fitness lie is that you need to spend hours in the gym. Research shows that short, intense bouts of exercise — even 10 minutes — can deliver serious results when done consistently.',
    sections: [
      {
        heading: '🌅 Morning: 5-Minute Activation',
        body: '1. Cat-cow (30s) → 2. Hip circles (30s each side) → 3. World\'s greatest stretch (30s each side) → 4. Deep squat hold (1 min). This wakes up your joints and primes your nervous system before the day starts.',
      },
      {
        heading: '🏋️ Desk Worker Routine (Anytime)',
        body: '10 wall push-ups → 10 seated leg raises → 10 shoulder rolls → 10 neck rotations → 10 glute bridges. Takes 4 minutes. Set a timer every 90 minutes at your desk.',
      },
      {
        heading: '💥 Lunch Break HIIT (10 mins)',
        body: '20s jump squats → 10s rest × 8 rounds = 4 minutes. Then: 20s mountain climbers → 10s rest × 8 rounds. Burn 100-150 calories, boost afternoon energy and focus dramatically.',
      },
      {
        heading: '🌙 Evening Wind-Down',
        body: 'Child\'s pose (1 min) → Supine twist (1 min each) → Figure-four stretch (1 min each) → Legs up the wall (2 mins). Activates the parasympathetic nervous system for deeper sleep.',
      },
      {
        heading: '📆 The Key: Stack Your Habits',
        body: 'Attach these micro-routines to existing habits. Morning routine → right after brushing teeth. Desk routine → right after a meeting. Evening stretch → right after changing clothes. Habit stacking is the #1 consistency tool.',
      },
    ],
    tags: ['Routines', 'Quick', 'Beginner', 'Consistency'],
  },
  3: {
    title: 'How Sleep Affects Your Gains',
    icon: '😴',
    category: 'Recovery',
    readTime: '4 min',
    bg: 'from-indigo-900/80 to-zinc-950',
    intro: 'You can eat perfectly and train perfectly — but if your sleep is poor, you\'re leaving half your results on the table. Sleep is when your body actually builds muscle.',
    sections: [
      {
        heading: '🔬 The Science of Sleep & Muscle',
        body: 'During deep sleep (NREM stages 3-4), the pituitary gland releases over 70% of daily growth hormone. This is your primary anabolic window. Cut sleep short and you slash this hormonal surge.',
      },
      {
        heading: '😤 What Sleep Deprivation Does',
        body: 'Even one night of 6 hours or less: testosterone drops 10-15%, cortisol rises 20-25%, insulin sensitivity worsens, reaction time slows equal to being legally drunk. Chronically sleep-deprived people lose 3x more muscle relative to fat when cutting calories.',
      },
      {
        heading: '🛁 Optimise Your Sleep',
        body: 'Drop room temperature to 18-20°C. No screens 60 minutes before bed — or use blue light glasses. Keep your wake time consistent 7 days a week (yes, weekends too). Magnesium glycinate 300mg before bed improves deep sleep quality significantly.',
      },
    ],
    tags: ['Recovery', 'Sleep', 'Hormones', 'Intermediate'],
  },
  4: {
    title: 'Eating for Your Body Type',
    icon: '🥗',
    category: 'Nutrition',
    readTime: '6 min',
    bg: 'from-emerald-900/80 to-zinc-950',
    intro: 'Body types — ectomorph, mesomorph, endomorph — are oversimplifications, but understanding your metabolic tendencies helps you build a nutrition strategy that actually works.',
    sections: [
      {
        heading: '🦴 Ectomorph: The Hard Gainer',
        body: 'Fast metabolism, struggles to gain weight. Strategy: eat more than you think you need. Target 3200-3800 calories. Prioritise carbohydrate-rich meals around training. Don\'t skip meals — carry high-calorie snacks (nuts, nut butter, dates).',
      },
      {
        heading: '💪 Mesomorph: The Lucky One',
        body: 'Naturally athletic, responds well to training. Balanced macros work well: 35% protein, 35% carbs, 30% fat. Mesomorphs can generally get away with more dietary flexibility while still progressing, but don\'t abuse it.',
      },
      {
        heading: '🔥 Endomorph: Efficient Storage',
        body: 'Slower metabolism, stores fat easily. Strategy: lower carbohydrate intake (150-200g/day), higher protein (2.2g/kg), prioritise resistance training over cardio. Avoid liquid calories. Time carbs around workouts.',
      },
    ],
    tags: ['Nutrition', 'Body Types', 'Bulking', 'Cutting'],
  },
  5: {
    title: 'The Truth About Cardio',
    icon: '🏃',
    category: 'Workout',
    readTime: '5 min',
    bg: 'from-rose-900/80 to-zinc-950',
    intro: 'Cardio has been both vilified by the lifting community and worshipped by the wellness world. The truth, as usual, is nuanced.',
    sections: [
      {
        heading: '❤️ Cardio is Non-Negotiable for Health',
        body: 'VO₂ max — your aerobic capacity — is the single best predictor of longevity. VO₂ max in the top 25th percentile reduces all-cause mortality by ~45% vs. the bottom 25th. You can\'t lift your way to elite cardiovascular fitness. Zone 2 cardio (conversational pace) 3×/week is the minimum effective dose.',
      },
      {
        heading: '⚠️ When Cardio Kills Gains',
        body: 'Concurrent training interference is real but overstated. Running immediately after lifting activates AMPK which partially inhibits mTOR (muscle building pathway). Solution: separate cardio and lifting by 6+ hours, or do cardio on rest days.',
      },
      {
        heading: '📊 Optimal Cardio Strategy',
        body: 'Zone 2 (60-70% max HR): 150+ min/week for cardiovascular health. HIIT (85-95% max HR): 1-2 sessions/week max, not more. Avoid chronic moderate-intensity cardio — this is the greatest interference with muscle building. Either go easy or go hard.',
      },
    ],
    tags: ['Cardio', 'HIIT', 'Zone 2', 'Advanced'],
  },
  6: {
    title: 'Mental Fitness: Train Your Mind',
    icon: '🧠',
    category: 'Mental Health',
    readTime: '8 min',
    bg: 'from-violet-900/80 to-zinc-950',
    intro: 'The most powerful performance-enhancing tool isn\'t a supplement or a training technique. It\'s your mind. Mental fitness determines whether you quit or push through when it matters.',
    sections: [
      {
        heading: '🎯 Identity-Based Goals',
        body: 'Don\'t set outcome goals ("lose 10kg"). Set identity goals ("I am someone who exercises every day"). Every time you go to the gym, you cast a vote for your identity. Over time, this becomes self-reinforcing.',
      },
      {
        heading: '🧘 Stress Management = Performance',
        body: 'Chronic psychological stress elevates cortisol, which directly competes with testosterone and impairs recovery. Just 10 minutes of diaphragmatic breathing daily measurably lowers baseline cortisol over 8 weeks.',
      },
      {
        heading: '🗺️ Visualisation',
        body: 'Elite athletes have used mental rehearsal for decades. Before a heavy lift or race, vividly visualise the performance. Research confirms this activates the same neural pathways as actual practice — improving performance by 13-15%.',
      },
      {
        heading: '💬 Self-Talk Strategies',
        body: 'Negative self-talk is the #1 reason people quit mid-set or skip sessions. Replace "I can\'t" with "I\'m learning". Replace "I failed" with "I collected data". Third-person self-talk ("Marko can do this") is clinically proven to improve performance under pressure.',
      },
    ],
    tags: ['Mindset', 'Mental Health', 'Performance', 'Beginner'],
  },
};

const categoryColors: Record<string, string> = {
  Nutrition: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Workout: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Recovery: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'Mental Health': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
};

const ArticleDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [liked, setLiked] = useState(false);

  const articleId = (location.state as any)?.articleId ?? 1;
  const article = articles[articleId] ?? articles[1];

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-24">

      {/* ── Hero ── */}
      <div className={`relative bg-gradient-to-br ${article.bg} pt-12 pb-10 px-6 rounded-b-[3rem] overflow-hidden shadow-2xl`}>
        <div className="absolute inset-0 flex items-center justify-center text-[12rem] opacity-10 pointer-events-none select-none">
          {article.icon}
        </div>

        <div className="relative z-10 flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-300 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className={`p-2.5 rounded-2xl transition-all ${liked ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-zinc-400 hover:bg-white/20'}`}
          >
            <Star size={20} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${categoryColors[article.category] ?? ''}`}>
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock size={12} /> {article.readTime} read
            </span>
          </div>
          <h1 className="text-2xl font-black text-white leading-tight">{article.title}</h1>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-6 pt-6 space-y-6">

        {/* Intro */}
        <p className="text-zinc-400 text-[15px] leading-relaxed border-l-2 border-[#afa3ff] pl-4">
          {article.intro}
        </p>

        {/* Sections */}
        <div className="space-y-5">
          {article.sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2"
            >
              <h2 className="text-base font-black text-white">{section.heading}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{section.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Tags */}
        <div>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <Tag size={12} /> Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-zinc-300 font-semibold">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* More Articles CTA */}
        <button
          onClick={() => navigate('/articles')}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#afa3ff]/10 border border-[#afa3ff]/20 text-[#afa3ff] font-black text-sm uppercase tracking-widest hover:bg-[#afa3ff]/20 transition-all"
        >
          <BookOpen size={16} /> More Articles
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ArticleDetail;
