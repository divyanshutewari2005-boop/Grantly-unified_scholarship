import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  Mail,
  User,
  Zap
} from 'lucide-react';
import { useProfileStore, DEFAULT_DEMO_STUDENT } from '../../store/useProfileStore.ts';
import { EDUCATION_LEVELS } from '../../lib/constants.ts';
import { Input } from '../../components/ui/Input.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, login } = useProfileStore();
  const { toast } = useToast();

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [educationLevel, setEducationLevel] = useState('Undergraduate (UG)');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const errs: { name?: string; email?: string; password?: string } = {};
    if (mode === 'signup' && !name.trim()) {
      errs.name = 'Please enter your full name';
    }
    if (!email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'signup') {
      // Initialize fresh profile with student's name & email
      setProfile({
        ...DEFAULT_DEMO_STUDENT,
        name: name.trim(),
        educationLevel,
        annualIncome: 240000,
        hasIncomeCertificate: false
      });
      toast(`Account created for ${name}!`, 'success', 'Opening your 5-step profile setup wizard...');
      navigate('/onboarding');
    } else {
      // Returning user login
      login(email.trim(), email.split('@')[0]);
      toast('Welcome back!', 'success', 'Loading your scholarship matches...');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#2E1A6B] via-[#3B1FC4] to-[#4C2FB8] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-soft-lg border border-white/20 text-center space-y-6">
        {/* Brand Header */}
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#3B1FC4] mx-auto shadow-soft-xs">
            <GraduationCap className="w-7 h-7 stroke-[2.4]" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'signup' ? 'Create Your Student Account' : 'Welcome Back to GRANTLY'}
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            {mode === 'signup'
              ? 'One student profile. Every relevant scholarship. Set up in 2 minutes.'
              : 'Log in to manage your active applications, matches, and deadlines.'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`w-1/2 py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#3B1FC4] shadow-soft-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`w-1/2 py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#3B1FC4] shadow-soft-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {mode === 'signup' && (
            <Input
              label="Full Name"
              placeholder="e.g. Divyanshu Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
              error={errors.name}
              required
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="student@example.edu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            error={errors.password}
            required
          />

          {mode === 'signup' && (
            <Select
              label="Target Education Level"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              options={EDUCATION_LEVELS}
            />
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full justify-center bg-linear-to-r from-[#4F46E5] to-[#7C5CF0] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-bold h-12 shadow-soft-xs mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {mode === 'signup' ? 'Create Account & Start Profile' : 'Sign In to Dashboard'}
          </Button>
        </form>

        {/* Privacy Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>100% Free · No Data Selling · Direct Official Portals</span>
        </div>
      </div>
    </div>
  );
};
