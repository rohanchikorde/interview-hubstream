
import { supabaseTable, handleSingleResponse, handleMultipleResponse, safeGet, safeString, safeNow } from "@/utils/supabaseHelpers";
import { Candidate, CandidateStatus, CreateCandidateRequest } from "@/types/candidate";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define the candidate service with proper error handling and type safety
export const candidateService = {
  async getCandidates(): Promise<Candidate[]> {
    try {
      const response = await supabaseTable('candidates').select('*');
      const candidates = handleMultipleResponse<any>(response);
      
      // Map the data to our frontend types with safe access
      const mappedCandidates: Candidate[] = candidates.map(candidate => ({
        id: safeString(safeGet(candidate, 'candidate_id', '')),
        full_name: safeString(safeGet(candidate, 'name', '')),
        email: safeString(safeGet(candidate, 'email', '')),
        resume_url: safeString(safeGet(candidate, 'resume_url', '')),
        skills: [],
        status: 'New', // Default status
        created_at: safeString(safeGet(candidate, 'created_at', safeNow())),
        updated_at: safeString(safeGet(candidate, 'created_at', safeNow()))
      }));
      
      return mappedCandidates;
    } catch (error: any) {
      toast.error(`Failed to fetch candidates: ${error.message}`);
      return [];
    }
  },
  
  async createCandidate(candidateRequest: CreateCandidateRequest): Promise<Candidate | null> {
    try {
      const { data, error } = await supabaseTable('candidates')
        .insert({
          name: candidateRequest.full_name,
          email: candidateRequest.email,
          resume_url: candidateRequest.resume_url,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      if (!data) {
        return null;
      }

      // Map the data to our frontend types
      const newCandidate: Candidate = {
        id: safeString(safeGet(data, 'candidate_id', '')),
        full_name: safeString(safeGet(data, 'name', '')),
        email: safeString(safeGet(data, 'email', '')),
        resume_url: safeString(safeGet(data, 'resume_url', '')),
        skills: [],
        status: candidateRequest.status || 'New',
        created_at: safeString(safeGet(data, 'created_at', safeNow())),
        updated_at: safeString(safeGet(data, 'created_at', safeNow()))
      };
      
      return newCandidate;
    } catch (error: any) {
      toast.error(`Failed to create candidate: ${error.message}`);
      return null;
    }
  },
  
  async updateCandidate(id: string, updates: Partial<Candidate>): Promise<boolean> {
    try {
      const { error } = await supabaseTable('candidates')
        .update({
          name: updates.full_name,
          email: updates.email,
          resume_url: updates.resume_url,
          updated_at: new Date().toISOString()
        })
        .eq('candidate_id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to update candidate: ${error.message}`);
      return false;
    }
  },
  
  async updateCandidateStatus(id: string, status: CandidateStatus): Promise<boolean> {
    try {
      const { error } = await supabaseTable('candidates')
        .update({
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('candidate_id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to update candidate status: ${error.message}`);
      return false;
    }
  },
  
  async deleteCandidate(id: string): Promise<boolean> {
    try {
      const { error } = await supabaseTable('candidates')
        .delete()
        .eq('candidate_id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to delete candidate: ${error.message}`);
      return false;
    }
  },

  async getCandidateById(id: string): Promise<Candidate | null> {
    try {
      const response = await supabaseTable('candidates')
        .select('*')
        .eq('candidate_id', id)
        .single();
        
      const candidate = handleSingleResponse<any>(response);
      
      if (!candidate) {
        return null;
      }
      
      // Map the data to our frontend types with safe access
      const mappedCandidate: Candidate = {
        id: safeString(safeGet(candidate, 'candidate_id', '')),
        full_name: safeString(safeGet(candidate, 'name', '')),
        email: safeString(safeGet(candidate, 'email', '')),
        resume_url: safeString(safeGet(candidate, 'resume_url', '')),
        skills: [],
        status: 'New', // Default status
        created_at: safeString(safeGet(candidate, 'created_at', safeNow())),
        updated_at: safeString(safeGet(candidate, 'updated_at', safeNow()))
      };
      
      return mappedCandidate;
    } catch (error: any) {
      toast.error(`Failed to fetch candidate: ${error.message}`);
      return null;
    }
  },

  async getCandidatesByRequirement(requirementId: string): Promise<Candidate[]> {
    try {
      const response = await supabaseTable('candidates')
        .select('*')
        .eq('requirement_id', requirementId);
        
      const candidates = handleMultipleResponse<any>(response);
      
      // Map the data to our frontend types with safe access
      const mappedCandidates: Candidate[] = candidates.map(candidate => ({
        id: safeString(safeGet(candidate, 'candidate_id', '')),
        full_name: safeString(safeGet(candidate, 'name', '')),
        email: safeString(safeGet(candidate, 'email', '')),
        resume_url: safeString(safeGet(candidate, 'resume_url', '')),
        skills: [],
        status: safeString(safeGet(candidate, 'status', 'New')) as CandidateStatus,
        requirement_id: safeString(safeGet(candidate, 'requirement_id', '')),
        created_at: safeString(safeGet(candidate, 'created_at', safeNow())),
        updated_at: safeString(safeGet(candidate, 'updated_at', safeNow()))
      }));
      
      return mappedCandidates;
    } catch (error: any) {
      toast.error(`Failed to fetch candidates: ${error.message}`);
      return [];
    }
  },

  async uploadResume(file: File): Promise<string | undefined> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `resumes/${fileName}`;
      
      const { error } = await supabase.storage
        .from('candidate-resumes')
        .upload(filePath, file);
        
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('candidate-resumes')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error: any) {
      toast.error(`Failed to upload resume: ${error.message}`);
      return undefined;
    }
  }
};
