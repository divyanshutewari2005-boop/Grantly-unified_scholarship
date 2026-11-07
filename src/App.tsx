
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';

import { ToastProvider } from './components/ui/Toast.tsx';
import { DashboardLayout } from './components/layout/DashboardLayout.tsx';
import { useProfileStore } from './store/useProfileStore.ts';

// Pages
import { AuthPage } from './pages/auth/AuthPage.tsx';
import { DashboardPage } from './pages/student/DashboardPage.tsx';
import { ExploreScholarshipsPage } from './pages/student/ExploreScholarshipsPage.tsx';
import { MatchesPage } from './pages/student/MatchesPage.tsx';
import { SavedScholarshipsPage } from './pages/student/SavedScholarshipsPage.tsx';
import { ApplicationsPage } from './pages/student/ApplicationsPage.tsx';
import { DeadlinesPage } from './pages/student/DeadlinesPage.tsx';
import { DocumentsPage } from './pages/student/DocumentsPage.tsx';
import { GrantlyGuidePage } from './pages/student/GrantlyGuidePage.tsx';
import { ProfilePage } from './pages/student/ProfilePage.tsx';
import { SettingsPage } from './pages/student/SettingsPage.tsx';
import { OnboardingWizardPage } from './pages/student/OnboardingWizardPage.tsx';
import { AdminPage } from './pages/admin/AdminPage.tsx';

// Protect routes that require login
const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useProfileStore(
    (state) => state.isAuthenticated
  );

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/auth" replace />;
};

// Redirect authenticated users away from login
const PublicRoute: React.FC = () => {
  const isAuthenticated = useProfileStore(
    (state) => state.isAuthenticated
  );

  return isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : <Outlet />;
};

// Shared dashboard layout
const StudentLayout: React.FC<{
  children: React.ReactNode;
  showRightRail?: boolean;
}> = ({ children, showRightRail = true }) => (
  <DashboardLayout showRightRail={showRightRail}>
    {children}
  </DashboardLayout>
);

function AppRoutes() {
  const isAuthenticated = useProfileStore(
    (state) => state.isAuthenticated
  );

  return (
    <Routes>

      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      {/* Protected student routes */}
      <Route element={<ProtectedRoute />}>

        <Route
          path="/onboarding"
          element={<OnboardingWizardPage />}
        />

        <Route
          path="/dashboard"
          element={
            <StudentLayout>
              <DashboardPage />
            </StudentLayout>
          }
        />

        <Route
          path="/explore-scholarships"
          element={
            <StudentLayout>
              <ExploreScholarshipsPage />
            </StudentLayout>
          }
        />

        <Route
          path="/matches"
          element={
            <StudentLayout>
              <MatchesPage />
            </StudentLayout>
          }
        />

        <Route
          path="/saved"
          element={
            <StudentLayout>
              <SavedScholarshipsPage />
            </StudentLayout>
          }
        />

        <Route
          path="/applications"
          element={
            <StudentLayout showRightRail={false}>
              <ApplicationsPage />
            </StudentLayout>
          }
        />

        <Route
          path="/deadlines"
          element={
            <StudentLayout>
              <DeadlinesPage />
            </StudentLayout>
          }
        />

        <Route
          path="/documents"
          element={
            <StudentLayout>
              <DocumentsPage />
            </StudentLayout>
          }
        />

        <Route
          path="/guide"
          element={
            <StudentLayout showRightRail={false}>
              <GrantlyGuidePage />
            </StudentLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <StudentLayout>
              <ProfilePage />
            </StudentLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <StudentLayout>
              <SettingsPage />
            </StudentLayout>
          }
        />

        <Route
          path="/admin"
          element={
            <StudentLayout showRightRail={false}>
              <AdminPage />
            </StudentLayout>
          }
        />

      </Route>

      {/* Default navigation */}
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/auth"}
            replace
          />
        }
      />

      {/* Unknown routes */}
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/auth"}
            replace
          />
        }
      />

    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
}
