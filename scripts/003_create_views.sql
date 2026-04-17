-- Create article_views table for tracking views
CREATE TABLE IF NOT EXISTS article_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  visitor_id TEXT
);

-- Enable RLS
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert views
CREATE POLICY "Anyone can insert views" ON article_views
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read views (for counting)
CREATE POLICY "Anyone can read views" ON article_views
  FOR SELECT USING (true);
