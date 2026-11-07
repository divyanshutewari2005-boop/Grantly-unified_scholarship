import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  Building2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  List,
  LayoutGrid
} from 'lucide-react';
import { useScholarshipStore } from '../../store/useScholarshipStore.ts';
import { DeadlineChip } from '../../components/ui/DeadlineChip.tsx';
import { differenceInCalendarDays, parseISO, isValid, format } from 'date-fns';

export const DeadlinesPage: React.FC = () => {
  const { scholarships } = useScholarshipStore();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const today = new Date();

  const deadlinesList = scholarships
    .map((s) => {
      let daysLeft = 0;
      try {
        const d = parseISO(s.deadline);
        if (isValid(d)) {
          daysLeft = differenceInCalendarDays(d, today);
        }
      } catch {
        daysLeft = 0;
      }
      return {
        scholarship: s,
        daysLeft
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const generateGoogleCalendarUrl = (name: string, deadlineStr: string) => {
    try {
      const cleanDate = deadlineStr.replace(/-/g, '');
      const title = encodeURIComponent(`Scholarship Deadline: ${name}`);
      const details = encodeURIComponent(`Final deadline to submit application on official scholarship portal.`);
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${cleanDate}/${cleanDate}&details=${details}`;
    } catch {
      return '#';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Scholarship Deadlines
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Never scramble on closing day. Proactive countdowns and reminders for all verified schemes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-[#EDE9FE] text-[#3B1FC4]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'calendar' ? 'bg-[#EDE9FE] text-[#3B1FC4]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Urgency Legend Strip */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs text-xs">
        <span className="font-bold text-slate-800">Urgency Key:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-slate-600 font-medium">Critical (≤ 3 days)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-600 font-medium">Closing Soon (≤ 7 days)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          <span className="text-slate-600 font-medium">Open / Normal</span>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-3">
          {deadlinesList.map(({ scholarship: s, daysLeft }) => (
            <div
              key={s.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft-sm hover:shadow-soft-md ${
                daysLeft <= 3 && daysLeft >= 0
                  ? 'border-rose-300 bg-rose-50/20'
                  : daysLeft <= 7 && daysLeft >= 0
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200/80'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{s.logo || '🎓'}</span>
                  <span className="px-2 py-0.2 rounded-md bg-[#EDE9FE] text-[#3B1FC4] text-[10px] font-bold">
                    {s.type}
                  </span>
                  <DeadlineChip daysLeft={daysLeft} />
                </div>

                <h4 className="text-base font-bold text-slate-900">{s.name}</h4>
                <p className="text-xs text-slate-500">{s.provider}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 block font-medium">Closing Date</span>
                  <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                    {s.deadline}
                  </span>
                  <span className="text-xs font-bold text-[#3B1FC4] block tabular-nums">
                    {s.amountText}
                  </span>
                </div>

                <a
                  href={generateGoogleCalendarUrl(s.name, s.deadline)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 text-xs font-semibold text-slate-700 hover:text-[#3B1FC4] flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Add to Calendar</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Month Calendar View */
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              {format(today, 'MMMM yyyy')} Calendar
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Highlighted deadlines for current cycle
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="font-bold text-slate-400 py-2">
                {d}
              </div>
            ))}

            {Array.from({ length: 31 }).map((_, i) => {
              const dayNum = i + 1;
              const hasDeadline = deadlinesList.find((d) => {
                const parts = d.scholarship.deadline.split('-');
                return parts.length === 3 && Number(parts[2]) === dayNum;
              });

              return (
                <div
                  key={i}
                  className={`min-h-[70px] p-2 rounded-xl border transition-all text-left flex flex-col justify-between ${
                    hasDeadline
                      ? hasDeadline.daysLeft <= 3
                        ? 'border-rose-300 bg-rose-50/60 font-bold'
                        : 'border-indigo-300 bg-indigo-50/50'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-700">{dayNum}</span>
                  {hasDeadline && (
                    <span className="text-[10px] text-[#3B1FC4] font-bold line-clamp-1 leading-tight">
                      {hasDeadline.scholarship.shortName}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
