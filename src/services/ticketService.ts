import { supabaseTable, castResult } from "@/utils/supabaseHelpers";
import {
  Ticket,
  TicketWithDetails,
  CreateTicketRequest,
  UpdateTicketRequest,
  TicketStatus
} from "@/types/ticket";
import { toast } from "sonner";

export const ticketService = {
  async getTickets(): Promise<TicketWithDetails[]> {
    try {
      // Assuming support_tickets is the closest match in the DB schema
      const { data, error } = await supabaseTable('support_tickets')
        .select('*, companies(company_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform DB data to match TicketWithDetails
      const tickets: TicketWithDetails[] = (data || []).map((ticket: any) => {
        return {
          id: ticket.ticket_id.toString(),
          requirement_id: '', // This field might not exist in the DB schema
          status: mapDBStatusToTicketStatus(ticket.status),
          raised_by: ticket.user_id?.toString() || '',
          company_id: ticket.company_id?.toString() || '',
          created_at: ticket.created_at,
          updated_at: ticket.updated_at || ticket.created_at,
          company_name: ticket.companies?.company_name || '',
          requirement_title: ticket.subject || '', // Using subject as a placeholder
          raised_by_name: '' // This would need to be fetched separately
        };
      });

      return tickets;
    } catch (error: any) {
      toast.error(`Failed to fetch tickets: ${error.message}`);
      return [];
    }
  },

  async getTicketById(id: string): Promise<TicketWithDetails | null> {
    try {
      const { data, error } = await supabaseTable('support_tickets')
        .select('*, companies(company_name)')
        .eq('ticket_id', parseInt(id))
        .single();

      if (error) throw error;

      // Create a TicketWithDetails object from the DB data
      const ticket: TicketWithDetails = {
        id: data.ticket_id.toString(),
        requirement_id: '', // This field might not exist in the DB schema
        status: mapDBStatusToTicketStatus(data.status),
        raised_by: data.user_id?.toString() || '',
        company_id: data.company_id?.toString() || '',
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at,
        company_name: data.companies?.company_name || '',
        requirement_title: data.subject || '', // Using subject as a placeholder
        raised_by_name: '' // This would need to be fetched separately
      };

      return ticket;
    } catch (error: any) {
      toast.error(`Failed to fetch ticket: ${error.message}`);
      return null;
    }
  },

  async createTicket(request: CreateTicketRequest): Promise<Ticket | null> {
    try {
      // Map the request to match the support_tickets schema
      const { data, error } = await supabaseTable('support_tickets')
        .insert({
          company_id: parseInt(request.company_id),
          subject: `Requirement Request`, // Default subject
          status: 'open', // Default status in DB
          // Other required fields based on DB schema
        })
        .select()
        .single();

      if (error) throw error;

      // Convert DB data to Ticket format
      const ticket: Ticket = {
        id: data.ticket_id.toString(),
        requirement_id: request.requirement_id, // This is stored at application level
        status: mapDBStatusToTicketStatus(data.status),
        raised_by: data.user_id?.toString() || '',
        company_id: data.company_id?.toString() || '',
        created_at: data.created_at,
        updated_at: data.created_at
      };

      return ticket;
    } catch (error: any) {
      toast.error(`Failed to create ticket: ${error.message}`);
      return null;
    }
  },

  async updateTicket(id: string, updates: UpdateTicketRequest): Promise<Ticket | null> {
    try {
      // Map TicketStatus to DB status
      const dbStatus = mapTicketStatusToDBStatus(updates.status);
      
      const { data, error } = await supabaseTable('support_tickets')
        .update({
          status: dbStatus,
          // Other fields as needed
        })
        .eq('ticket_id', parseInt(id))
        .select()
        .single();

      if (error) throw error;

      // Convert DB data to Ticket format
      const ticket: Ticket = {
        id: data.ticket_id.toString(),
        requirement_id: '', // This field might not exist in the DB
        status: mapDBStatusToTicketStatus(data.status),
        raised_by: data.user_id?.toString() || '',
        company_id: data.company_id?.toString() || '',
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at
      };

      return ticket;
    } catch (error: any) {
      toast.error(`Failed to update ticket: ${error.message}`);
      return null;
    }
  },

  async escalateTicket(id: string): Promise<boolean> {
    try {
      const { error } = await supabaseTable('support_tickets')
        .update({ 
          status: 'in_progress', // Using in_progress as equivalent to escalated
          priority: 'high' // Setting high priority for escalated tickets
        })
        .eq('ticket_id', parseInt(id));

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Failed to escalate ticket: ${error.message}`);
      return false;
    }
  }
};

// Helper functions to map between application statuses and DB statuses
function mapDBStatusToTicketStatus(dbStatus: string): TicketStatus {
  switch(dbStatus) {
    case 'open': return 'Pending';
    case 'in_progress': return 'Hold';
    case 'resolved': return 'Approved';
    default: return 'Pending';
  }
}

function mapTicketStatusToDBStatus(ticketStatus: TicketStatus): string {
  switch(ticketStatus) {
    case 'Pending': return 'open';
    case 'Hold': return 'in_progress';
    case 'Approved': return 'resolved';
    case 'Rejected': return 'resolved'; // Using resolved with additional context
    case 'Escalated': return 'in_progress'; // Using in_progress with high priority
    default: return 'open';
  }
}
