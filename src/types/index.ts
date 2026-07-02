export type UserRole = 'tutor' | 'student' | 'parent' | 'school' | 'admin'
export type TeachingMode = 'online' | 'physical' | 'both'
export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected'
export type CurriculumType = 'igcse' | 'a_level' | 'edexcel' | 'oxfordaqa' | 'sat' | 'act' | 'ib' | 'jamb' | 'neco' | 'jupeb'
export type BadgeType = 'identity_verified' | 'qualification_verified' | 'background_verified' | 'cambridge_expert' | 'top_tutor' | 'verified_tutor'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
export type LessonType = 'one_on_one' | 'group' | 'trial'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'failed'

export interface Tutor {
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
  teaching_mode: TeachingMode
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
  verification_status: VerificationStatus
  is_verified: boolean
  overall_rating: number
  review_count: number
  profile_views: number
  total_teaching_hours: number
  subscription_plan: 'basic' | 'pro' | 'elite'
  created_at: string
  // Joined relations
  subjects?: TutorSubject[]
  qualifications?: TutorQualification[]
  cambridge_metrics?: TutorCambridgeMetrics
  badges?: TutorBadge[]
  portfolio?: TutorPortfolioItem[]
}

export interface TutorSubject {
  id: string
  tutor_id: string
  subject: string
  curriculum: CurriculumType
  proficiency: 'intermediate' | 'advanced' | 'expert'
}

export interface TutorQualification {
  id: string
  tutor_id: string
  qualification_type: string
  institution: string
  field_of_study: string | null
  year_obtained: number | null
  document_url: string | null
  is_verified: boolean
}

export interface TutorCambridgeMetrics {
  id: string
  tutor_id: string
  total_students_taught: number
  total_exam_sittings: number
  a_star_a_percentage: number | null
  average_improvement: number | null
  pass_rate: number | null
  outstanding_learner_awards: number
  top_achievements: string | null
  is_admin_verified: boolean
}

export interface TutorBadge {
  id: string
  tutor_id: string
  badge: BadgeType
  awarded_at: string
}

export interface TutorPortfolioItem {
  id: string
  tutor_id: string
  item_type: 'video' | 'notes' | 'testimonial' | 'recommendation_letter' | 'result_screenshot'
  title: string
  description: string | null
  file_url: string | null
  external_url: string | null
  thumbnail_url: string | null
  is_public: boolean
}

export interface Student {
  id: string
  user_id: string
  full_name: string
  photo_url: string | null
  email: string
  phone: string | null
  state: string | null
  current_school: string | null
  year_group: string | null
  target_curricula: CurriculumType[]
  target_subjects: string[]
  target_exam_date: string | null
}

export interface Booking {
  id: string
  tutor_id: string
  student_id: string
  subject: string
  curriculum: CurriculumType
  lesson_type: LessonType
  start_time: string
  end_time: string
  status: BookingStatus
  notes: string | null
  meeting_link: string | null
  amount_ngn: number
  payment_status: PaymentStatus
  paystack_reference: string | null
  created_at: string
  tutor?: Tutor
  student?: Student
}

export interface Review {
  id: string
  booking_id: string
  tutor_id: string
  student_id: string
  rating: number
  comment: string | null
  is_public: boolean
  tutor_response: string | null
  created_at: string
  student?: Student
}

export interface School {
  id: string
  user_id: string
  registration_number: string
  school_name: string
  logo_url: string | null
  cover_image_url: string | null
  email: string
  state: string
  city: string | null
  address: string | null
  school_type: string
  curricula: CurriculumType[]
  founded_year: number | null
  student_count: number | null
  about: string | null
  is_verified: boolean
  overall_rating: number
  review_count: number
  subscription_plan: string
}

export interface TutorSearchFilters {
  subject?: string
  curriculum?: CurriculumType
  state?: string
  minRate?: number
  maxRate?: number
  minRating?: number
  teachingMode?: TeachingMode
  verifiedOnly?: boolean
  trialAvailable?: boolean
  sortBy?: 'rating' | 'rate_asc' | 'rate_desc' | 'reviews' | 'newest'
}

// Tutor registration form state (7 steps)
export interface TutorRegistrationForm {
  // Step 1: Account
  email: string
  password: string
  confirmPassword: string

  // Step 2: Personal
  full_name: string
  photo_url?: string
  phone: string
  state: string
  city: string

  // Step 3: Professional
  current_institution: string
  years_experience: number
  teaching_mode: TeachingMode
  languages: string[]
  bio: string

  // Step 4: Subjects & Curricula
  subjects: Array<{ subject: string; curriculum: CurriculumType; proficiency: 'intermediate' | 'advanced' | 'expert' }>

  // Step 5: Qualifications
  qualifications: Array<{
    qualification_type: string
    institution: string
    field_of_study: string
    year_obtained: number
    document_file?: File
  }>

  // Step 6: Cambridge Metrics
  total_students_taught: number
  total_exam_sittings: number
  a_star_a_percentage?: number
  pass_rate?: number
  top_achievements?: string

  // Step 7: Rates & Schedule
  hourly_rate_ngn: number
  max_class_size: number
  offers_group_classes: boolean
  offers_trial_lesson: boolean
  tools: string[]
  availability: Array<{ day_of_week: number; start_time: string; end_time: string }>
}
