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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          address: string | null
          admin_notes: string | null
          city: string | null
          cnic: string | null
          created_at: string
          documents_url: string | null
          full_name: string
          id: string
          income_details: string | null
          phone: string | null
          status: string
          user_id: string
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          city?: string | null
          cnic?: string | null
          created_at?: string
          documents_url?: string | null
          full_name: string
          id?: string
          income_details?: string | null
          phone?: string | null
          status?: string
          user_id: string
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          city?: string | null
          cnic?: string | null
          created_at?: string
          documents_url?: string | null
          full_name?: string
          id?: string
          income_details?: string | null
          phone?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          body_en: string
          body_ur: string
          category: string | null
          created_at: string
          id: string
          image_url: string | null
          is_published: boolean
          published_at: string | null
          title_en: string
          title_ur: string
          updated_at: string
        }
        Insert: {
          body_en?: string
          body_ur?: string
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          title_en: string
          title_ur?: string
          updated_at?: string
        }
        Update: {
          body_en?: string
          body_ur?: string
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          title_en?: string
          title_ur?: string
          updated_at?: string
        }
        Relationships: []
      }
      cases: {
        Row: {
          created_at: string
          description_en: string
          description_ur: string
          id: string
          image_url: string | null
          location: string | null
          raised_amount: number
          status: string
          target_amount: number
          title_en: string
          title_ur: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_en?: string
          description_ur?: string
          id?: string
          image_url?: string | null
          location?: string | null
          raised_amount?: number
          status?: string
          target_amount?: number
          title_en: string
          title_ur?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_en?: string
          description_ur?: string
          id?: string
          image_url?: string | null
          location?: string | null
          raised_amount?: number
          status?: string
          target_amount?: number
          title_en?: string
          title_ur?: string
          updated_at?: string
        }
        Relationships: []
      }
      chats: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          is_resolved: boolean
          message: string
          sender: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          message: string
          sender: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          message?: string
          sender?: string
          user_id?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          case_id: string | null
          created_at: string
          donor_email: string | null
          donor_name: string | null
          id: string
          payment_method: string | null
          screenshot_url: string | null
          slip_url: string | null
          status: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          case_id?: string | null
          created_at?: string
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          payment_method?: string | null
          screenshot_url?: string | null
          slip_url?: string | null
          status?: string
          type?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          case_id?: string | null
          created_at?: string
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          payment_method?: string | null
          screenshot_url?: string | null
          slip_url?: string | null
          status?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery: {
        Row: {
          caption_en: string | null
          caption_ur: string | null
          category: string | null
          id: string
          image_url: string
          uploaded_at: string
        }
        Insert: {
          caption_en?: string | null
          caption_ur?: string | null
          category?: string | null
          id?: string
          image_url: string
          uploaded_at?: string
        }
        Update: {
          caption_en?: string | null
          caption_ur?: string | null
          category?: string | null
          id?: string
          image_url?: string
          uploaded_at?: string
        }
        Relationships: []
      }
      impact_counter: {
        Row: {
          families_helped: number
          id: string
          ration_bags_distributed: number
          total_donations: number
          updated_at: string
          volunteers_count: number
          zakat_collected: number
        }
        Insert: {
          families_helped?: number
          id?: string
          ration_bags_distributed?: number
          total_donations?: number
          updated_at?: string
          volunteers_count?: number
          zakat_collected?: number
        }
        Update: {
          families_helped?: number
          id?: string
          ration_bags_distributed?: number
          total_donations?: number
          updated_at?: string
          volunteers_count?: number
          zakat_collected?: number
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          account_title: string
          created_at: string
          iban: string | null
          id: string
          is_active: boolean
          method_name: string
          phone_number: string | null
        }
        Insert: {
          account_title: string
          created_at?: string
          iban?: string | null
          id?: string
          is_active?: boolean
          method_name: string
          phone_number?: string | null
        }
        Update: {
          account_title?: string
          created_at?: string
          iban?: string | null
          id?: string
          is_active?: boolean
          method_name?: string
          phone_number?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          language_preference: string | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          language_preference?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          language_preference?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          source_en: string | null
          source_ur: string | null
          text_en: string
          text_ur: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          source_en?: string | null
          source_ur?: string | null
          text_en: string
          text_ur?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          source_en?: string | null
          source_ur?: string | null
          text_en?: string
          text_ur?: string
        }
        Relationships: []
      }
      ration_bag_items: {
        Row: {
          created_at: string
          icon_url: string | null
          id: string
          item_name_en: string
          item_name_ur: string
          quantity: string | null
          unit: string | null
        }
        Insert: {
          created_at?: string
          icon_url?: string | null
          id?: string
          item_name_en: string
          item_name_ur?: string
          quantity?: string | null
          unit?: string | null
        }
        Update: {
          created_at?: string
          icon_url?: string | null
          id?: string
          item_name_en?: string
          item_name_ur?: string
          quantity?: string | null
          unit?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          id: string
          key: string
          updated_at: string
          value_en: string
          value_ur: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value_en?: string
          value_ur?: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value_en?: string
          value_ur?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      zakat_rates: {
        Row: {
          gold_rate_per_gram: number
          id: string
          is_admin_override: boolean
          last_updated: string
          silver_rate_per_gram: number
        }
        Insert: {
          gold_rate_per_gram?: number
          id?: string
          is_admin_override?: boolean
          last_updated?: string
          silver_rate_per_gram?: number
        }
        Update: {
          gold_rate_per_gram?: number
          id?: string
          is_admin_override?: boolean
          last_updated?: string
          silver_rate_per_gram?: number
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
      app_role: "admin" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
