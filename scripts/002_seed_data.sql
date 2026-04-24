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
  '<p>Le corridor de Lobito, qui relie l''Angola à la Zambie et à la RDC, est devenu un symbole de la compétition géoéconomique entre l''Occident et la Chine pour l''accès aux minerais critiques africains.</p><h2>Un investissement stratégique occidental</h2><p>Les États-Unis, l''Union européenne et leurs partenaires ont mobilisé plus de 5 milliards de dollars pour moderniser cette infrastructure ferroviaire datant de l''ère coloniale.</p><h2>L''enjeu des minerais critiques</h2><p>Le corridor permettra d''acheminer le cobalt et le cuivre de la ceinture minière vers les ports atlantiques, offrant une alternative à la route orientale contrôlée par des intérêts chinois.</p>',
  'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&h=800&fit=crop',
  'Flux & Corridors',
  'flux-corridors',
  '2026-04-15',
  'corridor-lobito-enjeu-strategique',
  'Maria Santos',
  'published'
),
(
  'Réforme de l''Union Africaine : vers une gouvernance plus efficace ?',
  'Les propositions de restructuration de l''institution panafricaine suscitent des débats intenses entre les États membres sur l''avenir de l''intégration continentale.',
  '<p>L''Union Africaine engage un processus de réforme ambitieux visant à renforcer son efficacité et sa capacité d''action face aux défis contemporains du continent.</p><h2>Les axes de la réforme</h2><p>La proposition prévoit une réduction du nombre de commissaires, un renforcement des mécanismes de financement propres et une clarification des compétences entre l''UA et les communautés économiques régionales.</p>',
  'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=1200&h=800&fit=crop',
  'Institutions & Politiques publiques',
  'institutions-politiques',
  '2026-04-14',
  'reforme-union-africaine-gouvernance',
  'Kwame Asante',
  'published'
),
(
  'La Turquie renforce son empreinte diplomatique et économique en Afrique',
  'Ankara multiplie les initiatives pour s''imposer comme un partenaire incontournable du continent, combinant soft power culturel et investissements stratégiques.',
  '<p>La Turquie poursuit son offensive diplomatique en Afrique, avec l''ouverture de nouvelles ambassades et le renforcement de ses liens économiques avec plusieurs pays clés du continent.</p><h2>Une présence diplomatique élargie</h2><p>Avec 44 ambassades sur le continent, la Turquie dispose désormais du quatrième réseau diplomatique en Afrique, derrière la France, la Chine et les États-Unis.</p><h2>Les investissements turcs</h2><p>Turkish Airlines dessert 62 destinations africaines, tandis que les entreprises turques du BTP et de la défense remportent des contrats majeurs dans plusieurs pays.</p>',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=800&fit=crop',
  'Influences & Puissances',
  'influences-puissances',
  '2026-04-13',
  'turquie-empreinte-afrique',
  'Ayşe Yılmaz',
  'published'
),
(
  'Démographie africaine : les projections à l''horizon 2050 bouleversent les équilibres mondiaux',
  'Avec un doublement attendu de sa population, l''Afrique concentrera un quart de l''humanité d''ici 2050, transformant les dynamiques économiques et migratoires mondiales.',
  '<p>Les dernières projections démographiques des Nations Unies confirment la trajectoire exceptionnelle du continent africain, qui devrait passer de 1,4 à 2,5 milliards d''habitants d''ici 2050.</p><h2>Les implications économiques</h2><p>Cette croissance démographique représente à la fois un défi et une opportunité. Le dividende démographique pourrait générer une croissance économique significative si les investissements dans l''éducation et l''emploi suivent.</p><h2>Les défis de l''urbanisation</h2><p>Lagos, Kinshasa et Le Caire devraient figurer parmi les dix plus grandes mégalopoles mondiales, posant des défis majeurs en termes d''infrastructures et de services publics.</p>',
  'https://images.unsplash.com/photo-1504297050568-910d24c426d3?w=1200&h=800&fit=crop',
  'Données & Insights',
  'donnees-insights',
  '2026-04-12',
  'demographie-africaine-2050',
  'Dr. Aminata Traoré',
  'published'
),
(
  'Le franc CFA face aux monnaies numériques : quel avenir pour la zone monétaire ?',
  'Les banques centrales africaines explorent les options de monnaies numériques tandis que le débat sur la souveraineté monétaire s''intensifie.',
  '<p>La question de la réforme du franc CFA revient au cœur des débats économiques africains, alors que les technologies financières offrent de nouvelles perspectives.</p>',
  'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&h=800&fit=crop',
  'Géoéconomie',
  'geoeconomie',
  '2026-04-11',
  'franc-cfa-monnaies-numeriques',
  'Jean-Marc Ela',
  'published'
),
(
  'La guerre en Ukraine redistribue les cartes des approvisionnements agricoles africains',
  'Face aux perturbations des exportations de céréales russes et ukrainiennes, plusieurs pays africains accélèrent leurs stratégies de souveraineté alimentaire.',
  '<p>La prolongation du conflit en Ukraine continue d''affecter les chaînes d''approvisionnement alimentaires mondiales, poussant les pays africains à repenser leur dépendance aux importations.</p>',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=800&fit=crop',
  'Flux & Corridors',
  'flux-corridors',
  '2026-04-10',
  'ukraine-approvisionnements-agricoles-afrique',
  'Olga Petrova',
  'published'
),
(
  'L''essor des ports secs en Afrique de l''Ouest transforme la logistique régionale',
  'Le développement de plateformes logistiques intérieures répond aux besoins croissants des pays enclavés et désengorge les ports maritimes saturés.',
  '<p>Les ports secs se multiplient en Afrique de l''Ouest, offrant de nouvelles solutions logistiques pour le commerce régional et international.</p>',
  'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200&h=800&fit=crop',
  'Flux & Corridors',
  'flux-corridors',
  '2026-04-09',
  'ports-secs-afrique-ouest-logistique',
  'Ibrahim Koné',
  'published'
),
(
  'Les minerais critiques africains au cœur de la transition énergétique mondiale',
  'Cobalt, lithium, graphite : l''Afrique détient une part croissante des ressources essentielles aux batteries et aux technologies vertes.',
  '<p>L''Afrique émerge comme un acteur incontournable de la transition énergétique mondiale grâce à ses réserves de minerais critiques.</p>',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop',
  'Ressources & Énergie',
  'ressources-energie',
  '2026-04-08',
  'minerais-critiques-afrique-transition-energetique',
  'Claude Kabongo',
  'published'
),
(
  'Le rôle croissant des fonds souverains africains dans le développement continental',
  'Du Nigeria au Rwanda, les fonds souverains africains diversifient leurs stratégies d''investissement pour soutenir la transformation économique.',
  '<p>Les fonds souverains africains gagnent en maturité et en influence, jouant un rôle croissant dans le financement du développement continental.</p>',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
  'Géoéconomie',
  'geoeconomie',
  '2026-04-07',
  'fonds-souverains-africains-developpement',
  'Ngozi Okafor',
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
