import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
        "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5",
        "hover:scale-105 active:scale-95 group overflow-hidden",
        className
      )}
      title={theme === 'light' ? 'Prebaci na tamnu temu' : 'Prebaci na svetlu temu'}
    >
      <motion.div
        initial={false}
        animate={{
          y: theme === 'light' ? 0 : 40,
          opacity: theme === 'light' ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute"
      >
        <Sun className="w-5 h-5 text-amber-500" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          y: theme === 'dark' ? 0 : -40,
          opacity: theme === 'dark' ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute"
      >
        <Moon className="w-5 h-5 text-indigo-400" />
      </motion.div>
      
      {/* Decorative pulse effect on toggle */}
      <span className="absolute inset-0 rounded-xl bg-emerald-500/0 group-active:bg-emerald-500/10 transition-colors" />
    </button>
  );
}
