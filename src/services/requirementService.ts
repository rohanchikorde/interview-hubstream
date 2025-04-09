import { supabaseTable, handleSingleResponse, handleMultipleResponse, safeGet, safeString, safeNow } from "@/utils/supabaseHelpers";
import { Requirement } from "@/types/requirement";
import { toast } from "sonner";

export const requirementService = {
  async getRequirements(): Promise<Requirement[]> {
    try {
      const response = await supabaseTable('jobs').select('*');
      const requirementsData = handleMultipleResponse<any>(response);
      
      // Map the data to our frontend types with safe access
      const mappedRequirements: Requirement[] = requirementsData.map(requirement => ({
        id: safeString(safeGet(requirement, 'job_id', '')),
        title: safeString(safeGet(requirement, 'title', '')),
        description: safeString(safeGet(requirement, 'description', '')),
        positionsOpen: safeGet(requirement, 'positions_open', 0),
        skills: safeGet(requirement, 'skills_required', []) || [],
        interviews: [],
        candidates: [],
        status: safeString(safeGet(requirement, 'status', 'open')),
        companyId: safeString(safeGet(requirement, 'company_id', '')),
        createdAt: safeString(safeGet(requirement, 'created_at', safeNow())),
        updatedAt: safeString(safeGet(requirement, 'created_at', safeNow())),
      }));
      
      return mappedRequirements;
    } catch (error: any) {
      toast.error(`Failed to fetch requirements: ${error.message}`);
      return [];
    }
  },
  
  async getRequirementById(id: string): Promise<Requirement | null> {
    try {
      const response = await supabaseTable('jobs')
        .select('*')
        .eq('job_id', id)
        .single();
        
      const requirement = handleSingleResponse<any>(response);
      
      if (!requirement) {
        return null;
      }
      
      // Map the data to our frontend types with safe access
      const mappedRequirement: Requirement = {
        id: safeString(safeGet(requirement, 'job_id', '')),
        title: safeString(safeGet(requirement, 'title', '')),
        description: safeString(safeGet(requirement, 'description', '')),
        positionsOpen: safeGet(requirement, 'positions_open', 0),
        skills: safeGet(requirement, 'skills_required', []) || [],
        interviews: [],
        candidates: [],
        status: safeString(safeGet(requirement, 'status', 'open')),
        companyId: safeString(safeGet(requirement, 'company_id', '')),
        createdAt: safeString(safeGet(requirement, 'created_at', safeNow())),
        updatedAt: safeString(safeGet(requirement, 'created_at', safeNow())),
      };
      
      return mappedRequirement;
    } catch (error: any) {
      toast.error(`Failed to fetch requirement: ${error.message}`);
      return null;
    }
  },

  async createRequirement(title: string, description: string, positionsOpen: number, skillsRequired: string[], companyId: string): Promise<Requirement | null> {
    try {
      const { data, error } = await supabaseTable('jobs')
        .insert({
          title,
          description,
          positions_open: positionsOpen,
          skills_required: skillsRequired,
          company_id: parseInt(companyId),
          status: 'open'
        })
        .select()
        .single();

      if (error) throw error;
      
      if (!data) {
        return null;
      }

      // Map the data to our frontend types
      const requirement: Requirement = {
        id: String(data.job_id) || '',
        title: data.title || '',
        description: data.description || '',
        positionsOpen: data.positions_open || 1,
        skills: data.skills_required || [],
        interviews: [],
        candidates: [],
        status: data.status || 'open',
        companyId: String(data.company_id) || '',
        createdAt: data.created_at || '',
        updatedAt: data.created_at || ''
      };
      
      return requirement;
    } catch (error: any) {
      toast.error(`Failed to create requirement: ${error.message}`);
      return null;
    }
  },

  async updateRequirement(id: string, updates: Partial<Requirement>): Promise<boolean> {
    try {
      const dbUpdates: any = {};
      
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.positionsOpen) dbUpdates.positions_open = updates.positionsOpen;
      if (updates.skills) dbUpdates.skills_required = updates.skills;
      if (updates.status) dbUpdates.status = updates.status;
      
      dbUpdates.updated_at = new Date().toISOString();
      
      const { error } = await supabaseTable('jobs')
        .update(dbUpdates)
        .eq('job_id', id);

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
        .eq('job_id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to delete requirement: ${error.message}`);
      return false;
    }
  }
};
