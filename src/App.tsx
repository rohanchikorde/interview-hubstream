
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster.tsx'; 
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Import components
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

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
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
              <Route index element={<RequirementsPage />} />
              <Route path="requirements" element={<RequirementsPage />} />
              <Route path="requirements/new" element={<NewRequirementPage />} />
              <Route path="requirements/:id" element={<RequirementDetailPage />} />
              
              {/* New routes for tickets */}
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="tickets/:id" element={<TicketDetailPage />} />
              
              {/* New routes for interviews */}
              <Route path="interviews" element={<InterviewsPage />} />
              <Route path="interviews/schedule" element={<ScheduleInterviewPage />} />
              <Route path="interviews/:id" element={<InterviewDetailPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
