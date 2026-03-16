import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Activity, Brain, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export default function Landing() {
  const { signIn, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      if (userData.role === 'coach') {
        navigate('/coach');
      } else {
        navigate('/client');
      }
    }
  }, [userData, navigate]);

  const handleSignIn = async (role: 'client' | 'coach') => {
    try {
      await signIn(role);
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        console.error("Login failed", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-xl font-bold tracking-tight">Aura Fit</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => handleSignIn('client')} className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Prijava za klijente
            </button>
            <button
              onClick={() => handleSignIn('coach')}
              className="text-sm font-medium bg-white text-zinc-950 px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Portal za trenere
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-8 border border-indigo-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Faza 1: MVP Dostupan
          </div>
          
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Tvoj trening, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              tvoja aura,
            </span>{" "}
            <br />
            tvoj mentor.
          </h1>
          
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl leading-relaxed">
            Hibridna fitnes platforma koja spaja snagu veštačke inteligencije sa stručnošću pravih trenera. 
            Prati ishranu, beleži treninge i ostvari rezultate brže nego ikada.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => handleSignIn('client')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-500 text-white px-8 py-4 rounded-full font-medium hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Započni besplatno (Lite)
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleSignIn('coach')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 text-zinc-300 px-8 py-4 rounded-full font-medium hover:bg-zinc-800 transition-all border border-zinc-800 cursor-pointer"
            >
              Ja sam trener
            </button>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6">
              <Brain className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Analiza Ishrane</h3>
            <p className="text-zinc-400 leading-relaxed">
              Samo opiši šta si pojeo, a Aura Fit AI će automatski izračunati kalorije i makronutrijente.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Pametni Treninzi</h3>
            <p className="text-zinc-400 leading-relaxed">
              Prati svoj progres i "Progressive Overload". AI prepoznaje kada stagniraš i predlaže promene.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Coach Connect</h3>
            <p className="text-zinc-400 leading-relaxed">
              Poveži se sa pravim trenerom koji će pratiti tvoje rezultate i prilagođavati plan tvojim potrebama.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
