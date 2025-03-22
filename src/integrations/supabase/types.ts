export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      candidates: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          requirement_id: string | null
          resume_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          requirement_id?: string | null
          resume_url?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          requirement_id?: string | null
          resume_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidates_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      interviewees: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          organization_id: string
          role_applied: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          organization_id: string
          role_applied?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          organization_id?: string
          role_applied?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviewees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      interviewers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          organization_id: string | null
          specialization: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          organization_id?: string | null
          specialization?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          organization_id?: string | null
          specialization?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviewers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          created_at: string
          feedback_submitted: string | null
          id: string
          interviewee_id: string
          interviewer_id: string
          notes: string | null
          organization_id: string
          scheduled_at: string
          status: string
        }
        Insert: {
          created_at?: string
          feedback_submitted?: string | null
          id?: string
          interviewee_id: string
          interviewer_id: string
          notes?: string | null
          organization_id: string
          scheduled_at: string
          status?: string
        }
        Update: {
          created_at?: string
          feedback_submitted?: string | null
          id?: string
          interviewee_id?: string
          interviewer_id?: string
          notes?: string | null
          organization_id?: string
          scheduled_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_interviewee_id_fkey"
            columns: ["interviewee_id"]
            isOneToOne: false
            referencedRelation: "interviewees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "interviewers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews_schedule: {
        Row: {
          candidate_id: string
          created_at: string
          feedback: Json | null
          id: string
          interviewer_id: string
          requirement_id: string
          scheduled_at: string
          status: Database["public"]["Enums"]["interview_status"]
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          feedback?: Json | null
          id?: string
          interviewer_id: string
          requirement_id: string
          scheduled_at: string
          status?: Database["public"]["Enums"]["interview_status"]
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          feedback?: Json | null
          id?: string
          interviewer_id?: string
          requirement_id?: string
          scheduled_at?: string
          status?: Database["public"]["Enums"]["interview_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_schedule_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_schedule_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "interviewers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_schedule_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_admins: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_admins_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          position: string | null
          role: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          position?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          position?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      requirements: {
        Row: {
          company_id: string
          created_at: string
          description: string
          id: string
          number_of_positions: number
          price_per_interview: number
          raised_by: string
          skills: string[]
          status: Database["public"]["Enums"]["requirement_status"]
          title: string
          updated_at: string
          years_of_experience: number
        }
        Insert: {
          company_id: string
          created_at?: string
          description: string
          id?: string
          number_of_positions: number
          price_per_interview: number
          raised_by: string
          skills: string[]
          status?: Database["public"]["Enums"]["requirement_status"]
          title: string
          updated_at?: string
          years_of_experience: number
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          number_of_positions?: number
          price_per_interview?: number
          raised_by?: string
          skills?: string[]
          status?: Database["public"]["Enums"]["requirement_status"]
          title?: string
          updated_at?: string
          years_of_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "requirements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requirements_raised_by_fkey"
            columns: ["raised_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          company_id: string
          created_at: string
          id: string
          raised_by: string
          requirement_id: string
          status: Database["public"]["Enums"]["ticket_status"]
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          raised_by: string
          requirement_id: string
          status?: Database["public"]["Enums"]["ticket_status"]
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          raised_by?: string
          requirement_id?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          password_hash: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          password_hash: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          password_hash?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      interview_status: "Scheduled" | "In Progress" | "Completed" | "Canceled"
      requirement_status:
        | "Pending"
        | "Hold"
        | "Approved"
        | "Rejected"
        | "Fulfilled"
        | "Canceled"
      ticket_status: "Pending" | "Hold" | "Approved" | "Rejected" | "Escalated"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
