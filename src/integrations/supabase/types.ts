export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
        }
        Relationships: []
      }
      gate_passes: {
        Row: {
          created_at: string
          created_by: string | null
          expected_return: string | null
          going_with: string
          id: string
          in_at: string | null
          movement_type: Database["public"]["Enums"]["movement_type"]
          out_at: string
          pass_no: string
          purpose: string
          status: string
          student_id: string
          vehicle_no: string | null
          who_dropped: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expected_return?: string | null
          going_with: string
          id?: string
          in_at?: string | null
          movement_type: Database["public"]["Enums"]["movement_type"]
          out_at?: string
          pass_no: string
          purpose: string
          status?: string
          student_id: string
          vehicle_no?: string | null
          who_dropped?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expected_return?: string | null
          going_with?: string
          id?: string
          in_at?: string | null
          movement_type?: Database["public"]["Enums"]["movement_type"]
          out_at?: string
          pass_no?: string
          purpose?: string
          status?: string
          student_id?: string
          vehicle_no?: string | null
          who_dropped?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gate_passes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      public_display_state: {
        Row: {
          detail: string
          headline: string
          id: number
          mode: string
          safe_name: string | null
          updated_at: string
        }
        Insert: {
          detail?: string
          headline?: string
          id?: number
          mode?: string
          safe_name?: string | null
          updated_at?: string
        }
        Update: {
          detail?: string
          headline?: string
          id?: number
          mode?: string
          safe_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          class_name: string
          created_at: string
          current_status: Database["public"]["Enums"]["student_status"]
          house: string
          house_no: string | null
          id: string
          name: string
          photo_url: string | null
          qr_blocked: boolean
          qr_id: string
          section: string
          student_id: string
          updated_at: string
        }
        Insert: {
          class_name: string
          created_at?: string
          current_status?: Database["public"]["Enums"]["student_status"]
          house: string
          house_no?: string | null
          id?: string
          name: string
          photo_url?: string | null
          qr_blocked?: boolean
          qr_id: string
          section: string
          student_id: string
          updated_at?: string
        }
        Update: {
          class_name?: string
          created_at?: string
          current_status?: Database["public"]["Enums"]["student_status"]
          house?: string
          house_no?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          qr_blocked?: boolean
          qr_id?: string
          section?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitor_groups: {
        Row: {
          accompanying_names: string[]
          created_at: string
          created_by: string | null
          email: string | null
          head_name: string
          id: string
          in_at: string
          out_at: string | null
          phone: string | null
          purpose: string
          status: string
          vehicle_no: string | null
          visitor_pass_id: string
          whom_to_meet: string
        }
        Insert: {
          accompanying_names?: string[]
          created_at?: string
          created_by?: string | null
          email?: string | null
          head_name: string
          id?: string
          in_at?: string
          out_at?: string | null
          phone?: string | null
          purpose: string
          status?: string
          vehicle_no?: string | null
          visitor_pass_id: string
          whom_to_meet: string
        }
        Update: {
          accompanying_names?: string[]
          created_at?: string
          created_by?: string | null
          email?: string | null
          head_name?: string
          id?: string
          in_at?: string
          out_at?: string | null
          phone?: string | null
          purpose?: string
          status?: string
          vehicle_no?: string | null
          visitor_pass_id?: string
          whom_to_meet?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "gate_system"
      movement_type:
        | "Personal Leave"
        | "On Duty"
        | "Medical"
        | "Home Leave"
        | "Outing"
        | "Other"
      student_status: "on_campus" | "outside"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "gate_system"],
      movement_type: [
        "Personal Leave",
        "On Duty",
        "Medical",
        "Home Leave",
        "Outing",
        "Other",
      ],
      student_status: ["on_campus", "outside"],
    },
  },
} as const
