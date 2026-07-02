CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  tutor_response TEXT,
  tutor_responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aggregate rating back to tutor on review insert/update/delete
CREATE OR REPLACE FUNCTION update_tutor_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE tutors SET
    overall_rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE tutor_id = COALESCE(NEW.tutor_id, OLD.tutor_id) AND is_public = TRUE),
    review_count = (SELECT COUNT(*) FROM reviews WHERE tutor_id = COALESCE(NEW.tutor_id, OLD.tutor_id) AND is_public = TRUE)
  WHERE id = COALESCE(NEW.tutor_id, OLD.tutor_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER reviews_update_tutor_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_tutor_rating();

CREATE INDEX reviews_tutor_idx ON reviews(tutor_id);
CREATE INDEX reviews_student_idx ON reviews(student_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reviews are readable" ON reviews FOR SELECT USING (is_public = TRUE OR auth_is_admin());
CREATE POLICY "Students can create own reviews" ON reviews FOR INSERT
  WITH CHECK (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));
CREATE POLICY "Students can update own reviews" ON reviews FOR UPDATE
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));
CREATE POLICY "Tutors can respond" ON reviews FOR UPDATE
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()))
  WITH CHECK (tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));
