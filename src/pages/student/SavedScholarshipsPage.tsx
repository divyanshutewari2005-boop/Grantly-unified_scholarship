import React, { useState } from 'react';
import { Bookmark, ArrowRight, Trash2, Calendar, Building2, Search } from 'lucide-react';
import { useScholarshipStore } from '../../store/useScholarshipStore.ts';
import { useProfileStore } from '../../store/useProfileStore.ts';
import { ScholarshipDetailModal } from '../../components/scholarship/ScholarshipDetailModal.tsx';
import { Scholarship } from '../../data/mockScholarships.ts';

export const SavedScholarshipsPage: React.FC = () => {
  const { scholarships, savedScholarshipIds, toggleSaveScholarship } = useScholarshipStore();
  const { profile } = useProfileStore();
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  const savedList = scholarships.filter((s) => savedScholarshipIds.includes(s.id));

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Saved Scholarships
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {savedList.length} bookmarked opportunities saved for later review and preparation.
        </p>
      </div>

      {savedList.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#3B1FC4] flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No saved scholarships yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore scholarships and click the bookmark button to save opportunities to this list.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedList.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#3B1FC4] text-[10px] font-bold">
                    {s.type}
                  </span>
                  <button
                    onClick={() => toggleSaveScholarship(s.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
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
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  <span>Deadline: </span>
                  <span className="font-semibold text-slate-700">{s.deadline}</span>
                </div>

                <button
                  onClick={() => setSelectedScholarship(s)}
                  className="px-4 py-2 rounded-xl bg-linear-to-r from-[#4F46E5] to-[#7C5CF0] text-white text-xs font-bold transition-all shadow-soft-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
