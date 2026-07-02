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
