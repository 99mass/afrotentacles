-- Storage policies for media bucket
-- Make sure the 'media' bucket is created as a "Public bucket" in the Supabase Dashboard before running this.

-- Insert policy (Admins only)
CREATE POLICY "Admins can upload media" ON storage.objects
  FOR INSERT TO public WITH CHECK (
    bucket_id = 'media' AND 
    auth.uid() IN (SELECT id FROM admins)
  );

-- Update policy (Admins only)
CREATE POLICY "Admins can update media" ON storage.objects
  FOR UPDATE TO public USING (
    bucket_id = 'media' AND 
    auth.uid() IN (SELECT id FROM admins)
  );

-- Delete policy (Admins only)
CREATE POLICY "Admins can delete media" ON storage.objects
  FOR DELETE TO public USING (
    bucket_id = 'media' AND 
    auth.uid() IN (SELECT id FROM admins)
  );

-- Select policy (Public)
CREATE POLICY "Anyone can read media" ON storage.objects
  FOR SELECT TO public USING (
    bucket_id = 'media'
  );
