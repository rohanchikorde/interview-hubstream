import { supabase } from '@/integrations/supabase/client';
import { supabaseTable, handleSingleResponse, handleMultipleResponse } from '@/utils/supabaseHelpers';

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

interface Organization {
  id?: string;
  name?: string;
  stats?: {
    totalInterviews?: number;
    completedInterviews?: number;
    pendingInterviews?: number;
    totalCandidates?: number;
    totalRequirements?: number;
    averageScore?: number;
    monthlyData?: {
      month: string;
      interviews: number;
    }[];
    statusDistribution?: {
      name: string;
      value: number;
    }[];
  };
}

export const dashboardService = {
  /**
   * Get organization data for the current user
   */
  async getOrganization(): Promise<Organization | null> {
    try {
      // This is temporary mock data for organization dashboard
      // In a real implementation, this would fetch from the organizations table
      const mockOrg: Organization = {
        id: '1',
        name: 'Acme Corporation',
        stats: {
          totalInterviews: 248,
          completedInterviews: 187,
          pendingInterviews: 61,
          totalCandidates: 352,
          totalRequirements: 15,
          averageScore: 8.2,
          monthlyData: [
            { month: 'Jan', interviews: 12 },
            { month: 'Feb', interviews: 19 },
            { month: 'Mar', interviews: 23 },
            { month: 'Apr', interviews: 17 },
            { month: 'May', interviews: 28 },
            { month: 'Jun', interviews: 32 }
          ],
          statusDistribution: [
            { name: 'Completed', value: 187 },
            { name: 'Scheduled', value: 42 },
            { name: 'Canceled', value: 14 },
            { name: 'Pending', value: 5 }
          ]
        }
      };
      
      return mockOrg;
    } catch (error) {
      console.error('Error in getOrganization:', error);
      return null;
    }
  },

  /**
   * Get dashboard data for Admin role
   */
  async getAdminDashboardData(): Promise<DashboardSummary> {
    try {
      // Fetch counts for various entities
      const [
        interviewsResponse,
        interviewersResponse,
        intervieweesResponse, 
        orgsResponse,
        pendingRequestsResponse,
        upcomingInterviewsResponse,
        completedInterviewsResponse
      ] = await Promise.all([
        supabaseTable('interviews').select('*', { count: 'exact', head: true }),
        supabaseTable('interviewers').select('*', { count: 'exact', head: true }),
        supabaseTable('interviewees').select('*', { count: 'exact', head: true }),
        supabaseTable('organizations').select('*', { count: 'exact', head: true }),
        supabaseTable('demo_requests').select('*').eq('status', 'pending'),
        supabaseTable('interviews').select('*').eq('status', 'scheduled').gt('date_time', new Date().toISOString()),
        supabaseTable('interviews').select('*').eq('status', 'completed')
      ]);

      const pendingRequests = handleMultipleResponse(pendingRequestsResponse);
      const upcomingInterviews = handleMultipleResponse(upcomingInterviewsResponse);
      const completedInterviews = handleMultipleResponse(completedInterviewsResponse);

      return {
        counts: {
          interviews: interviewsResponse.count || 0,
          interviewers: interviewersResponse.count || 0,
          interviewees: intervieweesResponse.count || 0,
          companies: orgsResponse.count || 0,
          pendingRequests: pendingRequests.length || 0,
          upcomingInterviews: upcomingInterviews.length || 0,
          completedInterviews: completedInterviews.length || 0
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
      const orgResponse = await supabaseTable('organizations')
        .select('id')
        .eq('user_id', userId)
        .single();

      const orgData = handleSingleResponse<any>(orgResponse);

      if (!orgData) {
        throw new Error('Failed to find organization data');
      }

      const organizationId = orgData.id;

      if (!organizationId) {
        throw new Error('Organization ID is undefined');
      }

      // Fetch data for this organization
      const [
        interviewsResponse, 
        upcomingInterviewsResponse,
        completedInterviewsResponse
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

      const interviews = handleMultipleResponse(interviewsResponse);
      const upcomingInterviews = handleMultipleResponse(upcomingInterviewsResponse);
      const completedInterviews = handleMultipleResponse(completedInterviewsResponse);

      return {
        counts: {
          interviews: interviews.length || 0,
          upcomingInterviews: upcomingInterviews.length || 0,
          completedInterviews: completedInterviews.length || 0
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
      const interviewerResponse = await supabaseTable('interviewers')
        .select('id')
        .eq('user_id', userId)
        .single();

      const interviewerData = handleSingleResponse<any>(interviewerResponse);

      if (!interviewerData) {
        throw new Error('Failed to find interviewer data');
      }

      const interviewerId = interviewerData.id;

      // Fetch data for this interviewer
      const [
        upcomingInterviewsResponse,
        completedInterviewsResponse,
        canceledInterviewsResponse
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

      const upcomingInterviews = handleMultipleResponse(upcomingInterviewsResponse);
      const completedInterviews = handleMultipleResponse(completedInterviewsResponse);
      const canceledInterviews = handleMultipleResponse(canceledInterviewsResponse);

      return {
        counts: {
          interviews: upcomingInterviews.length + completedInterviews.length + canceledInterviews.length,
          upcomingInterviews: upcomingInterviews.length || 0,
          completedInterviews: completedInterviews.length || 0,
          canceledInterviews: canceledInterviews.length || 0
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
      const intervieweeResponse = await supabaseTable('interviewees')
        .select('id')
        .eq('user_id', userId)
        .single();

      const intervieweeData = handleSingleResponse<any>(intervieweeResponse);

      if (!intervieweeData) {
        throw new Error('Interviewee data is null');
      }

      const intervieweeId = intervieweeData.id;

      // Fetch data for this interviewee
      const [
        upcomingInterviewsResponse,
        completedInterviewsResponse,
        mockInterviewsResponse
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

      const upcomingInterviews = handleMultipleResponse(upcomingInterviewsResponse);
      const completedInterviews = handleMultipleResponse(completedInterviewsResponse);
      const mockInterviews = handleMultipleResponse(mockInterviewsResponse);

      return {
        counts: {
          interviews: upcomingInterviews.length + completedInterviews.length,
          upcomingInterviews: upcomingInterviews.length || 0,
          completedInterviews: completedInterviews.length || 0,
          scheduledMocks: mockInterviews.length || 0
        }
      };
    } catch (error) {
      console.error('Error in getIntervieweeDashboardData:', error);
      throw error;
    }
  }
};
