import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Info, Smartphone, Bell, LifeBuoy, ShieldCheck, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { LanguageToggle } from '../components/ui/LanguageToggle';

const Help: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();

  const helpTopics = [
    {
      icon: Smartphone,
      title: t('help.pwaTitle'),
      desc: t('help.pwaDesc')
    },
    {
      icon: Bell,
      title: t('help.notifyTitle'),
      desc: t('help.notifyDesc')
    },
    {
      icon: ShieldCheck,
      title: t('help.securityTitle'),
      desc: t('help.securityDesc')
    },
    {
      icon: FileText,
      title: t('help.docsTitle'),
      desc: t('help.docsDesc')
    },
    {
      icon: LifeBuoy,
      title: t('help.supportTitle'),
      desc: t('help.supportDesc')
    },
    {
      icon: Info,
      title: t('help.versionTitle'),
      desc: t('help.versionDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1c1c] text-zinc-900 dark:text-white font-sans flex flex-col p-6 transition-colors duration-300">
      <div className="flex items-center justify-between pt-8 mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-emerald-500 dark:text-[#d6ff3e] hover:bg-emerald-500/10 p-2 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-black text-[#afa3ff] tracking-tight">{t('help.title')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle className="h-9" />
          <ThemeToggle className="h-9 w-9" />
        </div>
      </div>

      <div className="space-y-6">
        {helpTopics.map((topic, i) => (
          <motion.div
            key={topic.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-sm dark:shadow-none"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-[#d6ff3e]/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/20 dark:border-[#d6ff3e]/20">
                <topic.icon className="text-emerald-500 dark:text-[#d6ff3e]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{topic.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{topic.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto pt-12 pb-8 text-center space-y-2">
        <div className="text-zinc-400 dark:text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          {t('help.designedFor')}
        </div>
        <div className="text-emerald-500 dark:text-[#d6ff3e] text-[9px] font-black uppercase tracking-[0.3em]">
          {t('help.author')}
        </div>
      </div>
    </div>
  );
};

export default Help;
