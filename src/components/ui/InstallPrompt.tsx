import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smartphone, X, Download } from "lucide-react";
import { usePWA } from "../../contexts/PWAContext";
import { useLanguage } from "../../contexts/LanguageContext";

export function InstallPrompt() {
  const { isInstallable, installApp, showInstallPrompt, setShowInstallPrompt } = usePWA();
  const { t } = useLanguage();

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  const handleInstall = async () => {
    await installApp();
    handleDismiss();
  };

  return (
    <AnimatePresence>
      {isInstallable && showInstallPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-safe left-0 right-0 z-[100] p-4 flex justify-center"
        >
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                <Smartphone className="text-zinc-950 w-7 h-7" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                    {t('pwa.promptTitle')}
                  </h3>
                  <button 
                    onClick={handleDismiss}
                    className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                  {t('pwa.promptDesc')}
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleInstall}
                    className="flex-1 flex items-center justify-center gap-2 brand-gradient text-zinc-950 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                  >
                    <Download size={16} />
                    {t('pwa.installButton')}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-6 py-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-black text-xs uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                  >
                    {t('pwa.cancelButton')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
