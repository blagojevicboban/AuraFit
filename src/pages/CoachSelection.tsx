import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Star, MessageSquare, ChevronRight, 
  Loader2, CheckCircle2, Trophy, ShieldCheck, ArrowLeft, Clock
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

export default function CoachSelection() {
  const navigate = useNavigate();
  const { user, userData, refreshUserData } = useAuth();
  const { t } = useLanguage();
  
  const [coaches, setCoaches] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectingId, setSelectingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // Fetch Coaches
        const qC = query(collection(db, 'users'), where('role', '==', 'coach'));
        const coachSnap = await getDocs(qC);
        setCoaches(coachSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch user's requests
        const qR = query(collection(db, 'coachRequests'), where('clientId', '==', user.uid));
        const requestSnap = await getDocs(qR);
        setRequests(requestSnap.docs.map(doc => doc.data()));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSelectCoach = async (coachId: string) => {
    if (!user || !userData) return;
    
    // Check if there is already a pending request for this specific coach
    if (requests.some(r => r.coachId === coachId && r.status === 'pending')) return;

    setSelectingId(coachId);
    try {
      await addDoc(collection(db, 'coachRequests'), {
        clientId: user.uid,
        clientName: userData.displayName || 'Korisnik',
        clientPhoto: userData.photoURL || '',
        coachId: coachId,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      // Update local state to reflect the sent request
      setRequests(prev => [...prev, { coachId, status: 'pending' }]);
    } catch (error) {
      console.error("Error sending coach request:", error);
    } finally {
      setSelectingId(null);
    }
  };

  const filteredCoaches = coaches.filter(c => 
    (c.displayName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.specialty || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Back Button & Header */}
        <header className="mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium tracking-tight">Nazad</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                Izaberi svog trenera
              </h1>
              <p className="text-zinc-500 max-w-xl font-light">
                Pronađi stručnjaka koji će ti pomoći da dostigneš svoje fitness ciljeve uz personalizovan pristup i svakodnevnu motivaciju.
              </p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input 
                type="text"
                placeholder="Pretraži trenere ili specijalnosti..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#d6ff3e]/20 transition-all font-semibold"
              />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-[#d6ff3e]" size={40} />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Učitavanje trenera...</p>
          </div>
        ) : filteredCoaches.length === 0 ? (
          <div className="text-center py-24 bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-800">
             <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
             <p className="text-zinc-500 font-medium">Trenutno nema dostupnih trenera koji odgovaraju pretrazi.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCoaches.map((coach, i) => (
              <motion.div
                key={coach.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden hover:border-zinc-700 transition-all shadow-xl hover:shadow-2xl hover:shadow-[#d6ff3e]/5"
              >
                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="px-3 py-1 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-full flex items-center gap-1.5 shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Dostupan</span>
                  </div>
                </div>

                {/* Avatar & Info */}
                <div className="p-8 pb-4 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 p-1 transition-transform group-hover:scale-105 duration-500">
                      <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-zinc-950">
                        {coach.photoURL ? (
                          <img src={coach.photoURL} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-black text-zinc-700">
                            {coach.displayName?.[0]}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Level Icon */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[#d6ff3e] flex items-center justify-center text-zinc-950 shadow-lg border-2 border-zinc-900">
                      <Trophy size={14} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#d6ff3e] transition-colors">{coach.displayName}</h3>
                  <p className="text-xs text-[#afa3ff] font-bold uppercase tracking-wider mb-4">{coach.specialty || 'Pro Trener'}</p>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 mb-6">
                    <span className="flex items-center gap-1.5"><Star size={12} className="text-yellow-500" /> 4.9</span>
                    <div className="w-px h-3 bg-zinc-800" />
                    <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /> Sertifikovan</span>
                  </div>

                  <p className="text-sm text-zinc-500 font-light leading-relaxed mb-6 line-clamp-3">
                    {coach.bio || 'Specijalista za transformacije i funkcionalni trening. Preko 5 godina iskustva u radu sa klijentima svih nivoa spremnosti.'}
                  </p>
                </div>

                {/* Footer / Action */}
                <div className="mt-auto p-4 bg-zinc-950/50 border-t border-zinc-800">
                  <button 
                    onClick={() => handleSelectCoach(coach.id)}
                    disabled={selectingId === coach.id || requests.some(r => r.coachId === coach.id && r.status === 'pending')}
                    className={cn(
                      "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2",
                      userData?.coachId === coach.id
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : requests.some(r => r.coachId === coach.id && r.status === 'pending')
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                          : "bg-[#d6ff3e] text-zinc-950 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#d6ff3e]/10"
                    )}
                  >
                    {selectingId === coach.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : userData?.coachId === coach.id ? (
                        <>
                          <CheckCircle2 size={16} />
                          Tvoj Trener
                        </>
                    ) : requests.some(r => r.coachId === coach.id && r.status === 'pending') ? (
                        <>
                          <Clock className="w-4 h-4" />
                          Zahtev poslat
                        </>
                    ) : (
                      <>
                        POŠALJI ZAHTEV
                        <ChevronRight size={14} />
                      </>
                    )}
                  </button>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
