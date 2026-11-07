import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  Bookmark,
  Calendar,
  Sparkles,
  Info,
  Building2
} from 'lucide-react';
import { useScholarshipStore } from '../../store/useScholarshipStore.ts';
import { useProfileStore } from '../../store/useProfileStore.ts';
import { useDocumentStore } from '../../store/useDocumentStore.ts';
import { getMatches } from '../../lib/engine/matchingEngine.ts';
import { ScholarshipDetailModal } from '../../components/scholarship/ScholarshipDetailModal.tsx';
import { Scholarship } from '../../data/mockScholarships.ts';

export const MatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'eligible' | 'needsVerification' | 'notEligible') || 'eligible';

  const [activeTab, setActiveTab] = useState<'eligible' | 'needsVerification' | 'notEligible'>(initialTab);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  const { scholarships, savedScholarshipIds, toggleSaveScholarship } = useScholarshipStore();
  const { profile } = useProfileStore();
  const { documents } = useDocumentStore();

  const docStatusMap = useMemo(() => {
    const map: Record<string, 'Ready' | 'Pending' | 'Not Applicable'> = {};
    for (const d of documents) {
      map[d.id] = d.status;
    }
    return map;
  }, [documents]);

  const matches = useMemo(() => {
    return getMatches(profile, scholarships, docStatusMap);
  }, [profile, scholarships, docStatusMap]);

  const currentList = {
    eligible: matches.eligible,
    needsVerification: matches.needsVerification,
    notEligible: matches.notEligible
  }[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE9FE] text-[#3B1FC4] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rule-Based Eligibility Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Scholarship Matches
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic matching based on your academic marks, annual family income, domicile, and category.
          </p>
        </div>
      </div>

      {/* Tabs matching user requirements: Eligible / Needs Verification / Not Eligible */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('eligible')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'eligible'
              ? 'bg-white text-emerald-700 shadow-soft-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Eligible</span>
          <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] tabular-nums font-black">
            {matches.eligible.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('needsVerification')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'needsVerification'
              ? 'bg-white text-amber-700 shadow-soft-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>Needs Verification</span>
          <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] tabular-nums font-black">
            {matches.needsVerification.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('notEligible')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'notEligible'
              ? 'bg-white text-slate-800 shadow-soft-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <XCircle className="w-4 h-4 text-rose-500" />
          <span>Not Eligible</span>
          <span className="px-2 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] tabular-nums font-black">
            {matches.notEligible.length}
          </span>
        </button>
      </div>

      {/* Explanatory banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-[#3B1FC4] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-900">Zero Guesswork Policy: </strong>
          GRANTLY does not display fabricated AI percentages. Each status is derived by evaluating the scheme's criteria against your profile fields.
        </div>
      </div>

      {/* List of matched cards */}
      {currentList.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200/80 shadow-soft-sm space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#3B1FC4] flex items-center justify-center mx-auto shadow-2xs">
            <Sparkles className="w-7 h-7 stroke-[1.8]" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {!profile ? 'Register Your Student Profile to Unlock Matches' : `No ${activeTab === 'eligible' ? 'Eligible' : activeTab === 'needsVerification' ? 'Pending' : 'Ineligible'} Scholarships`}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {!profile
              ? 'Enter your academic credentials, domicile state, and family income to allow our deterministic engine to verify which of the 450+ schemes you qualify for.'
              : 'Keep your document checklist updated as new government and corporate opportunities open.'}
          </p>
          {!profile && (
            <button
              onClick={() => navigate('/onboarding')}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#4F46E5] to-[#7C5CF0] text-white text-xs font-bold shadow-soft-xs hover:shadow-soft-sm transition-all cursor-pointer"
            >
              <span>Get Started / Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentList.map((item) => {
          const s = item.scholarship;
          const isSaved = savedScholarshipIds.includes(s.id);

          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{s.logo || '🎓'}</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#3B1FC4] text-[10px] font-bold">
                      {s.type}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {s.state}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleSaveScholarship(s.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-indigo-50 border-indigo-200 text-[#3B1FC4]'
                        : 'border-slate-200 text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h4
                  onClick={() => setSelectedScholarship(s)}
                  className="text-base font-bold text-slate-900 hover:text-[#3B1FC4] transition-colors cursor-pointer line-clamp-1"
                >
                  {s.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{s.provider}</p>

                <div className="mt-3">
                  <span className="text-lg font-extrabold text-[#3B1FC4] tabular-nums">
                    {s.amountText}
                  </span>
                </div>

                {/* Status and One-Line Reason */}
                <div className="mt-3 space-y-2">
                  {item.status === 'Eligible' && (
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Eligible: </span>
                        <span>{item.whyRecommended}</span>
                      </div>
                    </div>
                  )}

                  {item.status === 'Needs Verification' && (
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-xs text-amber-900 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Missing Info: </span>
                        <span>{item.whatWouldMakeEligible || 'Update your profile to confirm match.'}</span>
                      </div>
                    </div>
                  )}

                  {item.status === 'Not Eligible' && (
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-900 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Why Ineligible: </span>
                        <span>{item.whatWouldMakeEligible || 'Did not satisfy scheme eligibility rules.'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  <span>Deadline: </span>
                  <span className="font-semibold text-slate-700">{s.deadline}</span>
                </div>

                <button
                  onClick={() => setSelectedScholarship(s)}
                  className="px-4 py-2 rounded-xl bg-linear-to-r from-[#4F46E5] to-[#7C5CF0] text-white text-xs font-bold transition-all shadow-soft-xs flex items-center gap-1 cursor-pointer active:scale-98"
                >
                  <span>Why Am I Eligible?</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Details modal */}
      <ScholarshipDetailModal
        scholarship={selectedScholarship as any}
        isOpen={!!selectedScholarship}
        onClose={() => setSelectedScholarship(null)}
        profile={profile}
        isSaved={selectedScholarship ? savedScholarshipIds.includes(selectedScholarship.id) : false}
        onToggleSave={(id) => toggleSaveScholarship(id)}
      />
    </div>
  );
};
