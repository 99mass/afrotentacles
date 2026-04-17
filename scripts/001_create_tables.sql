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
  ip_hash TEXT,
  user_agent TEXT
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Articles policies (public read, admin write)
CREATE POLICY "Anyone can read published articles" ON articles
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can do everything on articles" ON articles
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admins)
  );

-- Article media policies
CREATE POLICY "Anyone can read article media" ON article_media
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage article media" ON article_media
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admins)
  );

-- Article views policies (anyone can insert, admins can read)
CREATE POLICY "Anyone can insert views" ON article_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read views" ON article_views
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admins)
  );

-- Admins policies
CREATE POLICY "Admins can read admins table" ON admins
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admins)
  );

-- Create view for article stats
CREATE OR REPLACE VIEW article_stats AS
SELECT 
  a.id,
  a.title,
  a.slug,
  a.category,
  a.is_published,
  a.created_at,
  COUNT(DISTINCT v.id) as view_count,
  COUNT(DISTINCT CASE WHEN v.viewed_at > NOW() - INTERVAL '24 hours' THEN v.id END) as views_today,
  COUNT(DISTINCT CASE WHEN v.viewed_at > NOW() - INTERVAL '7 days' THEN v.id END) as views_week
FROM articles a
LEFT JOIN article_views v ON a.id = v.article_id
GROUP BY a.id;
