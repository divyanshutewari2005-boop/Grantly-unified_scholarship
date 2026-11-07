import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  Languages,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Menu,
  ShieldCheck,
  LogOut,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore.ts';
import { useNotificationStore } from '../../store/useNotificationStore.ts';
import { useSettingsStore } from '../../store/useSettingsStore.ts';
import { Avatar } from '../ui/Avatar.tsx';
import { LoginModal } from '../auth/LoginModal.tsx';
import { RegisterModal } from '../auth/RegisterModal.tsx';

interface AppTopbarProps {
  onOpenCommandPalette: () => void;
  onToggleMobileSidebar?: () => void;
}

export const AppTopbar: React.FC<AppTopbarProps> = ({
  onOpenCommandPalette,
  onToggleMobileSidebar
}) => {
  const navigate = useNavigate();
  const { profile, resetProfile, logout, isAuthenticated } = useProfileStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const { language, setLanguage } = useSettingsStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = profile?.name ? profile.name.split(' ')[0] : 'Student';

  return (
    <header className="h-[72px] bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Mobile hamburger & time-aware greeting */}
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            {profile?.name ? (
              <>
                <span>{getGreeting()}, {displayName}</span>
                <span className="text-xl">👋</span>
              </>
            ) : (
              <>
                <span>Welcome to GRANTLY</span>
                <span className="text-xl">🎓</span>
              </>
            )}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {profile?.name
              ? "Here's your scholarship journey at a glance."
              : "Discover & manage verified scholarships across India."}
          </p>
        </div>
      </div>

      {/* Center-Right: Search pill & Ctrl+K */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-3 w-72 lg:w-96 px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200/90 text-slate-400 text-xs hover:border-indigo-300 hover:bg-white transition-all shadow-xs cursor-pointer group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
          <span className="flex-1 text-left truncate">Search scholarships, schemes or providers...</span>
          <kbd className="px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-600 text-[10px] font-bold font-mono">
            Ctrl K
          </kbd>
        </button>

        {/* Search icon button on mobile */}
        <button
          onClick={onOpenCommandPalette}
          className="md:hidden p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Conditional Header Controls: Before Login vs After Login */}
        {!isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200/90 hover:border-indigo-300 hover:bg-slate-50 text-slate-700 hover:text-[#3B1FC4] text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-500" />
              <span>Log In</span>
            </button>

            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-linear-to-r from-[#4F46E5] to-[#7C5CF0] hover:from-[#4338CA] hover:to-[#6D28D9] text-white text-xs font-bold shadow-soft-xs hover:shadow-soft-sm transition-all cursor-pointer active:scale-98"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Get Started</span>
            </button>
          </div>
        ) : (
          /* THIS SHOWS ONLY WHEN A PERSON LOGS IN */
          <>
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse" />
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-soft-lg border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                      <span className="text-[11px] text-slate-400">
                        {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-[#3B1FC4] hover:underline font-semibold cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications right now
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            if (n.actionRoute) {
                              navigate(n.actionRoute);
                              setIsNotifOpen(false);
                            }
                          }}
                          className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 text-left ${
                            !n.isRead ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {n.type === 'deadline_3d' || n.type === 'deadline_1d' ? (
                              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                                <Clock className="w-4 h-4" />
                              </div>
                            ) : n.type === 'new_match' ? (
                              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-xs font-bold leading-tight ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                                {n.title}
                              </p>
                              {!n.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                              {n.message}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {n.timestamp}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar with Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer group"
              >
                <Avatar name={profile?.name || 'Student'} size="sm" />
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform" />
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900 truncate">{profile?.name || 'Student Account'}</p>
                    <p className="text-slate-400 text-[11px] truncate">{profile?.course || 'Registered Student'}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile & Matching</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate('/settings');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-medium"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Settings & Preferences</span>
                    </button>

                    <button
                      onClick={() => {
                        const newLang = language === 'en' ? 'hi' : 'en';
                        setLanguage(newLang);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer font-medium"
                    >
                      <span className="flex items-center gap-2.5">
                        <Languages className="w-4 h-4 text-slate-400" />
                        <span>Language</span>
                      </span>
                      <span className="font-bold text-[#3B1FC4] uppercase text-[10px] bg-[#EDE9FE] px-1.5 py-0.5 rounded">
                        {language === 'en' ? 'English' : 'हिंदी'}
                      </span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 space-y-0.5">
                    <button
                      onClick={() => {
                        resetProfile();
                        setIsUserMenuOpen(false);
                        navigate('/onboarding');
                      }}
                      className="w-full px-4 py-2 text-left text-slate-600 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-medium"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-400" />
                      <span>Re-run Onboarding</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer font-medium"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Login & Register Modals accessible before login */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </header>
  );
};
