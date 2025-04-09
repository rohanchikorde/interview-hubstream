
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { PostgrestResponse } from "@supabase/supabase-js";

/**
 * Extended TableName type to include both schema tables and custom tables
 * that might not be in the schema yet
 */
type KnownTableName = keyof Database['public']['Tables'];
type CustomTableName = 'requirements' | 'candidates' | 'interviews_schedule' | 'tickets' | 
  'organizations' | 'interviewees' | 'admins' | 'notifications' | 'mock_interviews' | 'demo_requests';
type TableName = KnownTableName | CustomTableName;

/**
 * Helper function to query supabase tables with type safety
 * @param tableName The name of the table to query
 * @returns A query builder for the specified table
 */
export const supabaseTable = (tableName: TableName) => {
  // Using any here to bypass type checking limitations
  // when working with tables not fully represented in the Database type
  return supabase.from(tableName as string) as any;
};

/**
 * Helper function to cast query results to a specific type
 * @param data The data to cast
 * @returns The data cast to the specified type
 */
export const castResult = <T>(data: any): T => {
  return data as T;
};
