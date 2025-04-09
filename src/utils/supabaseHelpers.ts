
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";

type DBTables = Database['public']['Tables'];
type TableName = keyof DBTables;
type UnknownTableName = TableName | string;

/**
 * Helper function to query supabase tables with type safety
 * @param tableName The name of the table to query
 * @returns A query builder for the specified table
 */
export const supabaseTable = (tableName: UnknownTableName) => {
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
  
  return response.data as T | null;
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
  
  return (response.data || []) as T[];
};
