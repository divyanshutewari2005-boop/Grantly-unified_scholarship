import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  language: 'en' | 'hi';
  theme: 'light' | 'dark';
  notifyOnlyEligible: boolean;
  emailDigest: boolean;
  deadlineAlerts: boolean;
  quietHours: boolean;
  adminModeUnlocked: boolean;

  setLanguage: (lang: 'en' | 'hi') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setNotifyOnlyEligible: (val: boolean) => void;
  setEmailDigest: (val: boolean) => void;
  setDeadlineAlerts: (val: boolean) => void;
  setQuietHours: (val: boolean) => void;
  setAdminModeUnlocked: (val: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'light',
      notifyOnlyEligible: true,
      emailDigest: true,
      deadlineAlerts: true,
      quietHours: false,
      adminModeUnlocked: true,

      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setNotifyOnlyEligible: (notifyOnlyEligible) => set({ notifyOnlyEligible }),
      setEmailDigest: (emailDigest) => set({ emailDigest }),
      setDeadlineAlerts: (deadlineAlerts) => set({ deadlineAlerts }),
      setQuietHours: (quietHours) => set({ quietHours }),
      setAdminModeUnlocked: (adminModeUnlocked) => set({ adminModeUnlocked })
    }),
    {
      name: 'grantly_settings_storage'
    }
  )
);
