import React, { useState, useEffect, useRef } from "react";
import { Send, Search, User, Loader2, ChevronLeft, MoreVertical, MessageSquare } from "lucide-react";
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { useLocation, useNavigate } from "react-router-dom";

export default function Messages() {
  const { userData, currentUser } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations
  useEffect(() => {
    if (!currentUser) return;

    // In a real app, we might have a 'conversations' collection. 
    // Here we'll derive them from messages or fetch coaches/clients.
    const fetchParticipants = async () => {
      setLoading(true);
      try {
        let participants: any[] = [];
        if (userData?.role === 'coach') {
          // Coach sees their clients
          const q = query(collection(db, "users"), where("coachId", "==", currentUser.uid));
          const snap = await getDocs(q);
          participants = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else if (userData?.role === 'client' && userData?.coachId) {
          // Client sees their coach
          const coachDoc = await getDoc(doc(db, "users", userData.coachId));
          if (coachDoc.exists()) {
            participants = [{ id: coachDoc.id, ...coachDoc.data() }];
          }
        }
        
        setConversations(participants);
        
        // Handle auto-selected conversation from navigation state
        const passedUserId = (location.state as any)?.selectedUserId;
        if (passedUserId) {
          const target = participants.find(p => p.id === passedUserId);
          if (target) setActiveConversation(target);
        } else if (participants.length > 0 && !activeConversation) {
          setActiveConversation(participants[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [currentUser, userData]);

  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  // Fetch unread counts for all potential conversations
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "messages"),
      where("receiverId", "==", currentUser.uid),
      where("read", "==", false)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts: Record<string, number> = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        counts[data.senderId] = (counts[data.senderId] || 0) + 1;
      });
      setUnreadCounts(counts);
    });
    
    return () => unsubscribe();
  }, [currentUser]);

  // Mark as read when active conversation is viewed
  useEffect(() => {
    if (!currentUser || !activeConversation || messages.length === 0) return;
    
    const markAsRead = async () => {
      const unreadFromThisUser = messages.filter(m => m.senderId === activeConversation.id && !m.read);
      if (unreadFromThisUser.length > 0) {
        const { writeBatch, doc } = await import("firebase/firestore");
        const batch = writeBatch(db);
        unreadFromThisUser.forEach(msg => {
          batch.update(doc(db, "messages", msg.id), { read: true });
        });
        await batch.commit();
      }
    };

    markAsRead();
  }, [messages, activeConversation, currentUser]);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!currentUser || !activeConversation) return;

    const q = query(
      collection(db, "messages"),
      where("participants", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Filter for current pair and sort manually in JS to avoid index requirement
      const filtered = allMsgs
        .filter((m: any) => m.participants.includes(activeConversation.id))
        .sort((a: any, b: any) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
          return timeA - timeB;
        });
      setMessages(filtered);
    });

    return () => unsubscribe();
  }, [currentUser, activeConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !activeConversation) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        senderId: currentUser.uid,
        receiverId: activeConversation.id,
        participants: [currentUser.uid, activeConversation.id],
        createdAt: serverTimestamp(),
        read: false
      });
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-64px)] overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300">
      {/* Conversations Sidebar */}
      <div className={cn(
        "w-full md:w-80 flex-shrink-0 border-r border-zinc-200 dark:border-white/5 flex flex-col transition-all",
        activeConversation && "hidden md:flex"
      )}>
        <div className="p-6 border-b border-zinc-200 dark:border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">{t('nav.messages') === 'nav.messages' ? 'Poruke' : t('nav.messages')}</h1>
          </div>
          <div className="relative">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Pretraži..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {loading ? (
             <div className="flex justify-center p-8"><Loader2 className="animate-spin text-emerald-500" /></div>
          ) : conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-3xl transition-all",
                activeConversation?.id === conv.id 
                  ? "bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20" 
                  : "hover:bg-zinc-100 dark:hover:bg-white/5"
              )}
            >
              <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center text-zinc-950 font-black text-xl shadow-md border border-white/10">
                {conv.photoURL ? <img src={conv.photoURL} alt="" className="w-full h-full object-cover" /> : (conv.displayName?.[0] || 'U')}
              </div>
              <div className="text-left overflow-hidden flex-1">
                <p className="font-bold truncate">{conv.displayName}</p>
                <p className={cn("text-xs truncate opacity-60", activeConversation?.id === conv.id ? "text-zinc-950" : "text-zinc-500")}>
                  {conv.role === 'coach' ? 'Mentor' : 'Klijent'}
                </p>
              </div>
              {unreadCounts[conv.id] > 0 && (
                <div className="w-5 h-5 rounded-full bg-zinc-950 dark:bg-[#d6ff3e] text-[#d6ff3e] dark:text-zinc-950 text-[10px] font-black flex items-center justify-center animate-pulse shadow-lg">
                  {unreadCounts[conv.id]}
                </div>
              )}
            </button>

          ))}
          {!loading && conversations.length === 0 && (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <p className="text-sm text-zinc-500">Nema aktivnih razgovora.</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-slate-50/30 dark:bg-zinc-900/10 transition-all",
        !activeConversation && "hidden md:flex items-center justify-center text-center p-12"
      )}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 md:p-6 border-b border-zinc-200 dark:border-white/5 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveConversation(null)} className="md:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-zinc-950 font-black text-sm">
                   {activeConversation.photoURL ? <img src={activeConversation.photoURL} alt="" className="w-full h-full object-cover" /> : activeConversation.displayName?.[0]}
                </div>
                <div>
                  <h3 className="font-bold">{activeConversation.displayName}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Active Now</p>
                  </div>
                </div>
              </div>
              <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === currentUser?.uid;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex flex-col max-w-[80%]",
                      isMe ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "px-5 py-3 rounded-3xl text-sm leading-relaxed shadow-sm",
                      isMe 
                        ? "bg-emerald-500 text-zinc-950 rounded-tr-none font-medium" 
                        : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200 dark:border-white/5"
                    )}>
                      {msg.text}
                    </div>
                    <span className="mt-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                    </span>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-8 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl border-t border-zinc-200 dark:border-white/5">
              <form onSubmit={handleSendMessage} className="flex gap-4 max-w-4xl mx-auto items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Napiši poruku..."
                    className="w-full pl-6 pr-12 py-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-3xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 brand-gradient rounded-2xl flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6">
               <MessageSquare className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Vaše poruke</h2>
            <p className="text-zinc-500 max-w-xs transition-colors duration-200">
              Direktno dopisivanje sa tvojim trenerom ili klijentima. Sve poruke su sinhronizovane u realnom vremenu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
