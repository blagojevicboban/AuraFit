import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Chrome, Facebook, Fingerprint } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

import { useAuth } from '../contexts/AuthContext';

import GoogleAccountCard from '../components/auth/GoogleAccountCard';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [lastUser, setLastUser] = React.useState<any>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('aura_last_google_user');
    if (saved) {
      try {
        setLastUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse last user", e);
      }
    }
  }, []);

  const handleGoogleLogin = async (forceSelect = false) => {
    try {
      const { isNewUser } = await signIn('client', forceSelect);
      if (isNewUser) {
        navigate('/setup');
      } else {
        navigate('/home');
      }
    } catch (err: any) {
      if (err?.code === 'auth/unauthorized-domain') {
        alert('Ovaj domen nije autorizovan u Firebase Console. Molimo dodajte "aurafit-b1ug.onrender.com" u Authorized Domains.');
      } else if (err?.code !== 'auth/popup-closed-by-user') {
        alert('Google Log In failed. Please try again.');
      }
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#1c1c1c] text-zinc-900 dark:text-white flex flex-col font-sans transition-colors duration-300">
      {/* Top Header Section */}
      <div className="px-6 pt-12 pb-8 flex flex-col items-center relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-6 top-13 text-emerald-500 dark:text-[#d6ff3e]"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-emerald-500 dark:text-[#d6ff3e] text-2xl font-bold uppercase tracking-wider mb-12">Log In</h1>
        
        <div className="text-center max-w-xs">
          <h2 className="text-4xl font-extrabold mb-4 text-zinc-900 dark:text-white">Welcome</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Your fitness journey starts here. Sign in to access your personalized workout and nutrition plans.
          </p>
        </div>
      </div>

      {/* Inputs Section (Purple Card) */}
      <div className="bg-[#afa3ff] px-8 py-10 flex flex-col gap-6 rounded-[2.5rem] mx-6 shadow-xl relative z-10 transition-all">
        <Input 
          label="Username or email"
          labelClassName="text-[#1c1c1c]/70 font-bold"
          type="text" 
          placeholder="example@example.com"
          className="bg-white/30 border-white/40 text-[#1c1c1c] placeholder:text-[#1c1c1c]/40 font-medium"
        />

        <div className="space-y-2">
          <Input 
            label="Password"
            labelClassName="text-[#1c1c1c]/70 font-bold"
            type="password" 
            placeholder="**************"
            className="bg-white/30 border-white/40 text-[#1c1c1c] placeholder:text-[#1c1c1c]/40 font-medium"
          />
          <div className="text-right mt-2">
            <Link to="/forgot-password" size="sm" className="text-[#1c1c1c] font-black text-xs uppercase tracking-tighter hover:underline">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-8 pt-12 pb-10 flex flex-col items-center gap-8 bg-zinc-50 dark:bg-[#1c1c1c] flex-grow transition-colors">
        <Button size="xl" fullWidth className="max-w-xs shadow-lg rounded-2xl">
          Log In
        </Button>

        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          {lastUser ? (
            <GoogleAccountCard 
              user={lastUser} 
              onContinue={() => handleGoogleLogin(false)}
              onSwitch={() => handleGoogleLogin(true)}
            />
          ) : (
            <>
              <div className="flex items-center gap-4 w-full">
                <div className="h-[1px] bg-zinc-200 dark:bg-zinc-800 flex-grow" />
                <span className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest px-2">or log in with</span>
                <div className="h-[1px] bg-zinc-200 dark:bg-zinc-800 flex-grow" />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleGoogleLogin(false)}
                  className="bg-white p-3 rounded-full text-[#1c1c1c] hover:bg-zinc-100 transition-colors shadow-md border border-zinc-100"
                >
                  <Chrome size={28} />
                </button>
                <button 
                  onClick={() => alert('Facebook Log In is coming soon!')}
                  className="bg-white p-3 rounded-full text-[#1c1c1c] hover:bg-zinc-100 transition-colors shadow-md border border-zinc-100"
                >
                  <Facebook size={28} />
                </button>
                <button 
                  onClick={() => alert('Biometric login will be enabled in the settings.')}
                  className="bg-white p-3 rounded-full text-[#1c1c1c] hover:bg-zinc-100 transition-colors shadow-md border border-zinc-100"
                >
                  <Fingerprint size={28} />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-4">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
            Don't have an account? <Link to="/signup" className="text-emerald-500 dark:text-[#d6ff3e] font-black uppercase tracking-tighter hover:underline ml-1">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
