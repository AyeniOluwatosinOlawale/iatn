CREATE TYPE portfolio_item_type AS ENUM ('video', 'notes', 'testimonial', 'recommendation_letter', 'result_screenshot');

CREATE TABLE tutor_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  item_type portfolio_item_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  external_url TEXT,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX tutor_portfolio_tutor_idx ON tutor_portfolio(tutor_id);

ALTER TABLE tutor_portfolio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public portfolio items are readable" ON tutor_portfolio FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Tutors manage own portfolio" ON tutor_portfolio FOR ALL
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));
