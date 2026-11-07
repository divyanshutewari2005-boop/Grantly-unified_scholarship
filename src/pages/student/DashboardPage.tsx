import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  CheckCircle2,
  Layers,
  Calendar,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Bookmark,
  Sparkles,
  Zap,
  Check,
  Building2,
  FileText,
  Clock,
  UserPlus,
  Upload,
  Plus,
  ShieldCheck
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import confetti from 'canvas-confetti';
import { useProfileStore } from '../../store/useProfileStore.ts';
import { useScholarshipStore } from '../../store/useScholarshipStore.ts';
import { useApplicationStore } from '../../store/useApplicationStore.ts';
import { useDocumentStore } from '../../store/useDocumentStore.ts';
import { getMatches, getNextBestAction } from '../../lib/engine/matchingEngine.ts';
import { StatCard } from '../../components/ui/StatCard.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { ScholarshipDetailModal } from '../../components/scholarship/ScholarshipDetailModal.tsx';
import { RegisterModal } from '../../components/auth/RegisterModal.tsx';
import { LoginModal } from '../../components/auth/LoginModal.tsx';
import { Scholarship } from '../../data/mockScholarships.ts';
import { useToast } from '../../components/ui/Toast.tsx';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { profile, updateProfile, isAuthenticated } = useProfileStore();
  const { scholarships, savedScholarshipIds, toggleSaveScholarship } = useScholarshipStore();
  const { applications, getCountsByStatus } = useApplicationStore();
  const { documents, setDocumentStatus } = useDocumentStore();

  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [incomeCertNumber, setIncomeCertNumber] = useState('');
  const [incomeAmountInput, setIncomeAmountInput] = useState(profile?.annualIncome ? String(profile.annualIncome) : '');
  const [incomeAuthority, setIncomeAuthority] = useState('Tehsildar / Revenue Department');
  const [incomeFileUploaded, setIncomeFileUploaded] = useState(false);

  const isIncomeCertReady = documents.find((d) => d.id === 'doc-income')?.status === 'Ready';

  const handleSaveIncomeCertificate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const certNum = incomeCertNumber.trim();
    const amount = Number(incomeAmountInput);
    if (!certNum || !incomeAmountInput || !Number.isFinite(amount) || amount < 0) {
      toast('Enter your certificate number and annual income first.', 'error');
      return;
    }

    setDocumentStatus('doc-income', 'Ready', `Cert No: ${certNum} (${incomeAuthority})`);

    updateProfile({
      hasIncomeCertificate: true,
      annualIncome: amount
    });

    confetti({ particleCount: 65, spread: 75, origin: { y: 0.7 } });
    toast('Income Certificate Added Successfully!', 'success', `Verified: ${certNum} · ₹${(amount / 100000).toFixed(2)}L/yr`);
  };

  // Document status dictionary for engine
  const docStatusMap = useMemo(() => {
    const map: Record<string, 'Ready' | 'Pending' | 'Not Applicable'> = {};
    for (const d of documents) {
      map[d.id] = d.status;
    }
    return map;
  }, [documents]);

  // Run matching engine live!
  const matchBuckets = useMemo(() => {
    return getMatches(profile, scholarships, docStatusMap);
  }, [profile, scholarships, docStatusMap]);

  // Live Next Best Action calculation
  const nextAction = useMemo(() => {
    return getNextBestAction(profile, matchBuckets, docStatusMap);
  }, [profile, matchBuckets, docStatusMap]);

  // Donut chart data matching screenshot counts
  const appCounts = getCountsByStatus();
  const chartData = [
    { name: 'Interested', value: appCounts.Interested, color: '#312E81' },
    { name: 'Preparing', value: appCounts.Preparing, color: '#6366F1' },
    { name: 'Applied', value: appCounts.Applied, color: '#38BDF8' },
    { name: 'Under Review', value: appCounts['Under Review'], color: '#F59E0B' },
    { name: 'Approved', value: appCounts.Approved, color: '#10B981' }
  ];

  // Top 3 Recommended scholarships for horizontal row
  const recommended = matchBuckets.eligible.length >= 3
    ? matchBuckets.eligible.slice(0, 3)
    : [...matchBuckets.eligible, ...matchBuckets.needsVerification].slice(0, 3);

  const handleNextActionClick = () => {
    if (nextAction.id === 'action-register') {
      setIsRegisterModalOpen(true);
    } else if (nextAction.id === 'action-income-cert') {
      setDocumentStatus('doc-income', 'Ready', 'Self-certified by student');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      toast('Income Certificate marked as Ready!', 'success', 'Unlocked 3 eligible state scholarships.');
    } else if (nextAction.id === 'action-domicile') {
      setDocumentStatus('doc-domicile', 'Ready', 'Domicile verified');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      toast('Domicile Certificate verified!', 'success');
    } else {
      navigate(nextAction.actionRoute);
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================
          0. GET STARTED OR REGISTER (TOP SECTION - VISITOR MODE)
          ======================================================== */}
      {false && !isAuthenticated && (
        <section className="bg-linear-to-r from-indigo-50/90 via-purple-50/70 to-white border border-indigo-200/90 rounded-3xl p-5 sm:p-6 shadow-soft-sm relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-300/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4 max-w-2xl">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#4F46E5] to-[#7C5CF0] text-white flex items-center justify-center shrink-0 shadow-soft-xs mt-0.5">
                <UserPlus className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EDE9FE] text-[#3B1FC4]">
                    <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
                    <span>Start Your Funding Journey</span>
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    ✓ 100% Free · Official Portals Only
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Get Started or Register Your Student Profile
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Applying for scholarships? Register your academic credentials, domicile state, and family income to match with 450+ verified Central & State schemes with zero guesswork.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto shrink-0">
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#4F46E5] to-[#7C5CF0] hover:from-[#4338CA] hover:to-[#6D28D9] text-white text-xs sm:text-sm font-bold shadow-soft-sm hover:shadow-soft-md transition-all cursor-pointer active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                <span>Get Started / Register</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs"
              >
                <span>Log In</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          1. GRANTLY HERO BANNER
          ======================================================== */}
      <section className="grantly-hero relative overflow-hidden rounded-[26px] border border-violet-100 min-h-[190px] sm:min-h-[205px] flex items-center shadow-[0_8px_28px_rgba(91,55,180,.08)]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4eaff] via-[#f8f3ff] to-[#e8dcff]" />
        <div className="absolute -right-8 -top-24 h-64 w-64 rounded-full bg-white/70 blur-2xl" />
        <div className="absolute right-[16%] -bottom-28 h-64 w-64 rounded-full bg-violet-300/35 blur-3xl" />
        <div className="relative z-10 w-full flex items-center px-6 sm:px-8 py-7">
          <div className="max-w-[58%] sm:max-w-[56%] space-y-2.5">
            <h2 className="text-[22px] sm:text-[27px] font-black tracking-tight leading-[1.12] text-[#17133f]">
              Find, Apply & Manage<br />Scholarships — <span className="text-[#5525df]">All in One Place</span>
            </h2>
            <p className="text-[11px] sm:text-[13px] text-indigo-950/75 leading-relaxed max-w-md">
              Personalized matches, deadline alerts, document tracking and application management.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button onClick={() => setIsRegisterModalOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5525e8] to-[#7d43f5] px-4 py-2.5 text-[11px] sm:text-xs font-bold text-white shadow-md shadow-violet-200 hover:-translate-y-0.5 transition-all cursor-pointer">
                Get Started for Free <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => navigate('/explore-scholarships')} className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/90 px-4 py-2.5 text-[11px] sm:text-xs font-bold text-[#21164f] hover:bg-white transition-colors cursor-pointer">
                <GraduationCap className="h-3.5 w-3.5" /> Explore Scholarships
              </button>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-[47%] pointer-events-none">
            <div className="absolute right-[-5%] top-[-35%] h-[150%] w-[95%] rounded-[50%] bg-gradient-to-br from-violet-300/70 to-purple-100/20" />
            <img src="/hero-student.png" alt="Student holding books and laptop" className="absolute right-[4%] bottom-[-22%] h-[125%] w-auto max-w-none object-contain drop-shadow-xl" />
            <div className="absolute right-3 top-5 rounded-xl border border-white/80 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-sm">
              <p className="text-sm font-black text-[#1b1745]">5000+</p><p className="text-[9px] font-semibold text-indigo-700">Scholarships</p>
            </div>
            <div className="absolute right-4 bottom-5 rounded-xl border border-white/80 bg-white/95 px-3 py-2 shadow-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500"/><span className="text-[10px] font-bold text-slate-800">Verified<br/><span className="font-medium text-slate-500">Government & Private</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. FOUR STAT CARDS (ROW OF 4 MATCHING SCREENSHOT)
          ======================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Matched Scholarships */}
        <StatCard
          title="Matched Scholarships"
          count={profile ? matchBuckets.totalActiveMatches : scholarships.length}
          icon={<GraduationCap className="w-6 h-6" />}
          iconBgColor="bg-[#EDE9FE]"
          iconTextColor="text-[#3B1FC4]"
          badgeText={profile ? `↑ ${matchBuckets.totalActiveMatches} tailored schemes` : '26 verified catalog'}
          badgeType="success"
          onClick={() => navigate('/matches')}
        />

        {/* Card 2: Eligible Scholarships */}
        <StatCard
          title="Eligible Scholarships"
          count={matchBuckets.eligible.length}
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
          iconTextColor="text-emerald-700"
          badgeText={
            profile
              ? (matchBuckets.eligible.length > 0
                  ? `${matchBuckets.eligible.length} ready to apply`
                  : 'Needs verification')
              : 'Register to verify'
          }
          badgeType={matchBuckets.eligible.length > 0 ? 'success' : 'info'}
          onClick={() => navigate('/matches?tab=eligible')}
        />

        {/* Card 3: Active Applications */}
        <StatCard
          title="Active Applications"
          count={applications.length}
          icon={<Layers className="w-6 h-6 text-indigo-600" />}
          iconBgColor="bg-indigo-50"
          iconTextColor="text-indigo-700"
          badgeText={
            applications.length > 0
              ? `● ${applications.filter((a) => a.status === 'Under Review').length} under review`
              : '0 in progress'
          }
          badgeType={applications.length > 0 ? 'warning' : 'info'}
          onClick={() => navigate('/applications')}
        />

        {/* Card 4: Upcoming Deadlines */}
        <StatCard
          title="Upcoming Deadlines"
          count={5}
          icon={<Calendar className="w-6 h-6 text-rose-600" />}
          iconBgColor="bg-rose-50"
          iconTextColor="text-rose-700"
          badgeText="⚠ 2 in next 7 days"
          badgeType="danger"
          onClick={() => navigate('/deadlines')}
        />
      </section>

      {/* ========================================================
          3. RECOMMENDED FOR YOU (ROW OF 3 CARDS)
          ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Recommended for You
            </h3>
            <span className="text-[#3B1FC4]">✨</span>
          </div>
          <Link
            to="/matches"
            className="text-xs font-bold text-[#3B1FC4] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommended.map((match) => {
            const s = match.scholarship;
            const isSaved = savedScholarshipIds.includes(s.id);
            const isEligible = match.status === 'Eligible';

            return (
              <div
                key={s.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Header: Logo + Tags */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg shadow-xs">
                        {s.logo || '🎓'}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#3B1FC4] text-[10px] font-bold">
                          {s.type}
                        </span>
                        {s.categoryTag && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                            {s.categoryTag}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Title & Provider */}
                  <h4
                    onClick={() => setSelectedScholarship(s)}
                    className="text-sm font-bold text-slate-900 line-clamp-1 hover:text-[#3B1FC4] cursor-pointer transition-colors"
                  >
                    {s.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {s.provider}
                  </p>

                  {/* Amount Value Highlight */}
                  <div className="mt-3">
                    <span className="text-lg font-extrabold text-[#3B1FC4] tabular-nums tracking-tight">
                      {s.amountText}
                    </span>
                  </div>

                  {/* Eligibility Status Badge */}
                  <div className="mt-2 mb-3">
                    {isEligible ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Eligible</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/70">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Needs Verification</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Deadline + Bookmark + CTA Button */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Apply by: </span>
                    <span className="font-semibold text-slate-700">{s.deadline}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSaveScholarship(s.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-indigo-50 border-indigo-200 text-[#3B1FC4]'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                      }`}
                      aria-label="Save scholarship"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => setSelectedScholarship(s)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-linear-to-r from-[#4F46E5] to-[#7C5CF0] hover:from-[#4338CA] hover:to-[#6D28D9] text-white text-xs font-bold transition-all shadow-soft-xs flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          4. STUDENT JOURNEY: APPLICATION PROGRESS + NEXT ACTION
          ======================================================== */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* APPLICATION JOURNEY */}
        <div className="xl:col-span-5 relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-[0_12px_35px_rgba(49,46,129,0.07)]">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-100/70 blur-3xl pointer-events-none" />
          <div className="relative p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-indigo-700">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Your journey
                </div>
                <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
                  Application Progress
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Every step brings your funding goal closer.
                </p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-200">
                <Layers className="h-5 w-5" />
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="mt-6">
                <div className="rounded-2xl bg-gradient-to-br from-[#F5F3FF] via-white to-[#EEF2FF] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-3xl font-black tracking-tight text-slate-900">0<span className="text-lg text-slate-400">/{5}</span></p>
                      <p className="mt-1 text-xs font-semibold text-slate-600">Applications started</p>
                    </div>
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-[7px] border-indigo-100 bg-white">
                      <div className="absolute inset-0 rounded-full border-[7px] border-transparent border-t-violet-500 rotate-[-35deg]" />
                      <span className="text-lg font-black text-indigo-700">0%</span>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[
                      { label: 'Interested', value: appCounts.Interested, color: 'bg-indigo-500' },
                      { label: 'In progress', value: appCounts.Preparing, color: 'bg-violet-500' },
                      { label: 'Submitted', value: appCounts.Applied + appCounts['Under Review'] + appCounts.Approved, color: 'bg-emerald-500' }
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-white bg-white/90 p-2.5">
                        <span className={`mb-2 block h-1.5 w-6 rounded-full ${item.color}`} />
                        <p className="text-lg font-extrabold text-slate-900">{item.value}</p>
                        <p className="text-[10px] font-semibold text-slate-500">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-extrabold text-indigo-700">1</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800">Explore scholarships</p>
                      <p className="text-[11px] text-slate-500">Find opportunities that match your goals</p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div className="ml-3.5 h-4 border-l-2 border-dashed border-indigo-200" />
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-extrabold text-slate-500">2</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-700">Save your shortlist</p>
                      <p className="text-[11px] text-slate-500">Keep the best options in one place</p>
                    </div>
                    <Bookmark className="h-4 w-4 text-slate-300" />
                  </div>
                  <div className="ml-3.5 h-4 border-l-2 border-dashed border-slate-200" />
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-extrabold text-slate-500">3</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-700">Prepare and submit</p>
                      <p className="text-[11px] text-slate-500">Track every application until its result</p>
                    </div>
                    <FileText className="h-4 w-4 text-slate-300" />
                  </div>
                </div>

                <button
                  onClick={() => navigate('/explore-scholarships')}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C5CF0] px-4 py-3 text-xs font-extrabold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
                >
                  Find my first scholarship
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="mt-5">
                <div className="rounded-2xl bg-gradient-to-br from-[#F5F3FF] to-[#EEF2FF] p-4">
                  <div className="grid grid-cols-2 items-center gap-3">
                    <div>
                      <p className="text-3xl font-black tracking-tight text-slate-900">
                        {applications.length}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-600">Total tracked applications</p>
                      <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-indigo-700">
                        <TrendingUp className="h-3 w-3" />
                        Keep moving forward
                      </p>
                    </div>
                    <div className="relative h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={66} paddingAngle={4} dataKey="value" strokeWidth={0}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-900">
                          {Math.round(((appCounts.Applied + appCounts['Under Review'] + appCounts.Approved) / applications.length) * 100)}%
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Submitted</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {chartData.map((item) => (
                    <div key={item.name}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600">{item.name}</span>
                        <span className="font-extrabold text-slate-900">{item.value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${applications.length ? (item.value / applications.length) * 100 : 0}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/applications')}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-xs font-extrabold text-indigo-700 transition-colors hover:bg-indigo-50 cursor-pointer"
                >
                  Manage my applications
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* NEXT BEST ACTION */}
        <div className="xl:col-span-7 relative overflow-hidden rounded-[28px] bg-[#17113B] text-white shadow-[0_16px_45px_rgba(49,46,129,0.18)]">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  Smart recommendation
                </div>
                <h3 className="text-lg font-extrabold tracking-tight text-white">
                  Your Next Best Action
                </h3>
                <p className="mt-1 max-w-md text-xs leading-relaxed text-violet-100/75">
                  One focused step at a time. Complete this action to improve your scholarship readiness.
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-amber-300 shadow-inner">
                <Zap className="h-6 w-6" />
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="mt-6 rounded-2xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-300/15 text-violet-200">
                    <UserPlus className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">Create your student profile first</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-violet-100/75">
                      Register to get recommendations based on your course, domicile, marks and family income. Your next steps will appear here.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5B4BEB] to-[#8B5CF6] px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-indigo-900/20 transition-all hover:-translate-y-0.5 hover:brightness-110 cursor-pointer"
                >
                  Create my profile
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : !isIncomeCertReady ? (
              <div className="mt-6 rounded-2xl border border-white/15 bg-white/[0.08] p-4 sm:p-5 backdrop-blur-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-md">
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-300/15 px-2.5 py-1 text-[10px] font-bold text-amber-200">
                      <Clock className="h-3 w-3" />
                      Recommended next step
                    </div>
                    <h4 className="text-base font-extrabold text-white">
                      Add your income certificate
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-violet-100/75">
                      Some need-based scholarships require income proof. Add the details below to keep your profile ready.
                    </p>
                  </div>
                  <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] font-extrabold text-amber-200">
                    Action needed
                  </span>
                </div>

                <form onSubmit={handleSaveIncomeCertificate} className="mt-5 rounded-xl bg-white p-4 text-slate-900">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold text-slate-700">
                        Certificate number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter certificate number"
                        value={incomeCertNumber}
                        onChange={(e) => setIncomeCertNumber(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold text-slate-700">
                        Annual family income (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Enter annual income"
                        value={incomeAmountInput}
                        onChange={(e) => setIncomeAmountInput(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-[11px] font-semibold text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50">
                      <Upload className="h-4 w-4 text-indigo-600" />
                      {incomeFileUploaded ? 'File selected' : 'Choose certificate file'}
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setIncomeFileUploaded(Boolean(e.target.files?.length))}
                      />
                    </label>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5B4BEB] to-[#8B5CF6] px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-indigo-900/20 transition-all hover:-translate-y-0.5 hover:brightness-110 cursor-pointer"
                    >
                      Save certificate details
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-3 text-[10px] leading-relaxed text-slate-400">
                    Demo mode: selecting a file only updates the interface. It is not uploaded to a server.
                  </p>
                </form>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-300/15 text-emerald-200">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-extrabold text-white">Income certificate marked ready</h4>
                      <span className="rounded-full bg-emerald-300/15 px-2 py-0.5 text-[10px] font-bold text-emerald-200">Completed</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-violet-100/75">
                      Your profile checklist has been updated. Continue to review scholarships that match your details.
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => navigate('/matches?tab=eligible')}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-2.5 text-xs font-extrabold text-emerald-950 transition hover:bg-emerald-200 cursor-pointer"
                  >
                    View eligible matches
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDocumentStatus('doc-income', 'Pending');
                      toast('Income Certificate status reset to Pending.', 'info');
                    }}
                    className="rounded-xl border border-white/20 px-4 py-2.5 text-xs font-bold text-white/80 transition hover:bg-white/10 cursor-pointer"
                  >
                    Edit details
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-[10px] font-medium text-violet-100/60">
              <ShieldCheck className="h-3.5 w-3.5" />
              Your information stays in your local demo profile.
            </div>
          </div>
        </div>
      </section>

      {/* Scholarship Details Modal */}
      <ScholarshipDetailModal
        scholarship={selectedScholarship as any}
        isOpen={!!selectedScholarship}
        onClose={() => setSelectedScholarship(null)}
        profile={profile}
        isSaved={selectedScholarship ? savedScholarshipIds.includes(selectedScholarship.id) : false}
        onToggleSave={(id) => toggleSaveScholarship(id)}
        onPrepareDocuments={(s) => {
          setSelectedScholarship(null);
          navigate('/documents');
        }}
      />

      {/* Register / Get Started Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
    </div>
  );
};
