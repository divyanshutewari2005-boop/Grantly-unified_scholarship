import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  IndianRupee,
  ShieldCheck,
  Save,
  Download,
  Trash2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useProfileStore, DEFAULT_DEMO_STUDENT } from '../../store/useProfileStore.ts';
import { useScholarshipStore } from '../../store/useScholarshipStore.ts';
import { StudentProfile } from '../../lib/engine/matchingEngine.ts';
import { STATES_AND_UTS, EDUCATION_LEVELS, CATEGORIES } from '../../lib/constants.ts';
import { Slider } from '../../components/ui/Slider.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, resetProfile, completenessPercentage } = useProfileStore();
  const { scholarships } = useScholarshipStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState<StudentProfile>(() => profile || {
    name: '',
    dob: '2005-01-01',
    gender: 'Male',
    state: 'Delhi',
    domicileCertificateNumber: '',
    educationLevel: 'Undergraduate (UG)',
    course: '',
    courseType: 'Technical',
    institution: '',
    institutionType: 'Government',
    academicYear: '1st Year',
    percentage: 75,
    board: 'CBSE',
    annualIncome: 250000,
    hasIncomeCertificate: false,
    category: 'General',
    disabilityStatus: false,
    preferredTypes: ['Government', 'State', 'Private'],
    language: 'en'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    toast(
      'Profile updated successfully!',
      'success',
      'Matching engine re-evaluated 24 opportunities against your new criteria.'
    );
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `grantly_profile_${formData.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast('Profile data exported as JSON', 'info');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Student Profile
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Every scholarship match and recommendation on GRANTLY is derived strictly from this data.
          </p>
        </div>

        {/* Profile Completeness Gauge */}
        <div className="flex items-center gap-3 bg-white p-2.5 px-4 rounded-2xl border border-slate-200/80 shadow-soft-xs">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Completeness</span>
            <span className="text-base font-extrabold text-[#3B1FC4] tabular-nums">
              {completenessPercentage}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center relative">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle cx="20" cy="20" r="16" stroke="#EDE9FE" strokeWidth="4" fill="transparent" />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="#4F46E5"
                strokeWidth="4"
                strokeDasharray="100"
                strokeDashoffset={100 - completenessPercentage}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Personal & Domicile */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-[#3B1FC4]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Personal & Domicile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Select
              label="Gender"
              value={formData.gender || 'Male'}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              options={['Male', 'Female', 'Other', 'Prefer not to say']}
            />

            <Select
              label="Permanent Domicile State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              options={STATES_AND_UTS}
            />

            <Input
              label="Domicile Certificate Number (Optional)"
              value={formData.domicileCertificateNumber || ''}
              onChange={(e) => setFormData({ ...formData, domicileCertificateNumber: e.target.value })}
              placeholder="e.g. UK-DOM-2024-1928"
            />
          </div>
        </div>

        {/* Section 2: Academic Credentials */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <GraduationCap className="w-4 h-4 text-[#3B1FC4]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Academic Background
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Current Education Level"
              value={formData.educationLevel}
              onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
              options={EDUCATION_LEVELS}
            />

            <Input
              label="Course / Program Name"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              placeholder="e.g. B.Tech Computer Science"
              required
            />

            <Input
              label="College / Institution"
              value={formData.institution || ''}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="e.g. Govt College of Technology"
            />

            <Input
              label="Qualifying Board / Exam Score (%)"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.percentage || ''}
              onChange={(e) => setFormData({ ...formData, percentage: Number(e.target.value) })}
              helperText="Class 12 percentage for UG, or Graduation % for PG"
              required
            />
          </div>
        </div>

        {/* Section 3: Financial & Category */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <IndianRupee className="w-4 h-4 text-[#3B1FC4]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Financial Status & Category
            </h3>
          </div>

          <div className="space-y-4">
            <Slider
              label="Gross Annual Family Income"
              min={50000}
              max={1500000}
              step={25000}
              value={formData.annualIncome}
              displayValue={`₹${(formData.annualIncome / 100000).toFixed(2)} Lakh / year`}
              onChange={(val) => setFormData({ ...formData, annualIncome: val })}
              helperText="Combined household income before taxes. Many central schemes have a ₹2.5L to ₹4.5L ceiling."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Select
                label="Social Category / Reservation"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={CATEGORIES}
              />

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="incomeCertCheck"
                  checked={formData.hasIncomeCertificate}
                  onChange={(e) => setFormData({ ...formData, hasIncomeCertificate: e.target.checked })}
                  className="w-4 h-4 rounded text-[#3B1FC4] focus:ring-[#4F46E5]"
                />
                <label htmlFor="incomeCertCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  I possess an authentic Income Certificate issued by Tehsildar / SDM
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportData}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Export My Data (JSON)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to reset your profile to fresh state?')) {
                  resetProfile();
                  toast('Profile reset. Redirecting to setup wizard...', 'info');
                }
              }}
              className="px-4 py-2.5 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>Clear Profile</span>
            </button>
          </div>

          <Button
            type="submit"
            size="md"
            className="w-full sm:w-auto px-8"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile & Re-run Matching
          </Button>
        </div>
      </form>
    </div>
  );
};
