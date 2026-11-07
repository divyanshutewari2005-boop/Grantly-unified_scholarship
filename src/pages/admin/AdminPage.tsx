import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  UploadCloud,
  FileCheck,
  TrendingUp,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useScholarshipStore } from '../../store/useScholarshipStore.ts';
import { useNotificationStore } from '../../store/useNotificationStore.ts';
import { Scholarship } from '../../data/mockScholarships.ts';
import { Modal } from '../../components/ui/Modal.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

const VERIFICATION_PIPELINE = [
  'Added',
  'Source Checked',
  'Rules Recorded',
  'Verified',
  'Published'
] as const;

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { scholarships, addScholarship, updateScholarship, deleteScholarship } = useScholarshipStore();
  const { addNotification } = useNotificationStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [type, setType] = useState<'Government' | 'State' | 'Private' | 'PSU'>('Government');
  const [amountText, setAmountText] = useState('₹35,000 / year');
  const [annualAmount, setAnnualAmount] = useState(35000);
  const [deadline, setDeadline] = useState('2026-12-31');
  const [source, setSource] = useState('National Scholarship Portal');
  const [pipelineStep, setPipelineStep] = useState<typeof VERIFICATION_PIPELINE[number]>('Published');

  const handleSaveScholarship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingScholarship) {
      updateScholarship(editingScholarship.id, {
        name,
        provider,
        type,
        amountText,
        annualAmount,
        deadline,
        source
      });
      toast('Scholarship updated successfully', 'success');
      setEditingScholarship(null);
    } else {
      const id = `admin-scheme-${Date.now()}`;
      const newRecord: Scholarship = {
        id,
        name,
        shortName: name.slice(0, 24),
        provider,
        type,
        level: ['Undergraduate (UG)'],
        state: 'All India',
        amountText,
        annualAmount,
        deadline,
        officialUrl: 'https://scholarships.gov.in',
        source,
        lastVerified: new Date().toISOString().split('T')[0],
        verificationStatus: 'Verified',
        summary: 'Admin-curated scholarship scheme.',
        benefits: [`Annual grant of ${amountText}`],
        eligibilityRules: [
          {
            id: 'rule-min',
            field: 'minPercentage',
            operator: 'gte',
            value: 65,
            label: 'Minimum 65% in qualifying exam',
            description: 'Board marks criteria',
            mandatory: true
          }
        ],
        documents: [
          { id: 'doc-aadhaar', name: 'Aadhaar Card', mandatory: true, helpText: 'Seeded' }
        ],
        applicationProcedure: ['Apply through designated official portal.'],
        contactSupport: 'support@grantly.in',
        logo: '🏛️'
      };

      addScholarship(newRecord);

      // Trigger automatic new match release notification
      addNotification({
        type: 'new_match',
        title: `Newly Published: ${name}`,
        message: `Admin verification approved new ${type} scheme (${amountText}).`,
        scholarshipId: id,
        actionLabel: 'Inspect Scheme',
        actionRoute: `/explore-scholarships?highlight=${id}`
      });

      toast('Scholarship published & notifications dispatched!', 'success');
      setIsAddModalOpen(false);
    }

    // Reset inputs
    setName('');
    setProvider('');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
            title="Return to Student Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Admin Scholarship Curation & Verification
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-[#3B1FC4] text-[10px] font-extrabold uppercase">
                Officer Console
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage database records, configure eligibility rules, and publish verified schemes.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            setEditingScholarship(null);
            setName('');
            setProvider('');
            setIsAddModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Scholarship Scheme
        </Button>
      </div>

      {/* Verification Pipeline Tracker Strip */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#3B1FC4]" />
          <span>Verification Protocol Workflow</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {VERIFICATION_PIPELINE.map((st, i) => (
            <div
              key={st}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-2"
            >
              <span className="w-5 h-5 rounded-full bg-[#EDE9FE] text-[#3B1FC4] text-[11px] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="font-semibold text-slate-800 text-[11px] truncate">{st}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scholarship Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-soft-sm">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Database Catalog ({scholarships.length} Schemes)
          </h3>
          <span className="text-xs text-slate-500">Live synchronized with client store</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Scheme Name</th>
                <th className="py-3.5 px-4">Provider</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Deadline</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scholarships.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                    {s.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-[180px] truncate">{s.provider}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EDE9FE] text-[#3B1FC4]">
                      {s.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 tabular-nums">{s.amountText}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{s.deadline}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {s.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingScholarship(s);
                        setName(s.name);
                        setProvider(s.provider);
                        setType(s.type);
                        setAmountText(s.amountText);
                        setAnnualAmount(s.annualAmount);
                        setDeadline(s.deadline);
                        setIsAddModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit scheme"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete scholarship "${s.name}"?`)) {
                          deleteScholarship(s.id);
                          toast('Scholarship removed from database.', 'info');
                        }
                      }}
                      className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete scheme"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Scholarship Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingScholarship ? 'Edit Scholarship Scheme' : 'Add & Verify New Scheme'}
        description="Configure official requirements, eligibility rules, and publish to the matching engine."
      >
        <form onSubmit={handleSaveScholarship} className="space-y-4 pt-1 text-left text-xs">
          <Input
            label="Scheme Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. National Fellowship for Higher Education"
            required
          />

          <Input
            label="Provider / Department"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="e.g. Ministry of Tribal Affairs"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              options={['Government', 'State', 'Private', 'PSU']}
            />
            <Input
              label="Deadline Date"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Amount Display Text"
              value={amountText}
              onChange={(e) => setAmountText(e.target.value)}
              placeholder="e.g. ₹50,000 / year"
            />
            <Input
              label="Annual Numerical Amount (INR)"
              type="number"
              value={annualAmount}
              onChange={(e) => setAnnualAmount(Number(e.target.value))}
            />
          </div>

          <Input
            label="Official Portal Link"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. scholarships.gov.in"
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingScholarship ? 'Update Scheme' : 'Verify & Publish Scheme'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
