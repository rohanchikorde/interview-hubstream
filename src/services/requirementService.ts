
import { supabaseTable, handleSingleResponse, handleMultipleResponse } from "@/utils/supabaseHelpers";
import { Requirement, RequirementStatus, CreateRequirementRequest, UpdateRequirementRequest } from "@/types/requirement";
import { toast } from "sonner";

export const requirementService = {
  async createRequirement(requirementData: CreateRequirementRequest): Promise<Requirement | null> {
    try {
      const { data, error } = await supabaseTable('jobs')
        .insert({
          title: requirementData.title,
          description: requirementData.description,
          company_id: parseInt(requirementData.company_id),
          skills_required: requirementData.skills,
          positions_open: requirementData.number_of_positions,
          status: 'open',
        })
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        return null;
      }

      // Map the data to our frontend types
      const requirement: Requirement = {
        id: data.job_id?.toString() || '',
        title: data.title,
        description: data.description,
        number_of_positions: data.positions_open,
        skills: data.skills_required || [],
        years_of_experience: requirementData.years_of_experience,
        price_per_interview: requirementData.price_per_interview,
        status: data.status,
        company_id: data.company_id?.toString() || '',
        created_at: data.created_at,
        updated_at: data.created_at,
      };

      return requirement;
    } catch (error: any) {
      toast.error(`Failed to create requirement: ${error.message}`);
      return null;
    }
  },

  async getRequirements(filters?: { status?: RequirementStatus }): Promise<Requirement[]> {
    try {
      let query = supabaseTable('jobs').select('*');
      
      // Apply filters if provided
      if (filters?.status) {
        query = query.eq('status', filters.status.toLowerCase());
      }
      
      const response = await query.order('created_at', { ascending: false });

      const jobsData = handleMultipleResponse<any>(response);
      
      // Map the data to our frontend types
      const requirements: Requirement[] = jobsData.map(job => ({
        id: job.job_id?.toString() || '',
        title: job.title || '',
        description: job.description || '',
        number_of_positions: job.positions_open || 0,
        skills: job.skills_required || [],
        years_of_experience: job.years_of_experience || 0,
        price_per_interview: job.price_per_interview || 0,
        status: job.status || 'open',
        company_id: job.company_id?.toString() || '',
        raised_by: job.raised_by || '',
        created_at: job.created_at || '',
        updated_at: job.updated_at || job.created_at || '',
      }));
      
      return requirements;
    } catch (error: any) {
      toast.error(`Failed to fetch requirements: ${error.message}`);
      return [];
    }
  },

  async getRequirementById(id: string): Promise<Requirement | null> {
    try {
      const response = await supabaseTable('jobs')
        .select('*')
        .eq('job_id', parseInt(id))
        .single();

      const job = handleSingleResponse<any>(response);
      
      if (!job) {
        return null;
      }
      
      // Map the data to our frontend types
      const requirement: Requirement = {
        id: job.job_id?.toString() || '',
        title: job.title || '',
        description: job.description || '',
        number_of_positions: job.positions_open || 0,
        skills: job.skills_required || [],
        years_of_experience: job.years_of_experience || 0,
        price_per_interview: job.price_per_interview || 0,
        status: job.status || 'open',
        raised_by: job.raised_by || '',
        company_id: job.company_id?.toString() || '',
        created_at: job.created_at || '',
        updated_at: job.updated_at || job.created_at || '',
      };
      
      return requirement;
    } catch (error: any) {
      toast.error(`Failed to fetch requirement: ${error.message}`);
      return null;
    }
  },

  async updateRequirement(id: string, updates: Partial<Requirement>): Promise<boolean> {
    try {
      // Convert our frontend model to DB model
      const dbUpdates: any = {};
      
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.number_of_positions) dbUpdates.positions_open = updates.number_of_positions;
      if (updates.skills) dbUpdates.skills_required = updates.skills;
      if (updates.status) dbUpdates.status = updates.status.toLowerCase();
      if (updates.years_of_experience) dbUpdates.years_of_experience = updates.years_of_experience;
      if (updates.price_per_interview) dbUpdates.price_per_interview = updates.price_per_interview;
      
      if (updates.company_id) {
        dbUpdates.company_id = parseInt(updates.company_id);
      }
      
      dbUpdates.updated_at = new Date().toISOString();
      
      const { error } = await supabaseTable('jobs')
        .update(dbUpdates)
        .eq('job_id', parseInt(id));

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to update requirement: ${error.message}`);
      return false;
    }
  },

  async closeRequirement(id: string, status: 'Fulfilled' | 'Canceled'): Promise<boolean> {
    try {
      const { error } = await supabaseTable('jobs')
        .update({ 
          status: status.toLowerCase(), 
          updated_at: new Date().toISOString() 
        })
        .eq('job_id', parseInt(id));

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to close requirement: ${error.message}`);
      return false;
    }
  },

  async deleteRequirement(id: string): Promise<boolean> {
    try {
      const { error } = await supabaseTable('jobs')
        .delete()
        .eq('job_id', parseInt(id));

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to delete requirement: ${error.message}`);
      return false;
    }
  }
};
