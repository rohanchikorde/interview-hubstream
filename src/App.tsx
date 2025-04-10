
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "./components/ui/theme-provider";
import { useTheme } from "next-themes";
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import OrganizationDashboard from './pages/organization/OrganizationDashboard';
import OrganizationInterviews from './pages/organization/OrganizationInterviews';
import OrganizationInterviewers from './pages/organization/OrganizationInterviewers';
import OrganizationAnalytics from './pages/organization/OrganizationAnalytics';
import OrganizationPositions from './pages/organization/OrganizationPositions';
import OrganizationNotifications from './pages/organization/OrganizationNotifications';
import OrganizationSupport from './pages/organization/OrganizationSupport';
import OrganizationRequirements from "./pages/organization/OrganizationRequirements";
import RequirementDetailPage from './pages/requirements/RequirementDetailPage';

function App() {
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useAuth();
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<Navigate to="/register" replace />} />

        {/* Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
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
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
