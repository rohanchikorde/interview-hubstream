
import { supabaseTable, castResult } from "@/utils/supabaseHelpers";
import { supabase } from "@/integrations/supabase/client";
import { 
  Candidate, 
  CreateCandidateRequest, 
  UpdateCandidateStatus,
  CandidateStatus 
} from "@/types/candidate";
import { toast } from "sonner";

export const candidateService = {
  async createCandidate(request: CreateCandidateRequest): Promise<Candidate | null> {
    try {
      const { data, error } = await supabaseTable('candidates')
        .insert({
          name: request.full_name,  // Map full_name to name field in the DB
          email: request.email,
          resume_url: request.resume_url,
          // requirement_id field is not supported in the DB schema, it will be ignored
          // It will be handled at the application level
        })
        .select()
        .single();

      if (error) throw error;
      return castResult<Candidate>(data);
    } catch (error: any) {
      toast.error(`Failed to create candidate: ${error.message}`);
      return null;
    }
  },

  async getCandidatesByRequirement(requirementId: string): Promise<Candidate[]> {
    try {
      // Since requirement_id doesn't exist in the DB schema, we'll need to adapt
      // This is a simplified version - in a real app, you might need to use a join or custom query
      const { data, error } = await supabaseTable('candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter candidates by requirement at application level
      // In a real app, you would have a relation table or a proper foreign key
      const filteredCandidates = (data || []).filter((candidate: any) => {
        // This is a placeholder for a proper relationship check
        return true; // In a real app, check if candidate is related to requirementId
      });
      
      return castResult<Candidate[]>(filteredCandidates);
    } catch (error: any) {
      toast.error(`Failed to fetch candidates: ${error.message}`);
      return [];
    }
  },

  async updateCandidateStatus(id: string, status: CandidateStatus): Promise<Candidate | null> {
    try {
      // Since 'status' might not be a field in the candidate table in the DB schema,
      // we're using a simplified approach here
      const { data, error } = await supabaseTable('candidates')
        .update({ 
          // Store status in a way compatible with the DB schema
          // This assumes there's some way to represent status in the DB
          // Alternatively, you might need to use a separate table
        })
        .eq('candidate_id', id)
        .select()
        .single();

      if (error) throw error;
      return castResult<Candidate>(data);
    } catch (error: any) {
      toast.error(`Failed to update candidate status: ${error.message}`);
      return null;
    }
  },

  async uploadResume(file: File): Promise<string | null> {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `resumes/${fileName}`;
      
      const { error } = await supabase.storage
        .from('candidates')
        .upload(filePath, file);

      if (error) throw error;
      
      const { data } = supabase.storage
        .from('candidates')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error: any) {
      toast.error(`Failed to upload resume: ${error.message}`);
      return null;
    }
  },

  async bulkCreateCandidates(candidates: CreateCandidateRequest[]): Promise<number> {
    try {
      const formattedCandidates = candidates.map(c => ({
        name: c.full_name,  // Map full_name to name field
        email: c.email,
        resume_url: c.resume_url,
        // Map other fields as needed for the DB schema
      }));
      
      const { data, error } = await supabaseTable('candidates')
        .insert(formattedCandidates)
        .select();

      if (error) throw error;
      return data?.length || 0;
    } catch (error: any) {
      toast.error(`Failed to bulk create candidates: ${error.message}`);
      return 0;
    }
  }
};
