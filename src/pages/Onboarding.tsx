import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Onboarding: React.FC = () => {
  const { t } = useLanguage();
  const { userData, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const onboardingSteps = [
    {
      title: t('onboarding.step1Title'),
      subtitle: t('onboarding.step1Sub'),
      image: "/assets/onboarding-1.png"
    },
    {
      title: t('onboarding.step2Title'),
      subtitle: t('onboarding.step2Sub'),
      image: "/assets/onboarding-2.png"
    },
    {
      title: t('onboarding.step3Title'),
      subtitle: t('onboarding.step3Sub'),
      image: "/assets/onboarding-3.png"
    }
  ];

  React.useEffect(() => {
    if (!loading && userData) {
      if (userData.role === 'admin') navigate('/app/admin');
      else if (userData.role === 'coach') navigate('/app/coach');
      else navigate('/app/client');
    }
  }, [userData, loading, navigate]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Navigate to landing/login after onboarding
      navigate('/app');
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
          <div className="h-[60vh] w-full rounded-b-[3rem] bg-zinc-900 flex items-center justify-center p-8 relative overflow-hidden">
            <img 
              src={onboardingSteps[currentStep].image} 
              alt="Onboarding Illustration" 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            {/* Visual placeholder for the character illustrations in the UI Kit */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c]/20 to-transparent pointer-events-none" />
            <div className="w-64 h-64 bg-white/5 rounded-full blur-3xl absolute top-10" />
            
            {/* Action Text over Image (skip) */}
            <button 
              onClick={() => navigate('/login')}
              className="absolute top-12 right-8 text-white/70 font-bold tracking-wider hover:text-white transition-colors"
            >
              {t('onboarding.skip')}
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
