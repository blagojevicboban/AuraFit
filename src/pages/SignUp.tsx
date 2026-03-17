import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Chrome, Facebook, Fingerprint } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const SignUp: React.FC = () => {
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
        <h1 className="text-[#d6ff3e] text-2xl font-bold uppercase tracking-wider mb-12">Create Account</h1>
        
        <div className="text-center max-w-xs">
          <h2 className="text-3xl font-extrabold mb-4 italic">Let's Start!</h2>
        </div>
      </div>

      {/* Inputs Section (Purple Card) */}
      <div className="bg-[#afa3ff] px-8 py-10 flex flex-col gap-5">
        <Input 
          label="Full name"
          type="text" 
          placeholder="John Doe"
        />

        <Input 
          label="Email or Mobile Number"
          type="text" 
          placeholder="example@example.com / +123 567 89000"
        />

        <Input 
          label="Password"
          type="password" 
          placeholder="**************"
        />

        <Input 
          label="Confirm Password"
          type="password" 
          placeholder="**************"
        />
      </div>

      {/* Bottom Section */}
      <div className="px-8 pt-6 pb-10 flex flex-col items-center gap-6 bg-[#1c1c1c] flex-grow">
        <div className="text-center max-w-xs px-2">
            <p className="text-zinc-400 text-[10px] leading-tight">
                By continuing, you agree to <br/>
                <span className="text-[#d6ff3e] font-bold">Terms of Use</span> and <span className="text-[#d6ff3e] font-bold">Privacy Policy.</span>
            </p>
        </div>

        <Button size="xl" fullWidth className="max-w-xs shadow-lg">
          Sign Up
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

        <div className="mt-2">
          <p className="text-zinc-400 text-sm">
            Already have an account? <Link to="/login" className="text-[#d6ff3e] font-bold">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
