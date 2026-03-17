import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Chrome, Facebook, Fingerprint, Mail, Lock, User as UserIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  // State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name, 'client');
      navigate('/profile-setup');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col font-sans overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#afa3ff]/20 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-[#d6ff3e]/10 rounded-full blur-[80px]" />

      <div className="px-6 pt-12 pb-6 flex flex-col items-center relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-6 top-13 text-[#d6ff3e] hover:scale-110 transition-transform"
        >
          <ChevronLeft size={24} />
        </button>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#d6ff3e] text-2xl font-black uppercase tracking-[0.2em] mb-8"
        >
          Create Account
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h2 className="text-4xl font-black mb-2 italic tracking-tight uppercase">Let's Start!</h2>
          <p className="text-zinc-500 text-sm font-medium">Join our community today</p>
        </motion.div>
      </div>

      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-8 flex flex-col gap-4 relative z-10"
      >
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl space-y-4">
          <Input 
            label="Full name"
            type="text" 
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-900/50 border-white/5"
            icon={<UserIcon size={20} />}
          />

          <Input 
            label="Email"
            type="email" 
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-900/50 border-white/5"
            icon={<Mail size={20} />}
          />

          <Input 
            label="Password"
            type="password" 
            placeholder="**************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-900/50 border-white/5"
            icon={<Lock size={20} />}
          />

          <Input 
            label="Confirm Password"
            type="password" 
            placeholder="**************"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-zinc-900/50 border-white/5"
            icon={<Lock size={20} />}
          />

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-rose-500 text-xs font-bold text-center"
            >
              {error}
            </motion.p>
          )}
        </div>

        <div className="flex flex-col items-center gap-6 mt-4">
          <Button 
            type="submit"
            isLoading={loading}
            size="xl" 
            fullWidth 
            className="rounded-[2rem] shadow-[0_10px_30px_rgba(214,255,62,0.2)]"
          >
            Sign Up
          </Button>

          <div className="text-center max-w-xs px-2">
              <p className="text-zinc-500 text-[10px] font-medium leading-relaxed">
                  By continuing, you agree to <br/>
                  <span className="text-[#afa3ff] font-bold cursor-pointer hover:underline text-[11px]">Terms of Use</span> and <span className="text-[#afa3ff] font-bold cursor-pointer hover:underline text-[11px]">Privacy Policy</span>
              </p>
          </div>

          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-center gap-4 w-full">
              <div className="h-[1px] bg-zinc-800 flex-grow" />
              <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">or sign up with</span>
              <div className="h-[1px] bg-zinc-800 flex-grow" />
            </div>
            
            <div className="flex gap-4">
              {[Chrome, Facebook, Fingerprint].map((Icon, i) => (
                <button 
                  key={i}
                  type="button"
                  className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-white hover:bg-zinc-800 hover:border-[#afa3ff]/50 transition-all shadow-lg active:scale-95"
                >
                  <Icon size={24} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 mb-10">
            <p className="text-zinc-500 text-sm font-medium">
              Already have an account? <Link to="/login" className="text-[#d6ff3e] font-black hover:underline uppercase tracking-tighter ml-1">Log in</Link>
            </p>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default SignUp;
