import { useLanguage } from "../../contexts/LanguageContext";
import { cn } from "../../lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div 
      className={cn(
        "flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-xl h-10",
        className
      )}
    >
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          "px-3 h-full rounded-lg text-xs font-black transition-all",
          language === 'en' 
            ? "bg-white dark:bg-zinc-800 text-emerald-500 shadow-sm" 
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('sr')}
        className={cn(
          "px-3 h-full rounded-lg text-xs font-black transition-all",
          language === 'sr' 
            ? "bg-white dark:bg-zinc-800 text-emerald-500 shadow-sm" 
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        )}
      >
        SR
      </button>
    </div>
  );
}
