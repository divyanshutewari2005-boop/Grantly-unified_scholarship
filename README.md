# GRANTLY — Scholarship Discovery & Management Platform

> "One Student Profile. Every Relevant Scholarship. One Place to Manage Your Funding Journey."

GRANTLY is a scholarship discovery and management platform designed specifically for Indian students. It replaces fragmented state PDF gazettes and broken links with an explainable, rule-based matching engine, structured document readiness checks, proactive deadline alerts, and an end-to-end application tracking Kanban board.

---

## Core Product Principles

1. **Direct-to-Product Experience**: No landing pages, no marketing filler, no pre-login friction. Returning students land directly on their personalized Dashboard; first-time visitors are guided through an interactive 5-step Profile Setup Wizard with live match calculation.
2. **Deterministic, Explainable Eligibility**: No hallucinated AI "match percentages". Every scholarship is categorized strictly as **Eligible**, **Needs Verification**, or **Not Eligible**, backed by itemized rule evaluations and actionable hints.
3. **Official Portals Only**: GRANTLY never submits applications on the student's behalf. We prepare and guide students, providing direct verified links to the National Scholarship Portal (NSP), state welfare departments, and corporate CSR foundations.
4. **Privacy-First**: Document readiness is tracked via metadata and self-certification. Physical confidential files (Aadhaar, income certificates) are never uploaded to third-party servers.

---

## Project Structure & Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── AppSidebar.tsx        # Vertical deep purple gradient sidebar (~270px)
│   │   ├── AppTopbar.tsx         # Time-aware greeting, Ctrl+K search, notification bell, user menu
│   │   ├── AppRightRail.tsx      # Grantly Guide card, upcoming deadlines, document checklist
│   │   ├── CommandPalette.tsx    # Fast cmdk keyboard navigation & search
│   │   └── DashboardLayout.tsx   # 3-zone responsive container
│   ├── scholarship/
│   │   ├── ScholarshipCard.tsx   # Reusable card with status badges, urgency colors, bookmarking
│   │   └── ScholarshipDetailModal.tsx # "Why Am I Eligible?" rule inspector & roadmap stepper
│   └── ui/
│       ├── Button.tsx, IconButton.tsx, Badge.tsx, Card.tsx, Input.tsx, Select.tsx,
│       ├── Slider.tsx, Switch.tsx, Drawer.tsx, ProgressBar.tsx, ProgressRing.tsx,
│       └── StatCard.tsx, DeadlineChip.tsx, Skeleton.tsx, Toast.tsx
├── data/
│   └── mockScholarships.ts       # 26 realistic Indian scholarships with dynamic relative deadlines
├── lib/
│   ├── engine/
│   │   ├── matchingEngine.ts     # Pure deterministic rule engine & priority ranking
│   │   └── matchingEngine.test.ts # 16 comprehensive unit test cases
│   ├── constants.ts              # States, education levels, social categories
│   └── dates.ts                  # Relative dates, urgency color logic
├── store/
│   ├── useProfileStore.ts        # Student profile, completeness gauge, first-run status
│   ├── useScholarshipStore.ts    # Scholarship catalogue, bookmarking, filter state
│   ├── useApplicationStore.ts    # Kanban tracker (Interested -> Approved)
│   ├── useDocumentStore.ts       # Document checklist & readiness percentage
│   ├── useNotificationStore.ts   # Grouped notifications & unread counts
│   └── useSettingsStore.ts       # Language mode (English / Hindi), notification settings
├── services/
│   ├── api.ts                    # REST-shaped mock service layer
│   ├── askGuide.ts               # Hallucination-proof assistant retrieval
│   └── storage.ts                # Defensive localStorage wrapper
└── pages/
    ├── student/
    │   ├── DashboardPage.tsx     # Pixel-matched dashboard with hero banner, 4 stats, donut chart
    │   ├── ExploreScholarshipsPage.tsx # Filter sidebar, search, grid/list view
    │   ├── MatchesPage.tsx       # Eligible / Needs Verification / Not Eligible tabs
    │   ├── SavedScholarshipsPage.tsx # Bookmarked opportunities
    │   ├── ApplicationsPage.tsx  # Drag-and-drop Kanban & table view
    │   ├── DeadlinesPage.tsx     # Calendar & countdowns + Google Calendar links
    │   ├── DocumentsPage.tsx     # Master document readiness checklist
    │   ├── GrantlyGuidePage.tsx  # Full AI chat assistant with inline cards
    │   ├── ProfilePage.tsx       # Comprehensive profile editor & data export
    │   ├── SettingsPage.tsx      # Language mode, alerts, developer simulation
    │   └── OnboardingWizardPage.tsx # First-run full-screen wizard
    └── admin/
        └── AdminPage.tsx         # Scholarship CRUD & 5-step verification pipeline
```

---

## Matching Engine Specification

Located in `src/lib/engine/matchingEngine.ts`:

- `evaluateScholarship(profile, scholarship)`: Evaluates mandatory conditions across:
  - Minimum percentage or CGPA cutoff
  - Annual family income ceiling
  - State of permanent domicile (e.g. Uttarakhand vs All India)
  - Education level (UG, PG, Class 11-12)
  - Gender requirements (e.g. female-only engineering scholarships)
  - Caste/category reservations (SC, ST, OBC-NCL, EWS, Minority)
- `rankScholarships(profile, evaluated)`: Computes an internal priority ordering based on eligibility status, grant value, deadline proximity, and document readiness.
- Unit tests (`src/lib/engine/matchingEngine.test.ts`): 16 unit tests covering boundary values, missing profile fields, expired deadlines, and priority ordering. Run with:
  ```bash
  npx tsx -e "import { runEngineTests } from './src/lib/engine/matchingEngine.test.ts'; runEngineTests();"
  ```

---

## How to Swap Mocks for FastAPI + MySQL

1. **Replace `src/services/api.ts`**:
   The current methods (`getScholarships`, `getApplications`, `updateDocumentStatus`) mirror the exact payloads of FastAPI routes. Replace the localStorage reads with `fetch()` calls to your API endpoints:
   ```typescript
   export const api = {
     async getScholarships(params) {
       const res = await fetch(`/api/scholarships?${new URLSearchParams(params)}`);
       return res.json();
     },
     async updateApplicationStatus(id, status) {
       const res = await fetch(`/api/applications/${id}/status`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ status })
       });
       return res.json();
     }
   };
   ```
2. **Database Schemas**:
   - `students`: `id`, `name`, `email`, `state`, `income`, `category`, `percentage`, `course`
   - `scholarships`: `id`, `name`, `provider`, `amount`, `deadline`, `type`, `verification_status`
   - `eligibility_rules`: `id`, `scholarship_id`, `field`, `operator`, `value`, `mandatory`
   - `applications`: `id`, `student_id`, `scholarship_id`, `status`, `reference_number`
