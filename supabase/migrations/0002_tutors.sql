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
