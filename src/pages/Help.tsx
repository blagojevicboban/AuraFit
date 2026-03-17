import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Info, HelpCircle, Smartphone, Bell, LifeBuoy } from 'lucide-react';

const Help: React.FC = () => {
  const navigate = useNavigate();

  const helpTopics = [
    {
      icon: Smartphone,
      title: 'PWA Installation',
      desc: 'To install AuraFit on your phone, open it in Chrome (Android) or Safari (iOS) and select "Add to Home Screen".'
    },
    {
      icon: Bell,
      title: 'Push Notifications',
      desc: 'Enable notifications in the Home Dashboard prompt to stay updated on your workout goals.'
    },
    {
      icon: LifeBuoy,
      title: 'Support',
      desc: 'If you encounter any issues, please contact our support team at support@aurafit.com.'
    },
    {
      icon: Info,
      title: 'App Version',
      desc: 'AuraFit v1.2.0 - Premium Edition'
    }
  ];

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col p-6">
      <div className="flex items-center gap-4 pt-8 mb-12">
        <button 
          onClick={() => navigate(-1)}
          className="text-[#d6ff3e] hover:bg-white/10 p-2 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-black text-[#afa3ff] tracking-tight">Help & Support</h1>
      </div>

      <div className="space-y-6">
        {helpTopics.map((topic, i) => (
          <motion.div
            key={topic.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-800/50 border border-white/5 rounded-3xl p-6 backdrop-blur-md"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#d6ff3e]/10 flex items-center justify-center flex-shrink-0">
                <topic.icon className="text-[#d6ff3e]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{topic.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{topic.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto pt-12 pb-8 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
        Designed for Excellence
      </div>
    </div>
  );
};

export default Help;
