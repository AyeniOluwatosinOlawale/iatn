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
