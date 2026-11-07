import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar,
  Building2,
  FileText,
  Bookmark,
  CheckSquare,
  ArrowRight,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { Scholarship } from '../../data/scholarships.ts';
import { evaluateScholarship, StudentProfile } from '../../lib/eligibility.ts';
import { formatIndianDate, getDeadlineUrgency } from '../../lib/dates.ts';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';

export interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  isOpen: boolean;
  onClose: () => void;
  profile?: StudentProfile | null;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onPrepareDocuments?: (scholarship: Scholarship) => void;
}

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  isOpen,
  onClose,
  profile,
  isSaved = false,
  onToggleSave,
  onPrepareDocuments
}) => {
  const [activeTab, setActiveTab] = useState<'why_eligible' | 'overview' | 'documents' | 'steps'>('why_eligible');

  if (!isOpen || !scholarship) return null;

  const evaluation = evaluateScholarship(profile, scholarship);
  const urgency = getDeadlineUrgency(scholarship.deadline);

  const steps = [
    { num: 1, title: 'Complete Profile', desc: 'Fill academic & financial criteria' },
    { num: 2, title: 'Verify Eligibility', desc: 'Rule-based check with 0 guesswork' },
    { num: 3, title: 'Prepare Documents', desc: 'Verify your Aadhaar, income, marksheet' },
    { num: 4, title: 'Apply Officially', desc: 'Direct on government or portal link' },
    { num: 5, title: 'Track Progress', desc: 'Log reference number & deadline' }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-soft-lg border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] z-10">
        {/* Header banner */}
        <div className="p-6 border-b border-slate-100 bg-linear-to-r from-slate-50 via-indigo-50/30 to-purple-50/20">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {scholarship.type}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {scholarship.state}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-600 font-medium">
                  {scholarship.level.join(', ')}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                {scholarship.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="font-medium">{scholarship.provider}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-200/60 text-xs">
            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/60 shadow-soft-sm">
              <p className="text-slate-500 font-medium text-[11px]">Scholarship Value</p>
              <p className="text-base font-extrabold text-[#3B1FC4] tabular-nums mt-0.5">
                {scholarship.amountText}
              </p>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/60 shadow-soft-sm">
              <p className="text-slate-500 font-medium text-[11px]">Application Deadline</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatIndianDate(scholarship.deadline)}
              </p>
              <span className={`text-[10px] font-semibold ${urgency.isClosingSoon ? 'text-rose-600' : 'text-slate-500'}`}>
                {urgency.label}
              </span>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/60 shadow-soft-sm">
              <p className="text-slate-500 font-medium text-[11px]">Eligibility Status</p>
              <p className="text-sm font-bold mt-0.5 flex items-center gap-1">
                {evaluation.overallStatus === 'Eligible' && (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Eligible
                  </span>
                )}
                {evaluation.overallStatus === 'Needs Verification' && (
                  <span className="text-amber-700 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" /> Verify Criteria
                  </span>
                )}
                {evaluation.overallStatus === 'Not Eligible' && (
                  <span className="text-rose-700 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Not Eligible
                  </span>
                )}
              </p>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/60 shadow-soft-sm">
              <p className="text-slate-500 font-medium text-[11px]">Official Verification</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                {scholarship.verificationStatus}
              </p>
              <span className="text-[10px] text-slate-400">
                Verified: {formatIndianDate(scholarship.lastVerified)}
              </span>
            </div>
          </div>
        </div>

        {/* Stepper Roadmap */}
        <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-100 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[620px] text-xs">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#EDE9FE] text-[#3B1FC4] font-bold flex items-center justify-center text-[10px] shrink-0">
                  {s.num}
                </span>
                <div>
                  <p className="font-semibold text-slate-800">{s.title}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-8 h-px bg-slate-200 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-6 border-b border-slate-200 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('why_eligible')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'why_eligible'
                ? 'border-[#3B1FC4] text-[#3B1FC4]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Why Am I Eligible? ({evaluation.satisfiedCount}/{evaluation.totalRules})
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#3B1FC4] text-[#3B1FC4]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Benefits
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'documents'
                ? 'border-[#3B1FC4] text-[#3B1FC4]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Required Documents ({scholarship.documents.length})
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'steps'
                ? 'border-[#3B1FC4] text-[#3B1FC4]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            How to Apply
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'why_eligible' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-indigo-950">
                    Transparent, Explainable Rule Evaluation
                  </h4>
                  <p className="text-xs text-indigo-800/90 mt-0.5 leading-relaxed">
                    GRANTLY uses pure rule-based logic checking your profile against the scheme's official criteria. No black-box scores, no random AI percentages.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {evaluation.rules.map((rule) => {
                  const isPassed = rule.status === 'satisfied';
                  const isFail = rule.status === 'failed';
                  const isNeedsInfo = rule.status === 'needs_info';

                  return (
                    <div
                      key={rule.ruleId}
                      className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                        isPassed
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : isFail
                          ? 'bg-rose-50/40 border-rose-200'
                          : 'bg-amber-50/40 border-amber-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {isPassed && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                          {isFail && <XCircle className="w-5 h-5 text-rose-600" />}
                          {isNeedsInfo && <HelpCircle className="w-5 h-5 text-amber-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{rule.label}</p>
                          <p className="text-xs text-slate-600 mt-0.5">{rule.description}</p>
                          <p className="text-xs font-medium mt-1 text-slate-700">
                            <span className="font-semibold">Result: </span>
                            {rule.reason}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant={isPassed ? 'success' : isFail ? 'danger' : 'warning'}
                        size="sm"
                      >
                        {isPassed ? 'Satisfied' : isFail ? 'Not Met' : 'Needs Info'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Description</h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {scholarship.summary}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Financial & Academic Benefits</h4>
                <div className="space-y-2">
                  {scholarship.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust block */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" /> Official Verification & Trust Block
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary Source</span>
                    <span className="font-semibold text-slate-800">{scholarship.source}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Last Audited</span>
                    <span className="font-semibold text-slate-800">{formatIndianDate(scholarship.lastVerified)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Support / Helpdesk</span>
                    <span className="font-semibold text-slate-800 truncate block">{scholarship.contactSupport}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Required Document Checklist</h4>
                  <p className="text-xs text-slate-500">Collect and verify these before applying on the official portal.</p>
                </div>
                {onPrepareDocuments && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPrepareDocuments(scholarship)}
                    leftIcon={<CheckSquare className="w-3.5 h-3.5" />}
                  >
                    Open Document Checklist
                  </Button>
                )}
              </div>

              <div className="space-y-2.5">
                {scholarship.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-slate-200 flex items-start justify-between gap-3 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900">{doc.name}</p>
                          {doc.mandatory ? (
                            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              Mandatory
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                              Optional
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{doc.helpText}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Step-by-Step Official Application Procedure</h4>
              <div className="space-y-3">
                {scholarship.applicationProcedure.map((proc, index) => (
                  <div key={index} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-6 h-6 rounded-lg bg-[#EDE9FE] text-[#3B1FC4] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{proc}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">Important Notice: </span>
                GRANTLY guides your preparation, but official applications must be completed on{' '}
                <a
                  href={scholarship.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-amber-950"
                >
                  {scholarship.source}
                </a>
                . Never pay anyone promising guaranteed scholarship allocation.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleSave && onToggleSave(scholarship.id)}
              leftIcon={<Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600 text-indigo-600' : ''}`} />}
            >
              {isSaved ? 'Saved in List' : 'Save for Later'}
            </Button>
            {onPrepareDocuments && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPrepareDocuments(scholarship)}
                leftIcon={<CheckSquare className="w-4 h-4" />}
              >
                Prepare Documents
              </Button>
            )}
          </div>

          <a
            href={scholarship.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center font-semibold text-sm px-5 py-2.5 rounded-xl gap-2 h-10 bg-[#3B1FC4] hover:bg-[#4F46E5] text-white shadow-soft-sm transition-all whitespace-nowrap"
          >
            <span>Apply on Official Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
