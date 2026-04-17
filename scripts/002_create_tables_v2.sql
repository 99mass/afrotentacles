-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  category TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  author TEXT DEFAULT 'AfroTentacles',
  view_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create article_media table for multiple images, videos, PDFs
CREATE TABLE IF NOT EXISTS article_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'pdf')),
  url TEXT NOT NULL,
  caption TEXT,
  position INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create article_views table to track views
CREATE TABLE IF NOT EXISTS article_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_hash TEXT
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;

-- Articles policies (public read, authenticated admin write)
DROP POLICY IF EXISTS "Anyone can read published articles" ON articles;
CREATE POLICY "Anyone can read published articles" ON articles
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated users can manage articles" ON articles;
CREATE POLICY "Authenticated users can manage articles" ON articles
  FOR ALL USING (auth.role() = 'authenticated');

-- Article media policies
DROP POLICY IF EXISTS "Anyone can read article media" ON article_media;
CREATE POLICY "Anyone can read article media" ON article_media
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage article media" ON article_media;
CREATE POLICY "Authenticated users can manage article media" ON article_media
  FOR ALL USING (auth.role() = 'authenticated');

-- Article views policies (anyone can insert)
DROP POLICY IF EXISTS "Anyone can insert views" ON article_views;
CREATE POLICY "Anyone can insert views" ON article_views
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read views" ON article_views;
CREATE POLICY "Anyone can read views" ON article_views
  FOR SELECT USING (true);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(article_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE articles SET view_count = view_count + 1 WHERE slug = article_slug;
  INSERT INTO article_views (article_id) 
  SELECT id FROM articles WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
