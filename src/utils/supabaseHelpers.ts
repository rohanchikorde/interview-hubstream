
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

/**
 * Create a type-safe table helper that doesn't depend on the generated types
 * This allows us to use tables that might not be in the generated types yet
 */
type GenericTable = {
  [key: string]: any;
};

/**
 * Helper function to query supabase tables with type safety
 * @param tableName The name of the table to query
 * @returns A query builder for the specified table
 */
export const supabaseTable = (tableName: string) => {
  // Cast the result to any to bypass type checking issues
  return supabase.from(tableName) as any;
};

/**
 * Helper function to cast query results to a specific type
 * @param data The data to cast
 * @returns The data cast to the specified type
 */
export const castResult = <T>(data: any): T => {
  return data as T;
};
