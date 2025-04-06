
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/database.types";

// Type for all available table names
type TableName = keyof Database['public']['Tables'];

// This helper provides a workaround for TypeScript errors with tables not defined in types.ts
export const supabaseTable = <T extends TableName>(tableName: T) => {
  return supabase.from(tableName);
};

// For consistent type casting of Supabase results
export const castResult = <T>(data: any): T => {
  return data as T;
};
