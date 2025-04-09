
import { supabaseTable, handleSingleResponse, handleMultipleResponse, safeGet, safeString, safeNow } from "@/utils/supabaseHelpers";
import { Requirement, RequirementStatus, CreateRequirementRequest, UpdateRequirementRequest } from "@/types/requirement";
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
        number_of_positions: safeGet(requirement, 'positions_open', 0),
        skills: safeGet(requirement, 'skills_required', []) || [],
        years_of_experience: safeGet(requirement, 'years_of_experience', 0),
        price_per_interview: safeGet(requirement, 'price_per_interview', 0),
        status: safeString(safeGet(requirement, 'status', 'Pending')) as RequirementStatus,
        company_id: safeString(safeGet(requirement, 'company_id', '')),
        created_at: safeString(safeGet(requirement, 'created_at', safeNow())),
        updated_at: safeString(safeGet(requirement, 'created_at', safeNow())),
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
        number_of_positions: safeGet(requirement, 'positions_open', 0),
        skills: safeGet(requirement, 'skills_required', []) || [],
        years_of_experience: safeGet(requirement, 'years_of_experience', 0),
        price_per_interview: safeGet(requirement, 'price_per_interview', 0),
        status: safeString(safeGet(requirement, 'status', 'Pending')) as RequirementStatus,
        company_id: safeString(safeGet(requirement, 'company_id', '')),
        created_at: safeString(safeGet(requirement, 'created_at', safeNow())),
        updated_at: safeString(safeGet(requirement, 'created_at', safeNow())),
      };
      
      return mappedRequirement;
    } catch (error: any) {
      toast.error(`Failed to fetch requirement: ${error.message}`);
      return null;
    }
  },

  async createRequirement(title: string, description: string, positionsOpen: number, skillsRequired: string[], companyId: string, yearsOfExperience: number = 0, pricePerInterview: number = 0): Promise<Requirement | null> {
    try {
      const { data, error } = await supabaseTable('jobs')
        .insert({
          title,
          description,
          positions_open: positionsOpen,
          skills_required: skillsRequired,
          company_id: parseInt(companyId),
          years_of_experience: yearsOfExperience,
          price_per_interview: pricePerInterview,
          status: 'Pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      if (!data) {
        return null;
      }

      // Map the data to our frontend types
      const requirement: Requirement = {
        id: safeString(safeGet(data, 'job_id', '')),
        title: safeString(safeGet(data, 'title', '')),
        description: safeString(safeGet(data, 'description', '')),
        number_of_positions: safeGet(data, 'positions_open', 1),
        skills: safeGet(data, 'skills_required', []) || [],
        years_of_experience: safeGet(data, 'years_of_experience', 0),
        price_per_interview: safeGet(data, 'price_per_interview', 0),
        status: safeString(safeGet(data, 'status', 'Pending')) as RequirementStatus,
        company_id: safeString(safeGet(data, 'company_id', '')),
        created_at: safeString(safeGet(data, 'created_at', '')),
        updated_at: safeString(safeGet(data, 'created_at', ''))
      };
      
      return requirement;
    } catch (error: any) {
      toast.error(`Failed to create requirement: ${error.message}`);
      return null;
    }
  },

  async updateRequirement(id: string, updates: UpdateRequirementRequest): Promise<boolean> {
    try {
      const dbUpdates: any = {};
      
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.number_of_positions !== undefined) dbUpdates.positions_open = updates.number_of_positions;
      if (updates.skills) dbUpdates.skills_required = updates.skills;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.years_of_experience !== undefined) dbUpdates.years_of_experience = updates.years_of_experience;
      if (updates.price_per_interview !== undefined) dbUpdates.price_per_interview = updates.price_per_interview;
      
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
  },
  
  async closeRequirement(id: string, status: 'Fulfilled' | 'Canceled'): Promise<boolean> {
    try {
      const { error } = await supabaseTable('jobs')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('job_id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to close requirement: ${error.message}`);
      return false;
    }
  }
};
