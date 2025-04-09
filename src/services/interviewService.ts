
import { supabaseTable, handleSingleResponse, handleMultipleResponse } from "@/utils/supabaseHelpers";
import { Interview, InterviewWithDetails, ScheduleInterviewRequest, AddInterviewFeedbackRequest, UpdateInterviewStatusRequest, InterviewStatus } from "@/types/interview";
import { toast } from "sonner";

export const interviewService = {
  async getInterviews(filters?: { status?: InterviewStatus }): Promise<InterviewWithDetails[]> {
    try {
      let query = supabaseTable('interviews_schedule')
        .select(`
          *,
          candidates (*),
          jobs (*)
        `);
      
      // Apply filters if provided
      if (filters?.status) {
        query = query.eq('status', filters.status.toLowerCase());
      }
      
      const response = await query.order('scheduled_at', { ascending: false });

      const interviews = handleMultipleResponse<any>(response);
      
      // Map the data to our frontend types
      const mappedInterviews: InterviewWithDetails[] = interviews.map(interview => ({
        id: interview.interview_id?.toString() || '',
        candidate_id: interview.candidate_id?.toString() || '',
        interviewer_id: interview.interviewer_id?.toString() || '',
        requirement_id: interview.job_id?.toString() || '',
        scheduled_at: interview.scheduled_at,
        status: interview.status as InterviewStatus,
        created_at: interview.created_at,
        updated_at: interview.created_at,
        candidate_name: interview.candidates?.name || '',
        requirement_title: interview.jobs?.title || '',
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
      
      // Map the data to our frontend types
      const mappedInterview: InterviewWithDetails = {
        id: interview.interview_id?.toString() || '',
        candidate_id: interview.candidate_id?.toString() || '',
        interviewer_id: interview.interviewer_id?.toString() || '',
        requirement_id: interview.job_id?.toString() || '',
        scheduled_at: interview.scheduled_at,
        status: interview.status as InterviewStatus,
        feedback: interview.interviewer_notes ? {
          rating: 0,
          comments: interview.interviewer_notes
        } : null,
        created_at: interview.created_at,
        updated_at: interview.updated_at || interview.created_at,
        candidate_name: interview.candidates?.name || '',
        requirement_title: interview.jobs?.title || '',
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
          candidate_id: parseInt(request.candidate_id),
          interviewer_id: parseInt(request.interviewer_id),
          job_id: parseInt(request.requirement_id),
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
        id: data.interview_id?.toString() || '',
        candidate_id: data.candidate_id?.toString() || '',
        interviewer_id: data.interviewer_id?.toString() || '',
        requirement_id: data.job_id?.toString() || '',
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
          status: 'canceled', // Use lowercase to match DB enum
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
          interview_id: parseInt(id),
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
      const { data, error } = await supabaseTable('interviews')
        .select('reschedule_count')
        .eq('interview_id', id)
        .single();
        
      if (error) throw error;
      
      const rescheduleCount = data?.reschedule_count || 0;
      
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

  // Add the missing method for interview feedback
  async addInterviewFeedback(id: string, feedbackData: AddInterviewFeedbackRequest): Promise<boolean> {
    return this.addFeedback(id, feedbackData);
  }
};
