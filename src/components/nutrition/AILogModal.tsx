import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Loader2, Apple, Flame, Trophy, Info, Camera, Image as ImageIcon, Trash2, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { askAuraFitAI } from '../../lib/gemini';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface AILogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface NutritionResult {
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  advice: string;
}

export const AILogModal: React.FC<AILogModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const recognitionRef = React.useRef<any>(null);
  const [description, setDescription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(t('nutrition.tooLarge'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleListen = async () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(language === 'sr' ? 'Vaš pretraživač ne podržava diktiranje.' : 'Your browser does not support dictation.');
      return;
    }

    // Explicit check for microphone permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // If we get here, microphone is accessible. We can stop it immediately after check.
      stream.getTracks().forEach(track => track.stop());
    } catch (err: any) {
      console.error('Microphone access denied', err);
      setError(language === 'sr' ? 'Pristup mikrofonu je odbijen ili mikrofon nije povezan.' : 'Microphone access denied or not connected.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = language === 'sr' ? 'sr-RS' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        recognitionRef.current = null;
        if (event.error === 'not-allowed') {
          setError(language === 'sr' ? 'Dozvola za mikrofon nije data.' : 'Microphone permission not granted.');
        } else if (event.error !== 'aborted') {
          setError(language === 'sr' ? 'Greška pri prepoznavanju glasa.' : 'Voice recognition error.');
        }
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription(prev => (prev.trim() ? `${prev.trim()} ${transcript}` : transcript));
      };

      try {
        recognition.start();
      } catch (err) {
        console.error('Speech recognition start failed', err);
        setIsListening(false);
        recognitionRef.current = null;
      }
    }
  };

  const handleAIDetection = async () => {
    if (!description.trim() && !image) return;
    
    setIsParsing(true);
    setError(null);
    try {
      const prompt = `Analiziraj ovaj obrok${description ? `: "${description}"` : ' na slici'}. Vrati JSON sa sledećim poljima: mealName (naslov obroka), calories (broj), protein (broj u gramima), carbs (broj u gramima), fat (broj u gramima), advice (kratak savet od 10 reči). Vrati SAMO čist JSON.`;
      
      const responseText = await askAuraFitAI(prompt, false, true, image || undefined);
      const parsed = JSON.parse(responseText || '{}');
      
      if (parsed.calories) {
        setResult(parsed as NutritionResult);
      } else {
        throw new Error('Detection failed');
      }
    } catch (err) {
      console.error(err);
      setError(language === 'sr' ? 'Greška pri analizi. Proveri unos ili internet vezu.' : 'Analysis error. Check input or connection.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSave = async () => {
    if (!result || !currentUser) return;

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'meals'), {
        ...result,
        description,
        timestamp: serverTimestamp()
      });
      onSuccess();
      onClose();
      // Reset state
      setDescription('');
      setImage(null);
      setResult(null);
    } catch (err) {
      console.error(err);
      setError(language === 'sr' ? 'Greška pri čuvanju obroka.' : 'Error saving meal.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d6ff3e] flex items-center justify-center">
                  <Sparkles size={20} className="text-[#1c1c1c]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white leading-tight">{t('nutrition.logTitle')}</h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Powered by Gemini</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {!result ? (
                <div className="space-y-4">
                  <label className="text-zinc-400 text-xs font-bold uppercase tracking-widest ml-1">{t('nutrition.whatDidYouEat')}</label>
                  
                  {/* Image Picker */}
                  {!image ? (
                    <div className="flex gap-4">
                      <label className="flex-1 h-32 bg-zinc-800/50 border border-white/10 border-dashed rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-white group">
                        <Camera size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t('nutrition.takePhoto')}</span>
                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
                      </label>
                      <label className="flex-1 h-32 bg-zinc-800/50 border border-white/10 border-dashed rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-white group">
                        <ImageIcon size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t('nutrition.chooseImage')}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    </div>
                  ) : (
                    <div className="relative h-48 rounded-3xl overflow-hidden border border-white/10 bg-zinc-800">
                      <img src={image} alt="Meal preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setImage(null)}
                        className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}

                  <div className="relative">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={language === 'sr' ? "Npr: Tri kuvana jaja, šolja jogurta..." : "e.g. Three boiled eggs, a cup of yogurt..."}
                      className="w-full h-32 bg-zinc-800/50 border border-white/10 rounded-3xl p-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#afa3ff]/50 transition-all resize-none text-lg"
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={toggleListen}
                        className={`p-2.5 rounded-2xl transition-all ${
                          isListening 
                            ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30' 
                            : 'bg-zinc-800 text-zinc-400 hover:text-[#afa3ff] hover:bg-zinc-700'
                        }`}
                        title={isListening ? "Stop listening" : "Start dictation"}
                      >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                      </button>
                      <div className="text-zinc-600">
                        <Apple size={20} />
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <p className="text-rose-500 text-sm font-bold flex items-center gap-2 px-2 animate-pulse">
                      <Info size={16} /> {error}
                    </p>
                  )}

                  <Button
                    fullWidth
                    size="xl"
                    onClick={handleAIDetection}
                    disabled={isParsing || (!description.trim() && !image)}
                    className="bg-[#afa3ff] text-white rounded-2xl hover:bg-[#9d8fff] shadow-xl"
                  >
                    {isParsing ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      <Sparkles className="mr-2" size={20} />
                    )}
                    {t('nutrition.analyze')}
                  </Button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Results Display */}
                  <div className="bg-[#afa3ff]/10 border border-[#afa3ff]/20 rounded-3xl p-6 text-center">
                    <p className="text-[#afa3ff] text-sm font-black uppercase tracking-widest mb-1">{result.mealName}</p>
                    <div className="text-5xl font-black text-[#d6ff3e] mb-2">{result.calories} <span className="text-sm opacity-60">kcal</span></div>
                    <div className="flex justify-around mt-6 pb-4 border-b border-white/5">
                      <div className="text-center">
                        <div className="text-lg font-black text-white">{result.protein}g</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold">{t('nutrition.protein')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-white">{result.carbs}g</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold">{t('nutrition.carbs')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-white">{result.fat}g</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold">{t('nutrition.fat')}</div>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-xs font-medium italic mt-4 px-4 leading-relaxed">
                      "{result.advice}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      fullWidth
                      variant="outline"
                      onClick={() => setResult(null)}
                      disabled={isSaving}
                      className="border-zinc-700 text-zinc-400 rounded-2xl"
                    >
                      {t('nutrition.cancel')}
                    </Button>
                    <Button
                      fullWidth
                      onClick={handleSave}
                      isLoading={isSaving}
                      className="bg-[#d6ff3e] text-[#1c1c1c] rounded-2xl font-black shadow-xl"
                    >
                      <Trophy className="mr-2" size={18} />
                      {t('nutrition.logMeal')}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
