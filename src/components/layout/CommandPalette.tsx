import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Bookmark,
  Layers,
  Calendar,
  FolderClosed,
  MessageSquare,
  User,
  Settings,
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { MOCK_SCHOLARSHIPS } from '../../data/mockScholarships.ts';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-soft-lg border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[75vh]">
        <Command className="w-full flex flex-col">
          {/* Input Header */}
          <div className="flex items-center px-4 border-b border-slate-100">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Type a command, page name, or search scholarships..."
              className="w-full py-4 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
            <kbd className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-500">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <Command.List className="p-2 overflow-y-auto max-h-96 divide-y divide-slate-100 text-xs">
            <Command.Empty className="p-6 text-center text-slate-400">
              No results found.
            </Command.Empty>

            {/* Navigation Group */}
            <Command.Group heading="Navigation" className="py-1 text-slate-400 font-bold uppercase tracking-wider text-[10px] px-2">
              <Command.Item
                onSelect={() => handleSelect('/dashboard')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EDE9FE] hover:text-[#3B1FC4] text-slate-700 font-medium cursor-pointer transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/explore-scholarships')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EDE9FE] hover:text-[#3B1FC4] text-slate-700 font-medium cursor-pointer transition-colors"
              >
                <Compass className="w-4 h-4 text-slate-400" />
                <span>Explore Scholarships</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/matches')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EDE9FE] hover:text-[#3B1FC4] text-slate-700 font-medium cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4 text-slate-400" />
                <span>My Matches (Eligible & Needs Verification)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/saved')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EDE9FE] hover:text-[#3B1FC4] text-slate-700 font-medium cursor-pointer transition-colors"
              >
                <Bookmark className="w-4 h-4 text-slate-400" />
                <span>Saved Scholarships</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/applications')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EDE9FE] hover:text-[#3B1FC4] text-slate-700 font-medium cursor-pointer transition-colors"
              >
                <Layers className="w-4 h-4 text-slate-400" />
                <span>My Applications (Kanban Tracker)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/deadlines')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EDE9FE] hover:text-[#3B1FC4] text-slate-700 font-medium cursor-pointer transition-colors"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Upcoming Deadlines Calendar</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/documents')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EDE9FE] hover:text-[#3B1FC4] text-slate-700 font-medium cursor-pointer transition-colors"
              >
                <FolderClosed className="w-4 h-4 text-slate-400" />
                <span>Document Readiness Checklist</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/guide')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EDE9FE] hover:text-[#3B1FC4] text-slate-700 font-medium cursor-pointer transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>Grantly Guide (AI Assistant)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/profile')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EDE9FE] hover:text-[#3B1FC4] text-slate-700 font-medium cursor-pointer transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Student Profile & Matching Rules</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/settings')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EDE9FE] hover:text-[#3B1FC4] text-slate-700 font-medium cursor-pointer transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings & Preferences</span>
              </Command.Item>
            </Command.Group>

            {/* Quick Scholarships Group */}
            <Command.Group heading="Top Verified Schemes" className="py-1 text-slate-400 font-bold uppercase tracking-wider text-[10px] px-2">
              {MOCK_SCHOLARSHIPS.slice(0, 5).map((s) => (
                <Command.Item
                  key={s.id}
                  onSelect={() => handleSelect(`/explore-scholarships?highlight=${s.id}`)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#EDE9FE] hover:text-[#3B1FC4] text-slate-700 font-medium cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base">{s.logo}</span>
                    <span className="font-semibold text-slate-800 truncate">{s.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 tabular-nums shrink-0 ml-2">
                    {s.amountText}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
