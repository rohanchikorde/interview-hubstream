import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleAuthOperation } from '@/utils/supabaseHelpers';
import sessionService from '@/services/sessionService';

// Define the allowed user roles
export type UserRole = 'admin' | 'organization' | 'interviewer' | 'interviewee';

// Define a custom User type that extends SupabaseUser with the properties we need
export interface User extends SupabaseUser {
  name?: string;
  company?: string;
  role?: UserRole;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (credentials: any) => Promise<void>;
  signIn: (credentials: any) => Promise<void>;
  signOut: (redirect?: boolean) => Promise<void>;
  updateUser: (data: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: (redirect?: boolean) => Promise<void>;
  getUserRole: () => UserRole | null;
  getDashboardPath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        // Enhance user object with user metadata
        const enhancedUser = {
          ...session.user,
          name: session.user.user_metadata?.full_name || '',
          company: session.user.user_metadata?.company || '',
          role: session.user.user_metadata?.role || ''
        };
        setUser(enhancedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    getSession();

    // Set up auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      
      if (session?.user) {
        // Enhance user object with user metadata
        const enhancedUser = {
          ...session.user,
          name: session.user.user_metadata?.full_name || '',
          company: session.user.user_metadata?.company || '',
          role: session.user.user_metadata?.role || ''
        };
        setUser(enhancedUser);
        setIsAuthenticated(true);
        
        // If the user just signed in, redirect to their dashboard
        if (event === 'SIGNED_IN') {
          const role = session.user.user_metadata?.role as UserRole;
          const dashboardPath = getDashboardRouteByRole(role);
          navigate(dashboardPath);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        
        // If the user just signed out, redirect to login
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Get the user's role
  const getUserRole = (): UserRole | null => {
    return user?.role as UserRole || null;
  };

  // Get the appropriate dashboard path based on the user's role
  const getDashboardPath = (): string => {
    const role = getUserRole();
    switch (role) {
      case 'admin':
        return '/dashboard';
      case 'organization':
        return '/organization';
      case 'interviewer':
        return '/interviewer';
      case 'interviewee':
        return '/interviewee';
      default:
        return '/login';
    }
  };

  // Register function
  const register = async (userData: any) => {
    return signUp(userData);
  };

  // Login function
  const login = async (email: string, password: string) => {
    return signIn({ email, password });
  };

  // Logout function
  const logout = async (redirect: boolean = true) => {
    return signOut(redirect);
  };

  const signUp = async (credentials: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await handleAuthOperation(() => supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.name,
            phone_number: credentials.phone,
            role: credentials.role,
            company: credentials.company
          },
        },
      }));

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created successfully! Please check your email to verify.');
        
        // Create user profile in the appropriate table based on role
        if (data.user) {
          await createUserProfileByRole(data.user.id, credentials);
        }
        
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (credentials: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await handleAuthOperation(() => supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      }));

      if (error) {
        toast.error(error.message);
      } else {
        // Get user with role
        const role = data.user?.user_metadata?.role || 'interviewee';
        
        toast.success(`Welcome back, ${data.user?.user_metadata?.full_name || 'User'}!`);
        
        // Redirect to the appropriate dashboard based on role
        const dashboardPath = getDashboardRouteByRole(role as UserRole);
        navigate(dashboardPath);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (redirect: boolean = true) => {
    setIsLoading(true);
    try {
      const { error } = await handleAuthOperation(() => supabase.auth.signOut());
      if (error) {
        toast.error(error.message);
      } else {
        // Clear any persistent state
        sessionService.clearPersistentState();
        
        toast.success('Signed out successfully!');
        if (redirect) {
          navigate('/login');
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUser = async (data: any) => {
    setIsLoading(true);
    try {
      const { error } = await handleAuthOperation(() => supabase.auth.updateUser(data));
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Profile updated successfully!');
        setUser((prevUser) => {
          if (!prevUser) return null;
          return { ...prevUser, ...data.data };
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get the route path based on user role
  const getDashboardRouteByRole = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return '/dashboard';
      case 'organization':
        return '/organization';
      case 'interviewer':
        return '/interviewer';
      case 'interviewee':
        return '/interviewee';
      default:
        return '/login';
    }
  };

  // Create user profile based on role
  const createUserProfileByRole = async (userId: string, userData: any) => {
    try {
      const role = userData.role as UserRole;
      
      switch (role) {
        case 'admin':
          // Create admin user in the users table, omitting user_id if it's a string
          await supabase.from("users").insert({
            // We omit user_id since it's expected to be a number but we have a string UUID
            full_name: userData.name,
            work_email: userData.email,
            password_hash: "managed_by_supabase",
            roles: { role: "admin" },
            is_verified: true
          });
          break;
          
        case 'organization':
          // Create organization in the companies table, omitting company_id
          await supabase.from("companies").insert({
            // We omit company_id since it's expected to be a number but we have a string UUID
            company_name: userData.company || userData.name,
            subscription_tier: 'basic'
          });
          
          // Also create entry in users table
          await supabase.from("users").insert({
            // We omit user_id
            full_name: userData.name,
            work_email: userData.email,
            password_hash: "managed_by_supabase",
            roles: { role: "organization" },
            is_verified: true
          });
          
          // Create company_team entry to link user to company
          await supabase.from("company_team").insert({
            // We don't include numeric IDs for string UUIDs
            role: 'client_admin'
          });
          break;
          
        case 'interviewer':
          // Create interviewer in the interviewers table
          await supabase.from("interviewers").insert({
            // We omit user_id and interviewer_id
            expertise: userData.skills ? JSON.parse(userData.skills) : [],
            is_active: true
          });
          
          // Also create entry in users table
          await supabase.from("users").insert({
            // We omit user_id
            full_name: userData.name,
            work_email: userData.email,
            password_hash: "managed_by_supabase",
            roles: { role: "interviewer" },
            is_verified: true
          });
          break;
          
        case 'interviewee':
          // Create candidate in the candidates table
          await supabase.from("candidates").insert({
            // We omit user_id and candidate_id
            // Fix the source value to use a valid enum value and rename 'name' to match the field name in DB
            email: userData.email,
            name: userData.name, // Using 'name' field which exists in the candidates table
            source: 'client_upload' // Using a valid enum value from "client_upload" | "internal"
          });
          
          // Also create entry in users table
          await supabase.from("users").insert({
            // We omit user_id
            full_name: userData.name,
            work_email: userData.email,
            password_hash: "managed_by_supabase",
            roles: { role: "interviewee" },
            is_verified: true
          });
          break;
          
        default:
          console.warn(`Unknown role: ${role}`);
      }
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw new Error("Failed to create user profile");
    }
  };

  const value: AuthContextType = {
    session,
    user,
    isLoading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    updateUser,
    login,
    register,
    logout,
    getUserRole,
    getDashboardPath
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
