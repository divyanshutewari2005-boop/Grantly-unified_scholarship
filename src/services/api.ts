/**
 * Mock API layer for GRANTLY.
 * 
 * Architecture Note:
 * Mirrors the contract of the future FastAPI + MySQL REST endpoints.
 * State is safely persisted in browser localStorage via the storage wrapper.
 */

import { Scholarship, SCHOLARSHIPS_DATA } from '../data/scholarships.ts';
import { storage } from './storage.ts';

const SCHOLARSHIPS_STORAGE_KEY = 'scholarships_db';
const SAVED_STORAGE_KEY = 'saved_scholarship_ids';
const APPLICATIONS_STORAGE_KEY = 'applications';
const DOC_STATUS_STORAGE_KEY = 'doc_status_map';

export interface ApplicationRecord {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  amountText: string;
  deadline: string;
  status: 'Interested' | 'Preparing Documents' | 'Applied' | 'Under Review' | 'Approved' | 'Rejected';
  appliedDate?: string;
  referenceNumber?: string;
  acknowledgementUrl?: string;
  notes?: string;
  lastUpdated: string;
}

export interface DocumentStatusMap {
  [scholarshipId: string]: {
    [docId: string]: 'Ready' | 'Pending' | 'Not Applicable';
  };
}

export const api = {
  /**
   * Fetch all scholarships with optional query filters
   */
  async getScholarships(params?: {
    query?: string;
    type?: string;
    level?: string;
    state?: string;
    maxIncome?: number;
    sort?: 'deadline' | 'amount_high' | 'amount_low' | 'relevance';
  }): Promise<Scholarship[]> {
    // Artificial mini-delay to allow UI skeletons and real async interaction patterns
    await new Promise((r) => setTimeout(r, 60));

    let list = storage.get<Scholarship[]>(SCHOLARSHIPS_STORAGE_KEY, SCHOLARSHIPS_DATA);
    if (!list || list.length === 0) {
      list = SCHOLARSHIPS_DATA;
      storage.set(SCHOLARSHIPS_STORAGE_KEY, list);
    }

    if (!params) return list;

    let filtered = [...list];

    if (params.query) {
      const q = params.query.toLowerCase().trim();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.state.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.level.some((lvl) => lvl.toLowerCase().includes(q))
      );
    }

    if (params.type && params.type !== 'All') {
      filtered = filtered.filter((s) => s.type === params.type);
    }

    if (params.level && params.level !== 'All') {
      filtered = filtered.filter((s) => s.level.includes(params.level as string));
    }

    if (params.state && params.state !== 'All') {
      filtered = filtered.filter((s) => s.state === 'All India' || s.state === params.state);
    }

    if (params.sort) {
      if (params.sort === 'deadline') {
        filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      } else if (params.sort === 'amount_high') {
        filtered.sort((a, b) => b.annualAmount - a.annualAmount);
      } else if (params.sort === 'amount_low') {
        filtered.sort((a, b) => a.annualAmount - b.annualAmount);
      }
    }

    return filtered;
  },

  async getScholarshipById(id: string): Promise<Scholarship | null> {
    const all = await this.getScholarships();
    return all.find((s) => s.id === id) || null;
  },

  /**
   * Saved / Bookmarked scholarships
   */
  async getSavedIds(): Promise<string[]> {
    return storage.get<string[]>(SAVED_STORAGE_KEY, ['csss-moe-2026', 'reliance-foundation-ug-2026']);
  },

  async toggleSaveScholarship(id: string): Promise<{ saved: boolean; ids: string[] }> {
    const ids = await this.getSavedIds();
    let updated: string[];
    let saved: boolean;
    if (ids.includes(id)) {
      updated = ids.filter((item) => item !== id);
      saved = false;
    } else {
      updated = [...ids, id];
      saved = true;
    }
    storage.set(SAVED_STORAGE_KEY, updated);
    return { saved, ids: updated };
  },

  /**
   * Applications Tracker
   */
  async getApplications(): Promise<ApplicationRecord[]> {
    const defaultApps: ApplicationRecord[] = [
      {
        id: "app-1",
        scholarshipId: "csss-moe-2026",
        scholarshipName: "Central Sector Scheme of Scholarships (CSSS)",
        provider: "Ministry of Education",
        amountText: "₹12,000 / year",
        deadline: "2026-11-30",
        status: "Applied",
        appliedDate: "2026-10-15",
        referenceNumber: "NSP-2026-UK-884210",
        notes: "College nodal officer verification pending.",
        lastUpdated: "2026-10-15"
      },
      {
        id: "app-2",
        scholarshipId: "reliance-foundation-ug-2026",
        scholarshipName: "Reliance Foundation Undergraduate Scholarship",
        provider: "Reliance Foundation",
        amountText: "Up to ₹2,00,000",
        deadline: "2026-11-20",
        status: "Preparing Documents",
        notes: "Family income certificate pending from Tehsildar.",
        lastUpdated: "2026-10-22"
      },
      {
        id: "app-3",
        scholarshipId: "aicte-pragati-2026",
        scholarshipName: "AICTE Pragati Scholarship Scheme for Girl Students",
        provider: "AICTE",
        amountText: "₹50,000 / year",
        deadline: "2026-12-31",
        status: "Interested",
        notes: "Check if college quota applies.",
        lastUpdated: "2026-10-20"
      }
    ];
    return storage.get<ApplicationRecord[]>(APPLICATIONS_STORAGE_KEY, defaultApps);
  },

  async updateApplicationStatus(
    appId: string,
    newStatus: ApplicationRecord['status']
  ): Promise<ApplicationRecord[]> {
    const apps = await this.getApplications();
    const updated = apps.map((app) =>
      app.id === appId
        ? { ...app, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] }
        : app
    );
    storage.set(APPLICATIONS_STORAGE_KEY, updated);
    return updated;
  },

  async saveApplication(app: Partial<ApplicationRecord> & { scholarshipId: string }): Promise<ApplicationRecord> {
    const apps = await this.getApplications();
    const existingIndex = apps.findIndex((a) => a.id === app.id || a.scholarshipId === app.scholarshipId);

    const record: ApplicationRecord = {
      id: app.id || `app-${Date.now()}`,
      scholarshipId: app.scholarshipId,
      scholarshipName: app.scholarshipName || 'Scholarship',
      provider: app.provider || 'Provider',
      amountText: app.amountText || 'Grant',
      deadline: app.deadline || '2026-12-31',
      status: app.status || 'Interested',
      appliedDate: app.appliedDate,
      referenceNumber: app.referenceNumber,
      acknowledgementUrl: app.acknowledgementUrl,
      notes: app.notes,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    let updatedList: ApplicationRecord[];
    if (existingIndex >= 0) {
      updatedList = [...apps];
      updatedList[existingIndex] = { ...updatedList[existingIndex], ...record };
    } else {
      updatedList = [record, ...apps];
    }
    storage.set(APPLICATIONS_STORAGE_KEY, updatedList);
    return record;
  },

  /**
   * Document Readiness Status Tracker (Per scholarship & document)
   */
  async getDocumentStatuses(): Promise<DocumentStatusMap> {
    const defaultMap: DocumentStatusMap = {
      "csss-moe-2026": {
        "doc-aadhaar": "Ready",
        "doc-marksheet-12": "Ready",
        "doc-income": "Pending",
        "doc-bonafide": "Ready",
        "doc-bank": "Ready"
      }
    };
    return storage.get<DocumentStatusMap>(DOC_STATUS_STORAGE_KEY, defaultMap);
  },

  async updateDocumentStatus(
    scholarshipId: string,
    docId: string,
    status: 'Ready' | 'Pending' | 'Not Applicable'
  ): Promise<DocumentStatusMap> {
    const current = await this.getDocumentStatuses();
    const updated = {
      ...current,
      [scholarshipId]: {
        ...(current[scholarshipId] || {}),
        [docId]: status
      }
    };
    storage.set(DOC_STATUS_STORAGE_KEY, updated);
    return updated;
  }
};
