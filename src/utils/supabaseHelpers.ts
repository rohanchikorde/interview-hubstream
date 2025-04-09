
import { supabase } from "@/integrations/supabase/client";
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";

/**
 * Helper function to query supabase tables with better error handling
 * Uses a type assertion to allow dynamic table names
 * @param tableName The name of the table to query
 * @returns A query builder for the specified table
 */
export const supabaseTable = (tableName: string) => {
  // Use a type assertion to handle dynamic table names
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
