
import { supabase } from "@/integrations/supabase/client";
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";

/**
 * Helper function to query supabase tables with better error handling
 * Allows using any table name for flexibility while properly handling types
 * @param tableName The name of the table to query
 * @returns A query builder for the specified table
 */
export const supabaseTable = (tableName: string) => {
  // Use a generic from() call to avoid TypeScript errors with dynamic table names
  return supabase.from(tableName);
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
  
  if (!response.data) {
    return null;
  }
  
  return response.data as T;
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
  
  if (!response.data) {
    return [];
  }
  
  return (response.data || []) as T[];
};
