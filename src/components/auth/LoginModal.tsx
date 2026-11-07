import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  ArrowRight,
  Mail,
  Lock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Modal } from '../ui/Modal.tsx';
import { Input } from '../ui/Input.tsx';
import { Button } from '../ui/Button.tsx';
import { useProfileStore, DEFAULT_DEMO_STUDENT } from '../../store/useProfileStore.ts';
import { useToast } from '../ui/Toast.tsx';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister
}) => {
  const navigate = useNavigate();
  const { login, setProfile } = useProfileStore();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 4) {
      errs.password = 'Password must be at least 4 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const studentName = email.split('@')[0] || 'Student';
    login(email, studentName.charAt(0).toUpperCase() + studentName.slice(1));
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    toast('Logged In Successfully!', 'success', `Welcome back, ${email}`);
    onClose();
  };

  const handleQuickStudentLogin = () => {
    setProfile({
      ...DEFAULT_DEMO_STUDENT,
      name: 'Divyanshu Sharma',
      state: 'Uttarakhand',
      educationLevel: 'Undergraduate (UG)',
      course: 'B.Tech in Computer Science',
      percentage: 84.5,
      annualIncome: 240000,
      hasIncomeCertificate: true
    });
    confetti({ particleCount: 65, spread: 70, origin: { y: 0.6 } });
    toast('Logged in as Divyanshu Sharma', 'success', 'Loaded student profile.');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log In to GRANTLY"
      description="Access your saved scholarships, personalized eligibility matches, and applications."
      maxWidth="md"
    >
      <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. student@college.edu.in"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-[#4F46E5] focus:ring-[#4F46E5]" />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => toast('Password reset link sent if account exists.', 'info')}
            className="text-[#3B1FC4] hover:underline font-semibold cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          size="md"
          className="w-full bg-linear-to-r from-[#4F46E5] to-[#7C5CF0] text-white font-bold"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Log In
        </Button>

        {/* Quick Demo Sign In option */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <button
            type="button"
            onClick={handleQuickStudentLogin}
            className="w-full py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200/80 text-[#3B1FC4] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>1-Click Sample Student Login</span>
          </button>

          <p className="text-center text-xs text-slate-500 pt-1">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onSwitchToRegister) {
                  onSwitchToRegister();
                } else {
                  navigate('/auth?mode=signup');
                }
              }}
              className="font-bold text-[#3B1FC4] hover:underline cursor-pointer"
            >
              Register here
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};
