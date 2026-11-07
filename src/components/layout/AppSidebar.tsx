import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  GraduationCap,
  ArrowRight,
  Trophy
} from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore.ts';

interface AppSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  className = '',
  onNavigate
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { completenessPercentage, profile, isAuthenticated } = useProfileStore();

  const mainNav = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Explore Scholarships', path: '/explore-scholarships', icon: <Compass className="w-5 h-5" /> },
    { label: 'My Matches', path: '/matches', icon: <Sparkles className="w-5 h-5" /> },
    { label: 'Saved Scholarships', path: '/saved', icon: <Bookmark className="w-5 h-5" /> },
    { label: 'My Applications', path: '/applications', icon: <Layers className="w-5 h-5" /> },
    { label: 'Deadlines', path: '/deadlines', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Documents', path: '/documents', icon: <FolderClosed className="w-5 h-5" /> },
    {
      label: 'Grantly Guide',
      path: '/guide',
      icon: <MessageSquare className="w-5 h-5" />,
      badge: 'AI'
    }
  ];

  const bottomNav = [
    { label: 'My Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> }
  ];

  const isCurrentActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/' || location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`w-[240px] bg-linear-to-b from-[#2E1A6B] to-[#4C2FB8] text-white flex flex-col justify-between shrink-0 h-screen sticky top-0 p-4 shadow-soft-lg z-30 select-none overflow-y-auto no-scrollbar ${className}`}
    >
      <div>
        {/* Brand Header */}
        <div
          onClick={() => {
            navigate('/dashboard');
            onNavigate?.();
          }}
          className="flex items-center gap-3 px-2 py-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 stroke-[2.4]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wider text-white leading-none">
              GRANTLY
            </span>
            <span className="mt-1 text-[9px] font-medium leading-tight text-violet-200">Scholarship Discovery &<br/>Management Platform</span>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="mt-6 space-y-1">
          {mainNav.map((item) => {
            const active = isCurrentActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 relative group ${
                  active
                    ? 'bg-[#6345D8] text-white shadow-soft-sm shadow-purple-950/20 font-bold'
                    : 'text-purple-100/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${active ? 'text-white' : 'text-purple-200 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-md bg-[#EDE9FE] text-[#3B1FC4] text-[10px] font-extrabold uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-4 border-t border-white/15 mx-1" />

        {/* Secondary Nav */}
        <nav className="space-y-1">
          {bottomNav.map((item) => {
            const active = isCurrentActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                  active
                    ? 'bg-[#6345D8] text-white font-bold'
                    : 'text-purple-100/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className={`${active ? 'text-white' : 'text-purple-200'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Card: "Unlock More Opportunities" */}
      <div className="mt-6 pt-2">
        <div className="rounded-2xl bg-white/12 backdrop-blur-md p-4 border border-white/15 text-white shadow-soft-sm relative overflow-hidden">
          {/* Trophy Illustration */}
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-400/25 flex items-center justify-center text-amber-300">
              <Trophy className="w-6 h-6" />
            </div>
          </div>

          <h4 className="text-sm font-bold text-white leading-tight">
            {isAuthenticated ? 'Unlock More Opportunities' : 'Unlock Your Scholarships'}
          </h4>
          <p className="text-[11px] text-purple-200/90 mt-1 leading-snug">
            {isAuthenticated
              ? 'Complete your profile to get better matches.'
              : 'Log in or register to calculate 100% accurate eligibility.'}
          </p>

          {/* Completeness Bar (shown when logged in) */}
          {isAuthenticated && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-black/25 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-linear-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completenessPercentage}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-white tabular-nums">
                {completenessPercentage}%
              </span>
            </div>
          )}

          {/* White Pill Button */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                navigate('/profile');
              } else {
                navigate('/auth');
              }
              onNavigate?.();
            }}
            className="mt-3 w-full py-2 px-3 rounded-full bg-white hover:bg-slate-100 text-[#3B1FC4] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-98"
          >
            <span>{isAuthenticated ? 'Complete Now' : 'Log In / Register'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
