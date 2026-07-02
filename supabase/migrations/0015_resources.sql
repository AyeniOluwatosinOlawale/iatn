CREATE TYPE resource_type AS ENUM ('notes', 'past_paper_solution', 'mini_course', 'video', 'worksheet', 'revision_guide');

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type resource_type NOT NULL,
  subject TEXT NOT NULL,
  curriculum curriculum_type NOT NULL,
  year_level TEXT, -- IGCSE, AS, A2
  file_url TEXT,
  preview_url TEXT,
  thumbnail_url TEXT,
  price_ngn INTEGER NOT NULL DEFAULT 0, -- 0 = free
  is_free BOOLEAN GENERATED ALWAYS AS (price_ngn = 0) STORED,
  download_count INTEGER DEFAULT 0,
  overall_rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE resource_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id),
  buyer_id UUID NOT NULL REFERENCES auth.users(id),
  payment_id UUID REFERENCES payments(id),
  amount_ngn INTEGER NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_id, buyer_id)
);

CREATE INDEX resources_subject_idx ON resources(subject);
CREATE INDEX resources_curriculum_idx ON resources(curriculum);
CREATE INDEX resources_seller_idx ON resources(seller_id);
CREATE INDEX resources_published_idx ON resources(is_published);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published resources are public" ON resources FOR SELECT USING (is_published = TRUE OR seller_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));
CREATE POLICY "Tutors manage own resources" ON resources FOR ALL USING (seller_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));

ALTER TABLE resource_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers see own purchases" ON resource_purchases FOR SELECT USING (buyer_id = auth.uid());
