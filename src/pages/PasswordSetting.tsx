import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Key, Eye, EyeOff, Check, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  GoogleAuthProvider,
  reauthenticateWithPopup,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

const PasswordSetting: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Detect if user signed in via Google (no password)
  const isGoogleUser = currentUser?.providerData?.some(
    (p) => p.providerId === GoogleAuthProvider.PROVIDER_ID
  );

  const passwordStrength = (pw: string): { score: number; label: string; color: string } => {
    if (!pw) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const levels = [
      { score: 1, label: 'Slaba', color: 'bg-rose-500' },
      { score: 2, label: 'Osrednja', color: 'bg-amber-400' },
      { score: 3, label: 'Dobra', color: 'bg-emerald-400' },
      { score: 4, label: 'Odlična', color: 'bg-emerald-500' },
    ];
    return levels[score - 1] ?? { score: 0, label: '', color: '' };
  };

  const strength = passwordStrength(newPassword);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Nove lozinke se ne podudaraju.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Nova lozinka mora imati najmanje 6 karaktera.');
      return;
    }

    setLoading(true);
    try {
      if (isGoogleUser) {
        // Re-authenticate via Google popup
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(currentUser!, provider);
      } else {
        const credential = EmailAuthProvider.credential(
          currentUser?.email ?? '',
          currentPassword
        );
        await reauthenticateWithCredential(currentUser!, credential);
      }

      await updatePassword(currentUser!, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Trenutna lozinka je pogrešna.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Previše pokušaja. Pokušajte ponovo kasnije.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Google potvrda je otkazana.');
      } else {
        setError('Greška pri promjeni lozinke. Pokušajte ponovo.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-10">

      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-8 flex items-center gap-4 relative">
        <button
          onClick={() => navigate(-1)}
          className="text-[#d6ff3e] hover:text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-extrabold text-[#afa3ff]">Password Setting</h1>
      </div>

      {/* ── Icon Banner ── */}
      <div className="flex flex-col items-center pb-8 px-6">
        <div className="w-20 h-20 rounded-3xl bg-[#afa3ff]/10 border border-[#afa3ff]/20 flex items-center justify-center mb-4 shadow-lg shadow-[#afa3ff]/10">
          <Key size={36} className="text-[#afa3ff]" />
        </div>
        <p className="text-zinc-400 text-sm text-center max-w-xs leading-relaxed">
          {isGoogleUser
            ? 'Tvoj nalog koristi Google prijavu. Potvrdi identitet putem Google-a da postaviš lozinku.'
            : 'Unesite trenutnu lozinku i odaberite novu sigurnu lozinku.'}
        </p>
      </div>

      {/* ── Success State ── */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mx-6 mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 flex flex-col items-center gap-3 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <ShieldCheck size={28} className="text-emerald-400" />
            </div>
            <p className="text-emerald-400 font-bold text-lg">Lozinka uspješno promijenjena!</p>
            <p className="text-zinc-400 text-sm">Tvoja nova lozinka je aktivna.</p>
            <button
              onClick={() => { setSuccess(false); }}
              className="mt-2 text-xs text-zinc-500 hover:text-white underline transition-colors"
            >
              Zatvori
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Form ── */}
      <form onSubmit={handleChangePassword} className="flex flex-col gap-5 px-6">

        {/* Current Password (only for email users) */}
        {!isGoogleUser && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Trenutna lozinka
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Unesite trenutnu lozinku"
                autoComplete="current-password"
                required={!isGoogleUser}
                className="w-full bg-zinc-800/60 border border-zinc-700 rounded-2xl px-4 py-3.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#afa3ff] focus:ring-1 focus:ring-[#afa3ff]/50 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}

        {/* New Password */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Nova lozinka
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimalno 6 karaktera"
              autoComplete="new-password"
              required
              className="w-full bg-zinc-800/60 border border-zinc-700 rounded-2xl px-4 py-3.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#afa3ff] focus:ring-1 focus:ring-[#afa3ff]/50 transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Strength Meter */}
          {newPassword.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((lvl) => (
                  <div
                    key={lvl}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      lvl <= strength.score ? strength.color : 'bg-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-zinc-400">
                Jačina lozinke: <span className="font-bold text-white">{strength.label}</span>
              </p>
            </motion.div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Potvrdi novu lozinku
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ponovite novu lozinku"
              autoComplete="new-password"
              required
              className={`w-full bg-zinc-800/60 border rounded-2xl px-4 py-3.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 transition-all pr-12 ${
                confirmPassword && confirmPassword !== newPassword
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30'
                  : confirmPassword && confirmPassword === newPassword
                  ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/30'
                  : 'border-zinc-700 focus:border-[#afa3ff] focus:ring-[#afa3ff]/50'
              }`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {confirmPassword && confirmPassword === newPassword && (
                <Check size={16} className="text-emerald-400" />
              )}
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl px-4 py-3"
            >
              <AlertCircle size={18} className="text-rose-400 shrink-0" />
              <p className="text-rose-400 text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-[#d6ff3e] text-[#1c1c1c] font-black text-base uppercase tracking-widest rounded-2xl py-4 mt-2 flex items-center justify-center gap-2 shadow-lg shadow-[#d6ff3e]/20 hover:bg-[#e4ff6a] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <Key size={18} />
              {isGoogleUser ? 'Potvrdi i postavi lozinku' : 'Promijeni lozinku'}
            </>
          )}
        </motion.button>
      </form>

      {/* Password Tips */}
      <div className="mx-6 mt-8 bg-zinc-800/40 border border-zinc-700/50 rounded-3xl p-5 space-y-2">
        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-3">Savjeti za sigurnu lozinku</p>
        {[
          'Najmanje 8 karaktera',
          'Kombinacija velikih i malih slova',
          'Barem jedan broj',
          'Specijalni karakter (!@#$...)',
        ].map((tip) => (
          <div key={tip} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#afa3ff]" />
            <p className="text-zinc-400 text-sm">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordSetting;
