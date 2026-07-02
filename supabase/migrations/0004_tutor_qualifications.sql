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
