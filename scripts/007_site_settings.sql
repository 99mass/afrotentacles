-- Create site_settings table for global settings like YouTube video
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON public.site_settings;
DROP POLICY IF EXISTS "Site settings can be managed by authenticated users" ON public.site_settings;

-- Policies for site_settings
CREATE POLICY "Site settings are viewable by everyone"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Site settings can be managed by authenticated users"
  ON public.site_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert default YouTube settings
INSERT INTO public.site_settings (key, value)
VALUES ('youtube_video', jsonb_build_object(
  'url', '',
  'is_active', false,
  'articles_count', 3
))
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- Insert default contact settings (newsletter, WhatsApp, email)
INSERT INTO public.site_settings (key, value)
VALUES ('contact_links', jsonb_build_object(
  'newsletter_is_active', false,
  'newsletter_url', '',
  'whatsapp_is_active', false,
  'whatsapp_number', '',
  'email_is_active', false,
  'email_address', ''
))
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- Force schema reload for Supabase clients
NOTIFY pgrst, 'reload schema';
