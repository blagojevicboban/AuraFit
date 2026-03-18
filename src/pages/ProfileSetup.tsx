import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowRight, Activity, Weight, Ruler, Target } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const ProfileSetup: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const { t } = useLanguage();

  // Form State
  const [gender, setGender] = useState<'Male' | 'Female' | null>(null);
  const [age, setAge] = useState<number>(25);
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [goal, setGoal] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Initialize data from userData if available
  useEffect(() => {
    if (userData) {
      if (userData.gender) setGender(userData.gender);
      if (userData.weight) setWeight(userData.weight);
      if (userData.height) setHeight(userData.height);
      
      // Calculate age from birthday if provided by Google
      // Note: birthday is usually in YYYY-MM-DD or MM/DD/YYYY format in Google profile
      const rawBirthday = (userData as any).birthday;
      if (rawBirthday) {
        try {
          const birthDate = new Date(rawBirthday);
          const today = new Date();
          let calculatedAge = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
          }
          if (calculatedAge > 10 && calculatedAge < 100) {
            setAge(calculatedAge);
          }
        } catch (e) {
          console.error("Error parsing birthday:", e);
        }
      } else if ((userData as any).age) {
        setAge((userData as any).age);
      }
    }
  }, [userData]);

  const handleNext = async () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      // Setup complete, save to Firestore
      if (!currentUser) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(userDocRef, {
          gender,
          age,
          weight,
          height,
          goal,
          activityLevel,
          setupCompleted: true
        }, { merge: true });
        
        navigate('/home');
      } catch (error) {
        console.error("Error saving profile:", error);
        alert("Failed to save profile. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="flex flex-col h-full justify-center gap-8">
            <h2 className="text-4xl font-extrabold text-center mb-4 whitespace-pre-line">{t('setup.title1')}</h2>
            <p className="text-center text-zinc-400 max-w-xs mx-auto mb-8">
              {t('setup.desc1')}
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setGender('Male')}
                className={`w-full py-6 rounded-[2rem] text-xl font-bold transition-all ${gender === 'Male' ? 'bg-[#d6ff3e] text-[#1c1c1c] shadow-[0_0_20px_rgba(214,255,62,0.3)]' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
              >
                {t('setup.male')}
              </button>
              <button 
                onClick={() => setGender('Female')}
                className={`w-full py-6 rounded-[2rem] text-xl font-bold transition-all ${gender === 'Female' ? 'bg-[#d6ff3e] text-[#1c1c1c] shadow-[0_0_20px_rgba(214,255,62,0.3)]' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
              >
                {t('setup.female')}
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col h-full justify-center gap-8">
            <h2 className="text-4xl font-extrabold text-center mb-4">{t('setup.title2')}</h2>
            <p className="text-center text-zinc-400 max-w-xs mx-auto mb-8">
              {t('setup.desc2')}
            </p>
            <div className="flex flex-col items-center justify-center gap-8 py-10">
              <div className="text-6xl font-black text-[#d6ff3e]">{age}</div>
              <input 
                type="range" 
                min="14" max="100" 
                value={age} 
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full accent-[#d6ff3e]"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col h-full justify-center gap-8">
            <h2 className="text-4xl font-extrabold text-center mb-4">{t('setup.title3')}</h2>
            <p className="text-center text-zinc-400 max-w-xs mx-auto mb-8">
              {t('setup.desc3')}
            </p>
            <div className="flex justify-center items-end gap-2 py-10">
              <div className="text-6xl font-black text-[#d6ff3e]">{weight}</div>
              <div className="text-xl font-bold text-zinc-500 pb-2">kg</div>
            </div>
            <input 
                type="range" 
                min="40" max="200" 
                value={weight} 
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="w-full accent-[#d6ff3e]"
              />
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col h-full justify-center gap-8">
            <h2 className="text-4xl font-extrabold text-center mb-4">{t('setup.title4')}</h2>
            <p className="text-center text-zinc-400 max-w-xs mx-auto mb-8">
              {t('setup.desc4')}
            </p>
            <div className="flex justify-center items-end gap-2 py-10">
              <div className="text-6xl font-black text-[#d6ff3e]">{height}</div>
              <div className="text-xl font-bold text-zinc-500 pb-2">cm</div>
            </div>
            <input 
                type="range" 
                min="120" max="250" 
                value={height} 
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full accent-[#d6ff3e]"
              />
          </div>
        );
      case 5:
        const goals = [
          { id: 'loss', label: t('setup.goal1') },
          { id: 'gain', label: t('setup.goal2') },
          { id: 'shape', label: t('setup.goal3') },
          { id: 'other', label: t('setup.goal4') }
        ];
        return (
          <div className="flex flex-col h-full justify-center gap-8">
            <h2 className="text-4xl font-extrabold text-center mb-4">{t('setup.title5')}</h2>
            <p className="text-center text-zinc-400 max-w-xs mx-auto mb-8">
              {t('setup.desc5')}
            </p>
            <div className="flex flex-col gap-3">
              {goals.map((g) => (
                <button 
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`w-full py-5 rounded-[1.5rem] text-lg font-bold transition-all ${goal === g.id ? 'bg-[#d6ff3e] text-[#1c1c1c]' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        );
      case 6:
        const activities = [
          { id: 'rookie', label: t('common.rookie') },
          { id: 'beginner', label: t('common.beginner') },
          { id: 'intermediate', label: t('common.intermediate') },
          { id: 'advance', label: t('common.advance') },
          { id: 'beast', label: t('common.beast') }
        ];
        return (
          <div className="flex flex-col h-full justify-center gap-8">
            <h2 className="text-4xl font-extrabold text-center mb-4">{t('setup.title6')}</h2>
            <p className="text-center text-zinc-400 max-w-xs mx-auto mb-8">
              {t('setup.desc6')}
            </p>
            <div className="flex flex-col gap-3">
              {activities.map((a) => (
                <button 
                  key={a.id}
                  onClick={() => setActivityLevel(a.id)}
                  className={`w-full py-5 rounded-[1.5rem] text-lg font-bold transition-all ${activityLevel === a.id ? 'bg-[#d6ff3e] text-[#1c1c1c]' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col font-sans px-6 py-12">
      {/* Progress Header */}
      <div className="flex flex-col gap-6 mb-8">
        <h1 className="text-[#d6ff3e] text-2xl font-bold uppercase tracking-wider text-center">
            {t('setup.stepTitle').replace('{{step}}', step.toString())}
        </h1>
        <div className="flex gap-2 w-full justify-center">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i <= step ? 'bg-[#d6ff3e] flex-grow shadow-[0_0_10px_rgba(214,255,62,0.5)]' : 'bg-zinc-800 w-8'}`}
            />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="pt-8 flex justify-between items-center gap-4">
        {step > 1 ? (
          <Button 
            variant="ghost" 
            onClick={() => setStep(step - 1)}
            className="text-zinc-400 hover:text-white"
          >
            {t('setup.back')}
          </Button>
        ) : <div />}
        
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => navigate('/home')}
            className="text-white/50 font-bold hover:text-white transition-colors"
          >
            {t('setup.skip')}
          </button>
          <Button 
            onClick={handleNext}
            isLoading={loading}
            className="rounded-full shadow-[0_0_20px_rgba(214,255,62,0.3)] gap-2"
          >
            {step === 6 ? t('setup.finish') : t('setup.continue')} <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
