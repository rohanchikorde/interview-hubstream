
import { Json } from "@/integrations/supabase/types";

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'escalated';

export interface Ticket {
  id: string;
  status: TicketStatus;
  raised_by: string;
  requirement_id?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface TicketWithDetails extends Ticket {
  company_name?: string;
  requirement_title?: string;
}

export interface CreateTicketRequest {
  requirement_id?: string;
  company_id?: string;
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  reason?: string;
}
