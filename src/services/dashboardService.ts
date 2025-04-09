
import { supabaseTable, handleSingleResponse } from "@/utils/supabaseHelpers";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
      // This is a stub implementation - in a real app, we would fetch organization data from Supabase
      return {
        id: "1",
        name: "Example Organization",
        stats: {
          totalInterviews: 48,
          completedInterviews: 32,
          pendingInterviews: 16,
          totalCandidates: 75,
          totalRequirements: 12,
          averageScore: 8.5,
          monthlyData: [
            { month: "Jan", interviews: 5 },
            { month: "Feb", interviews: 8 },
            { month: "Mar", interviews: 12 },
            { month: "Apr", interviews: 15 },
            { month: "May", interviews: 8 }
          ],
          statusDistribution: [
            { name: "Completed", value: 32 },
            { name: "Pending", value: 16 },
            { name: "Canceled", value: 4 },
            { name: "No-Show", value: 3 }
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
      // In a real app, this would fetch actual data from Supabase
      
      // Mock data for now
      return {
        totalInterviews: 124,
        completedInterviews: 98,
        pendingInterviews: 26,
        canceledInterviews: 12,
        totalRequirements: 45,
        totalCandidates: 210,
        recentActivity: [
          {
            id: '1',
            type: 'interview',
            title: 'Senior React Developer',
            date: '2023-09-15T10:00:00',
            status: 'completed'
          },
          // ... more activity items
        ],
        interviewTrend: [
          { name: 'Week 1', interviews: 12 },
          { name: 'Week 2', interviews: 19 },
          { name: 'Week 3', interviews: 15 },
          { name: 'Week 4', interviews: 22 }
        ],
        statusDistribution: [
          { name: 'Completed', value: 98 },
          { name: 'Pending', value: 26 },
          { name: 'Canceled', value: 12 }
        ]
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
