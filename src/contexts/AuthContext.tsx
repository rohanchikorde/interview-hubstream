
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { supabaseTable, handleSingleResponse } from '@/utils/supabaseHelpers';

// Define types for our context
type Role = 'admin' | 'organization' | 'interviewer' | 'interviewee' | 'guest';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  company?: string;
}

interface AuthContextType {
  user: AuthUser | null;
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

// Interface for the user data from the DB
interface UserData {
  user_id: string;
  work_email: string;
  full_name: string;
  roles: string[];
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

// Create a guest user that will be used by default when no user is authenticated
const GUEST_USER: AuthUser = {
  id: 'guest',
  email: 'guest@hirevantage.com',
  name: 'Guest User',
  role: 'guest' as Role
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Initialize auth state by checking for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          fetchUserProfile(currentSession);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession) {
        fetchUserProfile(currentSession);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to fetch user profile including role after authentication
  const fetchUserProfile = async (currentSession: Session | null) => {
    if (!currentSession) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch user data from the users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', parseInt(currentSession.user.id))
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      } else if (data) {
        // Get the user's role from the roles field
        const userData = data as unknown as UserData;
        let userRole: Role = 'guest';
        
        if (userData.roles && Array.isArray(userData.roles) && userData.roles.length > 0) {
          userRole = userData.roles[0] as Role;
        }

        // Set the authenticated user with role information
        setUser({
          id: userData.user_id,
          email: userData.work_email,
          name: userData.full_name,
          role: userRole
        });

        // Redirect to the appropriate dashboard based on the role
        redirectBasedOnRole(userRole);
      }
    } catch (error) {
      console.error('Exception fetching user data:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to redirect users based on their role
  const redirectBasedOnRole = (role: Role) => {
    switch (role) {
      case 'admin':
        navigate('/dashboard');
        break;
      case 'organization':
        navigate('/organization');
        break;
      case 'interviewer':
        navigate('/interviewer');
        break;
      case 'interviewee':
        navigate('/interviewee');
        break;
      default:
        // For unrecognized roles, redirect to the home page
        navigate('/');
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (data.session) {
        // The user profile and redirection will be handled by the auth state change listener
        toast.success(`Welcome back!`);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        toast.error(authError.message);
        throw authError;
      }

      if (authData.user) {
        // Ensure the role is valid
        const validRole = (userData.role === 'admin' || 
                           userData.role === 'organization' || 
                           userData.role === 'interviewer' || 
                           userData.role === 'interviewee') 
                           ? userData.role as Role 
                           : 'organization';

        // Insert user data into the users table
        const { error: userError } = await supabase
          .from('users')
          .insert({
            user_id: parseInt(authData.user.id),
            work_email: userData.email,
            full_name: userData.name,
            roles: [validRole],
            password_hash: 'managed_by_auth' // We don't store the password hash, it's managed by Supabase Auth
          });

        if (userError) {
          toast.error('Error creating user profile');
          console.error('Error creating user profile:', userError);
          
          // If creating the user profile fails, delete the auth user
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw userError;
        }

        // Create related record based on role
        if (validRole === 'admin') {
          await supabase
            .from('admins')
            .insert({ user_id: parseInt(authData.user.id) });
        } else if (validRole === 'organization') {
          await supabase
            .from('organizations')
            .insert({ 
              user_id: parseInt(authData.user.id), 
              name: userData.company || 'Default Organization' 
            });
        } else if (validRole === 'interviewer') {
          await supabase
            .from('interviewers')
            .insert({ user_id: parseInt(authData.user.id) });
        } else if (validRole === 'interviewee') {
          await supabase
            .from('interviewees')
            .insert({ user_id: parseInt(authData.user.id) });
        }

        toast.success('Account created successfully! Please log in.');
        
        // For better UX, we could automatically log the user in here
        // But for now, we'll just redirect them to the login page
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error('Error signing out');
        throw error;
      }
      
      // Clear user data
      setUser(null);
      setSession(null);
      
      toast.success('You have been logged out');
      navigate('/');
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
        isAuthenticated: !!user && user.id !== 'guest'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
