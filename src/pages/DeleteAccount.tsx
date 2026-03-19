import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Trash2, AlertTriangle, Loader2, ShieldAlert, Eye, EyeOff,
} from 'lucide-react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  reauthenticateWithPopup,
  deleteUser,
} from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

type Step = 'confirm' | 'reauth' | 'deleting';

const DeleteAccount: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();

  const [step, setStep] = useState<Step>('confirm');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isGoogleUser = currentUser?.providerData?.some(
    (p) => p.providerId === GoogleAuthProvider.PROVIDER_ID
  );

  const handleProceed = () => {
    setStep('reauth');
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setStep('deleting');

    try {
      // Step 1 – Re-authenticate
      if (isGoogleUser) {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(currentUser!, provider);
      } else {
        const credential = EmailAuthProvider.credential(
          currentUser?.email ?? '',
          password
        );
        await reauthenticateWithCredential(currentUser!, credential);
      }

      // Step 2 – Delete Firestore user document
      if (currentUser?.uid) {
        try {
          await deleteDoc(doc(db, 'users', currentUser.uid));
        } catch (err) {
          console.warn('Could not delete Firestore doc:', err);
        }
      }

      // Step 3 – Delete Firebase Auth account
      await deleteUser(currentUser!);

      // Step 4 – Sign out & navigate
      await signOut();
      navigate('/');
    } catch (err: any) {
      setStep('reauth');
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Pogrešna lozinka. Pokušajte ponovo.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Previše pokušaja. Sačekajte i pokušajte ponovo.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Google potvrda je otkazana.');
      } else {
        setError('Greška pri brisanju naloga. Pokušajte ponovo.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-10">

      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-8 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-[#d6ff3e] hover:text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-extrabold text-rose-400">Delete Account</h1>
      </div>

      {/* ── Deleting Spinner ── */}
      {step === 'deleting' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6 px-6"
        >
          <div className="w-24 h-24 rounded-full border-4 border-rose-500/30 border-t-rose-500 animate-spin" />
          <p className="text-zinc-300 text-lg font-bold">Brišemo tvoj nalog...</p>
          <p className="text-zinc-500 text-sm text-center">Ovo može potrajati nekoliko sekundi.</p>
        </motion.div>
      )}

      {/* ── Confirm Step ── */}
      {step === 'confirm' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 px-6"
        >
          {/* Warning Icon */}
          <div className="w-24 h-24 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-lg shadow-rose-900/20">
            <ShieldAlert size={44} className="text-rose-400" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white">Jesi li siguran?</h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Brisanjem naloga trajno ćeš izgubiti sve podatke, progres, treninge i podešavanja. Ova akcija se <span className="text-rose-400 font-bold">ne može poništiti</span>.
            </p>
          </div>

          {/* What gets deleted */}
          <div className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-3xl p-5 space-y-3">
            <p className="text-xs font-black text-rose-400 uppercase tracking-widest">Šta se briše:</p>
            {[
              'Profil i lični podaci',
              'Svi treninzi i rutine',
              'Plan ishrane i obroci',
              'Progres i statistike',
              'Postavke i prilagođavanja',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500/70 shrink-0" />
                <p className="text-zinc-300 text-sm">{item}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="w-full space-y-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleProceed}
              className="w-full bg-rose-500 text-white font-black text-base uppercase tracking-widest rounded-2xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 hover:bg-rose-600 transition-all"
            >
              <Trash2 size={18} />
              Da, obriši nalog
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(-1)}
              className="w-full bg-zinc-800 text-zinc-300 font-bold text-base rounded-2xl py-4 hover:bg-zinc-700 transition-all"
            >
              Odustani
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ── Re-Auth Step ── */}
      {step === 'reauth' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 px-6"
        >
          {/* Warning Banner */}
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-5 flex gap-3">
            <AlertTriangle size={22} className="text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-rose-400 font-bold text-sm mb-1">Finalna potvrda</p>
              <p className="text-zinc-400 text-sm">
                {isGoogleUser
                  ? 'Potvrdi tvoj identitet putem Google-a da nastavimo s brisanjem.'
                  : 'Unesite vašu lozinku kako bismo potvrdili vaš identitet.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleDelete} className="flex flex-col gap-5">
            {!isGoogleUser && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Vaša lozinka
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Unesite vašu lozinku"
                    autoComplete="current-password"
                    required
                    className="w-full bg-zinc-800/60 border border-zinc-700 rounded-2xl px-4 py-3.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl px-4 py-3"
                >
                  <ShieldAlert size={18} className="text-rose-400 shrink-0" />
                  <p className="text-rose-400 text-sm font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-rose-500 text-white font-black text-base uppercase tracking-widest rounded-2xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 hover:bg-rose-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Trash2 size={18} />
                  {isGoogleUser ? 'Potvrdi putem Google-a i obriši' : 'Potvrdi i obriši nalog'}
                </>
              )}
            </motion.button>

            <button
              type="button"
              onClick={() => { setStep('confirm'); setError(''); }}
              className="text-sm text-zinc-500 hover:text-white text-center transition-colors"
            >
              ← Vrati se
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default DeleteAccount;
