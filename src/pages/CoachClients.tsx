import { useState, useEffect } from "react";
import { Users, Search, Filter, MoreVertical, Mail, Activity, ChevronRight, UserPlus, Loader2, Check, X, Clock } from "lucide-react";
import { motion } from "motion/react";
import { collection, query, where, getDocs, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function CoachClients() {
  const { currentUser, refreshUserData } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Fetch current clients
      const qC = query(collection(db, 'users'), where('coachId', '==', currentUser.uid));
      const clientSnap = await getDocs(qC);
      setClients(clientSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch pending requests
      const qR = query(collection(db, 'coachRequests'), 
        where('coachId', '==', currentUser.uid),
        where('status', '==', 'pending')
      );
      const requestSnap = await getDocs(qR);
      setRequests(requestSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching coach data:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleAccept = async (requestId: string, clientId: string) => {
    if (!currentUser) return;
    try {
      const batch = writeBatch(db);
      
      // 1. Accept request
      batch.update(doc(db, 'coachRequests', requestId), { status: 'accepted' });
      
      // 2. Assign coach to client
      batch.update(doc(db, 'users', clientId), { coachId: currentUser.uid });
      
      await batch.commit();
      await fetchData(); // Refresh UI
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await updateDoc(doc(db, 'coachRequests', requestId), { status: 'declined' });
      await fetchData(); // Refresh UI
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  const filteredClients = clients.filter(client => 
    (client.displayName || client.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-24 lg:pb-8 transition-colors duration-200">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-200">Klijenti</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm sm:text-base transition-colors duration-200">Upravljanje i pregled svih klijenata</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-indigo-500/20 self-start sm:self-auto">
          <UserPlus className="w-4 h-4" />
          Dodaj klijenta
        </button>
      </header>

      {/* Pending Requests Section */}
      {requests.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#afa3ff]">
            <Clock className="w-5 h-5" />
            <h2 className="text-lg font-bold uppercase tracking-widest">Zahtevi na čekanju ({requests.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-zinc-900 border border-indigo-500/20 rounded-3xl p-5 flex items-center justify-between shadow-xl shadow-indigo-500/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center overflow-hidden border border-indigo-500/20">
                    {request.clientPhoto ? (
                      <img src={request.clientPhoto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-indigo-400 font-bold">{request.clientName?.[0]}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{request.clientName}</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-500">Želi te za trenera</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleAccept(request.id, request.clientId)}
                    className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                    title="Prihvati"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDecline(request.id)}
                    className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10"
                    title="Odbij"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <div className="bg-white dark:bg-zinc-900/40 rounded-3xl border border-slate-200 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm dark:shadow-none overflow-hidden transition-colors duration-200">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-zinc-800/50 flex flex-col sm:flex-row gap-4 justify-between transition-colors duration-200">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-500" />
            <input 
              type="text" 
              placeholder="Pretraži klijente..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800/80 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors duration-200"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-zinc-950/50 text-slate-700 dark:text-zinc-300 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors border border-slate-200 dark:border-zinc-800/80">
            <Filter className="w-4 h-4" />
            Filteri
          </button>
        </div>

        <div className="overflow-x-auto min-h-[200px] relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-indigo-500" size={30} />
              <p className="text-slate-500 dark:text-zinc-400 font-bold">Učitavanje klijenata...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/20 transition-colors duration-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Klijent</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Cilj</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider hidden md:table-cell">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider hidden lg:table-cell">Reg. Datum</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider text-right">Akcije</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/50 transition-colors duration-200">
                {filteredClients.map((client, i) => (
                  <motion.tr 
                    key={client.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700/50 transition-colors duration-200 overflow-hidden shadow-sm">
                          {client.photoURL ? (
                            <img src={client.photoURL} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (client.displayName || client.name || "U")[0].toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white transition-colors duration-200">{client.displayName || client.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-zinc-500 sm:hidden mt-0.5 uppercase tracking-wider font-bold">{client.goal || 'Bez cilja'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-slate-600 dark:text-zinc-400 transition-colors duration-200">{client.goal || '---'}</span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        client.setupCompleted 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' 
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                      } transition-colors duration-200`}>
                        {client.setupCompleted ? 'Aktivno' : 'Čeka setup'}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-slate-500 dark:text-zinc-500 tabular-nums">
                        {client.createdAt?.toDate ? client.createdAt.toDate().toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-zinc-500">
                      Nema pronađenih klijenata
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
