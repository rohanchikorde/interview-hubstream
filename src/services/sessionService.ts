
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/contexts/AuthContext";

/**
 * Service to handle session management
 */
export const sessionService = {
  /**
   * Get the current session from supabase
   * @returns The current session object or null if no session
   */
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error.message);
      return null;
    }
    return data.session;
  },
  
  /**
   * Get the current user from supabase
   * @returns The current user object or null if not logged in
   */
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error getting user:", error.message);
      return null;
    }
    return data.user;
  },
  
  /**
   * Check if the user has a specific role
   * @param role The role to check for
   * @returns True if the user has the specified role, false otherwise
   */
  hasRole: async (role: UserRole): Promise<boolean> => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return false;
    }
    
    const userRole = data.user.user_metadata?.role as UserRole | undefined;
    return userRole === role;
  },
  
  /**
   * Get the user's role
   * @returns The user's role or null if not logged in
   */
  getUserRole: async (): Promise<UserRole | null> => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return null;
    }
    
    return (data.user.user_metadata?.role as UserRole) || null;
  },

  /**
   * Get user profile data from the appropriate table based on role
   * @param userId The user's ID
   * @param role The user's role
   * @returns The user's profile data or null if not found
   */
  getUserProfileByRole: async (userId: string, role: UserRole): Promise<any | null> => {
    try {
      let data = null;
      
      switch (role) {
        case 'admin':
          // Fetch admin profile
          const { data: adminData, error: adminError } = await supabase
            .from('users')
            .select('*')
            .eq('work_email', userId) // Using work_email as a unique identifier instead of user_id
            .single();
          
          if (adminError) throw adminError;
          data = adminData;
          break;
          
        case 'organization':
          // Fetch organization profile
          const { data: orgData, error: orgError } = await supabase
            .from('companies')
            .select('*')
            .eq('company_name', userId) // Using company_name instead of company_id
            .single();
          
          if (orgError) throw orgError;
          data = orgData;
          break;
          
        case 'interviewer':
          // First, get the user to find their user_id
          const { data: interviewerUser, error: interviewerUserError } = await supabase
            .from('users')
            .select('user_id')
            .eq('work_email', userId)
            .single();
            
          if (interviewerUserError) throw interviewerUserError;
          
          // Then use the user_id to get the interviewer record
          if (interviewerUser?.user_id) {
            const { data: interviewerData, error: interviewerError } = await supabase
              .from('interviewers')
              .select('*')
              .eq('user_id', interviewerUser.user_id)
              .single();
            
            if (interviewerError) throw interviewerError;
            data = { ...interviewerData, work_email: userId };
          }
          break;
          
        case 'interviewee':
          // First, get the user to find their user_id
          const { data: intervieweeUser, error: intervieweeUserError } = await supabase
            .from('users')
            .select('user_id')
            .eq('work_email', userId)
            .single();
            
          if (intervieweeUserError) throw intervieweeUserError;
          
          // Then use the user_id to get the candidate record
          if (intervieweeUser?.user_id) {
            const { data: intervieweeData, error: intervieweeError } = await supabase
              .from('candidates')
              .select('*')
              .eq('user_id', intervieweeUser.user_id)
              .single();
            
            if (intervieweeError) throw intervieweeError;
            data = { ...intervieweeData, work_email: userId };
          }
          break;
          
        default:
          return null;
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${role} profile:`, error);
      return null;
    }
  },
  
  /**
   * Set a persistent authentication state
   * @param key The key to store the data under
   * @param value The value to store
   */
  setPersistentState: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Error storing persistent state:", e);
    }
  },
  
  /**
   * Get a persistent authentication state
   * @param key The key to retrieve the data from
   * @param defaultValue The default value to return if the key doesn't exist
   * @returns The stored value or the default value
   */
  getPersistentState: (key: string, defaultValue: any = null): any => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (e) {
      console.error("Error retrieving persistent state:", e);
      return defaultValue;
    }
  },
  
  /**
   * Clear all persistent authentication state
   */
  clearPersistentState: (): void => {
    try {
      // Only clear authentication-related items
      const authKeys = ['sb-session', 'sb-user', 'last-active'];
      authKeys.forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.error("Error clearing persistent state:", e);
    }
  }
};

export default sessionService;
