
import { supabaseTable, handleSingleResponse, handleMultipleResponse } from "@/utils/supabaseHelpers";
import { Ticket, TicketWithDetails, CreateTicketRequest, UpdateTicketRequest } from "@/types/ticket";
import { toast } from "sonner";

export const ticketService = {
  async getTickets(): Promise<TicketWithDetails[]> {
    try {
      const response = await supabaseTable('tickets')
        .select(`
          *,
          companies (company_name)
        `)
        .order('created_at', { ascending: false });

      const data = handleMultipleResponse<any>(response);

      // Map the data to our frontend types
      const tickets: TicketWithDetails[] = data.map(ticket => ({
        id: ticket.ticket_id.toString(),
        status: ticket.status,
        user_id: ticket.user_id?.toString() || '',
        company_id: ticket.company_id?.toString() || '',
        created_at: ticket.created_at,
        updated_at: ticket.updated_at || ticket.created_at,
        company_name: ticket.companies?.company_name || '',
        requirement_title: ticket.subject || '',
        // Add any other mapping fields here
      }));
      
      return tickets;
    } catch (error: any) {
      toast.error(`Failed to fetch tickets: ${error.message}`);
      return [];
    }
  },
  
  async getTicketById(id: string): Promise<TicketWithDetails | null> {
    try {
      const response = await supabaseTable('tickets')
        .select(`
          *,
          companies (company_name)
        `)
        .eq('ticket_id', id)
        .single();

      const data = handleSingleResponse<any>(response);
      
      if (!data) {
        return null;
      }
      
      // Map the data to our frontend types
      const ticket: TicketWithDetails = {
        id: data.ticket_id.toString(),
        status: data.status,
        user_id: data.user_id?.toString() || '',
        company_id: data.company_id?.toString() || '',
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at,
        company_name: data.companies?.company_name || '',
        requirement_title: data.subject || '',
        // Add any other mapping fields here
      };
      
      return ticket;
    } catch (error: any) {
      toast.error(`Failed to fetch ticket: ${error.message}`);
      return null;
    }
  },
  
  async createTicket(request: CreateTicketRequest): Promise<Ticket | null> {
    try {
      const { data, error } = await supabaseTable('tickets')
        .insert({
          subject: request.requirement_title,
          company_id: request.company_id ? parseInt(request.company_id) : null,
          user_id: request.user_id ? parseInt(request.user_id) : null,
          status: request.status || 'open'
        })
        .select()
        .single();

      if (error) throw error;
      
      const ticket: Ticket = {
        id: data.ticket_id.toString(),
        status: data.status,
        user_id: data.user_id?.toString() || '',
        company_id: data.company_id?.toString() || '',
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at
      };
      
      return ticket;
    } catch (error: any) {
      toast.error(`Failed to create ticket: ${error.message}`);
      return null;
    }
  },
  
  async updateTicket(id: string, updates: UpdateTicketRequest): Promise<boolean> {
    try {
      // Convert string IDs to numbers if needed
      const dbUpdates: any = { ...updates };
      if (updates.company_id) dbUpdates.company_id = parseInt(updates.company_id);
      if (updates.user_id) dbUpdates.user_id = parseInt(updates.user_id);
      
      const { error } = await supabaseTable('tickets')
        .update(dbUpdates)
        .eq('ticket_id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to update ticket: ${error.message}`);
      return false;
    }
  },
  
  async updateTicketStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabaseTable('tickets')
        .update({ status })
        .eq('ticket_id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to update ticket status: ${error.message}`);
      return false;
    }
  },
  
  async escalateTicket(id: string): Promise<boolean> {
    try {
      const { error } = await supabaseTable('tickets')
        .update({ 
          status: 'escalated',
          updated_at: new Date().toISOString()
        })
        .eq('ticket_id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to escalate ticket: ${error.message}`);
      return false;
    }
  }
};
