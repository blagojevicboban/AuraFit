import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bell, User, Clock, Flame, Star, 
  Home, BookOpen, Apple, Headphones, ChevronLeft, Loader2
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useLanguage } from '../contexts/LanguageContext';
import TopHeader from '../components/TopHeader';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const Community: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('Discussion Forum');
  const [forums, setForums] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [forumSnap, challengeSnap] = await Promise.all([
          getDocs(query(collection(db, 'forumCategories'), orderBy('title'))),
          getDocs(collection(db, 'challenges'))
        ]);
        
        const allForums = forumSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const uniqueForums = Array.from(new Map(allForums.map((f: any) => [f.title, f])).values());
        setForums(uniqueForums);
        
        // Deduplicate challenges by title to handle cases where seeding might have created duplicates
        const allChallenges = challengeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const uniqueChallenges = Array.from(new Map(allChallenges.map((c: any) => [c.title, c])).values());
        setChallenges(uniqueChallenges);

      } catch (e) {
        console.error("Error fetching community data:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col pb-24 transition-colors duration-300">
      
      {/* ── Header ── */}
      <TopHeader title={t('community.title')} />

      <div className="px-6">
        {/* ── Tabs ── */}
        <div className="flex bg-zinc-200 dark:bg-zinc-900 rounded-full p-1 mb-6 relative transition-colors">
          <motion.div 
             className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-emerald-500 dark:bg-[#d6ff3e] rounded-full z-0"
             animate={{ x: activeTab === 'Discussion Forum' ? 0 : '100%' }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <button 
            onClick={() => setActiveTab('Discussion Forum')}
            className={`flex-1 py-3 text-sm font-bold rounded-full z-10 transition-colors ${activeTab === 'Discussion Forum' ? 'text-white dark:text-[#1c1c1c]' : 'text-zinc-500 dark:text-zinc-400'}`}
          >
            {t('community.forumTab')}
          </button>
          <button 
            onClick={() => setActiveTab('Challenges')}
            className={`flex-1 py-3 text-sm font-bold rounded-full z-10 transition-colors ${activeTab === 'Challenges' ? 'text-white dark:text-[#1c1c1c]' : 'text-zinc-500 dark:text-zinc-400'}`}
          >
            {t('community.challengesTab')}
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
              <h2 className="text-emerald-500 dark:text-[#d6ff3e] text-xl font-extrabold mb-4">{t('community.forumsHeader')}</h2>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-emerald-500 dark:text-[#d6ff3e]" size={30} />
                  <p className="text-zinc-500 font-bold">{t('common.loading')}</p>
                </div>
              ) : forums.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-sm border border-zinc-100 dark:border-white/5">
                   <p className="text-zinc-500 font-bold">{t('community.noForums')}</p>
                </div>
              ) : (
                <div className="bg-[#afa3ff] rounded-[2.5rem] p-6 space-y-6 shadow-xl">
                  {forums.map((forum, i) => (
                    <motion.div 
                      key={forum.id} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="group"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 pr-4 text-[#1c1c1c]">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-black text-sm leading-tight uppercase tracking-tight">{forum.title}</h4>
                            <button 
                              onClick={() => navigate(`/forum/${forum.id}`)}
                              className="text-[#1c1c1c]/60 text-[10px] whitespace-nowrap hover:text-[#1c1c1c] transition-colors font-bold uppercase tracking-widest"
                            >
                              {t('community.seeAll')}
                            </button>
                          </div>
                          <p className="text-[#1c1c1c]/70 text-[11px] leading-snug">{forum.description || forum.sub || ''}</p>
                        </div>
                      </div>
                      {i < forums.length - 1 && (
                        <div className="h-px bg-[#1c1c1c]/10 mt-4" />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="px-6 flex-grow pb-8">
               <h2 className="text-emerald-500 dark:text-[#d6ff3e] text-xl font-extrabold mb-4">{t('community.activeChallenges')}</h2>
               
               {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-emerald-500 dark:text-[#d6ff3e]" size={30} />
                </div>
               ) : challenges.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-sm border border-zinc-100 dark:border-white/5">
                   <p className="text-zinc-500 font-bold">{t('community.noChallenges')}</p>
                </div>
               ) : (
                <div className="space-y-4">
                    {challenges.map((challenge, i) => (
                      <motion.div 
                        key={challenge.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => navigate(`/challenge/${challenge.id}`)}
                        className="bg-white dark:bg-zinc-800 rounded-[2.5rem] p-1 relative overflow-hidden group cursor-pointer shadow-lg aspect-video border border-zinc-100 dark:border-none"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center overflow-hidden">
                          <img 
                            src={challenge.image || '/assets/cycling.png'} 
                            className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" 
                            alt={challenge.title} 
                          />
                        </div>
                        <button className="absolute bottom-4 right-4 text-white z-20 hover:scale-110 transition-transform">
                           <Star size={20} className="drop-shadow-lg" />
                        </button>
                        <div className="absolute bottom-4 left-4 z-20">
                          <h3 className="text-[#d6ff3e] font-black text-xl leading-tight mb-1 drop-shadow-md">{challenge.title}</h3>
                          <div className="flex items-center gap-4 text-xs font-bold text-zinc-100 italic">
                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#afa3ff]"/>{challenge.time || challenge.duration || 'Flexible'}</span>
                            <span className="flex items-center gap-1.5"><Flame size={12} className="text-[#afa3ff]"/>{challenge.kcal || 'Various'}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
               )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <BottomNav />

    </div>
  );
};

export default Community;
