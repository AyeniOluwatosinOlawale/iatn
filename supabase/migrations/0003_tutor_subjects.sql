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
