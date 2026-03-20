import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, MessageSquare, User, Clock, Send, Heart } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy, addDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';


export default function ForumPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [topic, setTopic] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();
  
  const [newReply, setNewReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFullTopic = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const topicDoc = await getDoc(doc(db, 'forumTopics', id));
      if (topicDoc.exists()) setTopic(topicDoc.data());

      const q = query(
        collection(db, 'forumPosts'),
        where('topicId', '==', id)
      );
      const snap = await getDocs(q);
      const fetchedPosts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sort manually to avoid composite index requirement
      fetchedPosts.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeA - timeB;
      });

      setPosts(fetchedPosts);

    } catch (err) {
      console.error("Error fetching topic detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFullTopic();
  }, [id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || !userData?.uid || !id) return;

    try {
      setIsSubmitting(true);
      
      await addDoc(collection(db, 'forumPosts'), {
        topicId: id,
        content: newReply.trim(),
        authorId: userData.uid,
        authorName: userData.displayName || 'Korisnik',
        createdAt: serverTimestamp(),
        likes: 0
      });

      await updateDoc(doc(db, 'forumTopics', id), {
        replyCount: increment(1),
        lastPostAt: serverTimestamp()
      });

      setNewReply('');
      await fetchFullTopic();
    } catch (err) {
      console.error("Error replying:", err);
    } finally {
      setIsSubmitting(false);
    }

  };

  const handleLikePost = async (postId: string) => {
    // Placeholder for like logic
    console.log("Liked post:", postId);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col p-6 transition-colors duration-300">
      <div className="flex items-center gap-4 mb-8 pt-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-500 hover:text-emerald-500 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-[#afa3ff] uppercase tracking-tighter truncate">
          {topic?.title || 'Diskusija'}
        </h1>
      </div>

      <div className="space-y-6 flex-grow pb-24">
        {loading ? (
          <div className="flex justify-center p-20 animate-pulse text-emerald-500 font-black text-xs uppercase tracking-widest">Učitavanje poruka...</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, i) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 border border-zinc-100 dark:border-white/5 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-[#afa3ff]">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest">{post.authorName || 'Korisnik'}</p>
                    <p className="text-[10px] text-zinc-500 font-bold">
                       {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : 'Slanje...'}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">{post.content}</p>
                <div className="mt-4 pt-4 border-t border-zinc-50 dark:border-white/5 flex gap-4">
                  <button 
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase text-zinc-400 hover:text-rose-500 transition-colors"
                  >
                    <Heart size={12} className={post.likes > 0 ? 'fill-rose-500 text-rose-500' : ''} /> {post.likes || 0} SVIĐANJA
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Reply input at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md border-t border-zinc-200 dark:border-white/5 z-40">
        <form onSubmit={handleReply} className="relative max-w-4xl mx-auto">
           <input 
             type="text" 
             value={newReply}
             onChange={(e) => setNewReply(e.target.value)}
             placeholder="Napiši odgovor..." 
             disabled={isSubmitting}
             className="w-full pl-6 pr-14 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-3xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
           />
           <button 
             type="submit"
             disabled={isSubmitting || !newReply.trim()}
             className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-500 text-zinc-950 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
           >
             <Send size={18} />
           </button>
        </form>
      </div>
    </div>

  );
}
