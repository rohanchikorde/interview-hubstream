
import { supabaseTable, handleSingleResponse, handleMultipleResponse } from "@/utils/supabaseHelpers";
import { Ticket, TicketWithDetails, CreateTicketRequest, UpdateTicketRequest, TicketStatus } from "@/types/ticket";
import { toast } from "sonner";

export const ticketService = {
  async getTickets(): Promise<TicketWithDetails[]> {
    try {
      const response = await supabaseTable('support_tickets')
        .select(`
          *,
          companies (company_name)
        `)
        .order('created_at', { ascending: false });

      const tickets = handleMultipleResponse<any>(response);

      // Map the data to our frontend types
      const mappedTickets: TicketWithDetails[] = tickets.map(ticket => ({
        id: ticket.ticket_id.toString(),
        status: ticket.status as TicketStatus,
        raised_by: ticket.user_id?.toString() || '',
        requirement_id: ticket.requirement_id?.toString() || '',
        company_id: ticket.company_id?.toString() || '',
        created_at: ticket.created_at,
        updated_at: ticket.updated_at || ticket.created_at,
        company_name: ticket.companies?.company_name || '',
        requirement_title: ticket.subject || '',
      }));
      
      return mappedTickets;
    } catch (error: any) {
      toast.error(`Failed to fetch tickets: ${error.message}`);
      return [];
    }
  },
  
  async getTicketById(id: string): Promise<TicketWithDetails | null> {
    try {
      const response = await supabaseTable('support_tickets')
        .select(`
          *,
          companies (company_name)
        `)
        .eq('ticket_id', id)
        .single();

      const ticket = handleSingleResponse<any>(response);
      
      if (!ticket) {
        return null;
      }
      
      // Map the data to our frontend types
      const mappedTicket: TicketWithDetails = {
        id: ticket.ticket_id.toString(),
        status: ticket.status as TicketStatus,
        raised_by: ticket.user_id?.toString() || '',
        requirement_id: ticket.requirement_id?.toString() || '',
        company_id: ticket.company_id?.toString() || '',
        created_at: ticket.created_at,
        updated_at: ticket.updated_at || ticket.created_at,
        company_name: ticket.companies?.company_name || '',
        requirement_title: ticket.subject || '',
      };
      
      return mappedTicket;
    } catch (error: any) {
      toast.error(`Failed to fetch ticket: ${error.message}`);
      return null;
    }
  },
  
  async createTicket(request: CreateTicketRequest): Promise<Ticket | null> {
    try {
      const { data, error } = await supabaseTable('support_tickets')
        .insert({
          subject: "Support Request",
          requirement_id: request.requirement_id ? parseInt(request.requirement_id) : null,
          company_id: request.company_id ? parseInt(request.company_id) : null,
          status: 'open'
        })
        .select()
        .single();

      if (error) throw error;
      
      if (!data) {
        return null;
      }

      // Map the data to our frontend types
      const ticket: Ticket = {
        id: data.ticket_id.toString(),
        status: data.status as TicketStatus,
        raised_by: data.user_id?.toString() || '',
        requirement_id: data.requirement_id?.toString() || '',
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
      const dbUpdates: any = {};
      
      if (updates.status) dbUpdates.status = updates.status.toLowerCase();
      if (updates.reason) dbUpdates.notes = updates.reason;
      
      dbUpdates.updated_at = new Date().toISOString();
      
      const { error } = await supabaseTable('support_tickets')
        .update(dbUpdates)
        .eq('ticket_id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to update ticket: ${error.message}`);
      return false;
    }
  },
  
  async updateTicketStatus(id: string, status: TicketStatus): Promise<boolean> {
    return this.updateTicket(id, { status });
  },
  
  async escalateTicket(id: string): Promise<boolean> {
    try {
      const { error } = await supabaseTable('support_tickets')
        .update({ 
          status: 'in_progress',
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
