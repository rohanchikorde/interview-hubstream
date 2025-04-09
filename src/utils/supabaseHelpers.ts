
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";

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
  return supabase.from(tableName as any);
};

/**
 * Helper function to cast query results to a specific type
 * @param data The data to cast
 * @returns The data cast to the specified type
 */
export const castResult = <T>(data: any): T => {
  return data as T;
};

/**
 * Helper function to handle a PostgrestSingleResponse
 * Checks if there is an error, otherwise safely extracts data
 * @param response The response from a Supabase query
 * @returns The data or null if there was an error
 */
export const handleSingleResponse = <T>(response: PostgrestSingleResponse<any>): T | null => {
  if (response.error) {
    console.error("Supabase query error:", response.error);
    return null;
  }
  
  return (response.data as any) as T;
};

/**
 * Helper function to handle a PostgrestResponse for multiple records
 * Checks if there is an error, otherwise safely extracts data array
 * @param response The response from a Supabase query
 * @returns The data array or empty array if there was an error
 */
export const handleMultipleResponse = <T>(response: { data: any; error: PostgrestError | null }): T[] => {
  if (response.error) {
    console.error("Supabase query error:", response.error);
    return [];
  }
  
  return ((response.data || []) as any) as T[];
};
