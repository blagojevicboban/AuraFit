import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowRight, Activity, Weight, Ruler, Target } from 'lucide-react';
import { Button } from '../components/ui/Button';

const ProfileSetup: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Form State
  const [gender, setGender] = useState<'Male' | 'Female' | null>(null);
  const [age, setAge] = useState<number>(25);
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [goal, setGoal] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('');

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      // Setup complete, navigate to login
      navigate('/login');
    }
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="flex flex-col h-full justify-center gap-8">
            <h2 className="text-4xl font-extrabold text-center mb-4">Tell Us About<br/>Yourself!</h2>
            <p className="text-center text-zinc-400 max-w-xs mx-auto mb-8">
              To give you a better experience we need to know your gender.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setGender('Male')}
                className={`w-full py-6 rounded-[2rem] text-xl font-bold transition-all ${gender === 'Male' ? 'bg-[#d6ff3e] text-[#1c1c1c] shadow-[0_0_20px_rgba(214,255,62,0.3)]' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
              >
                Male
              </button>
              <button 
                onClick={() => setGender('Female')}
                className={`w-full py-6 rounded-[2rem] text-xl font-bold transition-all ${gender === 'Female' ? 'bg-[#d6ff3e] text-[#1c1c1c] shadow-[0_0_20px_rgba(214,255,62,0.3)]' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
              >
                Female
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col h-full justify-center gap-8">
            <h2 className="text-4xl font-extrabold text-center mb-4">How Old Are You?</h2>
            <p className="text-center text-zinc-400 max-w-xs mx-auto mb-8">
              This helps us create your personalized plan.
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
            <h2 className="text-4xl font-extrabold text-center mb-4">What's Your Weight?</h2>
            <p className="text-center text-zinc-400 max-w-xs mx-auto mb-8">
              You can always change this later.
            </p>
            <div className="flex justify-center items-end gap-2 py-10">
              <div className="text-6xl font-black text-[#d6ff3e]">{weight}</div>
              <div className="text-xl font-bold text-zinc-500 pb-2">kg</div>
            </div>
            {/* Range slider or custom scroll picker could go here */}
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
            <h2 className="text-4xl font-extrabold text-center mb-4">What's Your Height?</h2>
            <p className="text-center text-zinc-400 max-w-xs mx-auto mb-8">
              This helps us calculate your BMI.
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
        const goals = ['Weight Loss', 'Muscle Gain', 'Shape Body', 'Others'];
        return (
          <div className="flex flex-col h-full justify-center gap-8">
            <h2 className="text-4xl font-extrabold text-center mb-4">What's Your Goal?</h2>
            <p className="text-center text-zinc-400 max-w-xs mx-auto mb-8">
              This helps us create your personalized plan.
            </p>
            <div className="flex flex-col gap-3">
              {goals.map((g) => (
                <button 
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`w-full py-5 rounded-[1.5rem] text-lg font-bold transition-all ${goal === g ? 'bg-[#d6ff3e] text-[#1c1c1c]' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        );
      case 6:
        const activities = ['Rookie', 'Beginner', 'Intermediate', 'Advance', 'True Beast'];
        return (
          <div className="flex flex-col h-full justify-center gap-8">
            <h2 className="text-4xl font-extrabold text-center mb-4">Physical Activity Level</h2>
            <p className="text-center text-zinc-400 max-w-xs mx-auto mb-8">
              Choose your regular activity level so we can provide the best plan.
            </p>
            <div className="flex flex-col gap-3">
              {activities.map((a) => (
                <button 
                  key={a}
                  onClick={() => setActivityLevel(a)}
                  className={`w-full py-5 rounded-[1.5rem] text-lg font-bold transition-all ${activityLevel === a ? 'bg-[#d6ff3e] text-[#1c1c1c]' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                >
                  {a}
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
        <h1 className="text-[#d6ff3e] text-2xl font-bold uppercase tracking-wider text-center">Step {step} of 6</h1>
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
            Back
          </Button>
        ) : <div />}
        
        <div className="flex gap-4 items-center">
          <button className="text-white/50 font-bold hover:text-white transition-colors">Skip</button>
          <Button 
            onClick={handleNext}
            className="rounded-full shadow-[0_0_20px_rgba(214,255,62,0.3)] gap-2"
          >
            Continue <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
