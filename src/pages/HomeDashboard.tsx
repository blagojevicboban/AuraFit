import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, User, Star, Dumbbell, BarChart2, Apple, Users, Play, Clock, Flame, ChevronRight, X, Shield, MessageSquare
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import GlobalSearch from '../components/GlobalSearch';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';


// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const recommendations = (t: any) => [
  { id: 1, title: t('common.squat'), duration: '12', kcal: '120', bg: 'from-zinc-700 to-zinc-900', img: '/assets/squat.png' },
  { id: 2, title: t('common.stretching'), duration: '12', kcal: '120', bg: 'from-zinc-600 to-zinc-800', img: '/assets/stretching.png' },
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
  const { initNotifications, userData } = useAuth();
  const { t } = useLanguage();

  const [favRecs, setFavRecs] = useState<number[]>([]);
  const [favArticles, setFavArticles] = useState<number[]>([]);

  const toggleFavRec = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavRecs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleFavArt = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavArticles(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [unreadFromCoach, setUnreadFromCoach] = useState(0);

  useEffect(() => {
    if (!userData?.uid || !userData?.coachId) return;
    const q = query(
      collection(db, "messages"),
      where("receiverId", "==", userData.uid),
      where("senderId", "==", userData.coachId),
      where("read", "==", false)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setUnreadFromCoach(snapshot.size);
    });
    return () => unsub();
  }, [userData?.uid, userData?.coachId]);


  useEffect(() => {
    // Show prompt if notifications are not enabled and it hasn't been shown this session
    if (userData && !userData.notificationsEnabled && !sessionStorage.getItem('pwa_prompt_shown')) {
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [userData]);

  const handleEnableNotifications = async () => {
    await initNotifications();
    setShowPrompt(false);
    sessionStorage.setItem('pwa_prompt_shown', 'true');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#1c1c1c] text-zinc-950 dark:text-white font-sans flex flex-col overflow-x-hidden transition-colors duration-300">
      
      {/* ── Notification Prompt ── */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[100] p-4 pt-12"
          >
            <div className="bg-[#afa3ff] rounded-3xl p-6 shadow-2xl relative border border-white/20 backdrop-blur-xl">
              <button 
                onClick={() => {
                  setShowPrompt(false);
                  sessionStorage.setItem('pwa_prompt_shown', 'true');
                }}
                className="absolute top-4 right-4 text-[#1c1c1c]/60 hover:text-[#1c1c1c]"
              >
                <X size={20} />
              </button>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#d6ff3e] flex items-center justify-center flex-shrink-0">
                  <Bell className="text-[#1c1c1c]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#1c1c1c] font-black text-lg leading-tight mb-1">{t('home.stayNotified')}</h3>
                  <p className="text-[#1c1c1c]/70 text-sm font-medium mb-4">{t('home.notificationDesc')}</p>
                  <button 
                    onClick={handleEnableNotifications}
                    className="w-full py-3 bg-[#1c1c1c] text-[#d6ff3e] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-colors"
                  >
                    {t('home.enableNotifications')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold" style={{ color: '#afa3ff' }}>
                {t('home.welcome', { name: userData?.displayName || t('common.champ') })}
              </h1>
              {userData?.role === 'admin' && (
                <button 
                  onClick={() => navigate('/app/admin')}
                  className="bg-zinc-800 border border-zinc-700 px-3 py-1 rounded-full text-[#d6ff3e] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-lg shadow-black/20 hover:bg-zinc-700 transition-colors"
                >
                  <Shield size={12} />
                  Admin
                </button>
              )}
            </div>
            <p className="text-zinc-700 dark:text-zinc-400 text-sm mt-1">{t('home.challengeLimits')}</p>
          </div>
          <div className="flex gap-4 pt-1">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-zinc-700 dark:text-white hover:text-[#d6ff3e] transition-colors"
            >
              <Search size={22} />
            </button>
            <button 
              onClick={() => navigate('/settings/notifications')}
              className="text-zinc-700 dark:text-white hover:text-[#d6ff3e] transition-colors relative"
            >
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#d6ff3e] rounded-full" />
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="text-zinc-700 dark:text-white hover:text-[#d6ff3e] transition-colors"
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
            { icon: Dumbbell, label: t('home.workout'), path: '/workouts' },
            { icon: BarChart2, label: t('home.progressTracking').replace('\n', ' '), path: '/progress' },
            { icon: Apple, label: t('nav.nutrition'), path: '/nutrition' },
            { icon: Users, label: t('nav.community'), path: '/community' },
          ].map(({ icon: Icon, label, path }, i) => (
            <React.Fragment key={path}>
              <button
                onClick={() => navigate(path)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-[#afa3ff]/20 transition-colors">
                  <Icon size={24} className="text-[#afa3ff]" />
                </div>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 text-center leading-tight whitespace-pre-line">{label}</span>
              </button>
              {i < 3 && <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-700/60" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-grow overflow-y-auto pb-24 space-y-2">

        {/* ── Coach Engagement Card (For clients without coach) ── */}
        {userData?.role === 'client' && !userData?.coachId && (
          <section className="px-6 pt-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => navigate('/coaches')}
              className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-[#afa3ff] to-[#7c66ff] shadow-xl shadow-[#7c66ff]/20 overflow-hidden cursor-pointer group"
            >
              {/* Abstract decorations */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-110 transition-transform" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#d6ff3e]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#d6ff3e]" />
                    <span className="text-[10px] font-black text-zinc-950 uppercase tracking-[0.2em]">Pronađi mentora</span>
                  </div>
                  <h2 className="text-3xl font-black text-zinc-950 leading-tight">
                    Ostvari rezultate 2x brže
                  </h2>
                  <p className="text-zinc-900/60 text-sm font-medium max-w-[200px]">
                    Angažuj profesionalnog trenera za personalizovane planove.
                  </p>
                </div>
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#d6ff3e] text-zinc-950 group-hover:scale-110 transition-transform shadow-lg">
                  <ChevronRight size={28} />
                </div>
              </div>
            </motion.div>
          </section>
        )}
        {/* ── My Coach Card (For clients with coach) ── */}

        {userData?.role === 'client' && userData?.coachId && (
          <section className="px-6 pt-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate('/app/messages', { state: { selectedUserId: userData.coachId } })}
              className="p-6 rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between cursor-pointer group transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-[#afa3ff] flex items-center justify-center text-zinc-950 font-black">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  {unreadFromCoach > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[1.25rem] h-[1.25rem] px-1 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-950 text-[10px] font-black text-white flex items-center justify-center animate-pulse shadow-sm">
                      {unreadFromCoach}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#afa3ff] uppercase tracking-widest">Moj Trener</p>
                  <h3 className="text-lg font-bold">Pošalji poruku</h3>
                </div>
              </div>

              <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-[#afa3ff] transition-colors">
                <ChevronRight size={20} />
              </div>
            </motion.div>
          </section>
        )}


        {/* ── Recommendations ── */}
        <section className="px-6 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-extrabold" style={{ color: '#d6ff3e' }}>{t('home.recommendations')}</h2>
            <button 
              onClick={() => navigate('/workouts')}
              className="text-[#afa3ff] text-sm font-bold flex items-center gap-1 hover:text-[#d6ff3e] transition-colors"
            >
              {t('common.seeAll')} <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {recommendations(t).map((item: any) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/workout-player/${item.id}`)}
                className={`group relative rounded-[2rem] overflow-hidden cursor-pointer bg-zinc-900 h-64 shadow-2xl transition-all duration-300`}
              >
                {/* Background Image with Zoom on Hover */}
                <img 
                  src={item.img} 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700" 
                  alt={item.title} 
                />
                
                {/* Advanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                
                {/* Level Badge (Glass) */}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full z-20 shadow-xl">
                  <span className="text-[8px] font-black text-[#d6ff3e] uppercase tracking-widest">
                    {item.id === 1 ? 'Intermediate' : 'Beginner'}
                  </span>
                </div>

                {/* Favorite star */}
                <button 
                  onClick={(e) => toggleFavRec(e, item.id)}
                  className={`absolute top-3 right-3 z-30 transition-all hover:scale-125 ${favRecs.includes(item.id) ? 'text-yellow-400' : 'text-zinc-400'}`}
                >
                  <Star size={18} fill={favRecs.includes(item.id) ? 'currentColor' : 'none'} />
                </button>

                {/* Play button (Glass Style) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl group-hover:bg-[#afa3ff] group-hover:border-[#afa3ff] transition-all duration-500 z-20">
                  <Play size={20} className="text-white group-hover:text-black ml-1" fill="currentColor" />
                </div>

                {/* Information (Glass Panel) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 bg-gradient-to-t from-black to-transparent z-10">
                  <h3 className="font-black text-lg text-white mb-2 leading-tight tracking-tight">{item.title}</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/5">
                      <Clock size={10} className="text-[#afa3ff]" />
                      <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-wider">{item.duration}m</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/5">
                      <Flame size={10} className="text-[#d6ff3e]" />
                      <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-wider">{item.kcal}kcal</span>
                    </div>
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
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/challenge/30-day-plank')}
            className="rounded-[2.5rem] overflow-hidden bg-[#afa3ff] relative cursor-pointer shadow-xl border border-white/20 group"
            style={{ minHeight: 180 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c1c]/90 via-[#1c1c1c]/40 to-transparent z-10" />
            <img 
              src="/assets/plank.png" 
              className="absolute right-0 top-0 bottom-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" 
              alt="Challenge" 
            />
            <div className="relative z-20 p-8">
              <p className="text-[#d6ff3e] text-[10px] font-black uppercase tracking-[0.2em] mb-2">{t('home.weeklyChallenge')}</p>
              <h3 className="text-3xl font-black text-white leading-tight mb-2">
                30 Day<br/>Plank
              </h3>
              <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">5 Min</span>
                 <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">Hard</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Articles & Tips ── */}
        <section className="px-6 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">{t('home.articlesTips')}</h2>
            <button 
              onClick={() => navigate('/articles')}
              className="text-[#afa3ff] text-sm font-bold flex items-center gap-1 hover:text-[#d6ff3e] transition-colors"
            >
              {t('common.seeAll')} <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {articles.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/article', { state: { articleId: item.id } })}
                className={`relative rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br ${item.bg} h-44`}
              >
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">{item.icon}</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <button 
                  onClick={(e) => toggleFavArt(e, item.id)}
                  className={`absolute top-3 right-3 transition-colors ${favArticles.includes(item.id) ? 'text-yellow-400' : 'text-zinc-400'}`}
                >
                  <Star size={16} fill={favArticles.includes(item.id) ? 'currentColor' : 'none'} />
                </button>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-bold text-sm text-white leading-tight">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      {/* ── Temporary Seed Button (Admin Only) ── */}
      {userData?.role === 'admin' && (
        <div className="fixed top-4 left-4 z-[60]">
          <button 
            onClick={async () => {
              const { seedDatabase } = await import('../lib/dbSeeder');
              const result = await seedDatabase();
              if (result.success) {
                alert(`Successfully seeded ${result.count} documents!`);
              } else {
                alert(`Seed failed: ${result.error}`);
              }
            }}
            className="bg-red-500/20 hover:bg-red-500/40 text-red-500 text-[8px] font-bold px-2 py-1 rounded-full border border-red-500/50 backdrop-blur-md"
          >
            DEBUG: SEED DB
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeDashboard;
