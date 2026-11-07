import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Loader2,
  Bookmark,
  Calendar
} from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore.ts';
import { useScholarshipStore } from '../../store/useScholarshipStore.ts';
import { askGuide, GuideResponse } from '../../services/askGuide.ts';
import { Scholarship } from '../../data/mockScholarships.ts';
import { ScholarshipDetailModal } from '../../components/scholarship/ScholarshipDetailModal.tsx';

interface ChatMessage {
  id: string;
  sender: 'user' | 'guide';
  text: string;
  timestamp: string;
  cards?: Scholarship[];
  actionLink?: string;
  actionText?: string;
}

export const GrantlyGuidePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');
  const navigate = useNavigate();

  const { profile } = useProfileStore();
  const { scholarships, savedScholarshipIds, toggleSaveScholarship } = useScholarshipStore();

  const [input, setInput] = useState(initialQuery || '');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'guide',
      text: `Hello ${profile?.name?.split(' ')[0] || 'there'}! 👋 I am **Grantly Guide**, your verified scholarship assistant. I can help you check eligibility rules, understand document requirements, and navigate government portals with zero guesswork.\n\nHow can I help you today?`,
      timestamp: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // If URL has a query (?q=...), trigger ask automatically
  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await askGuide(textToSend, profile, scholarships);
      const guideMsg: ChatMessage = {
        id: `guide-${Date.now()}`,
        sender: 'guide',
        text: response.text,
        timestamp: 'Just now',
        cards: response.suggestedCards,
        actionLink: response.actionLink,
        actionText: response.actionText
      };
      setMessages((prev) => [...prev, guideMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'guide',
          text: "I couldn't fetch verified records right now. Please try asking again.",
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const samplePrompts = [
    'Which scholarships fit my profile?',
    'What documents do I need?',
    'How to apply for a government scholarship?',
    'What scholarships exist for Uttarakhand students?'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-200/80 shadow-soft-sm overflow-hidden">
      {/* Top Banner */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#3B1FC4] shadow-xs">
            <Bot className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">Grantly Guide</h3>
              <span className="px-1.5 py-0.2 rounded-md bg-[#EDE9FE] text-[#3B1FC4] text-[10px] font-black uppercase">
                AI Assistant
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Deterministic answers grounded in official guidelines and your profile
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Hallucination-Proof</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-5 text-left">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser ? 'bg-[#3B1FC4] text-white' : 'bg-[#EDE9FE] text-[#3B1FC4]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-xl space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#3B1FC4] text-white rounded-tr-xs'
                      : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-xs whitespace-pre-line'
                  }`}
                >
                  {m.text}
                </div>

                {/* Inline Cards if attached */}
                {m.cards && m.cards.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {m.cards.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedScholarship(s)}
                        className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-soft-xs hover:shadow-soft-sm transition-all cursor-pointer text-left space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base">{s.logo || '🎓'}</span>
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                            {s.type}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-xs line-clamp-1">{s.name}</h5>
                        <p className="font-extrabold text-[#3B1FC4] text-xs tabular-nums">{s.amountText}</p>
                        <span className="text-[10px] text-slate-400 block">Deadline: {s.deadline}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Link button */}
                {m.actionLink && m.actionText && (
                  <button
                    onClick={() => navigate(m.actionLink!)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-[#3B1FC4] hover:bg-indigo-100 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>{m.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EDE9FE] text-[#3B1FC4] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl rounded-tl-xs text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3B1FC4]" />
              <span>Checking verified guidelines...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts strip */}
      <div className="px-6 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">Suggested:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#3B1FC4] hover:border-indigo-300 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-slate-100 flex items-center gap-3 bg-white"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about scholarships, eligibility criteria, or documents..."
          className="flex-1 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-3 rounded-2xl bg-linear-to-r from-[#4F46E5] to-[#7C5CF0] hover:from-[#4338CA] hover:to-[#6D28D9] text-white disabled:opacity-40 transition-all cursor-pointer shadow-soft-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Scholarship Details Modal */}
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
