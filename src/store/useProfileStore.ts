import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StudentProfile } from '../lib/engine/matchingEngine.ts';

interface ProfileState {
  profile: StudentProfile | null;
  isAuthenticated: boolean;
  isSetupComplete: boolean;
  completenessPercentage: number;
  userEmail: string | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  setProfile: (profile: StudentProfile) => void;
  updateProfile: (partial: Partial<StudentProfile>) => void;
  completeSetup: () => void;
  resetProfile: () => void;
}

export const DEFAULT_DEMO_STUDENT: StudentProfile = {
  name: "Student",
  dob: "2005-01-01",
  gender: "Male",
  state: "Delhi",
  domicileCertificateNumber: "",
  educationLevel: "Undergraduate (UG)",
  course: "Higher Education Degree",
  courseType: "Technical",
  institution: "College / University",
  institutionType: "Government",
  academicYear: "1st Year",
  percentage: 75,
  board: "CBSE",
  annualIncome: 250000,
  hasIncomeCertificate: false,
  category: "General",
  disabilityStatus: false,
  preferredTypes: ["Government", "State", "Private"],
  language: "en"
};

export function calculateProfileCompleteness(p: Partial<StudentProfile> | null): number {
  if (!p) return 0;
  const fields: (keyof StudentProfile)[] = [
    'name',
    'dob',
    'gender',
    'state',
    'educationLevel',
    'course',
    'percentage',
    'annualIncome',
    'hasIncomeCertificate',
    'category'
  ];
  let filled = 0;
  for (const f of fields) {
    if (p[f] !== undefined && p[f] !== null && p[f] !== '' && p[f] !== 'Student') {
      filled++;
    }
  }
  return Math.min(100, Math.round((filled / fields.length) * 100));
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      // Fresh clean website: no pre-data
      profile: null,
      isAuthenticated: false,
      isSetupComplete: false,
      completenessPercentage: 0,
      userEmail: null,

      login: (email, name = 'Student') => {
        set((state) => ({
          isAuthenticated: true,
          isSetupComplete: true,
          userEmail: email,
          profile: state.profile || { ...DEFAULT_DEMO_STUDENT, name }
        }));
      },

      logout: () => {
        set({
          isAuthenticated: false,
          isSetupComplete: false,
          profile: null,
          completenessPercentage: 0,
          userEmail: null
        });
      },

      setProfile: (profile) => {
        const pct = calculateProfileCompleteness(profile);
        set({
          profile,
          isAuthenticated: true,
          isSetupComplete: true,
          completenessPercentage: pct
        });
      },

      updateProfile: (partial) => {
        const current = get().profile || DEFAULT_DEMO_STUDENT;
        const updated = { ...current, ...partial };
        const pct = calculateProfileCompleteness(updated);
        set({ profile: updated, completenessPercentage: pct });
      },

      completeSetup: () => {
        set({
          isSetupComplete: true,
          isAuthenticated: true
        });
      },

      resetProfile: () => {
        set({
          profile: null,
          isAuthenticated: false,
          isSetupComplete: false,
          completenessPercentage: 0,
          userEmail: null
        });
      }
    }),
    {
      name: 'grantly_clean_profile_v4'
    }
  )
);
