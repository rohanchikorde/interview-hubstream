import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { authApi } from '@/services/authApi';

// Define types for our context
type Role = 'superadmin' | 'clientadmin' | 'client_coordinator' | 'super_coordinator' | 'interviewer' | 'accountant' | 'guest';

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  full_name: string;
  phone_number: string;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you would verify the token with the backend
      // For now, we'll just set the user as authenticated
      setUser({
        id: '1',
        email: 'user@example.com',
        name: 'Authenticated User',
        role: 'clientadmin' as Role
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      
      // Store the token
      localStorage.setItem('token', response.token);
      
      // Set user data
      setUser({
        id: response.user.id,
        email: response.user.email,
        name: response.user.full_name,
        role: response.user.role as Role
      });

      // Navigate to dashboard
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      await authApi.register({
        email: userData.email,
        password: userData.password,
        full_name: userData.name,
        phone_number: userData.phone_number,
        role: userData.role
      });
      toast.success('Registration successful! Please login to continue.');
      window.location.href = '/login';
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear token
      localStorage.removeItem('token');
      
      // Clear user
      setUser(null);
      
      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
