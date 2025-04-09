import { supabaseTable, handleSingleResponse, handleMultipleResponse, safeGet, safeString, safeNow, castResult } from "@/utils/supabaseHelpers";
import { Candidate } from "@/types/candidate";
import { toast } from "sonner";

// Define the candidate service with proper error handling and type safety
export const candidateService = {
  async getCandidates(): Promise<Candidate[]> {
    try {
      const response = await supabaseTable('candidates').select('*');
      const candidates = handleMultipleResponse<any>(response);
      
      // Map the data to our frontend types with safe access
      const mappedCandidates: Candidate[] = candidates.map(candidate => ({
        id: safeString(safeGet(candidate, 'candidate_id', '')),
        name: safeString(safeGet(candidate, 'name', '')),
        email: safeString(safeGet(candidate, 'email', '')),
        resumeUrl: safeString(safeGet(candidate, 'resume_url', '')),
        skills: [],
        status: 'New', // Default status
        createdAt: safeString(safeGet(candidate, 'created_at', safeNow())),
        updatedAt: safeString(safeGet(candidate, 'created_at', safeNow()))
      }));
      
      return mappedCandidates;
    } catch (error: any) {
      toast.error(`Failed to fetch candidates: ${error.message}`);
      return [];
    }
  },
  
  async createCandidate(candidate: Omit<Candidate, 'id'>): Promise<Candidate | null> {
    try {
      const { data, error } = await supabaseTable('candidates')
        .insert({
          name: candidate.name,
          email: candidate.email,
          resume_url: candidate.resumeUrl,
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
        id: String(data.candidate_id) || '',
        name: data.name || '',
        email: data.email || '',
        resumeUrl: data.resume_url || '',
        skills: [],
        status: 'New',
        createdAt: data.created_at || '',
        updatedAt: data.created_at || ''
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
          name: updates.name,
          email: updates.email,
          resume_url: updates.resumeUrl,
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
        name: safeString(safeGet(candidate, 'name', '')),
        email: safeString(safeGet(candidate, 'email', '')),
        resumeUrl: safeString(safeGet(candidate, 'resume_url', '')),
        skills: [],
        status: 'New', // Default status
        createdAt: safeString(safeGet(candidate, 'created_at', safeNow())),
        updatedAt: safeString(safeGet(candidate, 'updated_at', safeNow()))
      };
      
      return mappedCandidate;
    } catch (error: any) {
      toast.error(`Failed to fetch candidate: ${error.message}`);
      return null;
    }
  }
};
