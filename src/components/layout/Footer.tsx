import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-white">
              <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#3B1FC4]">
                <GraduationCap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                GRANTLY
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India's student-first scholarship discovery and management platform. One unified student profile matching every verified central, state, and private opportunity.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/60 p-2.5 rounded-xl max-w-sm">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Free · Verified Portals Only · No Data Selling</span>
            </div>
          </div>

          {/* Column 1: Discover */}
          <div className="space-y-3 text-sm">
            <p className="font-bold text-white tracking-wide text-xs uppercase">Discover</p>
            <ul className="space-y-2">
              <li>
                <Link to="/explore?type=Government" className="hover:text-white transition-colors text-slate-400">
                  Central Govt Schemes
                </Link>
              </li>
              <li>
                <Link to="/explore?state=Uttarakhand" className="hover:text-white transition-colors text-slate-400">
                  Uttarakhand State Grants
                </Link>
              </li>
              <li>
                <Link to="/explore?type=Private" className="hover:text-white transition-colors text-slate-400">
                  Private & CSR Foundations
                </Link>
              </li>
              <li>
                <Link to="/explore?level=Undergraduate (UG)" className="hover:text-white transition-colors text-slate-400">
                  Undergraduate (B.Tech, MBBS, B.Sc)
                </Link>
              </li>
              <li>
                <Link to="/explore?level=Postgraduate (PG)" className="hover:text-white transition-colors text-slate-400">
                  Postgraduate & Masters
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3 text-sm">
            <p className="font-bold text-white tracking-wide text-xs uppercase">How It Works</p>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors text-slate-400">
                  4-Step Funding Journey
                </Link>
              </li>
              <li>
                <Link to="/how-it-works#eligibility" className="hover:text-white transition-colors text-slate-400">
                  Explainable Eligibility
                </Link>
              </li>
              <li>
                <Link to="/how-it-works#documents" className="hover:text-white transition-colors text-slate-400">
                  Document Readiness
                </Link>
              </li>
              <li>
                <Link to="/how-it-works#tracker" className="hover:text-white transition-colors text-slate-400">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors text-slate-400">
                  About Our Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals & Trust */}
          <div className="space-y-3 text-sm">
            <p className="font-bold text-white tracking-wide text-xs uppercase">Official Portals</p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a
                  href="https://scholarships.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>National Scholarship Portal (NSP)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ugc.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>UGC Scholarships</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://aicte-india.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>AICTE Pragati & Saksham</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://online-inspire.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>DST INSPIRE Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer / Trust strip */}
        <div className="py-6 border-b border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
          <p className="font-semibold text-slate-300">
            Official Submission Disclaimer:
          </p>
          <p>
            GRANTLY is an independent discovery and application management guide for Indian students. <strong className="text-white">GRANTLY never submits applications on your behalf; you apply on the official portal.</strong> We provide eligibility criteria, document readiness guidance, and direct links to verified government and foundation sites. We do not charge fees, collect bank credentials, or guarantee financial grants.
          </p>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GRANTLY Education Technologies. Designed with precision for Indian scholars.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for students across Bharat
            </span>
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              Privacy & Transparency
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
