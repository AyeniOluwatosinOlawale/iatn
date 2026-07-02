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
