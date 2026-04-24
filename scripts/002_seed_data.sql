-- Insert Categories
INSERT INTO categories (name, slug, description) VALUES
('Géoéconomie', 'geoeconomie', 'Analyses économiques et stratégies continentales'),
('Géopolitique', 'geopolitique', 'Relations internationales et dynamiques de pouvoir'),
('Ressources & Énergie', 'ressources-energie', 'Mines, pétrole, gaz et énergies renouvelables'),
('Flux & Corridors', 'flux-corridors', 'Commerce, transport et infrastructures'),
('Institutions & Politiques publiques', 'institutions-politiques', 'Gouvernance et réformes institutionnelles'),
('Influences & Puissances', 'influences-puissances', 'Acteurs géopolitiques et réseaux d''influence'),
('Données & Insights', 'donnees-insights', 'Analyses de données et prospective')
ON CONFLICT (slug) DO NOTHING;

-- Insert Articles
INSERT INTO articles (title, excerpt, content, image, category_name, category_slug, published_date, slug, author, status) VALUES
(
  'La nouvelle stratégie économique de l''Union Africaine face aux défis mondiaux',
  'L''UA dévoile son plan ambitieux pour repositionner l''Afrique dans l''économie mondiale, avec un accent sur l''intégration régionale et la transformation industrielle.',
  '<p>L''Union Africaine a présenté sa nouvelle feuille de route économique pour la décennie 2025-2035, marquant un tournant stratégique dans l''approche du développement continental.</p><h2>Une vision renouvelée de l''intégration économique</h2><p>Le document, élaboré après deux années de consultations avec les États membres et les partenaires économiques, met l''accent sur trois piliers fondamentaux : l''industrialisation accélérée, la souveraineté alimentaire et la transition énergétique.</p><p>Cette stratégie s''inscrit dans le prolongement de la Zone de libre-échange continentale africaine (ZLECAf), dont la mise en œuvre progressive transforme déjà les flux commerciaux intra-africains.</p><h2>Les défis de la mise en œuvre</h2><p>Malgré l''ambition affichée, plusieurs obstacles persistent. Le financement reste le nerf de la guerre, avec un besoin estimé à 400 milliards de dollars sur dix ans. Les capacités institutionnelles des États membres varient considérablement, créant des asymétries dans l''application des politiques communes.</p><h2>Les premiers résultats encourageants</h2><p>Les données préliminaires montrent une augmentation de 23% des échanges intra-africains depuis l''entrée en vigueur de la ZLECAf, bien que partant d''une base relativement faible.</p>',
  'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=800&fit=crop',
  'Géoéconomie',
  'geoeconomie',
  '2026-04-17',
  'strategie-economique-union-africaine',
  'Amadou Diallo',
  'published'
),
(
  'Tensions au Sahel : les nouvelles alliances redessinent la carte géopolitique',
  'Le retrait progressif des forces occidentales et l''émergence de nouveaux partenaires transforment profondément l''équilibre des puissances dans la région sahélienne.',
  '<p>La région du Sahel connaît une reconfiguration géopolitique sans précédent. Les coups d''État successifs au Mali, au Burkina Faso et au Niger ont accéléré un mouvement de fond qui redéfinit les relations entre l''Afrique et ses partenaires traditionnels.</p><h2>La fin d''une ère</h2><p>Le départ des forces françaises de l''opération Barkhane, suivi du retrait des contingents européens et américains, marque la fin d''un cycle d''intervention militaire occidentale entamé en 2013.</p><h2>De nouveaux acteurs sur le terrain</h2><p>La Russie, à travers le groupe Wagner puis Africa Corps, a comblé une partie du vide laissé. La Turquie renforce également sa présence, tandis que la Chine maintient son approche centrée sur les infrastructures économiques.</p><h2>Les implications régionales</h2><p>La création de l''Alliance des États du Sahel (AES) entre le Mali, le Burkina Faso et le Niger constitue un développement majeur, remettant en question l''architecture sécuritaire de la CEDEAO.</p>',
  'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&h=800&fit=crop',
  'Géopolitique',
  'geopolitique',
  '2026-04-17',
  'tensions-sahel-alliances-geopolitique',
  'Fatou Sow',
  'published'
),
(
  'TotalEnergies et la course au gaz naturel liquéfié en Afrique de l''Est',
  'Le géant français accélère ses projets au Mozambique malgré les défis sécuritaires, tandis que de nouveaux gisements sont découverts en Tanzanie.',
  '<p>L''Afrique de l''Est s''affirme comme la nouvelle frontière du gaz naturel liquéfié mondial. TotalEnergies, malgré les difficultés rencontrées au Mozambique, maintient ses ambitions dans la région.</p><h2>Le projet Mozambique LNG</h2><p>Après une suspension de deux ans due à l''insurrection dans la province de Cabo Delgado, TotalEnergies a annoncé la reprise progressive des travaux sur son méga-projet de GNL.</p><h2>La concurrence s''intensifie</h2><p>ExxonMobil, Shell et ENI renforcent également leurs positions dans la région, créant une dynamique compétitive intense pour l''accès aux ressources gazières.</p>',
  'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1200&h=800&fit=crop',
  'Ressources & Énergie',
  'ressources-energie',
  '2026-04-16',
  'totalenergies-gnl-afrique-est',
  'Pierre Dubois',
  'published'
),
(
  'Le corridor de Lobito : un enjeu stratégique entre l''Occident et la Chine',
  'Les États-Unis et l''Europe investissent massivement dans la réhabilitation de cette voie ferrée historique pour contrer l''influence chinoise sur les minerais critiques.',
  '<p>Le corridor de Lobito, qui relie l''Angola à la Zambie et à la RDC, est devenu un symbole de la compétition géoéconomique entre l''Occident et la Chine pour l''accès aux minerais critiques africains.</p>',
  'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&h=800&fit=crop',
  'Flux & Corridors',
  'flux-corridors',
  '2026-04-15',
  'corridor-lobito-enjeu-strategique',
  'Maria Santos',
  'published'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Media (Only for articles that had them in data.ts)
INSERT INTO article_media (article_id, type, url, caption) VALUES
((SELECT id FROM articles WHERE slug = 'strategie-economique-union-africaine'), 'image', 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=800&fit=crop', 'Le siège de l''Union Africaine à Addis-Abeba'),
((SELECT id FROM articles WHERE slug = 'strategie-economique-union-africaine'), 'image', 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&h=800&fit=crop', 'Réunion des chefs d''État lors du sommet de l''UA'),
((SELECT id FROM articles WHERE slug = 'strategie-economique-union-africaine'), 'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Conférence de presse du président de la Commission de l''UA'),
((SELECT id FROM articles WHERE slug = 'strategie-economique-union-africaine'), 'pdf', '/documents/rapport-ua-2026.pdf', 'Rapport complet de la stratégie économique 2025-2035 (PDF)'),

((SELECT id FROM articles WHERE slug = 'tensions-sahel-alliances-geopolitique'), 'image', 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&h=800&fit=crop', 'Vue aérienne de Bamako, capitale du Mali'),

((SELECT id FROM articles WHERE slug = 'totalenergies-gnl-afrique-est'), 'image', 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1200&h=800&fit=crop', 'Installation gazière offshore'),
((SELECT id FROM articles WHERE slug = 'totalenergies-gnl-afrique-est'), 'pdf', '/documents/rapport-gnl-2026.pdf', 'Étude de marché GNL Afrique de l''Est (PDF)');
