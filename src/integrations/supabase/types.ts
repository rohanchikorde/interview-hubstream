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
      analytics: {
        Row: {
          analytic_id: number
          company_id: number | null
          job_id: number | null
          metric_type: Database["public"]["Enums"]["metric_type_enum"] | null
          recorded_at: string | null
          value: number | null
        }
        Insert: {
          analytic_id?: number
          company_id?: number | null
          job_id?: number | null
          metric_type?: Database["public"]["Enums"]["metric_type_enum"] | null
          recorded_at?: string | null
          value?: number | null
        }
        Update: {
          analytic_id?: number
          company_id?: number | null
          job_id?: number | null
          metric_type?: Database["public"]["Enums"]["metric_type_enum"] | null
          recorded_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "analytics_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["job_id"]
          },
        ]
      }
      applications: {
        Row: {
          application_id: number
          candidate_id: number | null
          created_at: string | null
          job_id: number | null
          status: Database["public"]["Enums"]["application_status_type"] | null
        }
        Insert: {
          application_id?: number
          candidate_id?: number | null
          created_at?: string | null
          job_id?: number | null
          status?: Database["public"]["Enums"]["application_status_type"] | null
        }
        Update: {
          application_id?: number
          candidate_id?: number | null
          created_at?: string | null
          job_id?: number | null
          status?: Database["public"]["Enums"]["application_status_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["job_id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["action_type"]
          created_at: string | null
          details: Json | null
          entity_id: number
          entity_type: string
          log_id: number
          performed_by: number | null
        }
        Insert: {
          action: Database["public"]["Enums"]["action_type"]
          created_at?: string | null
          details?: Json | null
          entity_id: number
          entity_type: string
          log_id?: number
          performed_by?: number | null
        }
        Update: {
          action?: Database["public"]["Enums"]["action_type"]
          created_at?: string | null
          details?: Json | null
          entity_id?: number
          entity_type?: string
          log_id?: number
          performed_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      candidate_lists: {
        Row: {
          company_id: number | null
          is_revision: boolean | null
          list_id: number
          list_url: string
          uploaded_at: string | null
        }
        Insert: {
          company_id?: number | null
          is_revision?: boolean | null
          list_id?: number
          list_url: string
          uploaded_at?: string | null
        }
        Update: {
          company_id?: number | null
          is_revision?: boolean | null
          list_id?: number
          list_url?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_lists_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      candidates: {
        Row: {
          auth_user_id: string | null
          candidate_id: number
          created_at: string | null
          email: string
          name: string
          resume_url: string | null
          source: Database["public"]["Enums"]["candidate_source_type"] | null
          user_id: number | null
        }
        Insert: {
          auth_user_id?: string | null
          candidate_id?: number
          created_at?: string | null
          email: string
          name: string
          resume_url?: string | null
          source?: Database["public"]["Enums"]["candidate_source_type"] | null
          user_id?: number | null
        }
        Update: {
          auth_user_id?: string | null
          candidate_id?: number
          created_at?: string | null
          email?: string
          name?: string
          resume_url?: string | null
          source?: Database["public"]["Enums"]["candidate_source_type"] | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      client_payments: {
        Row: {
          amount: number
          company_id: number | null
          created_at: string | null
          invoice_id: string | null
          paid_at: string | null
          payment_id: number
          payment_type: Database["public"]["Enums"]["payment_type_enum"] | null
          status:
            | Database["public"]["Enums"]["client_payment_status_type"]
            | null
        }
        Insert: {
          amount: number
          company_id?: number | null
          created_at?: string | null
          invoice_id?: string | null
          paid_at?: string | null
          payment_id?: number
          payment_type?: Database["public"]["Enums"]["payment_type_enum"] | null
          status?:
            | Database["public"]["Enums"]["client_payment_status_type"]
            | null
        }
        Update: {
          amount?: number
          company_id?: number | null
          created_at?: string | null
          invoice_id?: string | null
          paid_at?: string | null
          payment_id?: number
          payment_type?: Database["public"]["Enums"]["payment_type_enum"] | null
          status?:
            | Database["public"]["Enums"]["client_payment_status_type"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "client_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      companies: {
        Row: {
          company_id: number
          company_name: string
          created_at: string | null
          payment_status:
            | Database["public"]["Enums"]["payment_status_type"]
            | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier_type"]
            | null
        }
        Insert: {
          company_id?: number
          company_name: string
          created_at?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_type"]
            | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier_type"]
            | null
        }
        Update: {
          company_id?: number
          company_name?: string
          created_at?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_type"]
            | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier_type"]
            | null
        }
        Relationships: []
      }
      company_team: {
        Row: {
          auth_user_id: string | null
          company_id: number | null
          company_team_id: number
          created_at: string | null
          role: Database["public"]["Enums"]["company_team_role_type"] | null
          user_id: number | null
        }
        Insert: {
          auth_user_id?: string | null
          company_id?: number | null
          company_team_id?: number
          created_at?: string | null
          role?: Database["public"]["Enums"]["company_team_role_type"] | null
          user_id?: number | null
        }
        Update: {
          auth_user_id?: string | null
          company_id?: number | null
          company_team_id?: number
          created_at?: string | null
          role?: Database["public"]["Enums"]["company_team_role_type"] | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_team_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_team_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      interview_evaluations: {
        Row: {
          ai_summary: string | null
          created_at: string | null
          evaluation_id: number
          feedback: string | null
          interview_id: number | null
          score: number | null
        }
        Insert: {
          ai_summary?: string | null
          created_at?: string | null
          evaluation_id?: number
          feedback?: string | null
          interview_id?: number | null
          score?: number | null
        }
        Update: {
          ai_summary?: string | null
          created_at?: string | null
          evaluation_id?: number
          feedback?: string | null
          interview_id?: number | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_evaluations_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: true
            referencedRelation: "interviews"
            referencedColumns: ["interview_id"]
          },
        ]
      }
      interviewer_performance: {
        Row: {
          block_end_date: string | null
          block_start_date: string | null
          block_status: Database["public"]["Enums"]["block_status_type"] | null
          evaluated_at: string | null
          feedback: string | null
          incentive_eligible: boolean | null
          interview_id: number | null
          interviewer_id: number | null
          performance_id: number
          score: number | null
        }
        Insert: {
          block_end_date?: string | null
          block_start_date?: string | null
          block_status?: Database["public"]["Enums"]["block_status_type"] | null
          evaluated_at?: string | null
          feedback?: string | null
          incentive_eligible?: boolean | null
          interview_id?: number | null
          interviewer_id?: number | null
          performance_id?: number
          score?: number | null
        }
        Update: {
          block_end_date?: string | null
          block_start_date?: string | null
          block_status?: Database["public"]["Enums"]["block_status_type"] | null
          evaluated_at?: string | null
          feedback?: string | null
          incentive_eligible?: boolean | null
          interview_id?: number | null
          interviewer_id?: number | null
          performance_id?: number
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "interviewer_performance_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["interview_id"]
          },
          {
            foreignKeyName: "interviewer_performance_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "interviewers"
            referencedColumns: ["interviewer_id"]
          },
        ]
      }
      interviewers: {
        Row: {
          auth_user_id: string | null
          availability: Json | null
          created_at: string | null
          expertise: Json | null
          interviewer_id: number
          is_active: boolean | null
          last_active: string | null
          user_id: number | null
        }
        Insert: {
          auth_user_id?: string | null
          availability?: Json | null
          created_at?: string | null
          expertise?: Json | null
          interviewer_id?: number
          is_active?: boolean | null
          last_active?: string | null
          user_id?: number | null
        }
        Update: {
          auth_user_id?: string | null
          availability?: Json | null
          created_at?: string | null
          expertise?: Json | null
          interviewer_id?: number
          is_active?: boolean | null
          last_active?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "interviewers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      interviews: {
        Row: {
          candidate_id: number | null
          created_at: string | null
          interview_id: number
          interviewer_id: number | null
          interviewer_notes: string | null
          job_id: number | null
          recording_url: string | null
          reschedule_count: number | null
          scheduled_at: string | null
          status: Database["public"]["Enums"]["interview_status_type"] | null
        }
        Insert: {
          candidate_id?: number | null
          created_at?: string | null
          interview_id?: number
          interviewer_id?: number | null
          interviewer_notes?: string | null
          job_id?: number | null
          recording_url?: string | null
          reschedule_count?: number | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["interview_status_type"] | null
        }
        Update: {
          candidate_id?: number | null
          created_at?: string | null
          interview_id?: number
          interviewer_id?: number | null
          interviewer_notes?: string | null
          job_id?: number | null
          recording_url?: string | null
          reschedule_count?: number | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["interview_status_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "interviews_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "interviewers"
            referencedColumns: ["interviewer_id"]
          },
          {
            foreignKeyName: "interviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["job_id"]
          },
        ]
      }
      jobs: {
        Row: {
          company_id: number | null
          created_at: string | null
          description: string
          interview_format: Json | null
          job_id: number
          positions_open: number
          skills_required: Json | null
          status: Database["public"]["Enums"]["job_status_type"] | null
          title: string
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          description: string
          interview_format?: Json | null
          job_id?: number
          positions_open: number
          skills_required?: Json | null
          status?: Database["public"]["Enums"]["job_status_type"] | null
          title: string
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          description?: string
          interview_format?: Json | null
          job_id?: number
          positions_open?: number
          skills_required?: Json | null
          status?: Database["public"]["Enums"]["job_status_type"] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      leads: {
        Row: {
          company_name: string
          created_at: string | null
          details: Json | null
          full_name: string
          hiring_goals: string | null
          how_heard: string | null
          job_title: string | null
          lead_id: number
          phone_number: string
          team_size: string | null
          work_email: string
        }
        Insert: {
          company_name: string
          created_at?: string | null
          details?: Json | null
          full_name: string
          hiring_goals?: string | null
          how_heard?: string | null
          job_title?: string | null
          lead_id?: number
          phone_number: string
          team_size?: string | null
          work_email: string
        }
        Update: {
          company_name?: string
          created_at?: string | null
          details?: Json | null
          full_name?: string
          hiring_goals?: string | null
          how_heard?: string | null
          job_title?: string | null
          lead_id?: number
          phone_number?: string
          team_size?: string | null
          work_email?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          incentive_amount: number | null
          interview_id: number | null
          interviewer_id: number | null
          invoice_id: string | null
          paid_at: string | null
          payment_id: number
          status: Database["public"]["Enums"]["payment_status_enum"] | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          incentive_amount?: number | null
          interview_id?: number | null
          interviewer_id?: number | null
          invoice_id?: string | null
          paid_at?: string | null
          payment_id?: number
          status?: Database["public"]["Enums"]["payment_status_enum"] | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          incentive_amount?: number | null
          interview_id?: number | null
          interviewer_id?: number | null
          invoice_id?: string | null
          paid_at?: string | null
          payment_id?: number
          status?: Database["public"]["Enums"]["payment_status_enum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: true
            referencedRelation: "interviews"
            referencedColumns: ["interview_id"]
          },
          {
            foreignKeyName: "payments_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "interviewers"
            referencedColumns: ["interviewer_id"]
          },
        ]
      }
      quality_reviews: {
        Row: {
          created_at: string | null
          interview_id: number | null
          is_alerted: boolean | null
          quality_score: number | null
          review_id: number
        }
        Insert: {
          created_at?: string | null
          interview_id?: number | null
          is_alerted?: boolean | null
          quality_score?: number | null
          review_id?: number
        }
        Update: {
          created_at?: string | null
          interview_id?: number | null
          is_alerted?: boolean | null
          quality_score?: number | null
          review_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "quality_reviews_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: true
            referencedRelation: "interviews"
            referencedColumns: ["interview_id"]
          },
        ]
      }
      requirements_documents: {
        Row: {
          company_id: number | null
          document_id: number
          document_url: string
          is_revision: boolean | null
          uploaded_at: string | null
        }
        Insert: {
          company_id?: number | null
          document_id?: number
          document_url: string
          is_revision?: boolean | null
          uploaded_at?: string | null
        }
        Update: {
          company_id?: number | null
          document_id?: number
          document_url?: string
          is_revision?: boolean | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requirements_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          company_id: number | null
          created_at: string | null
          priority: Database["public"]["Enums"]["ticket_priority_type"] | null
          status: Database["public"]["Enums"]["ticket_status_type"] | null
          subject: string
          ticket_id: number
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority_type"] | null
          status?: Database["public"]["Enums"]["ticket_status_type"] | null
          subject: string
          ticket_id?: number
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority_type"] | null
          status?: Database["public"]["Enums"]["ticket_status_type"] | null
          subject?: string
          ticket_id?: number
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          full_name: string
          is_verified: boolean | null
          password_hash: string
          phone_number: string | null
          roles: Json
          user_id: number
          work_email: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          full_name: string
          is_verified?: boolean | null
          password_hash: string
          phone_number?: string | null
          roles: Json
          user_id?: number
          work_email: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          full_name?: string
          is_verified?: boolean | null
          password_hash?: string
          phone_number?: string | null
          roles?: Json
          user_id?: number
          work_email?: string
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
      action_type: "create" | "update" | "delete"
      application_status_type:
        | "shortlisted"
        | "evaluated"
        | "hired"
        | "rejected"
      block_status_type: "active" | "temporary_block" | "permanent_block"
      candidate_source_type: "client_upload" | "internal"
      client_payment_status_type:
        | "pending"
        | "completed"
        | "failed"
        | "disputed"
      company_team_role_type: "client_admin" | "hiring_manager"
      interview_status_type:
        | "scheduled"
        | "completed"
        | "rescheduled"
        | "tech_issue"
        | "no_show"
        | "on_hold"
      job_status_type: "open" | "closed" | "in_progress"
      metric_type_enum: "time_to_hire" | "success_rate" | "interview_duration"
      payment_status_enum:
        | "pending"
        | "completed"
        | "failed"
        | "disputed"
        | "overdue"
      payment_status_type: "pending" | "completed" | "overdue"
      payment_type_enum: "subscription" | "per_interview"
      subscription_tier_type: "basic" | "pro" | "enterprise"
      ticket_priority_type: "low" | "medium" | "high"
      ticket_status_type: "open" | "in_progress" | "resolved"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      action_type: ["create", "update", "delete"],
      application_status_type: [
        "shortlisted",
        "evaluated",
        "hired",
        "rejected",
      ],
      block_status_type: ["active", "temporary_block", "permanent_block"],
      candidate_source_type: ["client_upload", "internal"],
      client_payment_status_type: [
        "pending",
        "completed",
        "failed",
        "disputed",
      ],
      company_team_role_type: ["client_admin", "hiring_manager"],
      interview_status_type: [
        "scheduled",
        "completed",
        "rescheduled",
        "tech_issue",
        "no_show",
        "on_hold",
      ],
      job_status_type: ["open", "closed", "in_progress"],
      metric_type_enum: ["time_to_hire", "success_rate", "interview_duration"],
      payment_status_enum: [
        "pending",
        "completed",
        "failed",
        "disputed",
        "overdue",
      ],
      payment_status_type: ["pending", "completed", "overdue"],
      payment_type_enum: ["subscription", "per_interview"],
      subscription_tier_type: ["basic", "pro", "enterprise"],
      ticket_priority_type: ["low", "medium", "high"],
      ticket_status_type: ["open", "in_progress", "resolved"],
    },
  },
} as const
