import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

// Placeholder matching the aesthetic of Onboarding 2-A -> 2-D
const onboardingSteps = [
  {
    title: "Find the right\nworkout for what\nyou need",
    subtitle: "We have something suitable for everyone.",
    imageBg: "bg-zinc-800" // Placeholder for actual image
  },
  {
    title: "Make suitable\nworkouts and\ngreat results",
    subtitle: "Customized plans to help you reach your goals faster.",
    imageBg: "bg-zinc-700"
  },
  {
    title: "Let's do a\nworkout and live\nhealthy with us",
    subtitle: "Join our community and transform your lifestyle.",
    imageBg: "bg-zinc-600"
  }
];

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Navigate to Setup or Auth based on the flow
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col font-sans relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="flex-grow flex flex-col"
        >
          {/* Top Image Section - takes up ~60% of the screen */}
          <div className={`h-[60vh] w-full rounded-b-[3rem] ${onboardingSteps[currentStep].imageBg} flex items-center justify-center p-8 relative overflow-hidden`}>
            {/* Visual placeholder for the character illustrations in the UI Kit */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] to-transparent opacity-60 pointer-events-none" />
            <div className="w-64 h-64 bg-white/5 rounded-full blur-3xl absolute top-10" />
            
            {/* Action Text over Image (skip) */}
            <button 
              onClick={() => navigate('/login')}
              className="absolute top-12 right-8 text-white/70 font-bold tracking-wider hover:text-white transition-colors"
            >
              Skip
            </button>
          </div>

          {/* Bottom Content Section - takes up remaining space */}
          <div className="flex-grow px-8 pt-10 pb-12 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold leading-[1.1] whitespace-pre-line tracking-tight">
                {onboardingSteps[currentStep].title}
              </h2>
              {/* Added a subtitle to give extra context if needed, though the UI kit is clean */}
            </div>

            <div className="flex items-center justify-between mt-8">
              {/* Pagination Dots */}
              <div className="flex gap-2">
                {onboardingSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    animate={{ 
                      width: index === currentStep ? 32 : 8,
                      backgroundColor: index === currentStep ? '#d6ff3e' : '#4a4a4a'
                    }}
                    className="h-2 rounded-full transition-all duration-300"
                  />
                ))}
              </div>

              {/* Next Button */}
              <Button 
                onClick={handleNext}
                className="w-16 h-16 rounded-full p-0 flex items-center justify-center shadow-[0_0_20px_rgba(214,255,62,0.3)]"
              >
                <ChevronRight className="w-8 h-8 text-[#1c1c1c]" strokeWidth={3} />
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
