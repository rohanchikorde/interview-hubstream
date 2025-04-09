
import { supabase } from '@/integrations/supabase/client';
import { supabaseTable } from '@/utils/supabaseHelpers';

interface DashboardSummary {
  counts: {
    interviews: number;
    interviewers?: number;
    interviewees?: number;
    companies?: number;
    pendingRequests?: number;
    upcomingInterviews: number;
    completedInterviews: number;
    canceledInterviews?: number;
    scheduledMocks?: number; 
  };
  recentActivity?: any[];
}

export const dashboardService = {
  /**
   * Get dashboard data for Admin role
   */
  async getAdminDashboardData(): Promise<DashboardSummary> {
    try {
      // Fetch counts for various entities
      const [
        { count: interviewsCount, error: interviewsError },
        { count: interviewersCount, error: interviewersError },
        { count: intervieweesCount, error: intervieweesError },
        { count: organizationsCount, error: orgsError },
        { data: pendingRequests, error: pendingError },
        { data: upcomingInterviews, error: upcomingError },
        { data: completedInterviews, error: completedError }
      ] = await Promise.all([
        supabaseTable('interviews').select('*', { count: 'exact', head: true }),
        supabaseTable('interviewers').select('*', { count: 'exact', head: true }),
        supabaseTable('interviewees').select('*', { count: 'exact', head: true }),
        supabaseTable('organizations').select('*', { count: 'exact', head: true }),
        supabaseTable('demo_requests').select('*').eq('status', 'pending'),
        supabaseTable('interviews').select('*').eq('status', 'scheduled').gt('date_time', new Date().toISOString()),
        supabaseTable('interviews').select('*').eq('status', 'completed')
      ]);

      if (interviewsError || interviewersError || intervieweesError || orgsError || pendingError || upcomingError || completedError) {
        console.error('Error fetching admin dashboard data');
        throw new Error('Failed to load dashboard data');
      }

      return {
        counts: {
          interviews: interviewsCount || 0,
          interviewers: interviewersCount || 0,
          interviewees: intervieweesCount || 0,
          companies: organizationsCount || 0,
          pendingRequests: pendingRequests?.length || 0,
          upcomingInterviews: upcomingInterviews?.length || 0,
          completedInterviews: completedInterviews?.length || 0
        }
      };
    } catch (error) {
      console.error('Error in getAdminDashboardData:', error);
      throw error;
    }
  },

  /**
   * Get dashboard data for Organization role
   */
  async getOrganizationDashboardData(userId: string): Promise<DashboardSummary> {
    try {
      // First get the organization ID for this user
      const { data: orgData, error: orgError } = await supabaseTable('organizations')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (orgError) {
        throw new Error('Failed to find organization data');
      }

      const organizationId = orgData?.id;

      if (!organizationId) {
        throw new Error('Organization ID is undefined');
      }

      // Fetch data for this organization
      const [
        { data: interviews, error: interviewsError },
        { data: upcomingInterviews, error: upcomingError },
        { data: completedInterviews, error: completedError }
      ] = await Promise.all([
        supabaseTable('interviews').select('*').eq('organization_id', organizationId),
        supabaseTable('interviews')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('status', 'scheduled')
          .gt('date_time', new Date().toISOString()),
        supabaseTable('interviews')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('status', 'completed')
      ]);

      if (interviewsError || upcomingError || completedError) {
        throw new Error('Failed to load organization dashboard data');
      }

      return {
        counts: {
          interviews: interviews?.length || 0,
          upcomingInterviews: upcomingInterviews?.length || 0,
          completedInterviews: completedInterviews?.length || 0
        }
      };
    } catch (error) {
      console.error('Error in getOrganizationDashboardData:', error);
      throw error;
    }
  },

  /**
   * Get dashboard data for Interviewer role
   */
  async getInterviewerDashboardData(userId: string): Promise<DashboardSummary> {
    try {
      // First get the interviewer ID for this user
      const { data: interviewerData, error: interviewerError } = await supabaseTable('interviewers')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (interviewerError) {
        throw new Error('Failed to find interviewer data');
      }

      if (!interviewerData) {
        throw new Error('Interviewer data is null');
      }

      const interviewerId = interviewerData.id;

      // Fetch data for this interviewer
      const [
        { data: upcomingInterviews, error: upcomingError },
        { data: completedInterviews, error: completedError },
        { data: canceledInterviews, error: canceledError }
      ] = await Promise.all([
        supabaseTable('interviews')
          .select('*')
          .eq('interviewer_id', interviewerId)
          .eq('status', 'scheduled')
          .gt('date_time', new Date().toISOString()),
        supabaseTable('interviews')
          .select('*')
          .eq('interviewer_id', interviewerId)
          .eq('status', 'completed'),
        supabaseTable('interviews')
          .select('*')
          .eq('interviewer_id', interviewerId)
          .eq('status', 'cancelled') // Fixed: changed from 'canceled' to 'cancelled'
      ]);

      if (upcomingError || completedError || canceledError) {
        throw new Error('Failed to load interviewer dashboard data');
      }

      return {
        counts: {
          interviews: (upcomingInterviews?.length || 0) + (completedInterviews?.length || 0) + (canceledInterviews?.length || 0),
          upcomingInterviews: upcomingInterviews?.length || 0,
          completedInterviews: completedInterviews?.length || 0,
          canceledInterviews: canceledInterviews?.length || 0
        }
      };
    } catch (error) {
      console.error('Error in getInterviewerDashboardData:', error);
      throw error;
    }
  },

  /**
   * Get dashboard data for Interviewee role
   */
  async getIntervieweeDashboardData(userId: string): Promise<DashboardSummary> {
    try {
      // First get the interviewee ID for this user
      const { data: intervieweeData, error: intervieweeError } = await supabaseTable('interviewees')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (intervieweeError) {
        throw new Error('Failed to find interviewee data');
      }

      if (!intervieweeData) {
        throw new Error('Interviewee data is null');
      }

      const intervieweeId = intervieweeData.id;

      // Fetch data for this interviewee
      const [
        { data: upcomingInterviews, error: upcomingError },
        { data: completedInterviews, error: completedError },
        { data: mockInterviews, error: mockError }
      ] = await Promise.all([
        supabaseTable('interviews')
          .select('*')
          .eq('interviewee_id', intervieweeId)
          .eq('status', 'scheduled')
          .gt('date_time', new Date().toISOString()),
        supabaseTable('interviews')
          .select('*')
          .eq('interviewee_id', intervieweeId)
          .eq('status', 'completed'),
        supabaseTable('mock_interviews')
          .select('*')
          .eq('interviewee_id', intervieweeId)
      ]);

      if (upcomingError || completedError || mockError) {
        throw new Error('Failed to load interviewee dashboard data');
      }

      return {
        counts: {
          interviews: (upcomingInterviews?.length || 0) + (completedInterviews?.length || 0),
          upcomingInterviews: upcomingInterviews?.length || 0,
          completedInterviews: completedInterviews?.length || 0,
          scheduledMocks: mockInterviews?.length || 0
        }
      };
    } catch (error) {
      console.error('Error in getIntervieweeDashboardData:', error);
      throw error;
    }
  }
};
