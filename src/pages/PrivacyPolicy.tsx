import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import BottomNav from '../components/BottomNav';

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us when you create an account, set up your profile, or use our services. This includes your name, email address, age, weight, height, fitness goals, and activity level.

We also automatically collect certain information when you use the App, including usage data, device information, and performance metrics.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:
• Provide, maintain, and improve the AuraFit platform
• Generate personalized workout and nutrition recommendations
• Connect you with certified coaches on our platform
• Send you notifications about your fitness progress
• Analyze usage patterns to improve user experience`,
  },
  {
    title: '3. Data Sharing',
    content: `We do not sell, trade, or rent your personal information to third parties. Your data is shared only with:
• Coaches you are assigned to or interact with on the platform
• Firebase services (Google) for authentication and data storage
• Analytics services used to improve app performance

All third-party services are bound by strict data processing agreements.`,
  },
  {
    title: '4. Data Security',
    content: `We implement industry-standard security measures to protect your data, including encryption in transit (HTTPS/TLS) and at rest. Authentication is handled via Firebase Authentication, which uses secure token-based sessions.

Despite these measures, no system is completely secure. We encourage you to use a strong password and keep your credentials private.`,
  },
  {
    title: '5. Your Rights',
    content: `You have the right to:
• Access and review the personal data we hold about you
• Request correction of inaccurate personal data
• Request deletion of your account and all associated data
• Withdraw consent at any time (this may limit some app features)

To exercise these rights, use the "Delete Account" option in Settings or contact us at support@aurafit.com.`,
  },
  {
    title: '6. Data Retention',
    content: `We retain your personal data for as long as your account is active or as needed to provide services. When you delete your account, we will delete your personal data within 30 days, unless we are required to retain it by law.`,
  },
  {
    title: '7. Children\'s Privacy',
    content: `AuraFit is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy in the app and updating the "Last Updated" date below. Continued use of the app after changes constitutes your acceptance of the updated policy.`,
  },
  {
    title: '9. Contact Us',
    content: `If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:

Email: privacy@aurafit.com
Address: AuraFit Inc., 123 Fitness Street, Belgrade, Serbia`,
  },
];

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col pb-24 transition-colors duration-300">

      {/* ── Header ── */}
      <div className="bg-zinc-900 pt-12 pb-8 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-56 h-56 bg-[#afa3ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-5%] w-40 h-40 bg-[#d6ff3e]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-300 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-xl font-black text-white uppercase tracking-widest">Privacy Policy</h1>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#afa3ff]/20 border border-[#afa3ff]/30 flex items-center justify-center">
            <Shield size={26} className="text-[#afa3ff]" />
          </div>
          <div>
            <p className="text-white font-bold text-base">AuraFit Privacy Policy</p>
            <p className="text-zinc-400 text-xs">Last updated: March 19, 2026</p>
          </div>
        </div>
      </div>

      {/* ── Intro ── */}
      <div className="px-6 pt-8 pb-2">
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
          At AuraFit, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our application. Please read it carefully.
        </p>
      </div>

      {/* ── Sections ── */}
      <div className="px-6 py-4 space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm"
          >
            <h2 className="text-base font-black text-zinc-900 dark:text-white mb-3">
              {section.title}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Footer note ── */}
      <div className="px-6 py-4">
        <div className="bg-[#afa3ff]/10 border border-[#afa3ff]/20 rounded-3xl p-5 text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            By using AuraFit, you agree to the terms of this Privacy Policy.
            For questions, contact us at{' '}
            <span className="text-[#afa3ff] font-semibold">privacy@aurafit.com</span>
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default PrivacyPolicy;
