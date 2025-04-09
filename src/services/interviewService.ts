
import { supabaseTable, handleSingleResponse, handleMultipleResponse, castResult } from "@/utils/supabaseHelpers";
import { 
  Interview, 
  InterviewWithDetails, 
  ScheduleInterviewRequest, 
  UpdateInterviewStatusRequest,
  AddInterviewFeedbackRequest,
  InterviewStatus
} from "@/types/interview";
import { toast } from "sonner";

export const interviewService = {
  async scheduleInterview(request: ScheduleInterviewRequest): Promise<Interview | null> {
    try {
      // Map request to interviews table structure
      const response = await supabaseTable('interviews')
        .insert({
          candidate_id: parseInt(request.candidate_id),
          interviewer_id: parseInt(request.interviewer_id),
          job_id: parseInt(request.requirement_id), // Using job_id as equivalent
          scheduled_at: request.scheduled_at,
          status: 'scheduled', // Default status
        })
        .select()
        .single();

      const data = handleSingleResponse<any>(response);
      
      if (!data) {
        throw new Error('Failed to insert interview');
      }
      
      // Map DB response to Interview type
      const interview: Interview = {
        id: data.interview_id.toString(),
        candidate_id: data.candidate_id.toString(),
        interviewer_id: data.interviewer_id.toString(),
        requirement_id: data.job_id.toString(),
        scheduled_at: data.scheduled_at,
        status: mapDBStatusToInterviewStatus(data.status),
        created_at: data.created_at,
        updated_at: data.created_at,
      };
      
      return interview;
    } catch (error: any) {
      toast.error(`Failed to schedule interview: ${error.message}`);
      return null;
    }
  },

  async getInterviews(filters?: { status?: InterviewStatus }): Promise<InterviewWithDetails[]> {
    try {
      let query = supabaseTable('interviews')
        .select(`
          *,
          candidates (name, email),
          interviewers (user_id, availability),
          jobs (title, description)
        `);

      if (filters?.status) {
        // Map to DB status
        const dbStatus = mapInterviewStatusToDBStatus(filters.status);
        query = query.eq('status', dbStatus);
      }

      const { data, error } = await query.order('scheduled_at', { ascending: true });

      if (error) throw error;

      // Map data to InterviewWithDetails format
      const interviews: InterviewWithDetails[] = (data || []).map((interview: any) => ({
        id: interview.interview_id?.toString(),
        candidate_id: interview.candidate_id?.toString(),
        interviewer_id: interview.interviewer_id?.toString(),
        requirement_id: interview.job_id?.toString(),
        scheduled_at: interview.scheduled_at,
        status: mapDBStatusToInterviewStatus(interview.status),
        feedback: interview.interviewer_notes ? { 
          rating: 0, // Default value
          comments: interview.interviewer_notes 
        } : null,
        created_at: interview.created_at,
        updated_at: interview.updated_at || interview.created_at,
        candidate_name: interview.candidates?.name || '',
        interviewer_name: '', // Would need to join with users table
        requirement_title: interview.jobs?.title || ''
      }));
      
      return interviews;
    } catch (error: any) {
      toast.error(`Failed to fetch interviews: ${error.message}`);
      return [];
    }
  },

  async getInterviewById(id: string): Promise<InterviewWithDetails | null> {
    try {
      const response = await supabaseTable('interviews')
        .select(`
          *,
          candidates (name, email),
          interviewers (user_id, availability),
          jobs (title, description)
        `)
        .eq('interview_id', parseInt(id))
        .single();

      const data = handleSingleResponse<any>(response);
      
      if (!data) {
        throw new Error('Interview not found');
      }
      
      // Map data to InterviewWithDetails
      const interview: InterviewWithDetails = {
        id: data.interview_id.toString(),
        candidate_id: data.candidate_id.toString(),
        interviewer_id: data.interviewer_id.toString(),
        requirement_id: data.job_id.toString(),
        scheduled_at: data.scheduled_at,
        status: mapDBStatusToInterviewStatus(data.status),
        feedback: data.interviewer_notes ? { 
          rating: 0, // Default
          comments: data.interviewer_notes 
        } : null,
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at,
        candidate_name: data.candidates?.name || '',
        interviewer_name: '', // Would need to join with users table
        requirement_title: data.jobs?.title || ''
      };
      
      return interview;
    } catch (error: any) {
      toast.error(`Failed to fetch interview: ${error.message}`);
      return null;
    }
  },

  async updateInterviewStatus(id: string, request: UpdateInterviewStatusRequest): Promise<boolean> {
    try {
      // Map status to DB format
      const dbStatus = mapInterviewStatusToDBStatus(request.status);
      
      const { error } = await supabaseTable('interviews')
        .update({ 
          status: dbStatus
        })
        .eq('interview_id', parseInt(id));

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to update interview status: ${error.message}`);
      return false;
    }
  },

  async addInterviewFeedback(id: string, request: AddInterviewFeedbackRequest): Promise<boolean> {
    try {
      const { error } = await supabaseTable('interviews')
        .update({
          interviewer_notes: JSON.stringify(request.feedback)
        })
        .eq('interview_id', parseInt(id));

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to add interview feedback: ${error.message}`);
      return false;
    }
  },

  async cancelInterview(id: string): Promise<boolean> {
    try {
      const { error } = await supabaseTable('interviews')
        .update({ 
          status: 'canceled' // Using DB status format
        })
        .eq('interview_id', parseInt(id));

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to cancel interview: ${error.message}`);
      return false;
    }
  },

  async rescheduleInterview(id: string, newDateTime: string): Promise<boolean> {
    try {
      // Replace the RPC call with a simpler approach that works with Supabase
      const response = await supabaseTable('interviews')
        .select('reschedule_count')
        .eq('interview_id', parseInt(id))
        .single();
      
      const interview = handleSingleResponse<any>(response);
      
      if (!interview) {
        throw new Error('Interview not found');
      }
      
      const newCount = (interview.reschedule_count || 0) + 1;
      
      const { error } = await supabaseTable('interviews')
        .update({
          scheduled_at: newDateTime,
          reschedule_count: newCount
        })
        .eq('interview_id', parseInt(id));

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to reschedule interview: ${error.message}`);
      return false;
    }
  }
};

// Helper functions to map between application statuses and DB statuses
function mapDBStatusToInterviewStatus(dbStatus: string): InterviewStatus {
  switch(dbStatus) {
    case 'scheduled': return 'Scheduled';
    case 'in_progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'canceled': return 'Canceled';
    default: return 'Scheduled';
  }
}

function mapInterviewStatusToDBStatus(status: InterviewStatus): string {
  switch(status) {
    case 'Scheduled': return 'scheduled';
    case 'In Progress': return 'in_progress';
    case 'Completed': return 'completed';
    case 'Canceled': return 'canceled';
    default: return 'scheduled';
  }
}
