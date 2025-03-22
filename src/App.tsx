
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import RequirementsPage from "./pages/requirements/RequirementsPage";
import NewRequirementPage from "./pages/requirements/NewRequirementPage";
import RequirementDetailPage from "./pages/requirements/RequirementDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/requirements" 
              element={
                <ProtectedRoute>
                  <RequirementsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/requirements/new" 
              element={
                <ProtectedRoute>
                  <NewRequirementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/requirements/:id" 
              element={
                <ProtectedRoute>
                  <RequirementDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
