import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ApplicationStatus =
  | 'Interested'
  | 'Preparing'
  | 'Applied'
  | 'Under Review'
  | 'Approved'
  | 'Rejected';

export interface ApplicationItem {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  amountText: string;
  annualAmount: number;
  deadline: string;
  status: ApplicationStatus;
  appliedDate?: string;
  referenceNumber?: string;
  portalUrl?: string;
  notes?: string;
  lastUpdated: string;
}

interface ApplicationState {
  applications: ApplicationItem[];
  addApplication: (app: Omit<ApplicationItem, 'id' | 'lastUpdated'>) => void;
  updateStatus: (id: string, status: ApplicationStatus) => void;
  updateApplication: (id: string, partial: Partial<ApplicationItem>) => void;
  deleteApplication: (id: string) => void;
  getCountsByStatus: () => Record<ApplicationStatus, number>;
}

// Fresh clean website state: 0 applications initially
const DEFAULT_APPLICATIONS: ApplicationItem[] = [];

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      applications: DEFAULT_APPLICATIONS,

      addApplication: (app) => {
        const newApp: ApplicationItem = {
          ...app,
          id: `app-${Date.now()}`,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        set((state) => ({ applications: [newApp, ...state.applications] }));
      },

      updateStatus: (id, status) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id
              ? { ...a, status, lastUpdated: new Date().toISOString().split('T')[0] }
              : a
          )
        }));
      },

      updateApplication: (id, partial) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id
              ? { ...a, ...partial, lastUpdated: new Date().toISOString().split('T')[0] }
              : a
          )
        }));
      },

      deleteApplication: (id) => {
        set((state) => ({
          applications: state.applications.filter((a) => a.id !== id)
        }));
      },

      getCountsByStatus: () => {
        const counts: Record<ApplicationStatus, number> = {
          Interested: 0,
          Preparing: 0,
          Applied: 0,
          'Under Review': 0,
          Approved: 0,
          Rejected: 0
        };
        for (const app of get().applications) {
          if (counts[app.status] !== undefined) {
            counts[app.status]++;
          }
        }
        return counts;
      }
    }),
    {
      name: 'grantly_clean_applications_v4'
    }
  )
);
