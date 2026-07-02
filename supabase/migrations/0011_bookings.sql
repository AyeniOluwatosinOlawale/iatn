CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE lesson_type AS ENUM ('one_on_one', 'group', 'trial');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'refunded', 'failed');

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE RESTRICT,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,

  subject TEXT NOT NULL,
  curriculum curriculum_type NOT NULL,
  lesson_type lesson_type DEFAULT 'one_on_one',

  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time)) / 60) STORED,

  status booking_status DEFAULT 'pending',
  notes TEXT,
  meeting_link TEXT,

  -- Payment
  amount_ngn INTEGER NOT NULL,
  platform_fee_ngn INTEGER, -- 10-15% of amount
  tutor_payout_ngn INTEGER,
  payment_status payment_status DEFAULT 'unpaid',
  paystack_reference TEXT,
  paid_at TIMESTAMPTZ,

  -- Post-lesson
  tutor_notes TEXT,
  cancelled_by UUID REFERENCES auth.users(id),
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX bookings_tutor_idx ON bookings(tutor_id);
CREATE INDEX bookings_student_idx ON bookings(student_id);
CREATE INDEX bookings_start_time_idx ON bookings(start_time);
CREATE INDEX bookings_status_idx ON bookings(status);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see own bookings" ON bookings FOR SELECT
  USING (
    tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid())
    OR student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
    OR auth_is_admin()
  );
CREATE POLICY "Students can create bookings" ON bookings FOR INSERT
  WITH CHECK (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));
CREATE POLICY "Booking parties can update" ON bookings FOR UPDATE
  USING (
    tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid())
    OR student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
    OR auth_is_admin()
  );
