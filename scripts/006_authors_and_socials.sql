-- Create authors table
CREATE TABLE IF NOT EXISTS public.authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create social_links table
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Policies for authors
CREATE POLICY "Authors are viewable by everyone"
  ON public.authors FOR SELECT
  USING (true);

CREATE POLICY "Authors can be inserted by authenticated users"
  ON public.authors FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can be updated by authenticated users"
  ON public.authors FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authors can be deleted by authenticated users"
  ON public.authors FOR DELETE
  USING (auth.role() = 'authenticated');

-- Policies for social_links
CREATE POLICY "Social links are viewable by everyone"
  ON public.social_links FOR SELECT
  USING (true);

CREATE POLICY "Social links can be inserted by authenticated users"
  ON public.social_links FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Social links can be updated by authenticated users"
  ON public.social_links FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Social links can be deleted by authenticated users"
  ON public.social_links FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert default social links
INSERT INTO public.social_links (platform, url, icon_name, order_index)
VALUES 
  ('Twitter', 'https://twitter.com', 'Twitter', 1),
  ('LinkedIn', 'https://linkedin.com', 'Linkedin', 2),
  ('Facebook', 'https://facebook.com', 'Facebook', 3),
  ('Telegram', 'https://telegram.org', 'Send', 4);

-- Insert default author
INSERT INTO public.authors (name, bio)
VALUES ('Mouhamed ndiongue', 'Auteur principal');

-- Force schema reload for Supabase clients
NOTIFY pgrst, 'reload schema';
