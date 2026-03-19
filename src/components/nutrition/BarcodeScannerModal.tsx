import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, CheckCircle2, AlertCircle, Trophy, Barcode } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface NutritionData {
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

type ScanState = 'scanning' | 'loading' | 'result' | 'error' | 'manual';

const SCANNER_ID = 'barcode-scanner-div';

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [nutrition, setNutrition] = useState<NutritionData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [manualBarcode, setManualBarcode] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScannerStarted = useRef(false);

  const stopScanner = async () => {
    if (scannerRef.current && hasScannerStarted.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (_) {}
      hasScannerStarted.current = false;
    }
  };

  const lookupBarcode = async (barcode: string) => {
    await stopScanner();
    setScanState('loading');
    try {
      const res = await fetch(`/api/fatsecret/barcode?barcode=${encodeURIComponent(barcode)}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Not found');
      }
      const data = await res.json();

      // Parse FatSecret food.get.v3 response
      const food = data?.food;
      if (!food) throw new Error('Food not found');

      const servings = food.servings?.serving;
      const serving = Array.isArray(servings) ? servings[0] : servings;

      const result: NutritionData = {
        mealName: food.food_name,
        calories: parseFloat(serving?.calories ?? '0'),
        protein: parseFloat(serving?.protein ?? '0'),
        carbs: parseFloat(serving?.carbohydrate ?? '0'),
        fat: parseFloat(serving?.fat ?? '0'),
        servingSize: serving?.serving_description ?? '1 serving',
      };
      setNutrition(result);
      setScanState('result');
    } catch (err: any) {
      setErrorMsg(err.message || 'Product not found. Try a different barcode.');
      setScanState('error');
    }
  };

  const startScanner = () => {
    if (!document.getElementById(SCANNER_ID)) return;
    if (hasScannerStarted.current) return;

    const scanner = new Html5Qrcode(SCANNER_ID);
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 260, height: 120 },
        aspectRatio: 1.5,
      },
      (decodedText) => {
        if (hasScannerStarted.current) {
          hasScannerStarted.current = false; // prevent double scan
          lookupBarcode(decodedText);
        }
      },
      () => {} // silent ongoing errors
    ).then(() => {
      hasScannerStarted.current = true;
    }).catch((err) => {
      setErrorMsg('Camera access denied. Please allow camera permission or enter barcode manually.');
      setScanState('error');
    });
  };

  // Reset ALL state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }
    setScanState('scanning');
    setNutrition(null);
    setErrorMsg('');
    setSaveError('');
    setManualBarcode('');

    // slight delay to allow DOM to mount the scanner div
    const t = setTimeout(() => startScanner(), 300);
    return () => clearTimeout(t);
  }, [isOpen]);

  const handleReset = () => {
    setNutrition(null);
    setErrorMsg('');
    setManualBarcode('');
    setScanState('scanning');
    setTimeout(() => startScanner(), 300);
  };

  const handleSave = async () => {
    if (!nutrition || !currentUser) return;
    setIsSaving(true);
    setSaveError('');
    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'meals'), {
        mealName: nutrition.mealName,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        description: `${nutrition.mealName} (${nutrition.servingSize})`,
        source: 'barcode',
        timestamp: serverTimestamp(),
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setSaveError('Failed to save. Check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim().length > 5) {
      lookupBarcode(manualBarcode.trim());
    }
  };

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-white/5 flex items-center justify-between">
              {/* Hide html5-qrcode's own UI controls */}
              <style>{`
                #${SCANNER_ID} > img { display: none !important; }
                #${SCANNER_ID} select { display: none !important; }
                #${SCANNER_ID} button { display: none !important; }
                #${SCANNER_ID} span { display: none !important; }
              `}</style>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d6ff3e]/10 border border-[#d6ff3e]/20 flex items-center justify-center">
                  <Barcode size={20} className="text-[#d6ff3e]" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white leading-tight">{t('nutrition.barcode.title')}</h2>
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">Powered by FatSecret</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">

                {/* ── Scanning State ── */}
                {scanState === 'scanning' && (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <p className="text-zinc-400 text-sm text-center">
                      {t('nutrition.barcode.scanning')}
                    </p>

                    {/* Scanner viewport */}
                    <div className="relative overflow-hidden rounded-3xl bg-black border border-white/10">
                      <div id={SCANNER_ID} className="w-full" style={{ minHeight: 220 }} />
                      {/* Targeting reticle overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-24 border-2 border-[#d6ff3e] rounded-xl relative">
                          <div className="absolute -top-px -left-px w-5 h-5 border-t-4 border-l-4 border-[#d6ff3e] rounded-tl-lg" />
                          <div className="absolute -top-px -right-px w-5 h-5 border-t-4 border-r-4 border-[#d6ff3e] rounded-tr-lg" />
                          <div className="absolute -bottom-px -left-px w-5 h-5 border-b-4 border-l-4 border-[#d6ff3e] rounded-bl-lg" />
                          <div className="absolute -bottom-px -right-px w-5 h-5 border-b-4 border-r-4 border-[#d6ff3e] rounded-br-lg" />
                          {/* Scan line animation */}
                          <motion.div
                            className="absolute left-0 right-0 h-0.5 bg-[#d6ff3e]/70 shadow-[0_0_8px_#d6ff3e]"
                            animate={{ top: ['10%', '90%', '10%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Manual entry fallback */}
                    <div className="text-center">
                      <button
                        onClick={() => { stopScanner(); setScanState('manual'); }}
                        className="text-xs text-[#afa3ff] font-semibold hover:text-[#d6ff3e] transition-colors underline"
                      >
                        {t('nutrition.barcode.manualLink')}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Manual Entry State ── */}
                {scanState === 'manual' && (
                  <motion.div
                    key="manual"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className="w-16 h-16 rounded-3xl bg-[#d6ff3e]/10 border border-[#d6ff3e]/20 flex items-center justify-center">
                        <Barcode size={32} className="text-[#d6ff3e]" />
                      </div>
                      <p className="text-zinc-400 text-sm text-center">
                        {t('nutrition.barcode.manualTitle')}
                      </p>
                    </div>
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                      <input
                        type="number"
                        value={manualBarcode}
                        onChange={e => setManualBarcode(e.target.value)}
                        placeholder={t('nutrition.barcode.manualPlaceholder')}
                        className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-5 py-4 text-white text-lg font-mono focus:outline-none focus:border-[#d6ff3e]/50 focus:ring-1 focus:ring-[#d6ff3e]/30 transition-all placeholder:text-zinc-600 text-center tracking-widest"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={manualBarcode.trim().length < 6}
                        className="w-full py-4 bg-[#d6ff3e] text-[#1c1c1c] font-black rounded-2xl uppercase tracking-widest text-sm disabled:opacity-40 transition-all hover:bg-[#e4ff6a]"
                      >
                        {t('nutrition.barcode.search')}
                      </button>
                    </form>
                    <button
                      onClick={handleReset}
                      className="w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {t('nutrition.barcode.backToCamera')}
                    </button>
                  </motion.div>
                )}

                {/* ── Loading State ── */}
                {scanState === 'loading' && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 gap-5"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-[#d6ff3e]/20 border-t-[#d6ff3e] animate-spin" />
                      <Barcode size={28} className="text-[#d6ff3e] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-black text-lg">{t('nutrition.barcode.lookingUp')}</p>
                      <p className="text-zinc-500 text-sm">Searching FatSecret database</p>
                    </div>
                  </motion.div>
                )}

                {/* ── Result State ── */}
                {scanState === 'result' && nutrition && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    {/* Success badge */}
                    <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3">
                      <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                      <p className="text-emerald-300 text-sm font-semibold">{t('nutrition.barcode.found')}</p>
                    </div>

                    {/* Nutrition card */}
                    <div className="bg-zinc-800/60 border border-white/5 rounded-3xl p-5 space-y-4">
                      <div className="text-center space-y-1">
                        <p className="text-[#d6ff3e] font-black text-lg leading-tight">{nutrition.mealName}</p>
                        <p className="text-zinc-500 text-xs">per {nutrition.servingSize}</p>
                      </div>

                      <div className="text-center py-3 border-y border-white/5">
                        <p className="text-5xl font-black text-white">{nutrition.calories}</p>
                        <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">kcal</p>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Protein', value: nutrition.protein, unit: 'g', color: 'text-[#afa3ff]' },
                          { label: 'Carbs', value: nutrition.carbs, unit: 'g', color: 'text-[#d6ff3e]' },
                          { label: 'Fat', value: nutrition.fat, unit: 'g', color: 'text-orange-400' },
                        ].map(m => (
                          <div key={m.label} className="text-center bg-zinc-900/60 rounded-2xl py-3">
                            <p className={`text-xl font-black ${m.color}`}>{m.value}{m.unit}</p>
                            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-0.5">{m.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {saveError && (
                      <p className="text-rose-400 text-sm text-center font-semibold mb-2">{saveError}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleReset}
                        className="py-3.5 rounded-2xl bg-zinc-800 text-zinc-300 font-bold text-sm border border-white/5 hover:bg-zinc-700 transition-colors"
                      >
                        {t('nutrition.barcode.scanAgain')}
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="py-3.5 rounded-2xl bg-[#d6ff3e] text-[#1c1c1c] font-black text-sm flex items-center justify-center gap-2 hover:bg-[#e4ff6a] transition-colors disabled:opacity-60"
                      >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Trophy size={16} />}
                        {t('nutrition.logMeal')}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Error State ── */}
                {scanState === 'error' && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div className="flex flex-col items-center gap-4 py-6 text-center">
                      <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                        <AlertCircle size={36} className="text-rose-400" />
                      </div>
                      <div>
                        <p className="text-white font-black text-lg mb-2">{t('nutrition.barcode.notFound')}</p>
                        <p className="text-zinc-400 text-sm leading-relaxed">{errorMsg}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleReset}
                        className="py-3.5 rounded-2xl bg-zinc-800 text-zinc-300 font-bold text-sm border border-white/5 hover:bg-zinc-700 transition-colors"
                      >
                        {t('nutrition.barcode.tryAgain')}
                      </button>
                      <button
                        onClick={() => { stopScanner(); setScanState('manual'); }}
                        className="py-3.5 rounded-2xl bg-[#afa3ff]/10 border border-[#afa3ff]/20 text-[#afa3ff] font-bold text-sm hover:bg-[#afa3ff]/20 transition-colors"
                      >
                        {t('nutrition.barcode.enterManually')}
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
