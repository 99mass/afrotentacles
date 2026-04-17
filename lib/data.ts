export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  categorySlug: string
  date: string
  slug: string
  author: string
  videoUrl?: string
  pdfUrl?: string
  status: "published" | "draft"
}

export const categories = [
  { name: "Géoéconomie", slug: "geoeconomie", description: "Analyse des dynamiques économiques et financières du continent africain" },
  { name: "Géopolitique", slug: "geopolitique", description: "Décryptage des enjeux politiques et des relations internationales en Afrique" },
  { name: "Ressources & Énergie", slug: "ressources-energie", description: "Exploration des secteurs miniers, pétroliers et énergétiques" },
  { name: "Flux & Corridors", slug: "flux-corridors", description: "Étude des flux commerciaux et des corridors économiques" },
  { name: "Institutions & Politiques publiques", slug: "institutions", description: "Analyse des institutions et des politiques gouvernementales" },
  { name: "Influences & Puissances", slug: "influences", description: "Cartographie des réseaux d'influence et des puissances en Afrique" },
  { name: "Données & Insights", slug: "donnees-insights", description: "Données et analyses approfondies sur les tendances africaines" },
]

export const articles: Article[] = [
  {
    id: "1",
    title: "L'Afrique de l'Ouest face aux nouveaux enjeux du commerce transsaharien",
    excerpt: "Une analyse approfondie des mutations des routes commerciales historiques et de leur impact sur les économies sahéliennes contemporaines.",
    content: `
      <p>Le commerce transsaharien, longtemps considéré comme une relique du passé, connaît une renaissance inattendue dans le contexte géopolitique actuel. Les routes qui jadis acheminaient l'or, le sel et les esclaves vers les ports méditerranéens se réactivent sous de nouvelles formes.</p>
      
      <h2>Un héritage historique en mutation</h2>
      <p>Depuis des millénaires, les caravanes ont façonné les liens économiques et culturels entre le Maghreb et l'Afrique subsaharienne. Aujourd'hui, ces connexions prennent de nouvelles formes, portées par les infrastructures modernes et les accords commerciaux régionaux.</p>
      
      <h2>Les nouveaux acteurs du commerce transsaharien</h2>
      <p>La Chine, la Turquie et les Émirats arabes unis s'imposent comme des partenaires incontournables, investissant massivement dans les infrastructures de transport et les zones économiques spéciales.</p>
      
      <h2>Défis sécuritaires et opportunités économiques</h2>
      <p>L'instabilité au Sahel représente un obstacle majeur, mais paradoxalement, elle crée aussi des opportunités pour les acteurs capables de naviguer dans cet environnement complexe.</p>
    `,
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&h=800&fit=crop",
    category: "Géoéconomie",
    categorySlug: "geoeconomie",
    date: "2026-04-15",
    slug: "afrique-ouest-commerce-transsaharien",
    author: "Amadou Diallo",
    status: "published"
  },
  {
    id: "2",
    title: "Le corridor de Lobito : nouvelle artère économique de l'Afrique australe",
    excerpt: "Le chemin de fer reliant l'Angola à la RDC et à la Zambie redessine les équilibres logistiques du continent.",
    content: `
      <p>Le corridor de Lobito, longtemps négligé, redevient un axe stratégique majeur pour l'évacuation des minerais stratégiques d'Afrique centrale vers les marchés mondiaux.</p>
      
      <h2>Une infrastructure stratégique</h2>
      <p>Avec plus de 1 300 kilomètres de voies ferrées, le corridor connecte les zones minières du Katanga et de la Copperbelt au port de Lobito sur la côte atlantique angolaise.</p>
      
      <h2>L'enjeu des minerais critiques</h2>
      <p>Cuivre, cobalt, lithium : les ressources de cette région sont essentielles pour la transition énergétique mondiale. Le corridor de Lobito offre une alternative aux routes traditionnelles via l'Afrique du Sud ou la Tanzanie.</p>
    `,
    image: "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=1200&h=800&fit=crop",
    category: "Flux & Corridors",
    categorySlug: "flux-corridors",
    date: "2026-04-12",
    slug: "corridor-lobito-afrique-australe",
    author: "Maria Santos",
    status: "published"
  },
  {
    id: "3",
    title: "La diplomatie énergétique du Sénégal à l'épreuve de la production gazière",
    excerpt: "Avec l'entrée en production du champ Grand Tortue Ahmeyim, Dakar doit repenser sa stratégie régionale.",
    content: `
      <p>Le Sénégal entre dans une nouvelle ère avec le démarrage de la production de gaz naturel liquéfié. Cette transformation pose de nouveaux défis diplomatiques et économiques.</p>
      
      <h2>Une ressource partagée</h2>
      <p>Le champ Grand Tortue Ahmeyim, exploité conjointement avec la Mauritanie, illustre les possibilités de coopération énergétique transfrontalière en Afrique de l'Ouest.</p>
    `,
    image: "https://images.unsplash.com/photo-1518173946687-a4c47d3a9f6a?w=1200&h=800&fit=crop",
    category: "Ressources & Énergie",
    categorySlug: "ressources-energie",
    date: "2026-04-10",
    slug: "senegal-diplomatie-energetique-gaz",
    author: "Fatou Sow",
    status: "published"
  },
  {
    id: "4",
    title: "L'Union africaine face au défi de la réforme institutionnelle",
    excerpt: "Entre ambitions panafricaines et réalités nationales, l'UA cherche à renforcer son efficacité.",
    content: `
      <p>L'Union africaine, créée en 2002, peine encore à s'imposer comme un acteur décisif dans la résolution des crises continentales. La question de sa réforme est plus urgente que jamais.</p>
      
      <h2>Le diagnostic d'Addis-Abeba</h2>
      <p>Depuis le rapport Kagame de 2017, les propositions de réforme se multiplient. Financement autonome, rationalisation des organes, renforcement des capacités : les chantiers sont nombreux.</p>
    `,
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=800&fit=crop",
    category: "Institutions & Politiques publiques",
    categorySlug: "institutions",
    date: "2026-04-08",
    slug: "union-africaine-reforme-institutionnelle",
    author: "Jean-Baptiste Mensah",
    status: "published"
  },
  {
    id: "5",
    title: "Pékin renforce son emprise sur les infrastructures portuaires africaines",
    excerpt: "De Djibouti à Kribi, les opérateurs chinois multiplient les investissements stratégiques.",
    content: `
      <p>La stratégie maritime chinoise en Afrique s'intensifie, avec des investissements massifs dans les ports, les zones économiques spéciales et les corridors de transport.</p>
    `,
    image: "https://images.unsplash.com/photo-1578575436955-ef29da568c6c?w=1200&h=800&fit=crop",
    category: "Influences & Puissances",
    categorySlug: "influences",
    date: "2026-04-05",
    slug: "chine-infrastructures-portuaires-afrique",
    author: "Chen Wei",
    status: "published"
  },
  {
    id: "6",
    title: "Les cryptomonnaies, nouveau vecteur de la fuite des capitaux africains",
    excerpt: "Face aux contrôles des changes, les actifs numériques deviennent un outil prisé des élites.",
    content: `
      <p>L'adoption croissante des cryptomonnaies en Afrique révèle des usages variés, du transfert de fonds à l'évasion fiscale.</p>
    `,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=800&fit=crop",
    category: "Données & Insights",
    categorySlug: "donnees-insights",
    date: "2026-04-03",
    slug: "cryptomonnaies-fuite-capitaux-afrique",
    author: "Kofi Asante",
    status: "published"
  },
  {
    id: "7",
    title: "Le Nigeria à la croisée des chemins : élections et tensions régionales",
    excerpt: "Le géant ouest-africain fait face à des défis sécuritaires et économiques sans précédent.",
    content: `
      <p>Le Nigeria, première économie du continent, traverse une période de turbulences qui menace sa stabilité et son influence régionale.</p>
    `,
    image: "https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=1200&h=800&fit=crop",
    category: "Géopolitique",
    categorySlug: "geopolitique",
    date: "2026-04-01",
    slug: "nigeria-elections-tensions-regionales",
    author: "Chinedu Okonkwo",
    status: "published"
  },
  {
    id: "8",
    title: "La Zone de libre-échange continentale africaine : bilan et perspectives",
    excerpt: "Trois ans après son lancement, la ZLECAf peine à tenir ses promesses initiales.",
    content: `
      <p>La Zone de libre-échange continentale africaine représente le plus grand accord commercial au monde par le nombre de pays participants. Mais sa mise en œuvre reste lente.</p>
    `,
    image: "https://images.unsplash.com/photo-1504297050568-910d24c426d3?w=1200&h=800&fit=crop",
    category: "Géoéconomie",
    categorySlug: "geoeconomie",
    date: "2026-03-28",
    slug: "zlecaf-bilan-perspectives",
    author: "Amara Touré",
    status: "published"
  }
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(article => article.slug === slug)
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter(article => article.categorySlug === categorySlug && article.status === "published")
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return articles
    .filter(a => a.categorySlug === article.categorySlug && a.id !== article.id && a.status === "published")
    .slice(0, limit)
}

export function getCategoryBySlug(slug: string) {
  return categories.find(cat => cat.slug === slug)
}
