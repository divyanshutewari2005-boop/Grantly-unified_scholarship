
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  User,
  Mail,
  BookOpen,
  IndianRupee
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { Modal } from '../ui/Modal.tsx';
import { Input } from '../ui/Input.tsx';
import { Select } from '../ui/Select.tsx';
import { Button } from '../ui/Button.tsx';

import {
  useProfileStore,
  DEFAULT_DEMO_STUDENT
} from '../../store/useProfileStore.ts';

import {
  STATES_AND_UTS,
  EDUCATION_LEVELS,
  CATEGORIES
} from '../../lib/constants.ts';

import { useToast } from '../ui/Toast.tsx';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();

  const {
    setProfile,
    completeSetup,
    profile,
    login
  } = useProfileStore();

  const { toast } = useToast();

  // All registration fields start empty
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [course, setCourse] = useState('');
  const [percentage, setPercentage] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [category, setCategory] = useState('');

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    state?: string;
    educationLevel?: string;
    course?: string;
    percentage?: string;
    annualIncome?: string;
    category?: string;
  }>({});

  // Reset form whenever registration modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setState('');
      setEducationLevel('');
      setCourse('');
      setPercentage('');
      setAnnualIncome('');
      setCategory('');
      setErrors({});
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!state) {
      newErrors.state = 'Please select your domicile state';
    }

    if (!educationLevel) {
      newErrors.educationLevel = 'Please select education level';
    }

    if (!course.trim()) {
      newErrors.course = 'Please enter your course name';
    }

    const marks = Number(percentage);

    if (
      percentage.trim() === '' ||
      !Number.isFinite(marks) ||
      marks < 0 ||
      marks > 100
    ) {
      newErrors.percentage = 'Enter a valid score between 0 and 100';
    }

    const income = Number(annualIncome);

    if (
      annualIncome.trim() === '' ||
      !Number.isFinite(income) ||
      income < 0
    ) {
      newErrors.annualIncome = 'Enter a valid annual family income';
    }

    if (!category) {
      newErrors.category = 'Please select your social category';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Preserve the profile structure required by the matching engine.
    // All fields entered by the user override demo defaults.
    const updatedProfile = {
      ...(profile || DEFAULT_DEMO_STUDENT),
      name: name.trim(),
      state,
      educationLevel,
      course: course.trim(),
      percentage: marks,
      annualIncome: income,
      category,
      hasIncomeCertificate: false
    };

    setProfile(updatedProfile);
    login(email.trim(), name.trim());
    completeSetup();

    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast(
      'Registration successful!',
      'success',
      `Welcome ${name.trim()}. Your scholarship matches have been recalculated.`
    );

    onClose();
  };

  const handleOpenFullWizard = () => {
    onClose();
    navigate('/onboarding');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Your Student Profile"
      description="Enter your academic and financial credentials to calculate exact scholarship eligibility."
      maxWidth="lg"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 pt-2"
      >
        {/* Personal Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors(prev => ({ ...prev, name: undefined }));
            }}
            leftIcon={<User className="w-4 h-4 text-slate-400" />}
            error={errors.name}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors(prev => ({ ...prev, email: undefined }));
            }}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            error={errors.email}
            required
          />

        </div>

        {/* Education Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

          <Select
            label="Permanent Domicile State"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setErrors(prev => ({ ...prev, state: undefined }));
            }}
            options={[
              { value: '', label: 'Select your state' },
              ...STATES_AND_UTS
            ]}
            error={errors.state}
            required
          />

          <Select
            label="Target Education Level"
            value={educationLevel}
            onChange={(e) => {
              setEducationLevel(e.target.value);
              setErrors(prev => ({
                ...prev,
                educationLevel: undefined
              }));
            }}
            options={[
              { value: '', label: 'Select education level' },
              ...EDUCATION_LEVELS
            ]}
            error={errors.educationLevel}
            required
          />

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

          <Input
            label="Course / Degree Name"
            placeholder="e.g. B.Tech Computer Science"
            value={course}
            onChange={(e) => {
              setCourse(e.target.value);
              setErrors(prev => ({ ...prev, course: undefined }));
            }}
            leftIcon={<BookOpen className="w-4 h-4 text-slate-400" />}
            error={errors.course}
            required
          />

          <Input
            label="Qualifying Marks / Score (%)"
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="Enter your percentage"
            value={percentage}
            onChange={(e) => {
              setPercentage(e.target.value);
              setErrors(prev => ({ ...prev, percentage: undefined }));
            }}
            helperText="Percentage in Class 12 or last exam"
            error={errors.percentage}
            required
          />

        </div>

        {/* Financial Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

          <Input
            label="Annual Family Income (₹)"
            type="number"
            min="0"
            step="1000"
            placeholder="Enter annual family income"
            value={annualIncome}
            onChange={(e) => {
              setAnnualIncome(e.target.value);
              setErrors(prev => ({
                ...prev,
                annualIncome: undefined
              }));
            }}
            leftIcon={<IndianRupee className="w-4 h-4 text-slate-400" />}
            helperText={
              annualIncome !== ''
                ? `₹${(Number(annualIncome) / 100000).toFixed(2)} Lakh / year`
                : 'Enter your annual family income'
            }
            error={errors.annualIncome}
            required
          />

          <Select
            label="Social Category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setErrors(prev => ({ ...prev, category: undefined }));
            }}
            options={[
              { value: '', label: 'Select your category' },
              ...CATEGORIES
            ]}
            error={errors.category}
            required
          />

        </div>

        {/* Privacy Information */}
        <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">

          <ShieldCheck className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />

          <p>
            Your information is stored locally and tested against
            scholarship eligibility criteria. We never sell your data.
          </p>

        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">

          <button
            type="button"
            onClick={handleOpenFullWizard}
            className="text-xs font-bold text-[#3B1FC4] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Or take the interactive 5-step wizard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              className="w-1/2 sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="md"
              className="w-1/2 sm:w-auto bg-linear-to-r from-[#4F46E5] to-[#7C5CF0] text-white"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Register & Save
            </Button>

          </div>
        </div>
      </form>
    </Modal>
  );
};
