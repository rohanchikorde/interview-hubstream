import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signUp: (credentials: any) => Promise<void>;
  signIn: (credentials: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    };

    getSession();

    supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      setUser(session?.user || null);
    });
  }, []);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user || null);
    });
  }, []);

  const signUp = async (credentials: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.name,
            phone_number: credentials.phone,
            role: credentials.role,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created successfully! Please check your email to verify.');
        
        // Create user profile
        await handleRoleBasedData(data.user?.id || '', credentials.role, credentials);
        
        navigate('/auth/verify-email');
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
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed in successfully!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed out successfully!');
        navigate('/auth/sign-in');
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
      const { error } = await supabase.auth.updateUser(data);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Profile updated successfully!');
        setUser((prevUser) => ({ ...prevUser, ...data.data }));
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // In the registerUser function, replace the problematic table calls
  const handleRoleBasedData = async (userId: string, role: string, formData: any) => {
    try {
      if (role === "admin") {
        // Use supabase.from directly to avoid type issues
        await supabase.from("users")
          .insert({
            user_id: userId, 
            role: "admin"
          });
    } else if (role === "organization") {
      await supabase.from("companies")
        .insert({
          company_id: parseInt(userId),
          company_name: formData.company || "New Company"
        });
    } else if (role === "interviewer") {
      await supabase.from("interviewers")
        .insert({
          user_id: parseInt(userId),
          expertise: formData.skills || []
        });
    } else if (role === "interviewee") {
      await supabase.from("candidates")
        .insert({
          user_id: parseInt(userId),
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
    signUp,
    signIn,
    signOut,
    updateUser,
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
