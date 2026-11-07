import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DocumentItem {
  id: string;
  name: string;
  status: 'Ready' | 'Pending' | 'Not Applicable';
  mandatory: boolean;
  helpText: string;
  notes?: string;
  expiryDate?: string;
  lastUpdated: string;
}

interface DocumentState {
  documents: DocumentItem[];
  readyCount: number;
  totalCount: number;
  readinessPercentage: number;
  setDocumentStatus: (id: string, status: 'Ready' | 'Pending' | 'Not Applicable', notes?: string) => void;
  resetDocuments: () => void;
}

// Exactly matches screenshot:
// [✓] Aadhaar Card
// [✓] Previous Marksheet
// [✓] Bank Account Details
// [ ] Income Certificate (Pending, "Upload")
// [ ] Domicile Certificate (Pending, "Upload")
// Fresh clean website state: all documents start as Pending (0/5 Ready)
const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-aadhaar',
    name: 'Aadhaar Card',
    status: 'Pending',
    mandatory: true,
    helpText: 'Linked with active mobile and verified in NPCI mapper.',
    lastUpdated: ''
  },
  {
    id: 'doc-marksheet',
    name: 'Previous Marksheet',
    status: 'Pending',
    mandatory: true,
    helpText: 'Class 12 or qualifying semester marksheet.',
    lastUpdated: ''
  },
  {
    id: 'doc-bank',
    name: 'Bank Account Details',
    status: 'Pending',
    mandatory: true,
    helpText: 'Active bank passbook or cancelled cheque in student name.',
    lastUpdated: ''
  },
  {
    id: 'doc-income',
    name: 'Income Certificate',
    status: 'Pending',
    mandatory: true,
    helpText: 'Valid government income certificate from Tehsildar / SDO.',
    lastUpdated: ''
  },
  {
    id: 'doc-domicile',
    name: 'Domicile Certificate',
    status: 'Pending',
    mandatory: true,
    helpText: 'State permanent residence / Mool Niwas certificate.',
    lastUpdated: ''
  }
];

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documents: DEFAULT_DOCUMENTS,
      readyCount: 0,
      totalCount: 5,
      readinessPercentage: 0,

      setDocumentStatus: (id, status, notes) => {
        const updated = get().documents.map((d) =>
          d.id === id
            ? {
                ...d,
                status,
                notes: notes !== undefined ? notes : d.notes,
                lastUpdated: new Date().toISOString().split('T')[0]
              }
            : d
        );
        const ready = updated.filter((d) => d.status === 'Ready').length;
        const total = updated.length;
        const pct = Math.round((ready / total) * 100);

        set({
          documents: updated,
          readyCount: ready,
          totalCount: total,
          readinessPercentage: pct
        });
      },

      resetDocuments: () => {
        set({
          documents: DEFAULT_DOCUMENTS,
          readyCount: 0,
          totalCount: 5,
          readinessPercentage: 0
        });
      }
    }),
    {
      name: 'grantly_clean_documents_v4'
    }
  )
);
