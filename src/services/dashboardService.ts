
import { supabaseTable, handleSingleResponse } from "@/utils/supabaseHelpers";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardSummary {
  totalInterviews: number;
  completedInterviews: number;
  pendingInterviews: number;
  canceledInterviews: number;
  totalRequirements?: number;
  totalCandidates?: number;
  recentActivity: Activity[];
  interviewTrend: InterviewTrend[];
  statusDistribution: StatusDistribution[];
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  date: string;
  status: string;
}

export interface InterviewTrend {
  name: string;
  interviews: number;
}

export interface StatusDistribution {
  name: string;
  value: number;
}

export interface Organization {
  id: string;
  name: string;
  stats: {
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
  async getOrganization(): Promise<Organization | null> {
    try {
      // Fetch real organization data from Supabase
      // Update: Changed from 'organizations' to 'companies' to match the actual table name
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .limit(1)
        .single();
      
      if (companyError) throw companyError;
      
      // Get interviews count for this organization
      const { count: totalInterviews, error: interviewsError } = await supabase
        .from('interviews')
        .select('*', { count: 'exact', head: true });
      
      if (interviewsError) throw interviewsError;
      
      // Get completed interviews count
      const { count: completedInterviews, error: completedError } = await supabase
        .from('interviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');
      
      if (completedError) throw completedError;
      
      // Get pending interviews count
      const { count: pendingInterviews, error: pendingError } = await supabase
        .from('interviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled');
      
      if (pendingError) throw pendingError;
      
      // Get candidates count
      const { count: totalCandidates, error: candidatesError } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true });
      
      if (candidatesError) throw candidatesError;
      
      // Get jobs/requirements count
      const { count: totalRequirements, error: requirementsError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true });
      
      if (requirementsError) throw requirementsError;
      
      return {
        id: companyData?.company_id?.toString() || "1",
        name: companyData?.company_name || "Example Organization",
        stats: {
          totalInterviews: totalInterviews || 0,
          completedInterviews: completedInterviews || 0,
          pendingInterviews: pendingInterviews || 0,
          totalCandidates: totalCandidates || 0,
          totalRequirements: totalRequirements || 0,
          averageScore: 8.5,
          monthlyData: [
            { month: "Jan", interviews: 5 },
            { month: "Feb", interviews: 8 },
            { month: "Mar", interviews: 12 },
            { month: "Apr", interviews: 15 },
            { month: "May", interviews: 8 }
          ],
          statusDistribution: [
            { name: "Completed", value: completedInterviews || 0 },
            { name: "Pending", value: pendingInterviews || 0 },
            { name: "Canceled", value: 0 }
          ]
        }
      };
    } catch (error: any) {
      console.error('Error fetching organization data:', error);
      return null;
    }
  },

  async getAdminDashboardData(): Promise<DashboardSummary> {
    try {
      // Fetch real data from Supabase
      
      // Get total interviews count
      const { count: totalInterviews, error: interviewsError } = await supabase
        .from('interviews')
        .select('*', { count: 'exact', head: true });
      
      if (interviewsError) throw interviewsError;
      
      // Get completed interviews count
      const { count: completedInterviews, error: completedError } = await supabase
        .from('interviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Completed');
      
      if (completedError) throw completedError;
      
      // Get pending interviews count
      const { count: pendingInterviews, error: pendingError } = await supabase
        .from('interviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled');
      
      if (pendingError) throw pendingError;
      
      // Get canceled interviews count
      const { count: canceledInterviews, error: canceledError } = await supabase
        .from('interviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Canceled');
      
      if (canceledError) throw canceledError;
      
      // Get jobs/requirements count
      const { count: totalRequirements, error: requirementsError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true });
      
      if (requirementsError) throw requirementsError;
      
      // Get candidates count
      const { count: totalCandidates, error: candidatesError } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true });
      
      if (candidatesError) throw candidatesError;
      
      // Get recent activity (last 5 interviews)
      const { data: recentInterviews, error: recentError } = await supabase
        .from('interviews')
        .select(`
          interview_id,
          scheduled_at,
          status,
          candidate_id,
          candidates(name),
          job_id,
          jobs(title)
        `)
        .order('scheduled_at', { ascending: false })
        .limit(5);
      
      if (recentError) throw recentError;
      
      const recentActivity = recentInterviews?.map(interview => ({
        id: interview.interview_id.toString(),
        type: 'interview',
        title: interview.jobs?.title || 'Interview',
        date: interview.scheduled_at,
        status: interview.status
      })) || [];
      
      // Create interview trend data (simplified for now)
      const interviewTrend = [
        { name: 'Week 1', interviews: Math.round(totalInterviews / 4) || 0 },
        { name: 'Week 2', interviews: Math.round(totalInterviews / 3) || 0 },
        { name: 'Week 3', interviews: Math.round(totalInterviews / 2) || 0 },
        { name: 'Week 4', interviews: Math.round(totalInterviews / 1.5) || 0 }
      ];
      
      // Create status distribution data
      const statusDistribution = [
        { name: 'Completed', value: completedInterviews || 0 },
        { name: 'Pending', value: pendingInterviews || 0 },
        { name: 'Canceled', value: canceledInterviews || 0 }
      ];
      
      return {
        totalInterviews: totalInterviews || 0,
        completedInterviews: completedInterviews || 0,
        pendingInterviews: pendingInterviews || 0,
        canceledInterviews: canceledInterviews || 0,
        totalRequirements: totalRequirements || 0,
        totalCandidates: totalCandidates || 0,
        recentActivity,
        interviewTrend,
        statusDistribution
      };
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
      
      // Return empty data structure as fallback
      return {
        totalInterviews: 0,
        completedInterviews: 0,
        pendingInterviews: 0,
        canceledInterviews: 0,
        recentActivity: [],
        interviewTrend: [],
        statusDistribution: []
      };
    }
  },
  
  async getOrganizationDashboardData(userId: string): Promise<DashboardSummary> {
    try {
      // In a real app, this would fetch actual data from Supabase filtered by the organization
      
      // Mock data for now
      return {
        totalInterviews: 48,
        completedInterviews: 32,
        pendingInterviews: 16,
        canceledInterviews: 4,
        totalRequirements: 12,
        totalCandidates: 75,
        recentActivity: [
          {
            id: '1',
            type: 'interview',
            title: 'Frontend Developer',
            date: '2023-09-14T14:00:00',
            status: 'completed'
          },
          // ... more activity items
        ],
        interviewTrend: [
          { name: 'Week 1', interviews: 8 },
          { name: 'Week 2', interviews: 12 },
          { name: 'Week 3', interviews: 10 },
          { name: 'Week 4', interviews: 18 }
        ],
        statusDistribution: [
          { name: 'Completed', value: 32 },
          { name: 'Pending', value: 16 },
          { name: 'Canceled', value: 4 }
        ]
      };
    } catch (error) {
      console.error('Error fetching organization dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
      
      // Return empty data structure as fallback
      return {
        totalInterviews: 0,
        completedInterviews: 0,
        pendingInterviews: 0,
        canceledInterviews: 0,
        recentActivity: [],
        interviewTrend: [],
        statusDistribution: []
      };
    }
  },
  
  async getInterviewerDashboardData(userId: string): Promise<DashboardSummary> {
    try {
      // In a real app, this would fetch actual data from Supabase filtered by the interviewer
      
      // Mock data for now
      return {
        totalInterviews: 24,
        completedInterviews: 18,
        pendingInterviews: 6,
        canceledInterviews: 2,
        recentActivity: [
          {
            id: '1',
            type: 'interview',
            title: 'React Native Developer',
            date: '2023-09-16T11:00:00',
            status: 'pending'
          },
          // ... more activity items
        ],
        interviewTrend: [
          { name: 'Week 1', interviews: 5 },
          { name: 'Week 2', interviews: 8 },
          { name: 'Week 3', interviews: 5 },
          { name: 'Week 4', interviews: 6 }
        ],
        statusDistribution: [
          { name: 'Completed', value: 18 },
          { name: 'Pending', value: 6 },
          { name: 'Canceled', value: 2 }
        ]
      };
    } catch (error) {
      console.error('Error fetching interviewer dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
      
      // Return empty data structure as fallback
      return {
        totalInterviews: 0,
        completedInterviews: 0,
        pendingInterviews: 0,
        canceledInterviews: 0,
        recentActivity: [],
        interviewTrend: [],
        statusDistribution: []
      };
    }
  },
  
  async getIntervieweeDashboardData(userId: string): Promise<DashboardSummary> {
    try {
      // In a real app, this would fetch actual data from Supabase filtered by the interviewee
      
      // Mock data for now
      return {
        totalInterviews: 6,
        completedInterviews: 4,
        pendingInterviews: 2,
        canceledInterviews: 0,
        recentActivity: [
          {
            id: '1',
            type: 'interview',
            title: 'Junior Developer',
            date: '2023-09-18T15:00:00',
            status: 'pending'
          },
          // ... more activity items
        ],
        interviewTrend: [
          { name: 'Week 1', interviews: 1 },
          { name: 'Week 2', interviews: 2 },
          { name: 'Week 3', interviews: 1 },
          { name: 'Week 4', interviews: 2 }
        ],
        statusDistribution: [
          { name: 'Completed', value: 4 },
          { name: 'Pending', value: 2 },
          { name: 'Canceled', value: 0 }
        ]
      };
    } catch (error) {
      console.error('Error fetching interviewee dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
      
      // Return empty data structure as fallback
      return {
        totalInterviews: 0,
        completedInterviews: 0,
        pendingInterviews: 0,
        canceledInterviews: 0,
        recentActivity: [],
        interviewTrend: [],
        statusDistribution: []
      };
    }
  }
};
