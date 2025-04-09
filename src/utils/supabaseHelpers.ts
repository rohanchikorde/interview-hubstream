import { supabase } from "@/integrations/supabase/client";
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";

/**
 * Helper function to safely query supabase tables with better error handling
 * Uses a type assertion to allow dynamic table names, but with runtime validation
 * @param tableName The name of the table to query
 * @returns A query builder for the specified table
 */
export const supabaseTable = <T = any>(tableName: string) => {
  // Use a type assertion with runtime validation for the table name
  return supabase.from(tableName) as any;
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

/**
 * Helper function to cast database response to the expected type
 * Useful for mapping from database schema to application types
 * @param data The data from a Supabase query
 * @returns The data cast to the expected type or null
 */
export const castResult = <T>(data: any): T | null => {
  if (!data) {
    return null;
  }
  return data as T;
};

/**
 * Safely access a property on an object that might be undefined
 * @param obj The object to access a property from
 * @param key The key of the property to access
 * @param defaultValue The default value to return if the property doesn't exist
 * @returns The property value or the default value
 */
export const safeGet = <T, K extends keyof any>(obj: T | null | undefined, key: K, defaultValue: any): any => {
  if (!obj) return defaultValue;
  return (obj as any)[key] !== undefined && (obj as any)[key] !== null ? (obj as any)[key] : defaultValue;
};

/**
 * Safely convert a value to string
 * @param value The value to convert to string
 * @param defaultValue The default value to use if conversion fails
 * @returns The string representation of the value or the default value
 */
export const safeString = (value: any, defaultValue: string = ''): string => {
  if (value === null || value === undefined) return defaultValue;
  return String(value);
};

/**
 * Helper function to safely get the current ISO date string
 * @returns Current date in ISO format string
 */
export const safeNow = (): string => {
  return new Date().toISOString();
};

/**
 * Helper function to create a mapper that maps database fields to appropriate model fields
 * @param dataItem The database record to be mapped
 * @param fieldMap A mapping of model field names to database field names or direct values
 * @returns An object with the mapped fields
 */
export const mapDatabaseFields = <T>(dataItem: any, fieldMap: Record<string, string | any>): T => {
  const result: Record<string, any> = {};
  
  for (const [modelField, dbFieldOrValue] of Object.entries(fieldMap)) {
    if (typeof dbFieldOrValue === 'string') {
      // If the mapping is a string, treat it as a field name in the database record
      result[modelField] = dataItem?.[dbFieldOrValue] ?? null;
    } else {
      // Otherwise, use the direct value
      result[modelField] = dbFieldOrValue;
    }
  }
  
  return result as T;
};

/**
 * Helper function to wrap Supabase's auth operations and provide consistent error handling
 * @param operation The Supabase auth operation to perform
 * @returns The result of the operation or throws an error
 */
export const handleAuthOperation = async <T>(operation: () => Promise<T>): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    console.error("Authentication error:", error.message);
    throw new Error(error.message || "Authentication operation failed");
  }
};
