
import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleAuthOperation } from '@/utils/supabaseHelpers';

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
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
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        
        // Create user profile
        await handleRoleBasedData(data.user?.id || '', credentials.role, credentials);
        
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

  // In the registerUser function, replace the problematic table calls
  const handleRoleBasedData = async (userId: string, role: string, formData: any) => {
    try {
      if (role === "admin") {
        // Use raw query for user_id as string to avoid type errors
        await supabase.from("users")
          .insert({
            full_name: formData.name,
            work_email: formData.email,
            password_hash: "managed_by_supabase",
            roles: { role: "admin" }
          });
      } else if (role === "organization") {
        await supabase.from("companies")
          .insert({
            company_name: formData.company || "New Company"
          });
      } else if (role === "interviewer") {
        await supabase.from("interviewers")
          .insert({
            expertise: formData.skills || []
          });
      } else if (role === "interviewee") {
        await supabase.from("candidates")
          .insert({
            email: formData.email,
            name: formData.name
          });
      }
      // Continue with any additional logic...
    } catch (error) {
      console.error("Error creating user role data:", error);
      toast.error("Failed to set up user account");
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
