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
