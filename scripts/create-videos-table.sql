-- =============================================
-- Table: videos
-- Stocke les métadonnées des vidéos uploadées
-- =============================================

CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  file_type TEXT NOT NULL DEFAULT 'video/mp4',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour les vidéos actives (utilisé côté public)
CREATE INDEX IF NOT EXISTS idx_videos_active ON videos(is_active) WHERE is_active = true;

-- Index pour le tri par date
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

-- Activer RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique (pour afficher les vidéos actives sur le site)
CREATE POLICY "Allow public read active videos" ON videos
  FOR SELECT
  USING (is_active = true);

-- Politique d'accès complet pour les utilisateurs authentifiés (admin)
CREATE POLICY "Allow authenticated full access" ON videos
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Politique pour le service role (API route upload)
CREATE POLICY "Allow service role full access" ON videos
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
