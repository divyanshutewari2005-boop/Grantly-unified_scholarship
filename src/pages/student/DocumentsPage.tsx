import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Lock,
  Unlock,
  Info,
  Check,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useDocumentStore } from '../../store/useDocumentStore.ts';
import { useScholarshipStore } from '../../store/useScholarshipStore.ts';
import { ProgressRing } from '../../components/ui/ProgressRing.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { Button } from '../../components/ui/Button.tsx';

export const DocumentsPage: React.FC = () => {
  const { documents, readyCount, totalCount, readinessPercentage, setDocumentStatus } = useDocumentStore();
  const { scholarships } = useScholarshipStore();

  const [activeDocModal, setActiveDocModal] = useState<string | null>(null);
  const [docNoteInput, setDocNoteInput] = useState('');
  const [docExpiryInput, setDocExpiryInput] = useState('');

  const currentDoc = documents.find((d) => d.id === activeDocModal);

  // Calculate which scholarships this document unlocks
  const getUnlockedScholarships = (docId: string) => {
    return scholarships.filter((s) => s.documents.some((d) => d.id === docId));
  };

  const handleSaveModal = (status: 'Ready' | 'Pending' | 'Not Applicable') => {
    if (activeDocModal) {
      setDocumentStatus(activeDocModal, status, docNoteInput);
      setActiveDocModal(null);
      setDocNoteInput('');
      setDocExpiryInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Document Readiness Center
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Prepare verified documents before applying on government and private portals. We store status only — never file contents.
        </p>
      </div>

      {/* Top Banner with Progress Ring & Overview */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-4 flex items-center justify-center p-2">
          <ProgressRing
            progress={readinessPercentage}
            size={130}
            strokeWidth={13}
            centerText={`${readinessPercentage}%`}
            centerSubtext="Readiness"
            color="#4F46E5"
          />
        </div>

        <div className="md:col-span-8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-[#3B1FC4] text-xs font-bold border border-indigo-100">
              {readyCount} of {totalCount} Essential Documents Verified
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Why Document Readiness Matters
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
            In India, over 70% of scholarship applications rejected on portals like NSP are due to late or invalid income certificates and unseeded Aadhaar accounts. Keeping these 5 ready beforehand gives you instant submission capability.
          </p>
        </div>
      </div>

      {/* Documents Master Checklist */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
          Master Document Inventory
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {documents.map((doc) => {
            const isReady = doc.status === 'Ready';
            const isPending = doc.status === 'Pending';
            const unlockedList = getUnlockedScholarships(doc.id);

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isReady ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">{doc.name}</h4>
                      {doc.mandatory && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{doc.helpText}</p>
                    {doc.notes && (
                      <p className="text-xs text-slate-700 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        <span className="font-semibold text-slate-500">Note: </span>
                        {doc.notes}
                      </p>
                    )}

                    {/* Unlocks count */}
                    <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#3B1FC4] font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Required by {unlockedList.length} scholarships</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setDocumentStatus(doc.id, 'Ready')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        isReady
                          ? 'bg-emerald-500 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Ready ✓
                    </button>
                    <button
                      onClick={() => setDocumentStatus(doc.id, 'Pending')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        isPending
                          ? 'bg-amber-500 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Pending ⏳
                    </button>
                    <button
                      onClick={() => setDocumentStatus(doc.id, 'Not Applicable')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        doc.status === 'Not Applicable'
                          ? 'bg-slate-700 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      N/A
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setActiveDocModal(doc.id);
                      setDocNoteInput(doc.notes || '');
                    }}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    title="Edit certificate details"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail / Note edit modal */}
      <Modal
        isOpen={!!activeDocModal}
        onClose={() => setActiveDocModal(null)}
        title={currentDoc ? `Edit ${currentDoc.name}` : ''}
        description="Add reference numbers, issue dates, or notes."
      >
        <div className="space-y-4 pt-1 text-left text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Certificate Notes / Issuing Authority
            </label>
            <input
              type="text"
              value={docNoteInput}
              onChange={(e) => setDocNoteInput(e.target.value)}
              placeholder="e.g. Issued by Tehsildar Dehradun on 12-Aug-2026"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setActiveDocModal(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleSaveModal(currentDoc?.status || 'Ready')}>
              Save Details
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
