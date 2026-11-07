import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Calendar,
  Building2,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Table as TableIcon,
  LayoutGrid,
  MoreVertical
} from 'lucide-react';
import { useApplicationStore, ApplicationItem, ApplicationStatus } from '../../store/useApplicationStore.ts';
import { Drawer } from '../../components/ui/Drawer.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { Input } from '../../components/ui/Input.tsx';

const COLUMNS: { id: ApplicationStatus; title: string; color: string; badgeColor: string }[] = [
  { id: 'Interested', title: 'Interested', color: 'border-indigo-200', badgeColor: 'bg-indigo-100 text-indigo-800' },
  { id: 'Preparing', title: 'Preparing Documents', color: 'border-purple-200', badgeColor: 'bg-purple-100 text-purple-800' },
  { id: 'Applied', title: 'Applied', color: 'border-sky-200', badgeColor: 'bg-sky-100 text-sky-800' },
  { id: 'Under Review', title: 'Under Review', color: 'border-amber-200', badgeColor: 'bg-amber-100 text-amber-800' },
  { id: 'Approved', title: 'Approved', color: 'border-emerald-200', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { id: 'Rejected', title: 'Rejected', color: 'border-slate-200', badgeColor: 'bg-slate-100 text-slate-700' }
];

export const ApplicationsPage: React.FC = () => {
  const { applications, updateStatus, updateApplication, addApplication } = useApplicationStore();
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New application form state
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newAmount, setNewAmount] = useState('₹25,000 / year');
  const [newDeadline, setNewDeadline] = useState('2026-12-31');

  const handleAddNewApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addApplication({
      scholarshipId: `custom-${Date.now()}`,
      scholarshipName: newTitle.trim(),
      provider: newProvider.trim() || 'Official Department',
      amountText: newAmount,
      annualAmount: 25000,
      deadline: newDeadline,
      status: 'Interested',
      notes: 'Added to tracking board.'
    });
    setNewTitle('');
    setNewProvider('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Applications Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track your funding pipeline from initial discovery through official portal submission and sanction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Kanban / Table Toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'kanban' ? 'bg-[#EDE9FE] text-[#3B1FC4]' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Kanban Board"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[#EDE9FE] text-[#3B1FC4]' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Application
          </Button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        /* Kanban Board Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const colApps = applications.filter((a) => a.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/60 flex flex-col min-w-[220px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/60">
                  <span className="text-xs font-extrabold text-slate-800">
                    {col.title}
                  </span>
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold tabular-nums ${col.badgeColor}`}>
                    {colApps.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[680px]">
                  {colApps.length === 0 ? (
                    <div className="py-8 px-2 text-center border border-dashed border-slate-200 rounded-xl bg-white/60">
                      <p className="text-[11px] font-medium text-slate-400">No applications</p>
                    </div>
                  ) : (
                    colApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                      className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-soft-xs hover:shadow-soft-sm hover:-translate-y-0.5 transition-all cursor-pointer text-left space-y-2"
                    >
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                        {app.scholarshipName}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate">{app.provider}</p>
                      
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#3B1FC4] tabular-nums pt-1">
                        <span>{app.amountText}</span>
                      </div>

                      {app.referenceNumber && (
                        <div className="text-[10px] bg-slate-50 p-1.5 rounded text-slate-600 truncate border border-slate-100">
                          Ref: <span className="font-mono font-semibold">{app.referenceNumber}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                        <span>{app.deadline}</span>
                        <select
                          value={app.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                          className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 cursor-pointer"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.id}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Scholarship</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No applications tracked yet. Click "Add Custom Application" above or browse scholarships to track.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900">{app.scholarshipName}</td>
                  <td className="py-3.5 px-4 text-slate-500">{app.provider}</td>
                  <td className="py-3.5 px-4 font-bold text-[#3B1FC4] tabular-nums">{app.amountText}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EDE9FE] text-[#3B1FC4]">
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{app.referenceNumber || '—'}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApp(app);
                      }}
                      className="text-[#3B1FC4] font-bold hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}

      {/* Application Detail Drawer */}
      <Drawer
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={selectedApp?.scholarshipName || 'Application Details'}
        description={`Status: ${selectedApp?.status}`}
      >
        {selectedApp && (
          <div className="space-y-5 text-xs text-left">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Provider</label>
              <p className="text-sm font-semibold text-slate-900">{selectedApp.provider}</p>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Grant Value</label>
              <p className="text-base font-extrabold text-[#3B1FC4]">{selectedApp.amountText}</p>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Change Stage / Status</label>
              <div className="mt-1">
                <select
                  value={selectedApp.status}
                  onChange={(e) => {
                    const newSt = e.target.value as ApplicationStatus;
                    updateStatus(selectedApp.id, newSt);
                    setSelectedApp({ ...selectedApp, status: newSt });
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-white"
                >
                  {COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Application Reference Number</label>
              <input
                type="text"
                placeholder='e.g. NSP-2026-UK-12345'
                value={selectedApp.referenceNumber || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  updateApplication(selectedApp.id, { referenceNumber: val });
                  setSelectedApp({ ...selectedApp, referenceNumber: val });
                }}
                className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Student Notes & Action Log</label>
              <textarea
                rows={4}
                placeholder="Add notes about submission receipt, nodal officer verification, or queries..."
                value={selectedApp.notes || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  updateApplication(selectedApp.id, { notes: val });
                  setSelectedApp({ ...selectedApp, notes: val });
                }}
                className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl text-xs leading-relaxed"
              />
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 leading-relaxed">
              <span className="font-bold">Official Submission: </span>
              Remember to submit directly on the government portal before logging your reference ID.
            </div>
          </div>
        )}
      </Drawer>

      {/* Add Application Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Track a New Application"
        description="Add any central, state, or private scholarship you have applied to or are preparing for."
      >
        <form onSubmit={handleAddNewApp} className="space-y-4 pt-1 text-left">
          <Input
            label="Scholarship Name"
            placeholder="e.g. Reliance Foundation Undergraduate Scholarship"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <Input
            label="Provider / Authority"
            placeholder="e.g. Ministry of Education or Foundation name"
            value={newProvider}
            onChange={(e) => setNewProvider(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Grant Value"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />
            <Input
              label="Deadline Date"
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save to Tracker
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
