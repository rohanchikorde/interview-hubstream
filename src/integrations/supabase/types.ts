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
      admins: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics: {
        Row: {
          candidate_status: Json | null
          created_at: string
          id: string
          interview_trends: Json | null
          interviewer_performance: Json | null
          metrics: Json | null
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          candidate_status?: Json | null
          created_at?: string
          id?: string
          interview_trends?: Json | null
          interviewer_performance?: Json | null
          metrics?: Json | null
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          candidate_status?: Json | null
          created_at?: string
          id?: string
          interview_trends?: Json | null
          interviewer_performance?: Json | null
          metrics?: Json | null
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_requests: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          status: Database["public"]["Enums"]["demo_request_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          status?: Database["public"]["Enums"]["demo_request_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          status?: Database["public"]["Enums"]["demo_request_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      interviewees: {
        Row: {
          completed_interviews: number | null
          created_at: string
          id: string
          scheduled_mock_interviews: number | null
          upcoming_interviews: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_interviews?: number | null
          created_at?: string
          id?: string
          scheduled_mock_interviews?: number | null
          upcoming_interviews?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_interviews?: number | null
          created_at?: string
          id?: string
          scheduled_mock_interviews?: number | null
          upcoming_interviews?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviewees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      interviewers: {
        Row: {
          availability_status:
            | Database["public"]["Enums"]["availability_status"]
            | null
          cancellation_requests: number | null
          created_at: string
          feedback_pending: number | null
          id: string
          total_interviews: number | null
          upcoming_interviews: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability_status?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          cancellation_requests?: number | null
          created_at?: string
          feedback_pending?: number | null
          id?: string
          total_interviews?: number | null
          upcoming_interviews?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability_status?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          cancellation_requests?: number | null
          created_at?: string
          feedback_pending?: number | null
          id?: string
          total_interviews?: number | null
          upcoming_interviews?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviewers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          candidate_name: string
          created_at: string
          date_time: string
          department: string | null
          feedback: string | null
          id: string
          interviewee_id: string
          interviewer_id: string | null
          open_since: string | null
          organization_id: string
          position_title: string | null
          required_skill: string | null
          status: Database["public"]["Enums"]["interview_status"]
          updated_at: string
        }
        Insert: {
          candidate_name: string
          created_at?: string
          date_time: string
          department?: string | null
          feedback?: string | null
          id?: string
          interviewee_id: string
          interviewer_id?: string | null
          open_since?: string | null
          organization_id: string
          position_title?: string | null
          required_skill?: string | null
          status?: Database["public"]["Enums"]["interview_status"]
          updated_at?: string
        }
        Update: {
          candidate_name?: string
          created_at?: string
          date_time?: string
          department?: string | null
          feedback?: string | null
          id?: string
          interviewee_id?: string
          interviewer_id?: string | null
          open_since?: string | null
          organization_id?: string
          position_title?: string | null
          required_skill?: string | null
          status?: Database["public"]["Enums"]["interview_status"]
          updated_at?: string
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
      mock_interviews: {
        Row: {
          created_at: string
          date_time: string
          duration: string
          id: string
          interviewee_id: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          status: Database["public"]["Enums"]["interview_status"]
          technology: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_time: string
          duration: string
          id?: string
          interviewee_id: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          status?: Database["public"]["Enums"]["interview_status"]
          technology: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_time?: string
          duration?: string
          id?: string
          interviewee_id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          status?: Database["public"]["Enums"]["interview_status"]
          technology?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_interviews_interviewee_id_fkey"
            columns: ["interviewee_id"]
            isOneToOne: false
            referencedRelation: "interviewees"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          date: string
          id: string
          message: string
          status: Database["public"]["Enums"]["notification_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          message: string
          status?: Database["public"]["Enums"]["notification_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          message?: string
          status?: Database["public"]["Enums"]["notification_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          stats: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          stats?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          stats?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password_hash: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          password_hash: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password_hash?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
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
      availability_status: "available" | "busy"
      demo_request_status: "pending" | "approved" | "rejected"
      interview_status: "scheduled" | "completed" | "cancelled"
      notification_status: "unread" | "read"
      payment_status: "pending" | "completed"
      user_role: "admin" | "organization" | "interviewer" | "interviewee"
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
      availability_status: ["available", "busy"],
      demo_request_status: ["pending", "approved", "rejected"],
      interview_status: ["scheduled", "completed", "cancelled"],
      notification_status: ["unread", "read"],
      payment_status: ["pending", "completed"],
      user_role: ["admin", "organization", "interviewer", "interviewee"],
    },
  },
} as const
