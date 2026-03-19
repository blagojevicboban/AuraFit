import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserPlus, CheckCircle, XCircle, Clock, Loader2, ChevronDown, ChevronUp,
} from 'lucide-react';
import {
  collection, getDocs, doc, updateDoc, serverTimestamp, query, orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface CoachApplication {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  motivation: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: any;
  reviewedAt?: any;
  reviewedBy?: string;
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

export default function CoachApplications() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<CoachApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('pending');
  const [actionId, setActionId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'coachApplications'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() })) as CoachApplication[]);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleApprove = async (app: CoachApplication) => {
    setActionId(app.id);
    try {
      // Update application status
      await updateDoc(doc(db, 'coachApplications', app.id), {
        status: 'approved',
        reviewedAt: serverTimestamp(),
        reviewedBy: currentUser?.uid ?? '',
      });
      // Promote user role to coach
      await updateDoc(doc(db, 'users', app.userId), {
        role: 'coach',
      });
      setApplications(prev =>
        prev.map(a => a.id === app.id ? { ...a, status: 'approved' } : a)
      );
    } catch (err) {
      console.error('Error approving application:', err);
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (app: CoachApplication) => {
    setActionId(app.id);
    try {
      await updateDoc(doc(db, 'coachApplications', app.id), {
        status: 'rejected',
        reviewedAt: serverTimestamp(),
        reviewedBy: currentUser?.uid ?? '',
      });
      setApplications(prev =>
        prev.map(a => a.id === app.id ? { ...a, status: 'rejected' } : a)
      );
    } catch (err) {
      console.error('Error rejecting application:', err);
    } finally {
      setActionId(null);
    }
  };

  const filtered = applications.filter(a => filter === 'all' || a.status === filter);

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const statusConfig = {
    pending: { label: 'Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
    approved: { label: 'Approved', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    rejected: { label: 'Rejected', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <UserPlus className="w-6 h-6 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Coach Applications</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            {counts.pending} pending application{counts.pending !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(['pending', 'approved', 'rejected', 'all'] as FilterStatus[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
              filter === f
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-500'
            }`}
          >
            {f} <span className="ml-1 opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-slate-500 dark:text-zinc-400">Loading applications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-slate-400 dark:text-zinc-500" />
          </div>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">No {filter !== 'all' ? filter : ''} applications</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((app, index) => {
              const status = statusConfig[app.status];
              const StatusIcon = status.icon;
              const isExpanded = expandedId === app.id;
              const isActing = actionId === app.id;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden"
                >
                  {/* Row Summary */}
                  <div className="flex items-center gap-4 p-4">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                      {app.photoURL
                        ? <img src={app.photoURL} alt={app.displayName} className="w-full h-full object-cover" />
                        : app.displayName?.charAt(0).toUpperCase() || 'U'
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{app.displayName}</p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{app.email}</p>
                    </div>

                    {/* Status Badge */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.color} shrink-0`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>

                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : app.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors rounded-lg"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded details + actions */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-slate-100 dark:border-zinc-800 pt-4 space-y-4">
                          {/* Motivation */}
                          <div>
                            <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
                              Motivation
                            </p>
                            <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3">
                              {app.motivation || <span className="italic text-slate-400">No message provided.</span>}
                            </p>
                          </div>

                          {/* Timestamp */}
                          {app.createdAt && (
                            <p className="text-xs text-slate-400 dark:text-zinc-500">
                              Applied: {app.createdAt?.toDate?.()?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) ?? '—'}
                            </p>
                          )}

                          {/* Actions — only for pending */}
                          {app.status === 'pending' && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleApprove(app)}
                                disabled={isActing}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all disabled:opacity-50"
                              >
                                {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                Approve & Promote to Coach
                              </button>
                              <button
                                onClick={() => handleReject(app)}
                                disabled={isActing}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 font-bold text-sm transition-all disabled:opacity-50"
                              >
                                {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
