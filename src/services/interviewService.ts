import { supabaseTable, handleSingleResponse, handleMultipleResponse, safeGet, safeString, safeNow } from "@/utils/supabaseHelpers";
import { Interview, InterviewWithDetails, ScheduleInterviewRequest, AddInterviewFeedbackRequest, UpdateInterviewStatusRequest, InterviewStatus } from "@/types/interview";
import { toast } from "sonner";

export const interviewService = {
  async getInterviews(): Promise<InterviewWithDetails[]> {
    try {
      const response = await supabaseTable('interviews')
        .select(`
          *,
          candidates (*),
          jobs (*)
        `);
      
      const interviewsData = handleMultipleResponse<any>(response);
      
      // Map the data to our frontend types with safe access and defaults
      const mappedInterviews: InterviewWithDetails[] = interviewsData.map(interview => ({
        id: safeString(safeGet(interview, 'interview_id', '')),
        candidate_id: safeString(safeGet(interview, 'candidate_id', '')),
        interviewer_id: safeString(safeGet(interview, 'interviewer_id', '')),
        requirement_id: safeString(safeGet(interview, 'job_id', '')),
        scheduled_at: safeString(safeGet(interview, 'scheduled_at', safeNow())),
        status: safeGet(interview, 'status', 'Scheduled') as InterviewStatus,
        created_at: safeString(safeGet(interview, 'created_at', safeNow())),
        updated_at: safeString(safeGet(interview, 'updated_at', safeNow())),
        candidate_name: safeString(safeGet(interview, 'candidates.name', '')),
        requirement_title: safeString(safeGet(interview, 'jobs.title', ''))
      }));
      
      return mappedInterviews;
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
          candidates (*),
          jobs (*)
        `)
        .eq('interview_id', id)
        .single();

      const interview = handleSingleResponse<any>(response);
      
      if (!interview) {
        return null;
      }
      
      // Map the data to our frontend types with safe access
      const mappedInterview: InterviewWithDetails = {
        id: safeString(safeGet(interview, 'interview_id', '')),
        candidate_id: safeString(safeGet(interview, 'candidate_id', '')),
        interviewer_id: safeString(safeGet(interview, 'interviewer_id', '')),
        requirement_id: safeString(safeGet(interview, 'job_id', '')),
        scheduled_at: safeString(safeGet(interview, 'scheduled_at', safeNow())),
        status: safeGet(interview, 'status', 'Scheduled') as InterviewStatus,
        feedback: interview.interviewer_notes ? {
          rating: 0,
          comments: interview.interviewer_notes
        } : null,
        created_at: safeString(safeGet(interview, 'created_at', safeNow())),
        updated_at: safeString(safeGet(interview, 'updated_at', safeNow())),
        candidate_name: safeString(safeGet(interview, 'candidates.name', '')),
        requirement_title: safeString(safeGet(interview, 'jobs.title', '')),
      };
      
      return mappedInterview;
    } catch (error: any) {
      toast.error(`Failed to fetch interview: ${error.message}`);
      return null;
    }
  },
  
  async scheduleInterview(request: ScheduleInterviewRequest): Promise<Interview | null> {
    try {
      const { data, error } = await supabaseTable('interviews')
        .insert({
          candidate_id: parseInt(request.candidate_id) || null,
          interviewer_id: parseInt(request.interviewer_id) || null,
          job_id: parseInt(request.requirement_id) || null,
          scheduled_at: request.scheduled_at,
          status: 'scheduled',
        })
        .select()
        .single();

      if (error) throw error;
      
      if (!data) {
        return null;
      }

      // Map the data to our frontend types
      const interview: Interview = {
        id: String(data.interview_id) || '',
        candidate_id: String(data.candidate_id) || '',
        interviewer_id: String(data.interviewer_id) || '',
        requirement_id: String(data.job_id) || '',
        scheduled_at: data.scheduled_at,
        status: data.status as InterviewStatus,
        created_at: data.created_at,
        updated_at: data.created_at
      };
      
      return interview;
    } catch (error: any) {
      toast.error(`Failed to schedule interview: ${error.message}`);
      return null;
    }
  },
  
  async updateInterviewStatus(id: string, statusUpdate: UpdateInterviewStatusRequest): Promise<boolean> {
    try {
      const { error } = await supabaseTable('interviews')
        .update({ 
          status: statusUpdate.status.toLowerCase(),
          updated_at: new Date().toISOString()
        })
        .eq('interview_id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to update interview status: ${error.message}`);
      return false;
    }
  },
  
  async cancelInterview(id: string): Promise<boolean> {
    try {
      const { error } = await supabaseTable('interviews')
        .update({ 
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('interview_id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to cancel interview: ${error.message}`);
      return false;
    }
  },
  
  async addFeedback(id: string, feedbackData: AddInterviewFeedbackRequest): Promise<boolean> {
    try {
      const { error } = await supabaseTable('interviews')
        .update({ 
          interviewer_notes: feedbackData.feedback.comments,
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('interview_id', id);

      if (error) throw error;
      
      // We will also need to insert to interview_evaluations table
      // This is just a placeholder for now
      const { error: evalError } = await supabaseTable('interview_evaluations')
        .insert({
          interview_id: parseInt(id) || 0,
          score: feedbackData.feedback.rating,
          feedback: feedbackData.feedback.comments,
        });
        
      if (evalError) {
        console.error("Failed to save evaluation details:", evalError);
      }
      
      return true;
    } catch (error: any) {
      toast.error(`Failed to save feedback: ${error.message}`);
      return false;
    }
  },
  
  async rescheduleInterview(id: string, newDate: string): Promise<boolean> {
    try {
      // First get the current reschedule count
      const response = await supabaseTable('interviews')
        .select('reschedule_count')
        .eq('interview_id', id)
        .single();
      
      const data = handleSingleResponse<{reschedule_count?: number}>(response);
      const rescheduleCount = safeGet(data, 'reschedule_count', 0);
      
      const { error: updateError } = await supabaseTable('interviews')
        .update({ 
          scheduled_at: newDate,
          status: 'rescheduled',
          reschedule_count: rescheduleCount + 1,
          updated_at: new Date().toISOString()
        })
        .eq('interview_id', id);

      if (updateError) throw updateError;
      return true;
    } catch (error: any) {
      toast.error(`Failed to reschedule interview: ${error.message}`);
      return false;
    }
  },

  // Add the feedback method
  async addInterviewFeedback(id: string, feedbackData: AddInterviewFeedbackRequest): Promise<boolean> {
    return this.addFeedback(id, feedbackData);
  }
};
