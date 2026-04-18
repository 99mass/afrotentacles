-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS article_views CASCADE;
DROP TABLE IF EXISTS article_media CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  category_slug TEXT NOT NULL,
  author TEXT DEFAULT 'AfroTentacles',
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  view_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create article_media table for multiple images, videos, PDFs
CREATE TABLE article_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'pdf')),
  url TEXT NOT NULL,
  caption TEXT,
  thumbnail TEXT,
  position INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create article_views table to track views
CREATE TABLE article_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_hash TEXT
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read)
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');

-- Articles policies
CREATE POLICY "Anyone can read published articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can read all articles" ON articles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert articles" ON articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update articles" ON articles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete articles" ON articles FOR DELETE USING (auth.role() = 'authenticated');

-- Article media policies
CREATE POLICY "Anyone can read article media" ON article_media FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage article media" ON article_media FOR ALL USING (auth.role() = 'authenticated');

-- Article views policies
CREATE POLICY "Anyone can insert views" ON article_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read views" ON article_views FOR SELECT USING (true);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Géoéconomie', 'geoeconomie', 'Analyses économiques et stratégies continentales'),
  ('Géopolitique', 'geopolitique', 'Relations internationales et dynamiques de pouvoir'),
  ('Ressources & Énergie', 'ressources-energie', 'Mines, pétrole, gaz et énergies renouvelables'),
  ('Flux & Corridors', 'flux-corridors', 'Commerce, transport et infrastructures'),
  ('Institutions & Politiques publiques', 'institutions-politiques', 'Gouvernance et réformes institutionnelles'),
  ('Influences & Puissances', 'influences-puissances', 'Acteurs géopolitiques et réseaux d''influence'),
  ('Données & Insights', 'donnees-insights', 'Analyses de données et prospective');

-- Insert sample articles
INSERT INTO articles (title, slug, excerpt, content, image, category_slug, author, status, view_count) VALUES
(
  'La nouvelle stratégie économique de l''Union Africaine face aux défis mondiaux',
  'strategie-economique-union-africaine',
  'L''UA dévoile son plan ambitieux pour repositionner l''Afrique dans l''économie mondiale, avec un accent sur l''intégration régionale et la transformation industrielle.',
  '<p>L''Union Africaine a présenté sa nouvelle feuille de route économique pour la décennie 2025-2035, marquant un tournant stratégique dans l''approche du développement continental.</p><h2>Une vision renouvelée de l''intégration économique</h2><p>Le document, élaboré après deux années de consultations avec les États membres et les partenaires économiques, met l''accent sur trois piliers fondamentaux : l''industrialisation accélérée, la souveraineté alimentaire et la transition énergétique.</p>',
  'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=800&fit=crop',
  'geoeconomie',
  'Amadou Diallo',
  'published',
  1250
),
(
  'Tensions au Sahel : les nouvelles alliances redessinent la carte géopolitique',
  'tensions-sahel-alliances-geopolitique',
  'Le retrait progressif des forces occidentales et l''émergence de nouveaux partenaires transforment profondément l''équilibre des puissances dans la région sahélienne.',
  '<p>La région du Sahel connaît une reconfiguration géopolitique sans précédent. Les coups d''État successifs au Mali, au Burkina Faso et au Niger ont accéléré un mouvement de fond qui redéfinit les relations entre l''Afrique et ses partenaires traditionnels.</p>',
  'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&h=800&fit=crop',
  'geopolitique',
  'Fatou Sow',
  'published',
  980
),
(
  'TotalEnergies et la course au gaz naturel liquéfié en Afrique de l''Est',
  'totalenergies-gnl-afrique-est',
  'Le géant français accélère ses projets au Mozambique malgré les défis sécuritaires, tandis que de nouveaux gisements sont découverts en Tanzanie.',
  '<p>L''Afrique de l''Est s''affirme comme la nouvelle frontière du gaz naturel liquéfié mondial. TotalEnergies, malgré les difficultés rencontrées au Mozambique, maintient ses ambitions dans la région.</p>',
  'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1200&h=800&fit=crop',
  'ressources-energie',
  'Pierre Dubois',
  'published',
  756
),
(
  'Le corridor de Lobito : un enjeu stratégique entre l''Occident et la Chine',
  'corridor-lobito-enjeu-strategique',
  'Les États-Unis et l''Europe investissent massivement dans la réhabilitation de cette voie ferrée historique pour contrer l''influence chinoise sur les minerais critiques.',
  '<p>Le corridor de Lobito, qui relie l''Angola à la Zambie et à la RDC, est devenu un symbole de la compétition géoéconomique entre l''Occident et la Chine pour l''accès aux minerais critiques africains.</p>',
  'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&h=800&fit=crop',
  'flux-corridors',
  'Maria Santos',
  'published',
  543
),
(
  'Réforme de l''Union Africaine : vers une gouvernance plus efficace ?',
  'reforme-union-africaine-gouvernance',
  'Les propositions de restructuration de l''institution panafricaine suscitent des débats intenses entre les États membres sur l''avenir de l''intégration continentale.',
  '<p>L''Union Africaine engage un processus de réforme ambitieux visant à renforcer son efficacité et sa capacité d''action face aux défis contemporains du continent.</p>',
  'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=1200&h=800&fit=crop',
  'institutions-politiques',
  'Kwame Asante',
  'published',
  421
),
(
  'La Turquie renforce son empreinte diplomatique et économique en Afrique',
  'turquie-empreinte-afrique',
  'Ankara multiplie les initiatives pour s''imposer comme un partenaire incontournable du continent, combinant soft power culturel et investissements stratégiques.',
  '<p>La Turquie poursuit son offensive diplomatique en Afrique, avec l''ouverture de nouvelles ambassades et le renforcement de ses liens économiques avec plusieurs pays clés du continent.</p>',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=800&fit=crop',
  'influences-puissances',
  'Ayşe Yılmaz',
  'published',
  389
);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_article_view(article_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE articles SET view_count = view_count + 1 WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
