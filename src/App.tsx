import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from "next-themes";
import { useAuth } from './contexts/AuthContext';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import InterviewScheduler from './pages/InterviewScheduler';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import InterviewManagement from './pages/InterviewManagement';
import UserManagement from './pages/UserManagement';
import SettingsPage from './pages/SettingsPage';
import SupportPage from './pages/SupportPage';
import OrganizationDashboard from './pages/organization/OrganizationDashboard';
import OrganizationInterviews from './pages/organization/OrganizationInterviews';
import OrganizationInterviewers from './pages/organization/OrganizationInterviewers';
import OrganizationAnalytics from './pages/organization/OrganizationAnalytics';
import OrganizationPositions from './pages/organization/OrganizationPositions';
import OrganizationNotifications from './pages/organization/OrganizationNotifications';
import OrganizationSupport from './pages/organization/OrganizationSupport';
import RequirementDetailPage from './pages/RequirementDetailPage';
import OrganizationRequirements from "./pages/organization/OrganizationRequirements";

function App() {
  const [mounted, setMounted] = useState(false);
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/analytics" replace />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="scheduler" element={<InterviewScheduler />} />
          <Route path="management" element={<InterviewManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>
        
        {/* Organization Routes */}
        <Route
          path="/organization"
          element={
            <ProtectedRoute>
              <OrganizationDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/organization/interviews" replace />} />
          <Route path="interviews" element={<OrganizationInterviews />} />
          <Route path="interviewers" element={<OrganizationInterviewers />} />
          <Route path="requirements" element={<OrganizationRequirements />} />
          <Route path="requirements/:id" element={<RequirementDetailPage />} />
          <Route path="analytics" element={<OrganizationAnalytics />} />
          <Route path="positions" element={<OrganizationPositions />} />
          <Route path="notifications" element={<OrganizationNotifications />} />
          <Route path="support" element={<OrganizationSupport />} />
        </Route>
        
        {/* Default Route */}
        <Route path="/" element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/signin" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
