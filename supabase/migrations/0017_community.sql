CREATE TYPE post_category AS ENUM ('student', 'parent', 'teacher', 'school', 'general');

CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category post_category NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  subject TEXT,
  curriculum curriculum_type,
  tags TEXT[],
  upvotes INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE community_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  parent_reply_id UUID REFERENCES community_replies(id), -- for nested replies
  upvotes INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update reply count on community_posts
CREATE OR REPLACE FUNCTION update_post_reply_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE community_posts SET reply_count = (
    SELECT COUNT(*) FROM community_replies WHERE post_id = COALESCE(NEW.post_id, OLD.post_id) AND is_published = TRUE
  ) WHERE id = COALESCE(NEW.post_id, OLD.post_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER community_replies_update_count
  AFTER INSERT OR DELETE ON community_replies
  FOR EACH ROW EXECUTE FUNCTION update_post_reply_count();

CREATE INDEX community_posts_category_idx ON community_posts(category);
CREATE INDEX community_posts_author_idx ON community_posts(author_id);
CREATE INDEX community_replies_post_idx ON community_replies(post_id);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are public" ON community_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Auth users can post" ON community_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update own posts" ON community_posts FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Published replies are public" ON community_replies FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Auth users can reply" ON community_replies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update own replies" ON community_replies FOR UPDATE USING (author_id = auth.uid());
