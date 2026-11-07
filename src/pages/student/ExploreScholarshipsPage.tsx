import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Building2,
  ArrowRight,
  Bookmark,
  Layers,
  LayoutGrid,
  List
} from 'lucide-react';
import { useScholarshipStore } from '../../store/useScholarshipStore.ts';
import { useProfileStore } from '../../store/useProfileStore.ts';
import { useDocumentStore } from '../../store/useDocumentStore.ts';
import { evaluateScholarship } from '../../lib/engine/matchingEngine.ts';
import { STATES_AND_UTS, EDUCATION_LEVELS } from '../../lib/constants.ts';
import { ScholarshipDetailModal } from '../../components/scholarship/ScholarshipDetailModal.tsx';
import { Scholarship } from '../../data/mockScholarships.ts';
import { Select } from '../../components/ui/Select.tsx';
import { Input } from '../../components/ui/Input.tsx';

export const ExploreScholarshipsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const {
    scholarships,
    savedScholarshipIds,
    toggleSaveScholarship,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedState,
    setSelectedState,
    selectedLevel,
    setSelectedLevel,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    resetFilters
  } = useScholarshipStore();

  const { profile } = useProfileStore();
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  // If a highlight query exists, open detail modal automatically
  React.useEffect(() => {
    if (highlightId) {
      const match = scholarships.find((s) => s.id === highlightId);
      if (match) {
        setSelectedScholarship(match);
      }
    }
  }, [highlightId, scholarships]);

  const filtered = useMemo(() => {
    let list = [...scholarships];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.state.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.level.some((l) => l.toLowerCase().includes(q))
      );
    }

    if (selectedType !== 'All') {
      list = list.filter((s) => s.type === selectedType);
    }

    if (selectedState !== 'All') {
      list = list.filter((s) => s.state === 'All India' || s.state === selectedState);
    }

    if (selectedLevel !== 'All') {
      list = list.filter((s) => s.level.includes(selectedLevel));
    }

    if (sortBy === 'deadline') {
      list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sortBy === 'amount_high') {
      list.sort((a, b) => b.annualAmount - a.annualAmount);
    } else if (sortBy === 'amount_low') {
      list.sort((a, b) => a.annualAmount - b.annualAmount);
    }

    return list;
  }, [scholarships, searchQuery, selectedType, selectedState, selectedLevel, sortBy]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Explore Scholarships
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse {scholarships.length} verified Central, State, and Corporate CSR opportunities across India.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid / List toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#EDE9FE] text-[#3B1FC4]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-[#EDE9FE] text-[#3B1FC4]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar & Sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-soft-sm">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="Search by scholarship, course, state, provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort by:</span>
          <div className="w-44">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              options={[
                { value: 'relevance', label: 'Relevance' },
                { value: 'deadline', label: 'Earliest Deadline' },
                { value: 'amount_high', label: 'Highest Amount' },
                { value: 'amount_low', label: 'Lowest Amount' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Filter Sidebar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft-sm space-y-5 sticky top-24">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 font-extrabold text-xs text-slate-800 uppercase tracking-wider">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#3B1FC4]" />
              <span>Filter Results</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-[#3B1FC4] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Opportunity Type</label>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              options={['All', 'Government', 'State', 'Private', 'PSU']}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">State / Domicile</label>
            <Select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              options={['All', ...STATES_AND_UTS]}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Education Level</label>
            <Select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              options={['All', ...EDUCATION_LEVELS]}
            />
          </div>

          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-[11px] text-purple-900 leading-relaxed">
            <span className="font-bold">Matching Guarantee: </span>
            Even if a scholarship is outside your current criteria, you can inspect full rules and requirements.
          </div>
        </div>

        {/* List of Scholarships */}
        <div className="lg:col-span-3 space-y-4">
          <div className="text-xs font-bold text-slate-500">
            Showing <span className="text-slate-900 font-extrabold tabular-nums">{filtered.length}</span> scholarships
          </div>

          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
            {filtered.map((s) => {
              const evalRes = evaluateScholarship(profile, s);
              const isSaved = savedScholarshipIds.includes(s.id);
              const isEligible = evalRes.status === 'Eligible';

              return (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{s.logo || '🎓'}</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#3B1FC4] text-[10px] font-bold">
                          {s.type}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {s.state}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleSaveScholarship(s.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-indigo-50 border-indigo-200 text-[#3B1FC4]'
                            : 'border-slate-200 text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <h4
                      onClick={() => setSelectedScholarship(s)}
                      className="text-base font-bold text-slate-900 hover:text-[#3B1FC4] transition-colors cursor-pointer line-clamp-1"
                    >
                      {s.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{s.provider}</p>

                    <div className="mt-3">
                      <span className="text-lg font-extrabold text-[#3B1FC4] tabular-nums">
                        {s.amountText}
                      </span>
                    </div>

                    <div className="mt-2 mb-3">
                      {isEligible ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Eligible</span>
                        </span>
                      ) : evalRes.status === 'Needs Verification' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/70">
                          <span>Verify Criteria</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          <span>Criteria Not Met</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">
                      <span>Deadline: </span>
                      <span className="font-semibold text-slate-700">{s.deadline}</span>
                    </div>

                    <button
                      onClick={() => setSelectedScholarship(s)}
                      className="px-4 py-2 rounded-xl bg-linear-to-r from-[#4F46E5] to-[#7C5CF0] text-white text-xs font-bold transition-all shadow-soft-xs flex items-center gap-1 cursor-pointer active:scale-98"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scholarship Details Modal */}
      <ScholarshipDetailModal
        scholarship={selectedScholarship as any}
        isOpen={!!selectedScholarship}
        onClose={() => setSelectedScholarship(null)}
        profile={profile}
        isSaved={selectedScholarship ? savedScholarshipIds.includes(selectedScholarship.id) : false}
        onToggleSave={(id) => toggleSaveScholarship(id)}
      />
    </div>
  );
};
