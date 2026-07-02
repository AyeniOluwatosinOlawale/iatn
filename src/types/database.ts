export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; role: string; created_at: string; updated_at: string }
        Insert: { id: string; role?: string }
        Update: { role?: string }
      }
      tutors: {
        Row: {
          id: string
          user_id: string
          registration_number: string
          full_name: string
          photo_url: string | null
          email: string
          phone: string | null
          state: string | null
          city: string | null
          current_institution: string | null
          years_experience: number
          teaching_mode: string
          languages: string[]
          bio: string | null
          ai_profile_summary: string | null
          hourly_rate_ngn: number | null
          time_zone: string
          max_class_size: number
          offers_group_classes: boolean
          offers_trial_lesson: boolean
          response_time_hours: number
          tools: string[]
          verification_status: string
          is_verified: boolean
          verified_at: string | null
          overall_rating: number
          review_count: number
          profile_views: number
          total_teaching_hours: number
          subscription_plan: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tutors']['Row'], 'id' | 'registration_number' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tutors']['Insert']>
      }
      tutor_subjects: {
        Row: { id: string; tutor_id: string; subject: string; curriculum: string; proficiency: string; created_at: string }
        Insert: Omit<Database['public']['Tables']['tutor_subjects']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['tutor_subjects']['Insert']>
      }
      tutor_cambridge_metrics: {
        Row: {
          id: string; tutor_id: string; total_students_taught: number; total_exam_sittings: number
          a_star_a_percentage: number | null; average_improvement: number | null; pass_rate: number | null
          outstanding_learner_awards: number; top_achievements: string | null; is_admin_verified: boolean
          created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tutor_cambridge_metrics']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tutor_cambridge_metrics']['Insert']>
      }
      bookings: {
        Row: {
          id: string; tutor_id: string; student_id: string; subject: string; curriculum: string
          lesson_type: string; start_time: string; end_time: string; status: string; notes: string | null
          meeting_link: string | null; amount_ngn: number; platform_fee_ngn: number | null
          tutor_payout_ngn: number | null; payment_status: string; paystack_reference: string | null
          paid_at: string | null; created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      students: {
        Row: {
          id: string; user_id: string; full_name: string; photo_url: string | null; email: string
          phone: string | null; state: string | null; current_school: string | null; year_group: string | null
          target_curricula: string[]; target_subjects: string[]; target_exam_date: string | null
          created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['students']['Insert']>
      }
      schools: {
        Row: {
          id: string; user_id: string; registration_number: string; school_name: string
          logo_url: string | null; cover_image_url: string | null; email: string; phone: string | null
          state: string; city: string | null; address: string | null; school_type: string
          curricula: string[]; founded_year: number | null; student_count: number | null
          about: string | null; is_verified: boolean; overall_rating: number; review_count: number
          subscription_plan: string; created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['schools']['Row'], 'id' | 'registration_number' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['schools']['Insert']>
      }
      reviews: {
        Row: {
          id: string; booking_id: string; tutor_id: string; student_id: string; rating: number
          comment: string | null; is_public: boolean; tutor_response: string | null
          tutor_responded_at: string | null; created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: {
      auth_is_admin: { Args: Record<string, never>; Returns: boolean }
      auth_user_role: { Args: Record<string, never>; Returns: string }
    }
    Enums: {
      user_role: 'tutor' | 'student' | 'parent' | 'school' | 'admin'
      teaching_mode: 'online' | 'physical' | 'both'
      verification_status: 'pending' | 'under_review' | 'verified' | 'rejected'
      curriculum_type: 'igcse' | 'a_level' | 'edexcel' | 'oxfordaqa' | 'sat' | 'act' | 'ib' | 'jamb' | 'neco' | 'jupeb'
    }
  }
}
