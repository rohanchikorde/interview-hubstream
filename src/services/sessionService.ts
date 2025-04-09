
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
   * @param userId The user's ID (typically email)
   * @param role The user's role
   * @returns The user's profile data or null if not found
   */
  getUserProfileByRole: async (userId: string, role: UserRole): Promise<any | null> => {
    try {
      let data = null;
      // Get the auth user ID from Supabase auth
      const { data: authUserData } = await supabase.auth.getUser();
      const authUserId = authUserData?.user?.id;
      
      switch (role) {
        case 'admin':
          // Fetch admin profile directly connecting with auth user ID
          const { data: adminData, error: adminError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_user_id', authUserId)
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
          // Get interviewer data by auth_user_id
          if (authUserId) {
            const { data: interviewerData, error: interviewerError } = await supabase
              .from('interviewers')
              .select('*')
              .eq('auth_user_id', authUserId)
              .single();
            
            if (interviewerError) {
              // Fallback to the old approach if auth_user_id isn't set yet
              const { data: userRecord } = await supabase
                .from('users')
                .select('user_id')
                .eq('work_email', userId)
                .single();
              
              if (userRecord?.user_id) {
                const { data: fallbackData, error: fallbackError } = await supabase
                  .from('interviewers')
                  .select('*')
                  .eq('user_id', userRecord.user_id)
                  .single();
                
                if (!fallbackError) {
                  data = { ...fallbackData, work_email: userId };
                  // Update the interviewer with the auth_user_id for next time
                  await supabase
                    .from('interviewers')
                    .update({ auth_user_id: authUserId })
                    .eq('user_id', userRecord.user_id);
                }
              }
            } else {
              data = { ...interviewerData, work_email: userId };
            }
          }
          break;
          
        case 'interviewee':
          // Get candidate data by auth_user_id
          if (authUserId) {
            const { data: intervieweeData, error: intervieweeError } = await supabase
              .from('candidates')
              .select('*')
              .eq('auth_user_id', authUserId)
              .single();
            
            if (intervieweeError) {
              // Fallback to the old approach if auth_user_id isn't set yet
              const { data: userRecord } = await supabase
                .from('users')
                .select('user_id')
                .eq('work_email', userId)
                .single();
              
              if (userRecord?.user_id) {
                const { data: fallbackData, error: fallbackError } = await supabase
                  .from('candidates')
                  .select('*')
                  .eq('user_id', userRecord.user_id)
                  .single();
                
                if (!fallbackError) {
                  data = { ...fallbackData, work_email: userId };
                  // Update the candidate with the auth_user_id for next time
                  await supabase
                    .from('candidates')
                    .update({ auth_user_id: authUserId })
                    .eq('user_id', userRecord.user_id);
                }
              }
            } else {
              data = { ...intervieweeData, work_email: userId };
            }
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
