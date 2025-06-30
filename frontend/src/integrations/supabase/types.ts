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
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          patient_id: string
          provider_id: string
          reason: string | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          provider_id: string
          reason?: string | null
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          provider_id?: string
          reason?: string | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "healthcare_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      health_metrics: {
        Row: {
          created_at: string | null
          id: string
          metric_type: string
          notes: string | null
          patient_id: string
          recorded_at: string | null
          unit: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_type: string
          notes?: string | null
          patient_id: string
          recorded_at?: string | null
          unit: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_type?: string
          notes?: string | null
          patient_id?: string
          recorded_at?: string | null
          unit?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "health_metrics_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      healthcare_providers: {
        Row: {
          bio: string | null
          consultation_fee: number | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          is_available: boolean | null
          last_name: string
          license_number: string | null
          office_address: string | null
          phone: string | null
          rating: number | null
          specialty: string
          updated_at: string | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          is_available?: boolean | null
          last_name: string
          license_number?: string | null
          office_address?: string | null
          phone?: string | null
          rating?: number | null
          specialty: string
          updated_at?: string | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          is_available?: boolean | null
          last_name?: string
          license_number?: string | null
          office_address?: string | null
          phone?: string | null
          rating?: number | null
          specialty?: string
          updated_at?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          content: string | null
          created_at: string | null
          file_url: string | null
          id: string
          is_sensitive: boolean | null
          patient_id: string
          provider_id: string | null
          record_date: string
          record_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          is_sensitive?: boolean | null
          patient_id: string
          provider_id?: string | null
          record_date: string
          record_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          is_sensitive?: boolean | null
          patient_id?: string
          provider_id?: string | null
          record_date?: string
          record_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "healthcare_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string | null
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          instructions: string | null
          is_active: boolean | null
          name: string
          patient_id: string
          pills_remaining: number | null
          pills_total: number | null
          provider_id: string | null
          refill_date: string | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          name: string
          patient_id: string
          pills_remaining?: number | null
          pills_total?: number | null
          provider_id?: string | null
          refill_date?: string | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          name?: string
          patient_id?: string
          pills_remaining?: number | null
          pills_total?: number | null
          provider_id?: string | null
          refill_date?: string | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medications_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "healthcare_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          recipient_id: string | null
          recipient_type: string
          sender_id: string
          subject: string | null
          thread_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string | null
          recipient_type: string
          sender_id: string
          subject?: string | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string | null
          recipient_type?: string
          sender_id?: string
          subject?: string | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string | null
          dosage: string
          id: string
          instructions: string | null
          is_filled: boolean | null
          medication_name: string
          patient_id: string
          pharmacy_name: string | null
          prescribed_date: string
          provider_id: string
          quantity: number
          refills_allowed: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dosage: string
          id?: string
          instructions?: string | null
          is_filled?: boolean | null
          medication_name: string
          patient_id: string
          pharmacy_name?: string | null
          prescribed_date?: string
          provider_id: string
          quantity: number
          refills_allowed?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dosage?: string
          id?: string
          instructions?: string | null
          is_filled?: boolean | null
          medication_name?: string
          patient_id?: string
          pharmacy_name?: string | null
          prescribed_date?: string
          provider_id?: string
          quantity?: number
          refills_allowed?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "healthcare_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allergies: string[] | null
          blood_type: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          gender: string | null
          id: string
          insurance_policy_number: string | null
          insurance_provider: string | null
          last_name: string | null
          medical_conditions: string[] | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          allergies?: string[] | null
          blood_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          gender?: string | null
          id: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_name?: string | null
          medical_conditions?: string[] | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          allergies?: string[] | null
          blood_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_name?: string | null
          medical_conditions?: string[] | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      telemedicine_sessions: {
        Row: {
          appointment_id: string
          created_at: string | null
          id: string
          recording_url: string | null
          session_end_time: string | null
          session_start_time: string | null
          session_type: string
          session_url: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          appointment_id: string
          created_at?: string | null
          id?: string
          recording_url?: string | null
          session_end_time?: string | null
          session_start_time?: string | null
          session_type: string
          session_url?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string
          created_at?: string | null
          id?: string
          recording_url?: string | null
          session_end_time?: string | null
          session_start_time?: string | null
          session_type?: string
          session_url?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "telemedicine_sessions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
