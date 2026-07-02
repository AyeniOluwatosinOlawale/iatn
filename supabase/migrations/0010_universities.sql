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
