
import { supabase } from "@/integrations/supabase/client";
import { PostgrestQueryBuilder } from "@supabase/supabase-js";

// Type-safe approach for working with tables
type TableName = 'users' | 'organizations' | 'interviewers' | 'interviewees' | 
  'interviews' | 'candidates' | 'mock_interviews' | 'analytics' | 'notifications' | 
  'demo_requests' | 'admins' | 'companies' | 'company_team' | 'leads' | 
  'requirements_documents' | 'candidate_lists' | 'jobs' | 'applications' | 
  'interview_evaluations' | 'quality_reviews' | 'interviewer_performance' | 
  'client_payments' | 'payments' | 'support_tickets' | 'audit_logs' | 'requirements';

// This helper provides a workaround for TypeScript errors with tables not defined in types.ts
export const supabaseTable = (tableName: TableName | string): PostgrestQueryBuilder<any, any, any> => {
  // Using type assertion to bypass the TypeScript restriction since we know these tables exist
  return supabase.from(tableName);
};

// For consistent type casting of Supabase results
export const castResult = <T>(data: any): T => {
  return data as T;
};
