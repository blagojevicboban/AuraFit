import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Chrome, Facebook, Fingerprint } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col font-sans">
      {/* Top Header Section */}
      <div className="px-6 pt-12 pb-8 flex flex-col items-center relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-6 top-13 text-[#d6ff3e]"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[#d6ff3e] text-2xl font-bold uppercase tracking-wider mb-12">Log In</h1>
        
        <div className="text-center max-w-xs">
          <h2 className="text-3xl font-extrabold mb-4">Welcome</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      {/* Inputs Section (Purple Card) */}
      <div className="bg-[#afa3ff] px-8 py-10 flex flex-col gap-6 rounded-3xl mx-6 shadow-xl">
        <Input 
          label="Username or email"
          labelClassName="text-[#1c1c1c]/60"
          type="text" 
          placeholder="example@example.com"
          className="bg-white/20 border-white/30 text-[#1c1c1c] placeholder:text-[#1c1c1c]/40"
        />

        <div className="space-y-2">
          <Input 
            label="Password"
            labelClassName="text-[#1c1c1c]/60"
            type="password" 
            placeholder="**************"
            className="bg-white/20 border-white/30 text-[#1c1c1c] placeholder:text-[#1c1c1c]/40"
          />
          <div className="text-right mt-2">
            <Link to="/forgot-password" size="sm" className="text-[#1c1c1c] font-bold text-sm">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-8 pt-12 pb-10 flex flex-col items-center gap-8 bg-[#1c1c1c] flex-grow">
        <Button size="xl" fullWidth className="max-w-xs shadow-lg">
          Log In
        </Button>

        <div className="flex flex-col items-center gap-4">
          <span className="text-zinc-500 text-sm">or sign up with</span>
          <div className="flex gap-4">
            <button className="bg-white p-3 rounded-full text-[#1c1c1c] hover:bg-zinc-200 transition-colors shadow-md">
              <Chrome size={28} />
            </button>
            <button className="bg-white p-3 rounded-full text-[#1c1c1c] hover:bg-zinc-200 transition-colors shadow-md">
              <Facebook size={28} />
            </button>
            <button className="bg-white p-3 rounded-full text-[#1c1c1c] hover:bg-zinc-200 transition-colors shadow-md">
              <Fingerprint size={28} />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-zinc-400 text-sm">
            Don't have an account? <Link to="/signup" className="text-[#d6ff3e] font-bold">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
