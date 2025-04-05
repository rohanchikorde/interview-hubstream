
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster.tsx'; 
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Import components
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import RequestDemo from '@/pages/RequestDemo';
import Pricing from '@/pages/Pricing';
import About from '@/pages/About';

// Requirements pages
import RequirementsPage from '@/pages/requirements/RequirementsPage';
import NewRequirementPage from '@/pages/requirements/NewRequirementPage';
import RequirementDetailPage from '@/pages/requirements/RequirementDetailPage';

// Tickets pages
import TicketsPage from '@/pages/tickets/TicketsPage';
import TicketDetailPage from '@/pages/tickets/TicketDetailPage';

// Interviews pages
import InterviewsPage from '@/pages/interviews/InterviewsPage';
import InterviewDetailPage from '@/pages/interviews/InterviewDetailPage';
import ScheduleInterviewPage from '@/pages/interviews/ScheduleInterviewPage';

// Admin pages
import CompaniesPage from '@/pages/admin/CompaniesPage';
import CompanyDetailPage from '@/pages/admin/CompanyDetailPage';
import NewCompanyPage from '@/pages/admin/NewCompanyPage';
import NewInterviewPage from '@/pages/admin/NewInterviewPage';
import InterviewerDetailPage from '@/pages/admin/InterviewerDetailPage';

import './App.css';
import { Toaster as SonnerToaster } from 'sonner';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="vite-react-theme"
    >
      <AuthProvider>
        <SidebarProvider>
          <Toaster />
          <SonnerToaster position="bottom-center" richColors closeButton />
          {!isOnline && (
            <div className="fixed bottom-0 left-0 w-full bg-red-500 text-white p-2 text-center z-50">
              You are currently offline. Some features may not be available.
            </div>
          )}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/request-demo" element={<RequestDemo />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            
            {/* Protected routes all wrapped in SidebarProvider by default */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
              <Route index element={<RequirementsPage />} />
              <Route path="requirements" element={<RequirementsPage />} />
              <Route path="requirements/new" element={<NewRequirementPage />} />
              <Route path="requirements/:id" element={<RequirementDetailPage />} />
              
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="tickets/:id" element={<TicketDetailPage />} />
              
              <Route path="interviews" element={<InterviewsPage />} />
              <Route path="interviews/schedule" element={<ScheduleInterviewPage />} />
              <Route path="interviews/:id" element={<InterviewDetailPage />} />
              
              {/* Admin Routes */}
              <Route path="admin/companies" element={<CompaniesPage />} />
              <Route path="admin/companies/new" element={<NewCompanyPage />} />
              <Route path="admin/companies/:companyId" element={<CompanyDetailPage />} />
              <Route path="admin/companies/:companyId/interviews/new" element={<NewInterviewPage />} />
              <Route path="admin/interviewers/:interviewerId" element={<InterviewerDetailPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
