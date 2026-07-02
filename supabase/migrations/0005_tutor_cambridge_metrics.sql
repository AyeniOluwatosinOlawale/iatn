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
