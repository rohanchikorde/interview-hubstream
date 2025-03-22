
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

// Define types for our context
type Role = 'superadmin' | 'clientadmin' | 'client_coordinator' | 'super_coordinator' | 'interviewer' | 'accountant';

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
  company?: string;
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

// Sample user data - this would normally come from your backend
const SAMPLE_USERS = [
  {
    id: '1',
    email: 'admin@intervue.com',
    password: 'password123',
    name: 'Admin User',
    role: 'superadmin' as Role
  },
  {
    id: '2',
    email: 'client@example.com',
    password: 'password123',
    name: 'Client User',
    role: 'clientadmin' as Role,
    company: 'ACME Corp'
  },
  {
    id: '3',
    email: 'interviewer@example.com',
    password: 'password123',
    name: 'Interviewer User',
    role: 'interviewer' as Role
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user data in localStorage on mount
    const storedUser = localStorage.getItem('intervue_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse stored user data');
        localStorage.removeItem('intervue_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Here we would normally make a request to an API to authenticate
      // For now, we're using sample data for demonstration
      
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching email and password
      const matchedUser = SAMPLE_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (!matchedUser) {
        toast.error('Invalid email or password');
        throw new Error('Invalid email or password');
      }
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = matchedUser;
      
      // Store user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('intervue_user', JSON.stringify(userWithoutPassword));
      
      toast.success(`Welcome back, ${userWithoutPassword.name}!`);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      // Here we would normally make a request to an API to register
      // For now, we'll just simulate it
      
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user with same email exists
      if (SAMPLE_USERS.some(u => u.email === userData.email)) {
        toast.error('A user with this email already exists');
        throw new Error('User already exists');
      }
      
      // In a real app, we would save this to a database
      console.log('Registered new user:', userData);
      
      toast.success('Account created successfully! Please log in.');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Here we would normally make a request to an API to logout
      // For now, we'll just remove the user from state and localStorage
      
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem('intervue_user');
      
      toast.success('You have been logged out');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
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
