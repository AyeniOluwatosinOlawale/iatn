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
