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
      account_profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          created_at: string
          id: string
          is_active: boolean
          organization_name: string | null
          profile_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type: Database["public"]["Enums"]["account_type"]
          created_at?: string
          id?: string
          is_active?: boolean
          organization_name?: string | null
          profile_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          created_at?: string
          id?: string
          is_active?: boolean
          organization_name?: string | null
          profile_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          action_type: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_value: Json | null
          previous_value: Json | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          previous_value?: Json | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          previous_value?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string
          citations: string[] | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          featured_video: string | null
          id: string
          is_archived: boolean | null
          is_published: boolean | null
          published_at: string | null
          scheduled_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string
          citations?: string[] | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          featured_video?: string | null
          id?: string
          is_archived?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          scheduled_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string
          citations?: string[] | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          featured_video?: string | null
          id?: string
          is_archived?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          scheduled_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      calculation_logs: {
        Row: {
          created_at: string
          id: string
          inputs: Json | null
          medication_id: string | null
          result: Json | null
          safety_check_passed: boolean | null
          tool_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inputs?: Json | null
          medication_id?: string | null
          result?: Json | null
          safety_check_passed?: boolean | null
          tool_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inputs?: Json | null
          medication_id?: string | null
          result?: Json | null
          safety_check_passed?: boolean | null
          tool_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calculation_logs_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculation_logs_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "clinical_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      ce_certificates: {
        Row: {
          ce_credits_earned: number
          certificate_number: string
          course_id: string
          created_at: string
          id: string
          issued_at: string
          user_id: string
        }
        Insert: {
          ce_credits_earned: number
          certificate_number: string
          course_id: string
          created_at?: string
          id?: string
          issued_at?: string
          user_id: string
        }
        Update: {
          ce_credits_earned?: number
          certificate_number?: string
          course_id?: string
          created_at?: string
          id?: string
          issued_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ce_certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "ce_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      ce_courses: {
        Row: {
          category: string
          ce_credits: number
          created_at: string
          description: string | null
          difficulty_level: string
          duration_minutes: number
          id: string
          is_free: boolean
          is_published: boolean
          objectives: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          ce_credits?: number
          created_at?: string
          description?: string | null
          difficulty_level?: string
          duration_minutes?: number
          id?: string
          is_free?: boolean
          is_published?: boolean
          objectives?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          ce_credits?: number
          created_at?: string
          description?: string | null
          difficulty_level?: string
          duration_minutes?: number
          id?: string
          is_free?: boolean
          is_published?: boolean
          objectives?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ce_lessons: {
        Row: {
          content: string | null
          course_id: string
          created_at: string
          duration_minutes: number
          id: string
          lesson_order: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string
          duration_minutes?: number
          id?: string
          lesson_order?: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          lesson_order?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ce_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "ce_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      ce_quizzes: {
        Row: {
          course_id: string
          created_at: string
          id: string
          passing_score: number
          questions: Json
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          passing_score?: number
          questions?: Json
          title?: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          passing_score?: number
          questions?: Json
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ce_quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "ce_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      ce_user_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          lesson_id: string | null
          quiz_attempts: number | null
          quiz_passed: boolean | null
          quiz_score: number | null
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          lesson_id?: string | null
          quiz_attempts?: number | null
          quiz_passed?: boolean | null
          quiz_score?: number | null
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          lesson_id?: string | null
          quiz_attempts?: number | null
          quiz_passed?: boolean | null
          quiz_score?: number | null
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ce_user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "ce_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ce_user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "ce_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_tool_settings: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_visible: boolean
          system_category: string
          tool_id: string
          tool_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_visible?: boolean
          system_category: string
          tool_id: string
          tool_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_visible?: boolean
          system_category?: string
          tool_id?: string
          tool_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      clinical_tools: {
        Row: {
          category: string
          created_at: string
          description: string | null
          formula: Json | null
          id: string
          inputs: Json | null
          interpretation: Json | null
          name: string
          roles_applicable:
            | Database["public"]["Enums"]["clinical_role"][]
            | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          formula?: Json | null
          id?: string
          inputs?: Json | null
          interpretation?: Json | null
          name: string
          roles_applicable?:
            | Database["public"]["Enums"]["clinical_role"][]
            | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          formula?: Json | null
          id?: string
          inputs?: Json | null
          interpretation?: Json | null
          name?: string
          roles_applicable?:
            | Database["public"]["Enums"]["clinical_role"][]
            | null
        }
        Relationships: []
      }
      clinical_validation_rules: {
        Row: {
          created_at: string | null
          drug_class: string | null
          id: string
          is_active: boolean | null
          medication_pattern: string | null
          rule_config: Json
          rule_type: string
          severity: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          drug_class?: string | null
          id?: string
          is_active?: boolean | null
          medication_pattern?: string | null
          rule_config: Json
          rule_type: string
          severity?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          drug_class?: string | null
          id?: string
          is_active?: boolean | null
          medication_pattern?: string | null
          rule_config?: Json
          rule_type?: string
          severity?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clinician_profiles: {
        Row: {
          clinical_role: Database["public"]["Enums"]["clinical_role"]
          created_at: string
          education: string | null
          id: string
          onboarding_completed: boolean | null
          patient_population: string | null
          practice_setting:
            | Database["public"]["Enums"]["practice_setting"]
            | null
          preferred_units: string | null
          shift_type: Database["public"]["Enums"]["shift_type"] | null
          specialty: Database["public"]["Enums"]["clinical_specialty"] | null
          tour_completed: boolean | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          clinical_role: Database["public"]["Enums"]["clinical_role"]
          created_at?: string
          education?: string | null
          id?: string
          onboarding_completed?: boolean | null
          patient_population?: string | null
          practice_setting?:
            | Database["public"]["Enums"]["practice_setting"]
            | null
          preferred_units?: string | null
          shift_type?: Database["public"]["Enums"]["shift_type"] | null
          specialty?: Database["public"]["Enums"]["clinical_specialty"] | null
          tour_completed?: boolean | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          clinical_role?: Database["public"]["Enums"]["clinical_role"]
          created_at?: string
          education?: string | null
          id?: string
          onboarding_completed?: boolean | null
          patient_population?: string | null
          practice_setting?:
            | Database["public"]["Enums"]["practice_setting"]
            | null
          preferred_units?: string | null
          shift_type?: Database["public"]["Enums"]["shift_type"] | null
          specialty?: Database["public"]["Enums"]["clinical_specialty"] | null
          tour_completed?: boolean | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          notes: string | null
          responded_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          notes?: string | null
          responded_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          notes?: string | null
          responded_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_versions: {
        Row: {
          change_type: string
          content: Json
          created_at: string
          created_by: string | null
          entity_id: string
          entity_type: string
          id: string
          version_number: number
        }
        Insert: {
          change_type?: string
          content: Json
          created_at?: string
          created_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          version_number?: number
        }
        Update: {
          change_type?: string
          content?: Json
          created_at?: string
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          version_number?: number
        }
        Relationships: []
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          discount_applied: number
          id: string
          plan: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          coupon_id: string
          discount_applied?: number
          id?: string
          plan: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          coupon_id?: string
          discount_applied?: number
          id?: string
          plan?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          applicable_plans: string[] | null
          code: string
          created_at: string
          created_by: string | null
          current_uses: number
          description: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          min_plan: string | null
          starts_at: string | null
          updated_at: string
        }
        Insert: {
          applicable_plans?: string[] | null
          code: string
          created_at?: string
          created_by?: string | null
          current_uses?: number
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_plan?: string | null
          starts_at?: string | null
          updated_at?: string
        }
        Update: {
          applicable_plans?: string[] | null
          code?: string
          created_at?: string
          created_by?: string | null
          current_uses?: number
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_plan?: string | null
          starts_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      demo_blocked_dates: {
        Row: {
          blocked_date: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          blocked_date: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_date?: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      demo_bookings: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          scheduled_date: string
          scheduled_time: string
          status: string
          timezone: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          scheduled_date: string
          scheduled_time: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          scheduled_date?: string
          scheduled_time?: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      demo_email_templates: {
        Row: {
          alert_email: string
          body_text: string
          closing_text: string
          greeting: string
          header_color: string | null
          id: string
          logo_url: string | null
          subject: string
          template_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          alert_email?: string
          body_text?: string
          closing_text?: string
          greeting?: string
          header_color?: string | null
          id?: string
          logo_url?: string | null
          subject?: string
          template_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          alert_email?: string
          body_text?: string
          closing_text?: string
          greeting?: string
          header_color?: string | null
          id?: string
          logo_url?: string | null
          subject?: string
          template_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      demo_settings: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      demo_time_slot_overrides: {
        Row: {
          created_at: string
          id: string
          reason: string | null
          scope_type: string
          scope_value: string
          time_slots: string[]
        }
        Insert: {
          created_at?: string
          id?: string
          reason?: string | null
          scope_type: string
          scope_value: string
          time_slots?: string[]
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string | null
          scope_type?: string
          scope_value?: string
          time_slots?: string[]
        }
        Relationships: []
      }
      demo_time_slots: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          time_label: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          time_label: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          time_label?: string
        }
        Relationships: []
      }
      demo_timezones: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          tz_label: string
          tz_value: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          tz_label: string
          tz_value: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          tz_label?: string
          tz_value?: string
        }
        Relationships: []
      }
      drug_interactions: {
        Row: {
          clinical_significance: string | null
          created_at: string
          description: string | null
          drug_a_id: string
          drug_b_id: string
          id: string
          severity: string
        }
        Insert: {
          clinical_significance?: string | null
          created_at?: string
          description?: string | null
          drug_a_id: string
          drug_b_id: string
          id?: string
          severity: string
        }
        Update: {
          clinical_significance?: string | null
          created_at?: string
          description?: string | null
          drug_a_id?: string
          drug_b_id?: string
          id?: string
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "drug_interactions_drug_a_id_fkey"
            columns: ["drug_a_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drug_interactions_drug_b_id_fkey"
            columns: ["drug_b_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      edith_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      edith_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "edith_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "edith_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      errors_prevented: {
        Row: {
          created_at: string
          helped_prevent: boolean | null
          id: string
          interaction_type: string | null
          medication_id: string | null
          tool_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          helped_prevent?: boolean | null
          id?: string
          interaction_type?: string | null
          medication_id?: string | null
          tool_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          helped_prevent?: boolean | null
          id?: string
          interaction_type?: string | null
          medication_id?: string | null
          tool_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "errors_prevented_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "errors_prevented_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "clinical_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_assets: {
        Row: {
          alt_text: string | null
          created_at: string
          duration: number | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          media_type: string | null
          thumbnail_url: string | null
          uploaded_by: string | null
          used_in_pages: string[] | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          duration?: number | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          media_type?: string | null
          thumbnail_url?: string | null
          uploaded_by?: string | null
          used_in_pages?: string[] | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          duration?: number | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          media_type?: string | null
          thumbnail_url?: string | null
          uploaded_by?: string | null
          used_in_pages?: string[] | null
        }
        Relationships: []
      }
      marketing_pages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_sections: {
        Row: {
          content: Json
          created_at: string
          display_order: number
          id: string
          is_visible: boolean
          page_id: string
          section_key: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          display_order?: number
          id?: string
          is_visible?: boolean
          page_id: string
          section_key: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          display_order?: number
          id?: string
          is_visible?: boolean
          page_id?: string
          section_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "marketing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_seo: {
        Row: {
          canonical_url: string | null
          created_at: string
          id: string
          keywords: string[] | null
          meta_description: string | null
          meta_title: string | null
          og_image: string | null
          page_slug: string
          robots: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          page_slug: string
          robots?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          page_slug?: string
          robots?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      medication_sync_logs: {
        Row: {
          completed_at: string | null
          errors: Json | null
          id: string
          initiated_by: string | null
          medications_created: number | null
          medications_updated: number | null
          started_at: string
          status: string | null
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          errors?: Json | null
          id?: string
          initiated_by?: string | null
          medications_created?: number | null
          medications_updated?: number | null
          started_at?: string
          status?: string | null
          sync_type: string
        }
        Update: {
          completed_at?: string | null
          errors?: Json | null
          id?: string
          initiated_by?: string | null
          medications_created?: number | null
          medications_updated?: number | null
          started_at?: string
          status?: string | null
          sync_type?: string
        }
        Relationships: []
      }
      medications: {
        Row: {
          adjustments: Json | null
          administration_info: Json | null
          adverse_reactions: Json | null
          ai_confidence_score: number | null
          ai_generated_content: Json | null
          brand_names: string[] | null
          clinical_pearls: string[] | null
          content_status: string | null
          controlled_substance: boolean | null
          created_at: string
          crushing_info: Json | null
          documentation_reminders: Json | null
          dosage_form: string | null
          dosing_info: Json | null
          double_check_required: boolean | null
          drug_class: string | null
          drug_interactions_info: Json | null
          expected_effect: Json | null
          fda_label_data: Json | null
          fda_label_revision_date: string | null
          fda_label_url: string | null
          fda_link: string | null
          fda_set_id: string | null
          generic_name: string
          high_alert: boolean | null
          hold_parameters: Json | null
          id: string
          image_url: string | null
          last_synced_at: string | null
          line_compatibility: Json | null
          manufacturer: string | null
          monitoring: Json | null
          ndc_code: string | null
          nursing_guide: Json | null
          openfda_data: Json | null
          patient_education: Json | null
          pause_triggers: Json | null
          pharmacokinetics: Json | null
          pronunciation_audio_url: string | null
          pronunciation_text: string | null
          rate_dilution: Json | null
          red_flags: Json | null
          required_resources: Json | null
          review_notes: string | null
          review_tier: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          route: string[] | null
          safe_method: Json | null
          safety_badges: Json | null
          safety_info: Json | null
          strengths: string[] | null
          sync_source: string | null
          timing_rules: Json | null
          validation_results: Json | null
          video_url: string | null
          visibility_settings: Json | null
        }
        Insert: {
          adjustments?: Json | null
          administration_info?: Json | null
          adverse_reactions?: Json | null
          ai_confidence_score?: number | null
          ai_generated_content?: Json | null
          brand_names?: string[] | null
          clinical_pearls?: string[] | null
          content_status?: string | null
          controlled_substance?: boolean | null
          created_at?: string
          crushing_info?: Json | null
          documentation_reminders?: Json | null
          dosage_form?: string | null
          dosing_info?: Json | null
          double_check_required?: boolean | null
          drug_class?: string | null
          drug_interactions_info?: Json | null
          expected_effect?: Json | null
          fda_label_data?: Json | null
          fda_label_revision_date?: string | null
          fda_label_url?: string | null
          fda_link?: string | null
          fda_set_id?: string | null
          generic_name: string
          high_alert?: boolean | null
          hold_parameters?: Json | null
          id?: string
          image_url?: string | null
          last_synced_at?: string | null
          line_compatibility?: Json | null
          manufacturer?: string | null
          monitoring?: Json | null
          ndc_code?: string | null
          nursing_guide?: Json | null
          openfda_data?: Json | null
          patient_education?: Json | null
          pause_triggers?: Json | null
          pharmacokinetics?: Json | null
          pronunciation_audio_url?: string | null
          pronunciation_text?: string | null
          rate_dilution?: Json | null
          red_flags?: Json | null
          required_resources?: Json | null
          review_notes?: string | null
          review_tier?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          route?: string[] | null
          safe_method?: Json | null
          safety_badges?: Json | null
          safety_info?: Json | null
          strengths?: string[] | null
          sync_source?: string | null
          timing_rules?: Json | null
          validation_results?: Json | null
          video_url?: string | null
          visibility_settings?: Json | null
        }
        Update: {
          adjustments?: Json | null
          administration_info?: Json | null
          adverse_reactions?: Json | null
          ai_confidence_score?: number | null
          ai_generated_content?: Json | null
          brand_names?: string[] | null
          clinical_pearls?: string[] | null
          content_status?: string | null
          controlled_substance?: boolean | null
          created_at?: string
          crushing_info?: Json | null
          documentation_reminders?: Json | null
          dosage_form?: string | null
          dosing_info?: Json | null
          double_check_required?: boolean | null
          drug_class?: string | null
          drug_interactions_info?: Json | null
          expected_effect?: Json | null
          fda_label_data?: Json | null
          fda_label_revision_date?: string | null
          fda_label_url?: string | null
          fda_link?: string | null
          fda_set_id?: string | null
          generic_name?: string
          high_alert?: boolean | null
          hold_parameters?: Json | null
          id?: string
          image_url?: string | null
          last_synced_at?: string | null
          line_compatibility?: Json | null
          manufacturer?: string | null
          monitoring?: Json | null
          ndc_code?: string | null
          nursing_guide?: Json | null
          openfda_data?: Json | null
          patient_education?: Json | null
          pause_triggers?: Json | null
          pharmacokinetics?: Json | null
          pronunciation_audio_url?: string | null
          pronunciation_text?: string | null
          rate_dilution?: Json | null
          red_flags?: Json | null
          required_resources?: Json | null
          review_notes?: string | null
          review_tier?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          route?: string[] | null
          safe_method?: Json | null
          safety_badges?: Json | null
          safety_info?: Json | null
          strengths?: string[] | null
          sync_source?: string | null
          timing_rules?: Json | null
          validation_results?: Json | null
          video_url?: string | null
          visibility_settings?: Json | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          source: string | null
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          source?: string | null
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          source?: string | null
          subscribed_at?: string
        }
        Relationships: []
      }
      not_found_errors: {
        Row: {
          created_at: string
          id: string
          page_path: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_path: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_path?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_product_updates: boolean
          email_safety_alerts: boolean
          email_weekly_digest: boolean
          id: string
          push_calculation_reminders: boolean
          push_safety_alerts: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_product_updates?: boolean
          email_safety_alerts?: boolean
          email_weekly_digest?: boolean
          id?: string
          push_calculation_reminders?: boolean
          push_safety_alerts?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_product_updates?: boolean
          email_safety_alerts?: boolean
          email_weekly_digest?: boolean
          id?: string
          push_calculation_reminders?: boolean
          push_safety_alerts?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          page_path: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_path: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_path?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          state: string | null
          street_address: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          state?: string | null
          street_address?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          state?: string | null
          street_address?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      safety_alerts: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          alert_type: string
          created_at: string
          id: string
          medication_id: string | null
          message: string
          severity: string
          user_id: string
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          alert_type: string
          created_at?: string
          id?: string
          medication_id?: string | null
          message: string
          severity: string
          user_id: string
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          alert_type?: string
          created_at?: string
          id?: string
          medication_id?: string | null
          message?: string
          severity?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_alerts_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      share_events: {
        Row: {
          created_at: string
          id: string
          share_method: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          share_method: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          share_method?: string
          user_id?: string
        }
        Relationships: []
      }
      smtp_settings: {
        Row: {
          created_at: string
          from_email: string
          from_name: string
          host: string
          id: string
          is_active: boolean
          password: string
          port: number
          setting_key: string
          updated_at: string
          use_tls: boolean
          username: string
        }
        Insert: {
          created_at?: string
          from_email?: string
          from_name?: string
          host?: string
          id?: string
          is_active?: boolean
          password?: string
          port?: number
          setting_key: string
          updated_at?: string
          use_tls?: boolean
          username?: string
        }
        Update: {
          created_at?: string
          from_email?: string
          from_name?: string
          host?: string
          id?: string
          is_active?: boolean
          password?: string
          port?: number
          setting_key?: string
          updated_at?: string
          use_tls?: boolean
          username?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          id: string
          message: string
          priority: string
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string
          user_email: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          message: string
          priority?: string
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_email: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          message?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_email?: string
          user_id?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          display_order: number
          experience: string | null
          feature_page: string
          id: string
          image_url: string | null
          is_published: boolean
          name: string
          quote: string
          rating: number
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          experience?: string | null
          feature_page?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          name: string
          quote: string
          rating?: number
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          experience?: string | null
          feature_page?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          name?: string
          quote?: string
          rating?: number
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_medication_favorites: {
        Row: {
          created_at: string
          drug_class: string | null
          high_alert: boolean | null
          id: string
          medication_name: string
          note: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          drug_class?: string | null
          high_alert?: boolean | null
          id?: string
          medication_name: string
          note?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          drug_class?: string | null
          high_alert?: boolean | null
          id?: string
          medication_name?: string
          note?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_memberships: {
        Row: {
          billing_status: Database["public"]["Enums"]["billing_status"]
          cancelled_at: string | null
          created_at: string
          expires_at: string | null
          features: Json | null
          id: string
          metadata: Json | null
          plan: Database["public"]["Enums"]["membership_plan"]
          started_at: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_status?: Database["public"]["Enums"]["billing_status"]
          cancelled_at?: string | null
          created_at?: string
          expires_at?: string | null
          features?: Json | null
          id?: string
          metadata?: Json | null
          plan?: Database["public"]["Enums"]["membership_plan"]
          started_at?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_status?: Database["public"]["Enums"]["billing_status"]
          cancelled_at?: string | null
          created_at?: string
          expires_at?: string | null
          features?: Json | null
          id?: string
          metadata?: Json | null
          plan?: Database["public"]["Enums"]["membership_plan"]
          started_at?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
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
          role?: Database["public"]["Enums"]["app_role"]
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
      user_tool_favorites: {
        Row: {
          created_at: string
          id: string
          tool_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tool_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tool_id?: string
          user_id?: string
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
      is_admin_or_support: { Args: { _user_id: string }; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
      search_medications: {
        Args: { max_results?: number; search_query: string }
        Returns: {
          adjustments: Json | null
          administration_info: Json | null
          adverse_reactions: Json | null
          ai_confidence_score: number | null
          ai_generated_content: Json | null
          brand_names: string[] | null
          clinical_pearls: string[] | null
          content_status: string | null
          controlled_substance: boolean | null
          created_at: string
          crushing_info: Json | null
          documentation_reminders: Json | null
          dosage_form: string | null
          dosing_info: Json | null
          double_check_required: boolean | null
          drug_class: string | null
          drug_interactions_info: Json | null
          expected_effect: Json | null
          fda_label_data: Json | null
          fda_label_revision_date: string | null
          fda_label_url: string | null
          fda_link: string | null
          fda_set_id: string | null
          generic_name: string
          high_alert: boolean | null
          hold_parameters: Json | null
          id: string
          image_url: string | null
          last_synced_at: string | null
          line_compatibility: Json | null
          manufacturer: string | null
          monitoring: Json | null
          ndc_code: string | null
          nursing_guide: Json | null
          openfda_data: Json | null
          patient_education: Json | null
          pause_triggers: Json | null
          pharmacokinetics: Json | null
          pronunciation_audio_url: string | null
          pronunciation_text: string | null
          rate_dilution: Json | null
          red_flags: Json | null
          required_resources: Json | null
          review_notes: string | null
          review_tier: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          route: string[] | null
          safe_method: Json | null
          safety_badges: Json | null
          safety_info: Json | null
          strengths: string[] | null
          sync_source: string | null
          timing_rules: Json | null
          validation_results: Json | null
          video_url: string | null
          visibility_settings: Json | null
        }[]
        SetofOptions: {
          from: "*"
          to: "medications"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      account_type: "personal" | "work"
      app_role: "admin" | "moderator" | "support" | "user" | "super_admin"
      billing_status:
        | "active"
        | "past_due"
        | "cancelled"
        | "trialing"
        | "paused"
      clinical_role:
        | "nursing_student"
        | "nurse"
        | "advanced_nurse"
        | "medical_student"
        | "resident"
        | "attending"
        | "app"
      clinical_specialty:
        | "medical_surgical"
        | "general_internal_medicine"
        | "neuro"
        | "cardiac"
        | "pulmonology"
        | "gi"
        | "nephrology"
        | "endocrinology"
        | "rheumatology"
        | "id"
        | "hematology"
        | "oncology"
        | "palliative_care"
        | "pain_management"
        | "geriatrics"
        | "icu"
        | "cardiothoracic_icu"
        | "neuro_icu"
        | "surgical_icu"
        | "medical_icu"
        | "trauma"
        | "em"
        | "rapid_response"
        | "burn_unit"
        | "ob"
        | "labor_delivery"
        | "postpartum"
        | "high_risk_ob"
        | "reproductive_health"
        | "fertility"
        | "gyn_oncology"
        | "pediatrics"
        | "picu"
        | "pediatric_em"
        | "nicu"
        | "newborn_nursery"
        | "pediatric_oncology"
        | "pediatric_cardiology"
        | "perioperative"
        | "operating_room"
        | "pre_op"
        | "pacu"
        | "ambulatory_surgery"
        | "endoscopy"
        | "interventional_radiology"
        | "cardiac_cath_lab"
        | "psychiatric"
        | "substance_use"
        | "behavioral_health"
        | "crisis_intervention"
        | "forensic"
        | "public_health"
        | "community_health"
        | "school_nursing"
        | "occupational_health"
        | "correctional"
        | "home_health"
        | "hospice"
        | "rehabilitation"
        | "stroke_rehab"
        | "spinal_cord_injury"
        | "brain_injury"
        | "physical_medicine"
        | "long_term_care"
        | "skilled_nursing"
        | "dialysis"
        | "infusion"
        | "wound_ostomy"
        | "diabetes_education"
        | "lactation"
        | "case_management"
        | "care_coordination"
        | "radiology"
        | "nuclear_medicine"
        | "cardiac_diagnostics"
        | "sleep_medicine"
        | "pulmonary_function"
        | "nurse_educator"
        | "clinical_nurse_specialist"
        | "nurse_manager"
        | "nurse_executive"
        | "quality_improvement"
        | "patient_safety"
        | "risk_management"
        | "research"
        | "informatics"
        | "general"
        | "respiratory"
      membership_plan: "free" | "pro" | "premium" | "enterprise"
      practice_setting:
        | "emergency_department"
        | "trauma_center"
        | "observation_unit"
        | "critical_care_icu"
        | "medical_icu"
        | "surgical_icu"
        | "neuro_icu"
        | "cardiac_icu"
        | "cardiothoracic_icu"
        | "coronary_care_unit"
        | "step_down_unit"
        | "progressive_care_unit"
        | "medical_surgical_unit"
        | "telemetry_unit"
        | "stroke_unit"
        | "burn_unit"
        | "isolation_unit"
        | "negative_pressure_unit"
        | "overflow_surge_unit"
        | "operating_room"
        | "hybrid_or"
        | "preoperative_unit"
        | "post_anesthesia_care_unit"
        | "same_day_surgery"
        | "ambulatory_surgery_center"
        | "endoscopy_suite"
        | "cardiac_cath_lab"
        | "electrophysiology_lab"
        | "interventional_radiology"
        | "interventional_neurology_suite"
        | "pain_procedure_suite"
        | "labor_and_delivery"
        | "postpartum_mother_baby"
        | "high_risk_obstetrics_unit"
        | "antepartum_unit"
        | "ob_triage"
        | "neonatal_icu"
        | "newborn_nursery"
        | "lactation_services"
        | "fertility_clinic"
        | "gynecologic_oncology_unit"
        | "pediatric_unit"
        | "pediatric_icu"
        | "pediatric_emergency_department"
        | "pediatric_step_down"
        | "pediatric_oncology_unit"
        | "pediatric_specialty_clinic"
        | "school_based_health_center"
        | "oncology_unit"
        | "hematology_unit"
        | "bone_marrow_transplant_unit"
        | "transplant_unit"
        | "dialysis_unit"
        | "renal_unit"
        | "pulmonary_unit"
        | "infectious_disease_unit"
        | "immunocompromised_unit"
        | "hiv_care_unit"
        | "primary_care_clinic"
        | "specialty_clinic"
        | "urgent_care_center"
        | "ambulatory_care_center"
        | "infusion_center"
        | "dialysis_center"
        | "oncology_clinic"
        | "cardiology_clinic"
        | "neurology_clinic"
        | "gi_clinic"
        | "endocrinology_clinic"
        | "rheumatology_clinic"
        | "pain_management_clinic"
        | "wound_care_clinic"
        | "anticoagulation_clinic"
        | "inpatient_psychiatric_unit"
        | "behavioral_health_unit"
        | "substance_use_treatment_center"
        | "detox_unit"
        | "crisis_stabilization_unit"
        | "partial_hospitalization_program"
        | "intensive_outpatient_program"
        | "outpatient_mental_health_clinic"
        | "forensic_psychiatric_facility"
        | "inpatient_rehabilitation_facility"
        | "acute_rehab_unit"
        | "skilled_nursing_facility"
        | "long_term_acute_care_hospital"
        | "long_term_care_facility"
        | "memory_care_unit"
        | "stroke_rehabilitation_unit"
        | "spinal_cord_injury_rehab"
        | "traumatic_brain_injury_rehab"
        | "home_health"
        | "hospice"
        | "palliative_care_program"
        | "visiting_nurse_service"
        | "community_health_center"
        | "public_health_department"
        | "school_health_office"
        | "occupational_health_clinic"
        | "employer_based_clinic"
        | "mobile_health_unit"
        | "radiology_department"
        | "mri_suite"
        | "ct_suite"
        | "nuclear_medicine"
        | "cardiac_diagnostics"
        | "eeg_lab"
        | "sleep_lab"
        | "pulmonary_function_lab"
        | "vascular_lab"
        | "telehealth_center"
        | "virtual_icu"
        | "remote_patient_monitoring_program"
        | "nurse_advice_line"
        | "triage_call_center"
        | "digital_health_command_center"
        | "case_management_office"
        | "care_coordination_department"
        | "utilization_review"
        | "quality_improvement_department"
        | "patient_safety_office"
        | "risk_management"
        | "infection_prevention"
        | "clinical_education_department"
        | "nursing_administration"
        | "research_office"
        | "informatics_department"
        | "correctional_facility"
        | "military_treatment_facility"
        | "veterans_affairs_facility"
        | "disaster_response_team"
        | "emergency_operations_center"
        | "refugee_health_program"
        | "academic_institution"
        | "simulation_lab"
        | "nursing_school"
        | "medical_device_company"
        | "pharmaceutical_company"
        | "health_technology_company"
        | "insurance_organization"
        | "regulatory_agency"
      shift_type: "day" | "night" | "rotating" | "prn"
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
      account_type: ["personal", "work"],
      app_role: ["admin", "moderator", "support", "user", "super_admin"],
      billing_status: ["active", "past_due", "cancelled", "trialing", "paused"],
      clinical_role: [
        "nursing_student",
        "nurse",
        "advanced_nurse",
        "medical_student",
        "resident",
        "attending",
        "app",
      ],
      clinical_specialty: [
        "medical_surgical",
        "general_internal_medicine",
        "neuro",
        "cardiac",
        "pulmonology",
        "gi",
        "nephrology",
        "endocrinology",
        "rheumatology",
        "id",
        "hematology",
        "oncology",
        "palliative_care",
        "pain_management",
        "geriatrics",
        "icu",
        "cardiothoracic_icu",
        "neuro_icu",
        "surgical_icu",
        "medical_icu",
        "trauma",
        "em",
        "rapid_response",
        "burn_unit",
        "ob",
        "labor_delivery",
        "postpartum",
        "high_risk_ob",
        "reproductive_health",
        "fertility",
        "gyn_oncology",
        "pediatrics",
        "picu",
        "pediatric_em",
        "nicu",
        "newborn_nursery",
        "pediatric_oncology",
        "pediatric_cardiology",
        "perioperative",
        "operating_room",
        "pre_op",
        "pacu",
        "ambulatory_surgery",
        "endoscopy",
        "interventional_radiology",
        "cardiac_cath_lab",
        "psychiatric",
        "substance_use",
        "behavioral_health",
        "crisis_intervention",
        "forensic",
        "public_health",
        "community_health",
        "school_nursing",
        "occupational_health",
        "correctional",
        "home_health",
        "hospice",
        "rehabilitation",
        "stroke_rehab",
        "spinal_cord_injury",
        "brain_injury",
        "physical_medicine",
        "long_term_care",
        "skilled_nursing",
        "dialysis",
        "infusion",
        "wound_ostomy",
        "diabetes_education",
        "lactation",
        "case_management",
        "care_coordination",
        "radiology",
        "nuclear_medicine",
        "cardiac_diagnostics",
        "sleep_medicine",
        "pulmonary_function",
        "nurse_educator",
        "clinical_nurse_specialist",
        "nurse_manager",
        "nurse_executive",
        "quality_improvement",
        "patient_safety",
        "risk_management",
        "research",
        "informatics",
        "general",
        "respiratory",
      ],
      membership_plan: ["free", "pro", "premium", "enterprise"],
      practice_setting: [
        "emergency_department",
        "trauma_center",
        "observation_unit",
        "critical_care_icu",
        "medical_icu",
        "surgical_icu",
        "neuro_icu",
        "cardiac_icu",
        "cardiothoracic_icu",
        "coronary_care_unit",
        "step_down_unit",
        "progressive_care_unit",
        "medical_surgical_unit",
        "telemetry_unit",
        "stroke_unit",
        "burn_unit",
        "isolation_unit",
        "negative_pressure_unit",
        "overflow_surge_unit",
        "operating_room",
        "hybrid_or",
        "preoperative_unit",
        "post_anesthesia_care_unit",
        "same_day_surgery",
        "ambulatory_surgery_center",
        "endoscopy_suite",
        "cardiac_cath_lab",
        "electrophysiology_lab",
        "interventional_radiology",
        "interventional_neurology_suite",
        "pain_procedure_suite",
        "labor_and_delivery",
        "postpartum_mother_baby",
        "high_risk_obstetrics_unit",
        "antepartum_unit",
        "ob_triage",
        "neonatal_icu",
        "newborn_nursery",
        "lactation_services",
        "fertility_clinic",
        "gynecologic_oncology_unit",
        "pediatric_unit",
        "pediatric_icu",
        "pediatric_emergency_department",
        "pediatric_step_down",
        "pediatric_oncology_unit",
        "pediatric_specialty_clinic",
        "school_based_health_center",
        "oncology_unit",
        "hematology_unit",
        "bone_marrow_transplant_unit",
        "transplant_unit",
        "dialysis_unit",
        "renal_unit",
        "pulmonary_unit",
        "infectious_disease_unit",
        "immunocompromised_unit",
        "hiv_care_unit",
        "primary_care_clinic",
        "specialty_clinic",
        "urgent_care_center",
        "ambulatory_care_center",
        "infusion_center",
        "dialysis_center",
        "oncology_clinic",
        "cardiology_clinic",
        "neurology_clinic",
        "gi_clinic",
        "endocrinology_clinic",
        "rheumatology_clinic",
        "pain_management_clinic",
        "wound_care_clinic",
        "anticoagulation_clinic",
        "inpatient_psychiatric_unit",
        "behavioral_health_unit",
        "substance_use_treatment_center",
        "detox_unit",
        "crisis_stabilization_unit",
        "partial_hospitalization_program",
        "intensive_outpatient_program",
        "outpatient_mental_health_clinic",
        "forensic_psychiatric_facility",
        "inpatient_rehabilitation_facility",
        "acute_rehab_unit",
        "skilled_nursing_facility",
        "long_term_acute_care_hospital",
        "long_term_care_facility",
        "memory_care_unit",
        "stroke_rehabilitation_unit",
        "spinal_cord_injury_rehab",
        "traumatic_brain_injury_rehab",
        "home_health",
        "hospice",
        "palliative_care_program",
        "visiting_nurse_service",
        "community_health_center",
        "public_health_department",
        "school_health_office",
        "occupational_health_clinic",
        "employer_based_clinic",
        "mobile_health_unit",
        "radiology_department",
        "mri_suite",
        "ct_suite",
        "nuclear_medicine",
        "cardiac_diagnostics",
        "eeg_lab",
        "sleep_lab",
        "pulmonary_function_lab",
        "vascular_lab",
        "telehealth_center",
        "virtual_icu",
        "remote_patient_monitoring_program",
        "nurse_advice_line",
        "triage_call_center",
        "digital_health_command_center",
        "case_management_office",
        "care_coordination_department",
        "utilization_review",
        "quality_improvement_department",
        "patient_safety_office",
        "risk_management",
        "infection_prevention",
        "clinical_education_department",
        "nursing_administration",
        "research_office",
        "informatics_department",
        "correctional_facility",
        "military_treatment_facility",
        "veterans_affairs_facility",
        "disaster_response_team",
        "emergency_operations_center",
        "refugee_health_program",
        "academic_institution",
        "simulation_lab",
        "nursing_school",
        "medical_device_company",
        "pharmaceutical_company",
        "health_technology_company",
        "insurance_organization",
        "regulatory_agency",
      ],
      shift_type: ["day", "night", "rotating", "prn"],
    },
  },
} as const
