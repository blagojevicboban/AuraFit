import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Pencil,
  Home, BookOpen, Apple, User, Headphones
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import BottomNav from '../components/BottomNav';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { userData, currentUser, refreshUserData } = useAuth();

  const { t, language } = useLanguage();
  const [isSaving, setIsSaving] = React.useState(false);
  
  // Form state
  const [formData, setFormData] = React.useState({
    displayName: '',
    weight: '',
    height: '',
    age: '',
    mobile: '',
    dob: ''
  });

  React.useEffect(() => {
    if (userData) {
      setFormData({
        displayName: userData.displayName || '',
        weight: userData.weight?.toString() || '',
        height: userData.height?.toString() || '',
        age: userData.age?.toString() || '',
        mobile: (userData as any).mobile || '',
        dob: (userData as any).dob || (userData as any).birthday || ''
      });
    }
  }, [userData]);


  const calculateAge = (dob: string) => {
    if (!dob || !dob.includes('/')) return '';
    try {
      const parts = dob.split('/');
      if (parts.length !== 3) return '';
      const birthDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age.toString();
    } catch {
      return '';
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      
      // Construct update object safely
      const updateData: any = {
        displayName: formData.displayName,
        mobile: formData.mobile,
        dob: formData.dob
      };

      if (formData.weight) updateData.weight = Number(formData.weight);
      if (formData.height) updateData.height = Number(formData.height);
      
      // Calculate age from DOB if it was changed
      const calculatedAge = calculateAge(formData.dob);
      if (formData.age) {
        updateData.age = Number(formData.age);
      } else if (calculatedAge) {
        updateData.age = Number(calculatedAge);
      } else if (userData?.age) {
        updateData.age = userData.age;
      }

      await updateDoc(userRef, updateData);
      await refreshUserData();
      navigate('/profile');
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col pb-24 transition-colors duration-300">
      
      {/* ── Header Area ── */}
      <div className="bg-[#afa3ff] pt-12 pb-6 px-6 rounded-b-[3rem] relative z-10 shadow-lg">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 text-[#1c1c1c] hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-extrabold text-[#1c1c1c] mb-6 self-start">{t('profile.myProfile')}</h1>
            
            {/* Avatar with Edit Icon */}
            <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-[#d6ff3e] overflow-hidden shadow-xl bg-zinc-800 flex items-center justify-center">
                    {userData?.photoURL ? (
                      <img src={userData.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl">{userData?.displayName?.charAt(0).toUpperCase() || 'A'}</span>
                    )}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#d6ff3e] rounded-full flex items-center justify-center border-4 border-[#afa3ff] shadow-lg hover:scale-110 transition-transform">
                    <Pencil size={18} className="text-[#1c1c1c]" />
                </button>
            </div>

            <h2 className="text-2xl font-black text-[#1c1c1c] leading-tight text-center">{userData?.displayName || 'User'}</h2>
            <p className="text-[#1c1c1c]/70 text-sm font-medium">{userData?.email || 'email@example.com'}</p>
            <p className="text-[#1c1c1c] text-xs font-bold mt-1 uppercase tracking-widest">{userData?.role}</p>

            {/* Stats Card (Floating) */}
            <div className="mt-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-2xl w-full flex items-center justify-around py-4 border border-white/20 shadow-lg translate-y-4">
                <div className="text-center">
                    <div className="text-zinc-900 dark:text-white font-black text-lg">{userData?.weight || '--'} <span className="text-[10px] text-zinc-400">kg</span></div>
                    <div className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-wider">{t('profile.weight')}</div>
                </div>
                <div className="w-[1px] h-8 bg-zinc-200 dark:bg-white/10" />
                <div className="text-center">
                    <div className="text-zinc-900 dark:text-white font-black text-lg">{userData?.age || '--'}</div>
                    <div className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-wider">{t('profile.age')}</div>
                </div>
                <div className="w-[1px] h-8 bg-zinc-200 dark:bg-white/10" />
                <div className="text-center">
                    <div className="text-zinc-900 dark:text-white font-black text-lg">{userData?.height || '--'} <span className="text-[10px] text-zinc-400">cm</span></div>
                    <div className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-wider">{t('profile.height')}</div>
                </div>
            </div>
        </div>
      </div>

      {/* ── Edit Form ── */}
      <div className="flex-grow pt-14 px-6 space-y-6">
        <Input 
            label={t('profile.fullName')} 
            value={formData.displayName}
            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
            placeholder={t('profile.fullNamePlaceholder')}
        />
        <Input 
            label={t('profile.email')} 
            value={userData?.email || ''} 
            placeholder={t('profile.emailPlaceholder') || "example@example.com"}
            type="email"
            disabled
        />
        <Input 
            label={t('profile.mobile')} 
            value={formData.mobile}
            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            placeholder={t('profile.mobilePlaceholder')}
        />
        <Input 
            label={t('profile.dob')} 
            value={formData.dob}
            onChange={(e) => setFormData({...formData, dob: e.target.value})}
            placeholder={t('profile.dobPlaceholder')}
        />
        <div className="flex gap-4">
            <Input 
                label={t('profile.weight')} 
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                placeholder="-- Kg"
                className="flex-1"
                type="number"
            />
            <Input 
                label={t('profile.height')} 
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: e.target.value})}
                placeholder="-- CM"
                className="flex-1"
                type="number"
            />
        </div>

        <Button 
            className="w-full mt-4 bg-emerald-500 dark:bg-[#d6ff3e] text-white dark:text-[#1c1c1c] border-none hover:opacity-90 transition-opacity"
            onClick={handleSave}
            disabled={isSaving}
        >
            {isSaving ? <Loader2 className="animate-spin" /> : t('profile.update')}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default EditProfile;
