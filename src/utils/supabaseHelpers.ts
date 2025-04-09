
import { supabase } from "@/integrations/supabase/client";
import type { PostgrestFilterBuilder } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Type-safe approach for working with tables
type TableName = 'users' | 'organizations' | 'interviewers' | 'interviewees' | 
  'interviews' | 'candidates' | 'mock_interviews' | 'analytics' | 'notifications' | 
  'demo_requests' | 'admins' | 'companies' | 'company_team' | 'leads' | 
  'requirements_documents' | 'candidate_lists' | 'jobs' | 'applications' | 
  'interview_evaluations' | 'quality_reviews' | 'interviewer_performance' | 
  'client_payments' | 'payments' | 'support_tickets' | 'audit_logs' | 'requirements' |
  'interviews_schedule' | 'tickets';

/**
 * Helper function to query supabase tables with type safety
 * @param tableName The name of the table to query
 * @returns A query builder for the specified table
 */
export const supabaseTable = (tableName: TableName | string) => {
  // Return the supabase query builder for the specified table
  return supabase.from(tableName);
};

/**
 * Helper function to cast query results to a specific type
 * @param data The data to cast
 * @returns The data cast to the specified type
 */
export const castResult = <T>(data: any): T => {
  return data as T;
};
