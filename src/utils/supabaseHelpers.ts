
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

// Helper function to make direct API calls to backend
export const apiCall = async <T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
  data?: any
): Promise<T> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include'
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
    throw new Error(errorData.message || `API call failed with status: ${response.status}`);
  }
  
  return response.json();
};
