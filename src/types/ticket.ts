
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'escalated' | 'Pending' | 'Hold' | 'Approved' | 'Rejected';

export interface Ticket {
  id: string;
  requirement_id: string;
  status: TicketStatus;
  raised_by: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface TicketWithDetails extends Ticket {
  requirement_title?: string;
  company_name?: string;
  raised_by_name?: string;
}

export interface CreateTicketRequest {
  requirement_id: string;
  company_id: string;
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  reason?: string;
}
