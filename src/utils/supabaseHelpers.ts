
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

/**
 * Define a type for all valid table names in the Database
 */
type TableName = keyof Database['public']['Tables'];

/**
 * Helper function to query supabase tables with type safety
 * @param tableName The name of the table to query
 * @returns A query builder for the specified table
 */
export const supabaseTable = <T extends TableName>(tableName: T) => {
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
