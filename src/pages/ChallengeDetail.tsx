import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Users, Clock, Flame, 
  Trophy, Star, Calendar, ArrowRight,
  CheckCircle2, Share2, Info
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import TopHeader from '../components/TopHeader';

const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { userData, refreshUserData } = useAuth();
  
  const [challenge, setChallenge] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'challenges', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setChallenge({ id: docSnap.id, ...docSnap.data() });
        } else {
          navigate('/community');
        }
      } catch (error) {
        console.error("Error fetching challenge:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenge();
  }, [id, navigate]);

  const isJoined = userData?.joinedChallenges?.includes(id || '');

  const handleJoinLeave = async () => {
    if (!id || !userData?.uid) return;
    
    setIsJoining(true);
    try {
      const userRef = doc(db, 'users', userData.uid);
      const challengeRef = doc(db, 'challenges', id);

      if (isJoined) {
        await updateDoc(userRef, {
          joinedChallenges: arrayRemove(id)
        });
        await updateDoc(challengeRef, {
          participantsCount: increment(-1)
        });
        setChallenge(prev => ({ ...prev, participantsCount: (prev.participantsCount || 1) - 1 }));
      } else {
        await updateDoc(userRef, {
          joinedChallenges: arrayUnion(id)
        });
        await updateDoc(challengeRef, {
          participantsCount: increment(1)
        });
        setChallenge(prev => ({ ...prev, participantsCount: (prev.participantsCount || 0) + 1 }));
      }
      
      await refreshUserData();
    } catch (error) {
      console.error("Error updating challenge status:", error);
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-[#d6ff3e] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-400 font-bold">{t('common.loading')}</p>
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans pb-10 transition-colors duration-300">
      
      {/* ── Header ── */}
      <TopHeader title={t('community.details')} showBack={true} />

      <div className="px-6 space-y-8">
        {/* ── Hero Image ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl mt-4 border border-zinc-100 dark:border-white/5"
        >
          <img 
            src={challenge.image || '/assets/cycling.png'} 
            className="w-full h-full object-cover" 
            alt={challenge.title} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="bg-[#d6ff3e] text-[#1c1c1c] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block shadow-lg">
                {challenge.intensity || 'Advanced'}
              </span>
              <h1 className="text-white text-3xl font-black leading-none drop-shadow-xl">{challenge.title}</h1>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Row ── */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
          <StatCard 
            icon={<Users className="text-indigo-500" size={20}/>} 
            value={challenge.participantsCount || 0} 
            label={t('community.participants')} 
          />
          <StatCard 
            icon={<Clock className="text-emerald-500" size={20}/>} 
            value={challenge.duration || challenge.time || '15 min'} 
            label={t('community.duration')} 
          />
          <StatCard 
            icon={<Flame className="text-orange-500" size={20}/>} 
            value={challenge.kcal || '~350'} 
            label={t('community.calories')} 
          />
          <StatCard 
            icon={<Trophy className="text-[#d6ff3e]" size={20}/>} 
            value={challenge.difficulty || t('common.intermediate')} 
            label={t('community.difficulty')} 
          />
        </div>

        {/* ── Description ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-sm border border-zinc-100 dark:border-white/5"
        >
           <h3 className="text-zinc-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
             <Info size={14} className="text-[#afa3ff]"/>
             {t('community.details')}
           </h3>
           <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-medium">
             {challenge.description || t('community.noDescription')}
           </p>
        </motion.div>

        {/* ── Benefits / Why Join ── */}
        <div className="grid grid-cols-2 gap-4">
           <BenefitItem icon={<Calendar size={18}/>} text="Track Progress" />
           <BenefitItem icon={<Star size={18}/>} text="Earn Points" />
           <BenefitItem icon={<CheckCircle2 size={18}/>} text="Compete Daily" />
           <BenefitItem icon={<ArrowRight size={18}/>} text="Personalized" />
        </div>

        {/* ── Join Button ── */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleJoinLeave}
          disabled={isJoining}
          className={`w-full py-5 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${
            isJoined 
              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500' 
              : 'bg-emerald-500 dark:bg-[#d6ff3e] text-white dark:text-[#1c1c1c]'
          }`}
        >
          {isJoining ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {isJoined ? t('community.leaveChallenge') : t('community.joinChallenge')}
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>

        <div className="flex justify-center gap-8 py-4">
           <button className="text-zinc-400 hover:text-[#afa3ff] transition-colors"><Share2 size={24}/></button>
           <button className="text-zinc-400 hover:text-red-500 transition-colors"><Star size={24}/></button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, value: string | number, label: string }> = ({ icon, value, label }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-3xl p-5 min-w-[140px] flex flex-col gap-3 shadow-lg flex-shrink-0"
  >
    <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h4 className="text-lg font-black dark:text-white leading-tight">{value}</h4>
      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-bold">{label}</p>
    </div>
  </motion.div>
);

const BenefitItem: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200/50 dark:border-white/5">
     <span className="text-emerald-500 dark:text-[#d6ff3e]">{icon}</span>
     <span className="text-[10px] font-black uppercase tracking-tight text-zinc-600 dark:text-zinc-300">{text}</span>
  </div>
);

export default ChallengeDetail;
