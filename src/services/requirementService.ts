
import { supabaseTable, handleSingleResponse, handleMultipleResponse } from "@/utils/supabaseHelpers";
import { Requirement } from "@/types/requirement";
import { toast } from "sonner";

export const requirementService = {
  async createRequirement(requirementData: {
    title: string;
    description: string;
    companyId: string;
    skillsRequired: string[];
    positionsOpen: number;
  }): Promise<Requirement | null> {
    try {
      const { data, error } = await supabaseTable('jobs')
        .insert({
          title: requirementData.title,
          description: requirementData.description,
          company_id: parseInt(requirementData.companyId),
          skills_required: requirementData.skillsRequired,
          positions_open: requirementData.positionsOpen,
          status: 'open',
        })
        .select()
        .single();

      if (error) throw error;

      // Map the data to our frontend types
      const requirement: Requirement = {
        id: data.job_id.toString(),
        title: data.title,
        description: data.description,
        positionsOpen: data.positions_open,
        skillsRequired: data.skills_required || [],
        status: data.status,
        companyId: data.company_id?.toString() || '',
        createdAt: data.created_at,
        updatedAt: data.created_at,
      };

      return requirement;
    } catch (error: any) {
      toast.error(`Failed to create requirement: ${error.message}`);
      return null;
    }
  },

  async getRequirements(): Promise<Requirement[]> {
    try {
      const response = await supabaseTable('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      const data = handleMultipleResponse<any>(response);
      
      // Map the data to our frontend types
      const requirements: Requirement[] = data.map(job => ({
        id: job.job_id.toString(),
        title: job.title,
        description: job.description,
        positionsOpen: job.positions_open,
        skillsRequired: job.skills_required || [],
        // Add status field from DB if not already mapped
        status: job.status || 'open',
        // Add additional fields as needed
        companyId: job.company_id?.toString() || '',
        createdAt: job.created_at,
        updatedAt: job.created_at,
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
        id: job.job_id.toString(),
        title: job.title,
        description: job.description,
        positionsOpen: job.positions_open,
        skillsRequired: job.skills_required || [],
        // Add status field from DB
        status: job.status,
        raisedBy: job.raised_by,
        companyId: job.company_id?.toString() || '',
        createdAt: job.created_at,
        updatedAt: job.created_at,
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
      const dbUpdates: any = {
        ...(updates.title && { title: updates.title }),
        ...(updates.description && { description: updates.description }),
        ...(updates.positionsOpen && { positions_open: updates.positionsOpen }),
        ...(updates.skillsRequired && { skills_required: updates.skillsRequired }),
        ...(updates.status && { status: updates.status }),
        updated_at: new Date().toISOString()
      };
      
      if (updates.companyId) {
        dbUpdates.company_id = parseInt(updates.companyId);
      }
      
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
