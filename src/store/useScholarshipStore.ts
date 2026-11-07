import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Scholarship, MOCK_SCHOLARSHIPS } from '../data/mockScholarships.ts';

interface ScholarshipState {
  scholarships: Scholarship[];
  savedScholarshipIds: string[];
  searchQuery: string;
  selectedType: string;
  selectedState: string;
  selectedLevel: string;
  sortBy: 'relevance' | 'deadline' | 'amount_high' | 'amount_low';
  viewMode: 'grid' | 'list';
  
  setScholarships: (scholarships: Scholarship[]) => void;
  toggleSaveScholarship: (id: string) => boolean;
  isSaved: (id: string) => boolean;
  setSearchQuery: (q: string) => void;
  setSelectedType: (type: string) => void;
  setSelectedState: (state: string) => void;
  setSelectedLevel: (level: string) => void;
  setSortBy: (sort: 'relevance' | 'deadline' | 'amount_high' | 'amount_low') => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  resetFilters: () => void;
  addScholarship: (scholarship: Scholarship) => void;
  updateScholarship: (id: string, partial: Partial<Scholarship>) => void;
  deleteScholarship: (id: string) => void;
}

export const useScholarshipStore = create<ScholarshipState>()(
  persist(
    (set, get) => ({
      scholarships: MOCK_SCHOLARSHIPS,
      savedScholarshipIds: [],
      searchQuery: '',
      selectedType: 'All',
      selectedState: 'All',
      selectedLevel: 'All',
      sortBy: 'relevance',
      viewMode: 'grid',

      setScholarships: (scholarships) => set({ scholarships }),

      toggleSaveScholarship: (id) => {
        const current = get().savedScholarshipIds;
        const exists = current.includes(id);
        const updated = exists ? current.filter((item) => item !== id) : [...current, id];
        set({ savedScholarshipIds: updated });
        return !exists;
      },

      isSaved: (id) => get().savedScholarshipIds.includes(id),

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedType: (selectedType) => set({ selectedType }),
      setSelectedState: (selectedState) => set({ selectedState }),
      setSelectedLevel: (selectedLevel) => set({ selectedLevel }),
      setSortBy: (sortBy) => set({ sortBy }),
      setViewMode: (viewMode) => set({ viewMode }),

      resetFilters: () =>
        set({
          searchQuery: '',
          selectedType: 'All',
          selectedState: 'All',
          selectedLevel: 'All',
          sortBy: 'relevance'
        }),

      addScholarship: (scholarship) => {
        set((state) => ({
          scholarships: [scholarship, ...state.scholarships]
        }));
      },

      updateScholarship: (id, partial) => {
        set((state) => ({
          scholarships: state.scholarships.map((s) =>
            s.id === id ? { ...s, ...partial } : s
          )
        }));
      },

      deleteScholarship: (id) => {
        set((state) => ({
          scholarships: state.scholarships.filter((s) => s.id !== id),
          savedScholarshipIds: state.savedScholarshipIds.filter((item) => item !== id)
        }));
      }
    }),
    {
      name: 'grantly_clean_scholarships_v4'
    }
  )
);
