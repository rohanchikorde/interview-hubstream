import { supabaseTable, castResult } from "@/utils/supabaseHelpers";
import { supabase } from "@/integrations/supabase/client";
import { 
  Requirement, 
  CreateRequirementRequest, 
  UpdateRequirementRequest,
  RequirementStatus 
} from "@/types/requirement";
import { toast } from "sonner";

export const requirementService = {
  async createRequirement(request: CreateRequirementRequest): Promise<Requirement | null> {
    try {
      // Map fields to match the database structure
      // Using 'jobs' table as it's likely the closest match in the DB schema
      const { data, error } = await supabaseTable('jobs')
        .insert({
          title: request.title,
          description: request.description,
          positions_open: request.number_of_positions,
          skills_required: request.skills,
          company_id: parseInt(request.company_id), // Convert to number for DB
          // Other fields might need to be mapped depending on the actual DB schema
        })
        .select()
        .single();

      if (error) throw error;
      
      // Convert the job data to Requirement format
      const requirement: Requirement = {
        id: data.job_id.toString(),
        title: data.title,
        description: data.description,
        number_of_positions: data.positions_open,
        skills: data.skills_required || [],
        years_of_experience: request.years_of_experience,
        price_per_interview: request.price_per_interview,
        status: 'Pending',
        raised_by: (await supabase.auth.getUser()).data.user?.id || '',
        company_id: request.company_id,
        created_at: data.created_at,
        updated_at: data.created_at
      };
      
      return requirement;
    } catch (error: any) {
      toast.error(`Failed to create requirement: ${error.message}`);
      return null;
    }
  },

  async getRequirements(filters?: { status?: RequirementStatus }): Promise<Requirement[]> {
    try {
      // Query the jobs table instead of requirements
      let query = supabaseTable('jobs')
        .select('*');

      if (filters?.status) {
        // Map the status to match the DB schema
        const dbStatus = filters.status === 'Fulfilled' ? 'closed' : 
                        filters.status === 'Pending' ? 'open' : 'in_progress';
        query = query.eq('status', dbStatus);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convert job data to Requirement format
      const requirements: Requirement[] = (data || []).map((job: any) => ({
        id: job.job_id.toString(),
        title: job.title,
        description: job.description,
        number_of_positions: job.positions_open,
        skills: job.skills_required || [],
        years_of_experience: 0, // Default value
        price_per_interview: 0, // Default value
        status: job.status === 'closed' ? 'Fulfilled' : 
               job.status === 'open' ? 'Pending' : 'Approved',
        raised_by: job.raised_by || '',
        company_id: job.company_id?.toString() || '',
        created_at: job.created_at,
        updated_at: job.created_at
      }));
      
      return requirements;
    } catch (error: any) {
      toast.error(`Failed to fetch requirements: ${error.message}`);
      return [];
    }
  },

  async getRequirementById(id: string): Promise<Requirement | null> {
    try {
      // Query jobs table using job_id
      const { data, error } = await supabaseTable('jobs')
        .select('*')
        .eq('job_id', parseInt(id))
        .single();

      if (error) throw error;
      
      // Convert job to Requirement format
      const requirement: Requirement = {
        id: data.job_id.toString(),
        title: data.title,
        description: data.description,
        number_of_positions: data.positions_open,
        skills: data.skills_required || [],
        years_of_experience: 0, // Default
        price_per_interview: 0, // Default
        status: data.status === 'closed' ? 'Fulfilled' : 
                data.status === 'open' ? 'Pending' : 'Approved',
        raised_by: data.raised_by || '',
        company_id: data.company_id?.toString() || '',
        created_at: data.created_at,
        updated_at: data.created_at
      };
      
      return requirement;
    } catch (error: any) {
      toast.error(`Failed to fetch requirement: ${error.message}`);
      return null;
    }
  },

  async updateRequirement(id: string, updates: UpdateRequirementRequest): Promise<Requirement | null> {
    try {
      // Map updates to match jobs table structure
      const jobUpdates: any = {};
      
      if (updates.title) jobUpdates.title = updates.title;
      if (updates.description) jobUpdates.description = updates.description;
      if (updates.number_of_positions) jobUpdates.positions_open = updates.number_of_positions;
      if (updates.skills) jobUpdates.skills_required = updates.skills;
      if (updates.status) {
        // Map status to the DB schema
        jobUpdates.status = updates.status === 'Fulfilled' ? 'closed' : 
                            updates.status === 'Pending' ? 'open' : 'in_progress';
      }
      
      const { data, error } = await supabaseTable('jobs')
        .update(jobUpdates)
        .eq('job_id', parseInt(id))
        .select()
        .single();

      if (error) throw error;
      
      // Convert back to Requirement format
      const requirement: Requirement = {
        id: data.job_id.toString(),
        title: data.title,
        description: data.description,
        number_of_positions: data.positions_open,
        skills: data.skills_required || [],
        years_of_experience: updates.years_of_experience || 0,
        price_per_interview: updates.price_per_interview || 0,
        status: data.status === 'closed' ? 'Fulfilled' : 
                data.status === 'open' ? 'Pending' : 'Approved',
        raised_by: data.raised_by || '',
        company_id: data.company_id?.toString() || '',
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at
      };
      
      return requirement;
    } catch (error: any) {
      toast.error(`Failed to update requirement: ${error.message}`);
      return null;
    }
  },

  async closeRequirement(id: string, status: 'Fulfilled' | 'Canceled'): Promise<boolean> {
    try {
      // Map to jobs table status
      const jobStatus = status === 'Fulfilled' ? 'closed' : 'in_progress';
      
      const { error } = await supabaseTable('jobs')
        .update({ status: jobStatus })
        .eq('job_id', parseInt(id));

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to close requirement: ${error.message}`);
      return false;
    }
  }
};
