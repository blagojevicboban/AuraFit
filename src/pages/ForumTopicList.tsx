import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, MessageCircle, User, Clock, Plus, Search } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';


export default function ForumTopicList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [category, setCategory] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();


  // Create Topic State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTopics = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const catDoc = await getDoc(doc(db, 'forumCategories', id));
      if (catDoc.exists()) setCategory(catDoc.data());

      const q = query(
        collection(db, 'forumTopics'),
        where('categoryId', '==', id)
      );
      const snap = await getDocs(q);
      const fetchedTopics = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort manually to avoid composite index requirement
      fetchedTopics.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      
      setTopics(fetchedTopics);

    } catch (err) {
      console.error("Error fetching topics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [id]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !userData?.uid) return;

    try {
      setIsSubmitting(true);
      
      // 1. Create the topic
      const topicRef = await addDoc(collection(db, 'forumTopics'), {
        title: newTitle.trim(),
        categoryId: id,
        authorId: userData.uid,
        authorName: userData.displayName || 'Korisnik',
        authorPhoto: userData.photoURL || '',
        createdAt: serverTimestamp(),
        replyCount: 0,
        lastPostAt: serverTimestamp()
      });

      // 2. Create the first post (content)
      await addDoc(collection(db, 'forumPosts'), {
        topicId: topicRef.id,
        content: newContent.trim(),
        authorId: userData.uid,
        authorName: userData.displayName || 'Korisnik',
        createdAt: serverTimestamp(),
        likes: 0
      });

      console.log("Topic and post created successfully!");
      setNewTitle('');
      setNewContent('');
      setIsModalOpen(false);
      await fetchTopics(); // Refresh list with properly defined fetchTopics
    } catch (err) {
      console.error("Error creating topic:", err);
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col p-6 pb-24 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-zinc-500 hover:text-emerald-500 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#afa3ff] uppercase tracking-tighter">
            {category?.title || 'Forum'}
          </h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
            {topics.length} DISKUSIJA
          </p>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex gap-3 mb-8">
        <div className="flex-1 relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
           <input 
             type="text" 
             placeholder="Pretraži teme..." 
             className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
           />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 rounded-2xl bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
        >
           <Plus size={24} />
        </button>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-20 animate-pulse text-emerald-500 font-black tracking-widest uppercase text-xs">Učitavanje diskusija...</div>
        ) : topics.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-sm border border-zinc-100 dark:border-white/5">
            <p className="text-zinc-500 font-bold italic leading-relaxed">Još uvek nema diskusija u ovoj kategoriji.<br/>Budi prvi koji će započeti temu!</p>
          </div>
        ) : topics.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/forum-topic/${topic.id}`)}
            className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-emerald-500 transition-colors">
                  {topic.title}
                </h3>
                <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><User size={12} className="text-[#afa3ff]" /> {topic.authorName || 'Korisnik'}</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#afa3ff]" /> {topic.createdAt?.toDate()?.toLocaleDateString() || 'Danas'}</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center bg-zinc-50 dark:bg-white/5 w-12 h-14 rounded-2xl border border-zinc-100 dark:border-white/5">
                <MessageCircle size={14} className="text-emerald-500 mb-1" />
                <span className="text-xs font-black">{topic.replyCount || 0}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Topic Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-[#afa3ff] to-emerald-500 animate-gradient-x" />
              
              <h2 className="text-2xl font-black text-[#afa3ff] uppercase tracking-tighter mb-6">Nova Diskusija</h2>
              
              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 mb-2 block">Naslov teme</label>
                  <input 
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="O čemu želiš da pričaš?"
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 mb-2 block">Sadržaj poruke</label>
                  <textarea 
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Podeli svoja razmišljanja ili postavi pitanje..."
                    rows={4}
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm resize-none"
                    required
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                  >
                    Odustani
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-emerald-500 text-zinc-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Slanje...' : 'Objavi temu'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
