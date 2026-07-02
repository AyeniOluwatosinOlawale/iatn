-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User role enum
CREATE TYPE user_role AS ENUM ('tutor', 'student', 'parent', 'school', 'admin');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Helper: get current user role
CREATE OR REPLACE FUNCTION auth_user_role()
RETURNS user_role LANGUAGE sql STABLE AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- Helper: is admin
CREATE OR REPLACE FUNCTION auth_is_admin()
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$;

-- RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (id = auth.uid() OR auth_is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
-- Teaching mode enum
CREATE TYPE teaching_mode AS ENUM ('online', 'physical', 'both');

-- Verification status enum
CREATE TYPE verification_status AS ENUM ('pending', 'under_review', 'verified', 'rejected');

-- Sequence for IATN registration numbers
CREATE SEQUENCE tutor_reg_seq START 1 INCREMENT 1;

-- Core tutors table
CREATE TABLE tutors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_number TEXT UNIQUE,

  -- Identity
  full_name TEXT NOT NULL,
  photo_url TEXT,
  email TEXT NOT NULL,
  phone TEXT,

  -- Location
  state TEXT,
  city TEXT,
  current_institution TEXT,

  -- Professional
  years_experience INTEGER DEFAULT 0,
  teaching_mode teaching_mode DEFAULT 'both',
  languages TEXT[] DEFAULT ARRAY['English'],
  bio TEXT,
  ai_profile_summary TEXT,

  -- Teaching specifics
  hourly_rate_ngn INTEGER,
  time_zone TEXT DEFAULT 'Africa/Lagos',
  max_class_size INTEGER DEFAULT 1,
  offers_group_classes BOOLEAN DEFAULT FALSE,
  offers_trial_lesson BOOLEAN DEFAULT TRUE,
  response_time_hours INTEGER DEFAULT 24,

  -- Tools & tech
  tools TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Verification
  verification_status verification_status DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,

  -- Analytics
  profile_views INTEGER DEFAULT 0,
  total_teaching_hours INTEGER DEFAULT 0,
  student_retention_rate DECIMAL(5,2),
  overall_rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,

  -- Subscription
  subscription_plan TEXT DEFAULT 'basic', -- basic | pro | elite
  subscription_expires_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate IATN registration number
CREATE OR REPLACE FUNCTION generate_tutor_registration_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  seq_val INTEGER;
BEGIN
  seq_val := nextval('tutor_reg_seq');
  NEW.registration_number := 'IATN-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq_val::TEXT, 6, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_tutor_registration_number
  BEFORE INSERT ON tutors
  FOR EACH ROW EXECUTE FUNCTION generate_tutor_registration_number();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER tutors_updated_at
  BEFORE UPDATE ON tutors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes
CREATE INDEX tutors_state_idx ON tutors(state);
CREATE INDEX tutors_verified_idx ON tutors(is_verified);
CREATE INDEX tutors_rating_idx ON tutors(overall_rating DESC);
CREATE INDEX tutors_rate_idx ON tutors(hourly_rate_ngn);
CREATE INDEX tutors_user_id_idx ON tutors(user_id);

-- RLS
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tutors are publicly readable" ON tutors FOR SELECT USING (TRUE);
CREATE POLICY "Tutors can update own record" ON tutors FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Tutors can insert own record" ON tutors FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can do anything on tutors" ON tutors USING (auth_is_admin()) WITH CHECK (auth_is_admin());
CREATE TYPE curriculum_type AS ENUM (
  'igcse', 'a_level', 'edexcel', 'oxfordaqa', 'sat', 'act', 'ib', 'jamb', 'neco', 'jupeb'
);

CREATE TYPE proficiency_level AS ENUM ('intermediate', 'advanced', 'expert');

CREATE TABLE tutor_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  curriculum curriculum_type NOT NULL,
  proficiency proficiency_level DEFAULT 'advanced',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tutor_id, subject, curriculum)
);

CREATE INDEX tutor_subjects_tutor_idx ON tutor_subjects(tutor_id);
CREATE INDEX tutor_subjects_subject_idx ON tutor_subjects(subject);
CREATE INDEX tutor_subjects_curriculum_idx ON tutor_subjects(curriculum);

ALTER TABLE tutor_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tutor subjects are public" ON tutor_subjects FOR SELECT USING (TRUE);
CREATE POLICY "Tutors manage own subjects" ON tutor_subjects FOR ALL USING (
  tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid())
);
CREATE TABLE tutor_qualifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  qualification_type TEXT NOT NULL, -- bachelors | masters | phd | pgde | qts | trcn | other
  institution TEXT NOT NULL,
  field_of_study TEXT,
  year_obtained INTEGER,
  document_url TEXT, -- Supabase Storage signed URL
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX tutor_qualifications_tutor_idx ON tutor_qualifications(tutor_id);

ALTER TABLE tutor_qualifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Qualifications visible to owner and admin" ON tutor_qualifications FOR SELECT
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()) OR auth_is_admin());
CREATE POLICY "Tutors manage own qualifications" ON tutor_qualifications FOR ALL
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));
CREATE TABLE tutor_cambridge_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL UNIQUE REFERENCES tutors(id) ON DELETE CASCADE,
  total_students_taught INTEGER DEFAULT 0,
  total_exam_sittings INTEGER DEFAULT 0,
  a_star_a_percentage DECIMAL(5,2),
  average_improvement DECIMAL(5,2), -- grade points improvement
  pass_rate DECIMAL(5,2),
  outstanding_learner_awards INTEGER DEFAULT 0,
  top_achievements TEXT,
  is_admin_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER cambridge_metrics_updated_at
  BEFORE UPDATE ON tutor_cambridge_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE tutor_cambridge_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cambridge metrics are public" ON tutor_cambridge_metrics FOR SELECT USING (TRUE);
CREATE POLICY "Tutors manage own metrics" ON tutor_cambridge_metrics FOR ALL
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));
CREATE TYPE portfolio_item_type AS ENUM ('video', 'notes', 'testimonial', 'recommendation_letter', 'result_screenshot');

CREATE TABLE tutor_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  item_type portfolio_item_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  external_url TEXT,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX tutor_portfolio_tutor_idx ON tutor_portfolio(tutor_id);

ALTER TABLE tutor_portfolio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public portfolio items are readable" ON tutor_portfolio FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Tutors manage own portfolio" ON tutor_portfolio FOR ALL
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));
CREATE TYPE badge_type AS ENUM (
  'identity_verified',
  'qualification_verified',
  'background_verified',
  'cambridge_expert',
  'top_tutor',
  'verified_tutor'
);

CREATE TABLE tutor_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  badge badge_type NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  awarded_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ,
  UNIQUE(tutor_id, badge)
);

CREATE INDEX tutor_badges_tutor_idx ON tutor_badges(tutor_id);

ALTER TABLE tutor_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are publicly readable" ON tutor_badges FOR SELECT USING (TRUE);
CREATE POLICY "Only admins can manage badges" ON tutor_badges FOR ALL USING (auth_is_admin());
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  photo_url TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  state TEXT,
  city TEXT,
  current_school TEXT,
  year_group TEXT, -- Year 10, Year 11, Lower Sixth, etc.
  target_curricula curriculum_type[],
  target_subjects TEXT[],
  target_exam_date DATE,
  parent_id UUID, -- linked parent account
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can read own record" ON students FOR SELECT USING (user_id = auth.uid() OR auth_is_admin());
CREATE POLICY "Students can update own record" ON students FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Students can insert own record" ON students FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE SEQUENCE school_reg_seq START 1 INCREMENT 1;

CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_number TEXT UNIQUE,

  -- Identity
  school_name TEXT NOT NULL,
  logo_url TEXT,
  cover_image_url TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,

  -- Location
  state TEXT NOT NULL,
  city TEXT,
  address TEXT,

  -- Profile
  school_type TEXT DEFAULT 'private', -- private | government | international
  curricula curriculum_type[] DEFAULT ARRAY[]::curriculum_type[],
  founded_year INTEGER,
  student_count INTEGER,
  fee_range_ngn_min INTEGER,
  fee_range_ngn_max INTEGER,
  about TEXT,

  -- Metrics
  a_star_a_rate DECIMAL(5,2),
  university_placement_rate DECIMAL(5,2),
  inspection_rating TEXT,

  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verification_status verification_status DEFAULT 'pending',

  -- Subscription
  subscription_plan TEXT DEFAULT 'standard', -- standard | premium
  subscription_expires_at TIMESTAMPTZ,

  overall_rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto registration number
CREATE OR REPLACE FUNCTION generate_school_registration_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE seq_val INTEGER;
BEGIN
  seq_val := nextval('school_reg_seq');
  NEW.registration_number := 'IATN-SCH-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq_val::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_school_registration_number
  BEFORE INSERT ON schools
  FOR EACH ROW EXECUTE FUNCTION generate_school_registration_number();

CREATE TRIGGER schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX schools_state_idx ON schools(state);
CREATE INDEX schools_verified_idx ON schools(is_verified);

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Schools are publicly readable" ON schools FOR SELECT USING (TRUE);
CREATE POLICY "Schools can update own record" ON schools FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Schools can insert own record" ON schools FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage schools" ON schools USING (auth_is_admin()) WITH CHECK (auth_is_admin());
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  logo_url TEXT,
  cover_url TEXT,
  website TEXT,
  about TEXT,

  -- Entry requirements
  accepts_a_level BOOLEAN DEFAULT TRUE,
  accepts_igcse BOOLEAN DEFAULT TRUE,
  accepts_ib BOOLEAN DEFAULT FALSE,
  accepts_sat BOOLEAN DEFAULT FALSE,
  accepts_foundation BOOLEAN DEFAULT FALSE,

  min_a_level_grades TEXT, -- e.g. "ABB"
  min_ib_points INTEGER,
  min_sat_score INTEGER,

  -- Fees
  annual_fee_usd INTEGER,
  annual_fee_ngn INTEGER,

  -- Metadata
  popular_courses TEXT[],
  scholarships_available BOOLEAN DEFAULT FALSE,
  scholarship_details TEXT,
  application_deadline DATE,
  acceptance_rate DECIMAL(5,2),

  is_featured BOOLEAN DEFAULT FALSE,
  is_sponsored BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX universities_country_idx ON universities(country);
CREATE INDEX universities_featured_idx ON universities(is_featured);

ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Universities are publicly readable" ON universities FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage universities" ON universities FOR ALL USING (auth_is_admin());
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE lesson_type AS ENUM ('one_on_one', 'group', 'trial');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'refunded', 'failed');

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE RESTRICT,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,

  subject TEXT NOT NULL,
  curriculum curriculum_type NOT NULL,
  lesson_type lesson_type DEFAULT 'one_on_one',

  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time)) / 60) STORED,

  status booking_status DEFAULT 'pending',
  notes TEXT,
  meeting_link TEXT,

  -- Payment
  amount_ngn INTEGER NOT NULL,
  platform_fee_ngn INTEGER, -- 10-15% of amount
  tutor_payout_ngn INTEGER,
  payment_status payment_status DEFAULT 'unpaid',
  paystack_reference TEXT,
  paid_at TIMESTAMPTZ,

  -- Post-lesson
  tutor_notes TEXT,
  cancelled_by UUID REFERENCES auth.users(id),
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX bookings_tutor_idx ON bookings(tutor_id);
CREATE INDEX bookings_student_idx ON bookings(student_id);
CREATE INDEX bookings_start_time_idx ON bookings(start_time);
CREATE INDEX bookings_status_idx ON bookings(status);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see own bookings" ON bookings FOR SELECT
  USING (
    tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid())
    OR student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
    OR auth_is_admin()
  );
CREATE POLICY "Students can create bookings" ON bookings FOR INSERT
  WITH CHECK (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));
CREATE POLICY "Booking parties can update" ON bookings FOR UPDATE
  USING (
    tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid())
    OR student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
    OR auth_is_admin()
  );
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  tutor_response TEXT,
  tutor_responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aggregate rating back to tutor on review insert/update/delete
CREATE OR REPLACE FUNCTION update_tutor_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE tutors SET
    overall_rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE tutor_id = COALESCE(NEW.tutor_id, OLD.tutor_id) AND is_public = TRUE),
    review_count = (SELECT COUNT(*) FROM reviews WHERE tutor_id = COALESCE(NEW.tutor_id, OLD.tutor_id) AND is_public = TRUE)
  WHERE id = COALESCE(NEW.tutor_id, OLD.tutor_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER reviews_update_tutor_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_tutor_rating();

CREATE INDEX reviews_tutor_idx ON reviews(tutor_id);
CREATE INDEX reviews_student_idx ON reviews(student_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reviews are readable" ON reviews FOR SELECT USING (is_public = TRUE OR auth_is_admin());
CREATE POLICY "Students can create own reviews" ON reviews FOR INSERT
  WITH CHECK (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));
CREATE POLICY "Students can update own reviews" ON reviews FOR UPDATE
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));
CREATE POLICY "Tutors can respond" ON reviews FOR UPDATE
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()))
  WITH CHECK (tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_a UUID NOT NULL REFERENCES auth.users(id),
  participant_b UUID NOT NULL REFERENCES auth.users(id),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_a, participant_b)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  body TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE conversations SET last_message_at = NOW() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER messages_update_conversation
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

CREATE INDEX messages_conversation_idx ON messages(conversation_id);
CREATE INDEX messages_sender_idx ON messages(sender_id);
CREATE INDEX conversations_participant_a_idx ON conversations(participant_a);
CREATE INDEX conversations_participant_b_idx ON conversations(participant_b);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversation participants can read" ON conversations FOR SELECT
  USING (participant_a = auth.uid() OR participant_b = auth.uid());
CREATE POLICY "Users can start conversations" ON conversations FOR INSERT
  WITH CHECK (participant_a = auth.uid() OR participant_b = auth.uid());

CREATE POLICY "Message participants can read" ON messages FOR SELECT
  USING (conversation_id IN (
    SELECT id FROM conversations WHERE participant_a = auth.uid() OR participant_b = auth.uid()
  ));
CREATE POLICY "Sender can insert messages" ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());
CREATE TYPE payment_type AS ENUM ('booking', 'subscription', 'resource_purchase', 'background_check');

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  payment_type payment_type NOT NULL,
  reference_id UUID, -- booking_id, subscription, resource_id, etc.
  paystack_reference TEXT UNIQUE,
  paystack_access_code TEXT,
  amount_ngn INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending | success | failed | refunded
  channel TEXT, -- card | bank | ussd | mobile_money
  currency TEXT DEFAULT 'NGN',
  paid_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX payments_user_idx ON payments(user_id);
CREATE INDEX payments_reference_idx ON payments(paystack_reference);
CREATE INDEX payments_status_idx ON payments(status);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own payments" ON payments FOR SELECT USING (user_id = auth.uid() OR auth_is_admin());
CREATE POLICY "System inserts payments" ON payments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE TYPE resource_type AS ENUM ('notes', 'past_paper_solution', 'mini_course', 'video', 'worksheet', 'revision_guide');

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type resource_type NOT NULL,
  subject TEXT NOT NULL,
  curriculum curriculum_type NOT NULL,
  year_level TEXT, -- IGCSE, AS, A2
  file_url TEXT,
  preview_url TEXT,
  thumbnail_url TEXT,
  price_ngn INTEGER NOT NULL DEFAULT 0, -- 0 = free
  is_free BOOLEAN GENERATED ALWAYS AS (price_ngn = 0) STORED,
  download_count INTEGER DEFAULT 0,
  overall_rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE resource_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id),
  buyer_id UUID NOT NULL REFERENCES auth.users(id),
  payment_id UUID REFERENCES payments(id),
  amount_ngn INTEGER NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_id, buyer_id)
);

CREATE INDEX resources_subject_idx ON resources(subject);
CREATE INDEX resources_curriculum_idx ON resources(curriculum);
CREATE INDEX resources_seller_idx ON resources(seller_id);
CREATE INDEX resources_published_idx ON resources(is_published);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published resources are public" ON resources FOR SELECT USING (is_published = TRUE OR seller_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));
CREATE POLICY "Tutors manage own resources" ON resources FOR ALL USING (seller_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));

ALTER TABLE resource_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers see own purchases" ON resource_purchases FOR SELECT USING (buyer_id = auth.uid());
CREATE TABLE mock_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  curriculum curriculum_type NOT NULL,
  year_level TEXT,
  paper_year INTEGER,
  paper_number TEXT, -- P1, P2, P3, etc.
  duration_minutes INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  instructions TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mock_exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES mock_exams(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_image_url TEXT,
  marks INTEGER NOT NULL DEFAULT 1,
  mark_scheme TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mock_exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES mock_exams(id),
  student_id UUID NOT NULL REFERENCES students(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  score INTEGER,
  percentage DECIMAL(5,2),
  time_taken_minutes INTEGER,
  answers JSONB, -- { question_id: answer_text }
  feedback JSONB, -- AI-generated feedback per question
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX mock_exam_attempts_student_idx ON mock_exam_attempts(student_id);
CREATE INDEX mock_exam_attempts_exam_idx ON mock_exam_attempts(exam_id);

ALTER TABLE mock_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_exam_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published exams are public" ON mock_exams FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Questions of published exams are public" ON mock_exam_questions FOR SELECT USING (
  exam_id IN (SELECT id FROM mock_exams WHERE is_published = TRUE)
);
CREATE POLICY "Students see own attempts" ON mock_exam_attempts FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()) OR auth_is_admin());
CREATE POLICY "Students create own attempts" ON mock_exam_attempts FOR INSERT
  WITH CHECK (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));
CREATE POLICY "Students update own attempts" ON mock_exam_attempts FOR UPDATE
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));
CREATE TYPE post_category AS ENUM ('student', 'parent', 'teacher', 'school', 'general');

CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category post_category NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  subject TEXT,
  curriculum curriculum_type,
  tags TEXT[],
  upvotes INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE community_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  parent_reply_id UUID REFERENCES community_replies(id), -- for nested replies
  upvotes INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update reply count on community_posts
CREATE OR REPLACE FUNCTION update_post_reply_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE community_posts SET reply_count = (
    SELECT COUNT(*) FROM community_replies WHERE post_id = COALESCE(NEW.post_id, OLD.post_id) AND is_published = TRUE
  ) WHERE id = COALESCE(NEW.post_id, OLD.post_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER community_replies_update_count
  AFTER INSERT OR DELETE ON community_replies
  FOR EACH ROW EXECUTE FUNCTION update_post_reply_count();

CREATE INDEX community_posts_category_idx ON community_posts(category);
CREATE INDEX community_posts_author_idx ON community_posts(author_id);
CREATE INDEX community_replies_post_idx ON community_replies(post_id);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are public" ON community_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Auth users can post" ON community_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update own posts" ON community_posts FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Published replies are public" ON community_replies FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Auth users can reply" ON community_replies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update own replies" ON community_replies FOR UPDATE USING (author_id = auth.uid());
-- Additional cross-table RLS policies and admin overrides

-- Parents table
CREATE TABLE parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can read own record" ON parents FOR SELECT USING (user_id = auth.uid() OR auth_is_admin());
CREATE POLICY "Parents can manage own record" ON parents FOR ALL USING (user_id = auth.uid());

-- Parent-child links
CREATE TABLE parent_children (
  parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'parent', -- parent | guardian
  PRIMARY KEY (parent_id, student_id)
);

ALTER TABLE parent_children ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can see own children links" ON parent_children FOR SELECT
  USING (parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid()));
CREATE POLICY "Parents manage own children links" ON parent_children FOR ALL
  USING (parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid()));

-- Admin audit log
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can read audit log" ON admin_audit_log FOR SELECT USING (auth_is_admin());
CREATE POLICY "Only admins can write audit log" ON admin_audit_log FOR INSERT WITH CHECK (auth_is_admin());

-- Tutor availability slots
CREATE TABLE tutor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun 6=Sat
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT TRUE,
  UNIQUE(tutor_id, day_of_week, start_time)
);

ALTER TABLE tutor_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Availability is public" ON tutor_availability FOR SELECT USING (TRUE);
CREATE POLICY "Tutors manage own availability" ON tutor_availability FOR ALL
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));

-- Waitlist / interest capture
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role user_role DEFAULT 'tutor',
  state TEXT,
  subjects TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join waitlist" ON waitlist FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can read waitlist" ON waitlist FOR SELECT USING (auth_is_admin());
