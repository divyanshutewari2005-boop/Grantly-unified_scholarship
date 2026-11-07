import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, ArrowRight, Calendar, Check, FileText } from 'lucide-react';
import { DeadlineChip } from '../ui/DeadlineChip.tsx';

interface AppRightRailProps {
  className?: string;
}

export const AppRightRail: React.FC<AppRightRailProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  const quickQuestions = [
    'Which scholarships fit my profile?',
    'What documents do I need?',
    'How to apply for a government scholarship?'
  ];

  const upcomingDeadlines = [
    { id: 'csss-moe-2026', name: 'Central Sector Scholarship', daysLeft: 3, tag: 'In 3 days', urgency: 'urgent' as const, iconBg: 'bg-rose-50 text-rose-600' },
    { id: 'uk-merit-2026', name: 'Uttarakhand Merit Scholarship', daysLeft: 7, tag: 'In 7 days', urgency: 'warning' as const, iconBg: 'bg-purple-50 text-purple-600' },
    { id: 'aicte-pragati-2026', name: 'AICTE Pragati Scholarship', daysLeft: 10, tag: 'In 10 days', urgency: 'info' as const, iconBg: 'bg-sky-50 text-sky-600' }
  ];

  return (
    <aside className={`w-full space-y-5 shrink-0 ${className}`}>
      <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-soft-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EDE9FE] text-[#5525df]">
            <Bot className="h-6 w-6" />
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2"><h3 className="text-sm font-extrabold text-slate-900">Grantly Guide</h3><span className="rounded-md bg-[#EDE9FE] px-1.5 py-0.5 text-[9px] font-black text-[#5525df]">AI</span></div>
            <p className="text-[10px] text-slate-500">Your personal scholarship assistant</p>
          </div>
        </div>
        <div className="mb-3 rounded-2xl border border-violet-100 bg-gradient-to-br from-[#f6efff] to-[#eee7ff] p-3 text-[11px] font-medium leading-relaxed text-indigo-950">Ask me anything about scholarships, eligibility, documents or the application process.</div>
        <div className="space-y-2">
          {quickQuestions.map((question) => (
            <button key={question} onClick={() => navigate(`/guide?q=${encodeURIComponent(question)}`)} className="group flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-left text-[10px] font-semibold text-slate-800 transition-all hover:border-violet-300 hover:bg-violet-50/50">
              <span>{question}</span><ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-violet-600" />
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-soft-sm">
        <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-700"/><h3 className="text-sm font-extrabold text-slate-900">Upcoming Deadlines</h3></div>
          <Link to="/deadlines" className="flex items-center gap-1 text-[10px] font-bold text-[#5525df] hover:underline">View All <ArrowRight className="h-3 w-3"/></Link>
        </div>
        <div className="divide-y divide-slate-100">
          {upcomingDeadlines.map((item) => (
            <button key={item.id} onClick={() => navigate(`/explore-scholarships?highlight=${item.id}`)} className="flex w-full items-center justify-between gap-2 rounded-lg py-3 text-left transition-colors hover:bg-slate-50">
              <span className="flex min-w-0 items-center gap-2.5"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}><FileText className="h-4 w-4"/></span><span className="truncate text-[10px] font-bold text-slate-800">{item.name}</span></span>
              <DeadlineChip daysLeft={item.daysLeft} label={item.tag}/>
            </button>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[24px] border border-violet-100 bg-gradient-to-br from-[#f1dcff] via-[#fbf5ff] to-white p-4 shadow-soft-sm">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-300/35 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-[82px] w-[82px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-200 to-fuchsia-100 text-5xl">👩🏻‍🎓</div>
          <div><h3 className="text-sm font-extrabold leading-tight text-[#4b20c9]">Log in or Register</h3><p className="text-xs font-bold text-slate-900">to unlock more features!</p></div>
        </div>
        <ul className="relative mt-4 space-y-2 text-[11px] font-semibold text-slate-700">
          {['Track your applications','Manage documents','Get personalized matches','Receive deadline alerts'].map((item) => <li key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 stroke-[3]"/>{item}</li>)}
        </ul>
        <button onClick={() => navigate('/auth')} className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5525e8] to-[#7d43f5] px-4 py-3 text-xs font-extrabold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5">Login / Get Started <ArrowRight className="h-4 w-4"/></button>
      </section>
    </aside>
  );
};
