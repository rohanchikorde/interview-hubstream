
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      requirements: {
        Row: {
          id: string
          title: string
          description: string
          number_of_positions: number
          skills: string[]
          years_of_experience: number
          price_per_interview: number
          status: string
          raised_by: string
          company_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          number_of_positions: number
          skills: string[]
          years_of_experience: number
          price_per_interview: number
          status?: string
          raised_by: string
          company_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          number_of_positions?: number
          skills?: string[]
          years_of_experience?: number
          price_per_interview?: number
          status?: string
          raised_by?: string
          company_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      candidates: {
        Row: {
          id: string
          full_name: string
          email: string
          resume_url: string | null
          status: string
          requirement_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          resume_url?: string | null
          status: string
          requirement_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          resume_url?: string | null
          status?: string
          requirement_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      interviewers: {
        Row: {
          id: string
          name: string
          email: string
          skills: string[]
          years_of_experience: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          skills: string[]
          years_of_experience: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          skills?: string[]
          years_of_experience?: number
          created_at?: string
          updated_at?: string
        }
      }
      interviews_schedule: {
        Row: {
          id: string
          candidate_id: string
          interviewer_id: string
          requirement_id: string
          scheduled_at: string
          status: string
          feedback: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          interviewer_id: string
          requirement_id: string
          scheduled_at: string
          status?: string
          feedback?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          interviewer_id?: string
          requirement_id?: string
          scheduled_at?: string
          status?: string
          feedback?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          email: string
          contact_person: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          contact_person: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          contact_person?: string
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          requirement_id: string
          status: string
          raised_by: string
          company_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requirement_id: string
          status?: string
          raised_by: string
          company_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requirement_id?: string
          status?: string
          raised_by?: string
          company_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          role: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          role: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          role?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
