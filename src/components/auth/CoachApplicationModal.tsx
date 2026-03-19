import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserPlus, X, Send, Clock, CheckCircle, XCircle, Loader2, ChevronRight,
} from 'lucide-react';
import {
  collection, query, where, getDocs, addDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

type ApplicationStatus = 'none' | 'pending' | 'approved' | 'rejected';

interface CoachApplicationModalProps {
  onClose: () => void;
}

export function CoachApplicationModal({ onClose }: CoachApplicationModalProps) {
  const { currentUser, userData } = useAuth();
  const [status, setStatus] = useState<ApplicationStatus>('none');
  const [motivation, setMotivation] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Check if a previous application exists
  useEffect(() => {
    const check = async () => {
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, 'coachApplications'),
          where('userId', '==', currentUser.uid)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const latest = snap.docs[snap.docs.length - 1].data();
          setStatus(latest.status as ApplicationStatus);
        }
      } catch (err) {
        console.error('Error checking application:', err);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userData) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'coachApplications'), {
        userId: currentUser.uid,
        displayName: userData.displayName,
        email: userData.email,
        photoURL: userData.photoURL ?? '',
        motivation: motivation.trim(),
        status: 'pending',
        createdAt: serverTimestamp(),
        reviewedAt: null,
        reviewedBy: null,
      });
      setStatus('pending');
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const statusContent = {
    pending: {
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
      title: 'Application Pending',
      desc: 'Your application is under review. You will be notified once an admin makes a decision.',
    },
    approved: {
      icon: CheckCircle,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      title: 'Application Approved! 🎉',
      desc: 'Congratulations! Your coach application has been approved. Your role has been updated.',
    },
    rejected: {
      icon: XCircle,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10 border-rose-500/20',
      title: 'Application Rejected',
      desc: 'Unfortunately your application was not approved this time. You may contact an admin for more information.',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="w-full max-w-md bg-[#1c1c1c] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#afa3ff]/10 border border-[#afa3ff]/20 flex items-center justify-center">
              <UserPlus size={20} className="text-[#afa3ff]" />
            </div>
            <h2 className="text-lg font-black text-white">Become a Coach</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={28} className="text-[#afa3ff] animate-spin" />
            </div>
          ) : status !== 'none' ? (
            /* ── Status display ── */
            (() => {
              const cfg = statusContent[status];
              const StatusIcon = cfg.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center gap-5 py-4"
                >
                  <div className={`w-20 h-20 rounded-3xl border flex items-center justify-center ${cfg.bg}`}>
                    <StatusIcon size={38} className={cfg.color} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-white mb-2">{cfg.title}</p>
                    <p className="text-zinc-400 text-sm leading-relaxed">{cfg.desc}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 w-full py-3.5 rounded-2xl bg-[#d6ff3e] text-[#1c1c1c] font-black uppercase tracking-widest text-sm"
                  >
                    Close
                  </button>
                </motion.div>
              );
            })()
          ) : (
            /* ── Application Form ── */
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-zinc-400 text-sm leading-relaxed">
                Share your experience and motivation to become a certified coach on AuraFit. An admin will review your application.
              </p>

              {/* Feature bullets */}
              <div className="bg-white/5 rounded-2xl p-4 space-y-2 border border-white/5">
                {[
                  'Create and manage client workout plans',
                  'Track client progress and results',
                  'Access the coach dashboard',
                ].map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#afa3ff]/20 border border-[#afa3ff]/30 flex items-center justify-center shrink-0">
                      <ChevronRight size={12} className="text-[#afa3ff]" />
                    </div>
                    <p className="text-zinc-300 text-sm">{f}</p>
                  </div>
                ))}
              </div>

              {/* Motivation textarea */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Your motivation (optional)
                </label>
                <textarea
                  value={motivation}
                  onChange={e => setMotivation(e.target.value)}
                  placeholder="Tell us about your fitness background, certifications, and why you'd like to coach..."
                  rows={4}
                  maxLength={600}
                  className="w-full bg-zinc-800/60 border border-zinc-700 rounded-2xl px-4 py-3 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-[#afa3ff] focus:ring-1 focus:ring-[#afa3ff]/40 resize-none transition-all"
                />
                <p className="text-right text-xs text-zinc-600">{motivation.length}/600</p>
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl bg-[#d6ff3e] text-[#1c1c1c] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#d6ff3e]/20 hover:bg-[#e4ff6a] transition-all disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Send size={16} />
                    Submit Application
                  </>
                )}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
