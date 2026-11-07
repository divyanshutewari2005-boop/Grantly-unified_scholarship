import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  User,
  BookOpen,
  IndianRupee,
  Layers,
  Settings,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProfileStore, DEFAULT_DEMO_STUDENT } from '../../store/useProfileStore.ts';
import { useScholarshipStore } from '../../store/useScholarshipStore.ts';
import { getMatches, StudentProfile } from '../../lib/engine/matchingEngine.ts';
import { STATES_AND_UTS, EDUCATION_LEVELS, CATEGORIES } from '../../lib/constants.ts';
import { Slider } from '../../components/ui/Slider.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Button } from '../../components/ui/Button.tsx';

export const OnboardingWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setProfile, completeSetup } = useProfileStore();
  const { scholarships } = useScholarshipStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [formData, setFormData] = useState<StudentProfile>(() => profile || DEFAULT_DEMO_STUDENT);
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishStep, setFinishStep] = useState<'scanning' | 'ready'>('scanning');

  // Live match counter updating in real time as fields are adjusted!
  const liveMatches = useMemo(() => {
    return getMatches(formData, scholarships);
  }, [formData, scholarships]);

  const stepsList = [
    { num: 1, title: 'Personal & Domicile', icon: <User className="w-4 h-4" /> },
    { num: 2, title: 'Academic Details', icon: <BookOpen className="w-4 h-4" /> },
    { num: 3, title: 'Family Income', icon: <IndianRupee className="w-4 h-4" /> },
    { num: 4, title: 'Category & Background', icon: <Layers className="w-4 h-4" /> },
    { num: 5, title: 'Preferences', icon: <Settings className="w-4 h-4" /> }
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep((step + 1) as any);
    } else {
      // Step 5 finish trigger
      setIsFinishing(true);
      setFinishStep('scanning');

      setTimeout(() => {
        setFinishStep('ready');
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
      }, 1600);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as any);
    }
  };

  const handleFinalRedirect = () => {
    setProfile(formData);
    completeSetup();
    navigate('/dashboard');
  };

  if (isFinishing) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#2E1A6B] to-[#4C2FB8] text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/20 shadow-soft-lg space-y-6 animate-in fade-in">
          {finishStep === 'scanning' ? (
            <div className="space-y-4 py-8">
              <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto text-[#C4B5FD] animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Finding Your Scholarships...
              </h3>
              <p className="text-xs text-purple-200 max-w-xs mx-auto leading-relaxed">
                Scanning 450+ verified Central, State, and Corporate CSR guidelines against your criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-6 py-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-2xl bg-emerald-400 text-emerald-950 flex items-center justify-center mx-auto shadow-soft-md">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-white">
                  We Found {liveMatches.totalActiveMatches} Scholarships For You!
                </h3>
                <p className="text-sm text-purple-100">
                  <span className="font-extrabold text-emerald-300">{liveMatches.eligible.length} are 100% Eligible</span> for immediate preparation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-xs text-purple-100 space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span>Matched Opportunities:</span>
                  <span className="font-bold text-white tabular-nums">{liveMatches.totalActiveMatches}</span>
                </div>
                <div className="flex justify-between">
                  <span>Eligible Schemes:</span>
                  <span className="font-bold text-emerald-300 tabular-nums">{liveMatches.eligible.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Needs Document Verification:</span>
                  <span className="font-bold text-amber-300 tabular-nums">{liveMatches.needsVerification.length}</span>
                </div>
              </div>

              <button
                onClick={handleFinalRedirect}
                className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-slate-100 text-[#3B1FC4] text-sm font-extrabold transition-all shadow-soft-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Enter Your Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3FF] flex flex-col lg:flex-row">
      {/* ----------------- LEFT PANEL (PURPLE GRADIENT) ----------------- */}
      <div className="w-full lg:w-[420px] bg-linear-to-b from-[#2E1A6B] to-[#4C2FB8] text-white p-8 sm:p-10 flex flex-col justify-between shrink-0 shadow-soft-lg">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <GraduationCap className="w-6 h-6 stroke-[2.4]" />
            </div>
            <span className="text-xl font-extrabold tracking-wider text-white">GRANTLY</span>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              One Profile. Every Opportunity.
            </h2>
            <p className="text-xs text-purple-200 mt-1 leading-relaxed">
              Fill out your details to enable our deterministic rule engine to match you with verified funding.
            </p>
          </div>

          {/* Stepper list */}
          <div className="space-y-3">
            {stepsList.map((s) => {
              const isCurrent = s.num === step;
              const isPassed = s.num < step;
              return (
                <div
                  key={s.num}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                    isCurrent
                      ? 'bg-white/20 border border-white/30 text-white font-bold'
                      : isPassed
                      ? 'text-emerald-300 bg-white/5'
                      : 'text-purple-300/60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-white text-[#3B1FC4]'
                        : isPassed
                        ? 'bg-emerald-400 text-emerald-950'
                        : 'bg-white/10 text-purple-200'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="text-xs">{s.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Match Counter Widget */}
        <div className="mt-8 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-200 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Matches found so far:</span>
            </span>
            <span className="text-lg font-extrabold text-white tabular-nums">
              {liveMatches.totalActiveMatches}
            </span>
          </div>
          <p className="text-[11px] text-purple-200/80">
            {liveMatches.eligible.length} verified eligible based on current fields
          </p>
        </div>
      </div>

      {/* ----------------- RIGHT PANEL (FORM) ----------------- */}
      <div className="flex-1 p-6 sm:p-12 lg:p-16 flex flex-col justify-between overflow-y-auto max-w-3xl">
        <div className="space-y-6 text-left">
          {/* Step 1: Personal & Domicile */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Step 1: Personal & Domicile Details
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  State scholarships require verified permanent residence (Mool Niwas).
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. Divyanshu Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.dob || '2004-08-15'}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />

                  <Select
                    label="Gender (Optional)"
                    value={formData.gender || 'Male'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    options={['Male', 'Female', 'Other', 'Prefer not to say']}
                  />
                </div>

                <Select
                  label="Permanent Domicile State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  options={STATES_AND_UTS}
                />
              </div>
            </div>
          )}

          {/* Step 2: Academic Details */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Step 2: Academic Credentials
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Cut-off percentages and degree levels determine eligible government quotas.
                </p>
              </div>

              <div className="space-y-4">
                <Select
                  label="Current Education Level"
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                  options={EDUCATION_LEVELS}
                />

                <Input
                  label="Course / Degree Name"
                  placeholder="e.g. B.Tech in Computer Science"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Qualifying Board / Exam Score (%)"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.percentage || ''}
                    onChange={(e) => setFormData({ ...formData, percentage: Number(e.target.value) })}
                    helperText="Percentage in Class 12 or previous exam"
                    required
                  />

                  <Select
                    label="Institution Type"
                    value={formData.institutionType || 'Government'}
                    onChange={(e) => setFormData({ ...formData, institutionType: e.target.value as any })}
                    options={['Government', 'Private', 'Autonomous', 'Aided']}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Financial Details */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Step 3: Family Income & Certificate
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Need-cum-merit schemes have strict annual income ceilings.
                </p>
              </div>

              <div className="space-y-6 pt-2">
                <Slider
                  label="Gross Annual Family Income"
                  min={50000}
                  max={1500000}
                  step={25000}
                  value={formData.annualIncome}
                  displayValue={`₹${(formData.annualIncome / 100000).toFixed(2)} Lakh / year`}
                  onChange={(val) => setFormData({ ...formData, annualIncome: val })}
                  helperText="Combined parental annual income from all sources before tax."
                />

                <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="incomeCertOnboarding"
                    checked={formData.hasIncomeCertificate}
                    onChange={(e) => setFormData({ ...formData, hasIncomeCertificate: e.target.checked })}
                    className="w-4 h-4 rounded text-[#3B1FC4] focus:ring-[#4F46E5]"
                  />
                  <label htmlFor="incomeCertOnboarding" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    I have or can obtain a valid Income Certificate from the Tehsildar / Revenue Officer
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Category & Background */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Step 4: Social Category & Background
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Unlock affirmative welfare schemes (SC, ST, OBC-NCL, EWS, Minority).
                </p>
              </div>

              <div className="space-y-4">
                <Select
                  label="Category / Caste Group"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={CATEGORIES}
                />

                <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="disabilityCheck"
                    checked={formData.disabilityStatus || false}
                    onChange={(e) => setFormData({ ...formData, disabilityStatus: e.target.checked })}
                    className="w-4 h-4 rounded text-[#3B1FC4] focus:ring-[#4F46E5]"
                  />
                  <label htmlFor="disabilityCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Person with Disabilities (PwD) - Eligible for AICTE Saksham and special assistance
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Preferences */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Step 5: Preferences & Simple Language
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Configure how GRANTLY alerts and guides your journey.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <p className="text-xs font-bold text-slate-800">Preferred Language Mode</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, language: 'en' })}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        formData.language === 'en'
                          ? 'border-[#3B1FC4] bg-[#EDE9FE] text-[#3B1FC4]'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, language: 'hi' })}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        formData.language === 'hi'
                          ? 'border-[#3B1FC4] bg-[#EDE9FE] text-[#3B1FC4]'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      हिंदी (Hindi)
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-indigo-900 leading-relaxed">
                    <span className="font-bold">Privacy Guarantee: </span>
                    We only collect what's strictly required for matching. You can update or delete your profile at any time from My Profile.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Nav Buttons */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <Button
            size="md"
            className="px-7"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {step === 5 ? 'Finish & Find Matches' : 'Continue ->'}
          </Button>
        </div>
      </div>
    </div>
  );
};
