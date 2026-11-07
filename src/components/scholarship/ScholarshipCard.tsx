import React from 'react';
import { Bookmark, Calendar, ArrowRight, Building2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Scholarship } from '../../data/scholarships.ts';
import { getDeadlineUrgency, formatIndianDate } from '../../lib/dates.ts';
import { Badge } from '../ui/Badge.tsx';
import { Button } from '../ui/Button.tsx';
import { Card } from '../ui/Card.tsx';

export interface ScholarshipCardProps {
  scholarship: Scholarship;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onViewDetails?: (scholarship: Scholarship) => void;
  eligibilityStatus?: 'Eligible' | 'Needs Verification' | 'Not Eligible';
  eligibilityReason?: string;
  viewMode?: 'grid' | 'list';
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  isSaved = false,
  onToggleSave,
  onViewDetails,
  eligibilityStatus = 'Needs Verification',
  eligibilityReason,
  viewMode = 'grid'
}) => {
  const urgency = getDeadlineUrgency(scholarship.deadline);

  const eligibilityBadge = {
    Eligible: {
      variant: 'success' as const,
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      text: 'Eligible'
    },
    'Needs Verification': {
      variant: 'secondary' as const,
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      text: 'Verify Criteria'
    },
    'Not Eligible': {
      variant: 'neutral' as const,
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      text: 'Criteria Not Met'
    }
  }[eligibilityStatus];

  if (viewMode === 'list') {
    return (
      <Card hoverEffect className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-slate-200/90">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              {scholarship.type}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {scholarship.state}
            </span>
            <span className="text-slate-300">·</span>
            <Badge variant={eligibilityBadge.variant} size="sm" icon={eligibilityBadge.icon}>
              {eligibilityBadge.text}
            </Badge>
          </div>

          <h3 className="text-base font-bold text-slate-900 truncate hover:text-[#3B1FC4] transition-colors">
            {scholarship.name}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{scholarship.provider}</span>
          </div>

          {eligibilityReason && (
            <p className="text-xs text-slate-600 mt-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 line-clamp-1">
              <span className="font-semibold text-slate-700">Reason: </span>
              {eligibilityReason}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="text-left md:text-right">
            <p className="text-xs text-slate-400 font-medium">Grant Value</p>
            <p className="text-base font-extrabold text-[#3B1FC4] tabular-nums">
              {scholarship.amountText}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 justify-start md:justify-end">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formatIndianDate(scholarship.deadline)}</span>
              <span className={`text-[11px] font-semibold ${urgency.isClosingSoon ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                ({urgency.label})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave && onToggleSave(scholarship.id)}
              aria-label={isSaved ? "Remove from saved" : "Save scholarship"}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSaved
                  ? 'bg-indigo-50 border-indigo-200 text-[#3B1FC4]'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails && onViewDetails(scholarship)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View Details
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card hoverEffect className="p-5 flex flex-col justify-between h-full border-slate-200/90 relative group">
      <div>
        {/* Top bar with scheme type and bookmark button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100">
              {scholarship.type}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {scholarship.state}
            </span>
          </div>
          <button
            onClick={() => onToggleSave && onToggleSave(scholarship.id)}
            aria-label={isSaved ? "Remove from saved" : "Save scholarship"}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isSaved
                ? 'bg-indigo-50 border-indigo-200 text-[#3B1FC4]'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails && onViewDetails(scholarship)}
          className="text-base font-bold text-slate-900 group-hover:text-[#3B1FC4] transition-colors line-clamp-2 cursor-pointer leading-snug"
        >
          {scholarship.name}
        </h3>

        {/* Provider */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2 mb-3">
          <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{scholarship.provider}</span>
        </div>

        {/* Eligibility tag */}
        <div className="mb-4">
          <Badge variant={eligibilityBadge.variant} size="sm" icon={eligibilityBadge.icon}>
            {eligibilityBadge.text}
          </Badge>
          {eligibilityReason && (
            <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
              {eligibilityReason}
            </p>
          )}
        </div>
      </div>

      {/* Card bottom: amount, deadline, and action */}
      <div className="pt-3 border-t border-slate-100/90 mt-2">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <p className="text-[11px] font-medium text-slate-400">Award Amount</p>
            <p className="text-base font-extrabold text-[#3B1FC4] tracking-tight tabular-nums">
              {scholarship.amountText}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium text-slate-400">Deadline</p>
            <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold justify-end">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span className={urgency.isClosingSoon ? 'text-rose-600 font-bold' : ''}>
                {formatIndianDate(scholarship.deadline)}
              </span>
            </div>
            <p className={`text-[10px] font-semibold ${urgency.isClosingSoon ? 'text-rose-600' : 'text-slate-400'}`}>
              {urgency.label}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="w-full justify-between"
          onClick={() => onViewDetails && onViewDetails(scholarship)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Check Eligibility & Apply
        </Button>
      </div>
    </Card>
  );
};
