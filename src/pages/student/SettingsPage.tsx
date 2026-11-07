import React from 'react';
import {
  Settings,
  Languages,
  Bell,
  Moon,
  Sun,
  Code,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore.ts';
import { useNotificationStore } from '../../store/useNotificationStore.ts';
import { useScholarshipStore } from '../../store/useScholarshipStore.ts';
import { useProfileStore } from '../../store/useProfileStore.ts';
import { useDocumentStore } from '../../store/useDocumentStore.ts';
import { Switch } from '../../components/ui/Switch.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

export const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const {
    language,
    setLanguage,
    notifyOnlyEligible,
    setNotifyOnlyEligible,
    emailDigest,
    setEmailDigest,
    deadlineAlerts,
    setDeadlineAlerts,
    quietHours,
    setQuietHours,
    adminModeUnlocked,
    setAdminModeUnlocked
  } = useSettingsStore();

  const { addNotification } = useNotificationStore();
  const { addScholarship } = useScholarshipStore();
  const { resetProfile } = useProfileStore();
  const { resetDocuments } = useDocumentStore();

  const handleSimulateNewRelease = () => {
    const id = `new-release-${Date.now()}`;
    const newScheme = {
      id,
      name: "National Merit-cum-Means Post-Doctoral & PG Grant",
      shortName: "National PG Research Grant",
      provider: "Department of Science and Technology, GoI",
      type: "Government" as const,
      level: ["Undergraduate (UG)", "Postgraduate (PG)"],
      courseType: ["Technical", "Science", "B.Tech"],
      state: "All India",
      amountText: "₹65,000 / year",
      annualAmount: 65000,
      deadline: "2026-12-28",
      officialUrl: "https://scholarships.gov.in",
      source: "National Scholarship Portal",
      lastVerified: "2026-11-06",
      verificationStatus: "Verified" as const,
      summary: "Newly published national grant for research and higher education studies.",
      benefits: ["Direct annual stipend of ₹65,000"],
      eligibilityRules: [
        {
          id: "new-r1",
          field: "minPercentage" as const,
          operator: "gte" as const,
          value: 70,
          label: "Minimum 70% in previous exam",
          description: "Merit requirement",
          mandatory: true
        }
      ],
      documents: [
        { id: "doc-aadhaar", name: "Aadhaar Card", mandatory: true, helpText: "Bank seeded" }
      ],
      applicationProcedure: ["Apply online on NSP."],
      contactSupport: "dst-pg@gov.in",
      logo: "🔬",
      isNewRelease: true
    };

    addScholarship(newScheme);
    addNotification({
      type: 'new_match',
      title: 'New Scholarship Released: National PG Research Grant',
      message: 'A newly published government grant of ₹65,000/yr matches your academic criteria!',
      scholarshipId: id,
      actionLabel: 'View Scheme',
      actionRoute: `/explore-scholarships?highlight=${id}`
    });

    toast(
      'New scholarship simulated and published!',
      'success',
      'Matching engine ran and created a high-priority alert in your bell.'
    );
  };

  const handleResetDemoData = () => {
    if (confirm('Reset all demo state to fresh default values?')) {
      resetProfile();
      resetDocuments();
      toast('Demo data reset to default state.', 'info');
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Settings & Preferences
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Customize notifications, simple language mode, and simulation tools.
        </p>
      </div>

      {/* Language Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Languages className="w-4 h-4 text-[#3B1FC4]" />
          <h3 className="text-sm font-extrabold text-slate-900">
            Simple Language Mode (सरल भाषा)
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-700 font-semibold">Display Language</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Government notifications and instructions simplified in English or Hindi.
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-[#3B1FC4] shadow-soft-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-white text-[#3B1FC4] shadow-soft-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी (Hindi)
            </button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Bell className="w-4 h-4 text-[#3B1FC4]" />
          <h3 className="text-sm font-extrabold text-slate-900">
            Notification Rules
          </h3>
        </div>

        <div className="space-y-4">
          <Switch
            checked={notifyOnlyEligible}
            onChange={setNotifyOnlyEligible}
            label="Notify only for 100% Eligible matches"
            description="Mutes notifications for schemes where your profile currently fails mandatory rules."
          />

          <div className="border-t border-slate-100 pt-4">
            <Switch
              checked={deadlineAlerts}
              onChange={setDeadlineAlerts}
              label="Proactive Deadline Alerts (7 days, 3 days, closing day)"
              description="Sends high-priority countdown alerts for bookmarked scholarships."
            />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <Switch
              checked={emailDigest}
              onChange={setEmailDigest}
              label="Weekly Scholarship Digest Email (UI Preview)"
              description="Email delivery will activate when the backend mail worker is deployed."
            />
          </div>
        </div>
      </div>

      {/* Developer & Simulation Tools */}
      <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-soft-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Code className="w-4 h-4 text-[#3B1FC4]" />
          <h3 className="text-sm font-extrabold text-slate-900">
            Developer Simulation Tools
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
            <div>
              <p className="font-bold text-slate-900">Simulate New Scholarship Release</p>
              <p className="text-slate-500 mt-0.5">
                Injects a freshly approved government research scholarship and triggers the matching engine notification flow.
              </p>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSimulateNewRelease}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Simulate Release
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-slate-900">Reset Demo Data to Default</p>
              <p className="text-slate-500 mt-0.5">
                Restores Divyanshu's profile, document states (3/5), and application pipeline (60%).
              </p>
            </div>
            <button
              onClick={handleResetDemoData}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
