import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const Launch: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically navigate to onboarding after 3 seconds
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-[#d6ff3e] flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background radial gradient specifically for launch */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,255,62,0.15)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 1, 
          ease: "easeOut",
          type: "spring",
          stiffness: 100 
        }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Generated FitBody Logo */}
        <div className="w-48 h-48 mb-6 relative">
          <img 
            src="file:///C:/Users/Mejkerslab/.gemini/antigravity/brain/f05b05fc-4d14-4796-9f22-5bbd83dc36ed/launch_logo_fitbody_1773745923855.png" 
            alt="FitBody Logo"
            className="w-full h-full object-contain"
          />
        </div>
        
        <h1 className="text-5xl font-extrabold tracking-[0.2em] uppercase italic">
          FitBody
        </h1>
        <motion.div 
          initial={{ w: 0, opacity: 0 }}
          animate={{ w: '100%', opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="h-1 bg-[#d6ff3e] w-full mt-2 rounded-full"
        />
        
        <p className="mt-8 text-zinc-400 font-medium tracking-widest uppercase text-sm">
          Loading...
        </p>

        {/* Custom Loader matching UI kit vibe */}
        <div className="mt-12 w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.8, ease: "easeInOut" }}
            className="h-full bg-[#d6ff3e] rounded-full"
          />
        </div>

      </motion.div>
    </div>
  );
};

export default Launch;
