import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, Menu, X, Sparkles, User, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button.tsx';

interface NavbarProps {
  currentUser?: { name: string; role: 'student' | 'admin' } | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    { label: 'How it Works', path: '/how-it-works' },
    { label: 'About', path: '/about' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-slate-900 group select-none whitespace-nowrap shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#3B1FC4] shadow-soft-sm group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              GRANTLY
            </span>
            <span className="text-[10px] font-semibold text-indigo-600 tracking-wider uppercase -mt-1 hidden sm:block">
              Scholarships India
            </span>
          </div>
        </Link>

        {/* Zone 2: 4 nav links */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-semibold">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full transition-all whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#EDE9FE] text-[#3B1FC4] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: CTA Actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<LayoutDashboard className="w-4 h-4" />}
                >
                  {currentUser.role === 'admin' ? 'Admin Portal' : 'My Dashboard'}
                </Button>
              </Link>
              {onLogout && (
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-5 border-[#4F46E5] text-[#3B1FC4]"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-full px-5 bg-[#3B1FC4] hover:bg-[#4F46E5]"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu hamburger toggle */}
        <div className="flex md:hidden items-center gap-2">
          {currentUser && (
            <Link to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}>
              <button className="p-2 text-indigo-700 bg-indigo-50 rounded-xl" aria-label="Go to Dashboard">
                <User className="w-5 h-5" />
              </button>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-soft-md animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active ? 'bg-[#EDE9FE] text-[#3B1FC4]' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <Button
                variant="primary"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(currentUser.role === 'admin' ? '/admin' : '/dashboard');
                }}
                leftIcon={<LayoutDashboard className="w-4 h-4" />}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
