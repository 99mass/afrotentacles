export interface MediaItem {
  type: "image" | "video" | "pdf"
  url: string
  caption?: string
  thumbnail?: string
}

export interface Article {
  id: string
  title: string
  subtitle?: string
  excerpt: string
  content: string
  image: string
  region: string
  regionSlug: string
  country?: string
  tags: string[]
  date: string
  slug: string
  author: string
  media?: MediaItem[]
  isSpotlight?: boolean
  isBrief?: boolean
  isSubscribersOnly?: boolean
  status: "published" | "draft"
}

export const regions = [
  { name: "Le Continent", slug: "continent", description: "Actualités panafricaines et analyses transversales" },
  { name: "Afrique Centrale", slug: "afrique-centrale", description: "RDC, Cameroun, Gabon, Congo, Tchad, Centrafrique" },
  { name: "Afrique de l'Ouest", slug: "afrique-ouest", description: "Nigeria, Sénégal, Côte d'Ivoire, Ghana, Mali, Niger, Burkina Faso" },
  { name: "Afrique de l'Est et Corne", slug: "afrique-est", description: "Kenya, Éthiopie, Tanzanie, Ouganda, Rwanda, Soudan" },
  { name: "Afrique australe et îles", slug: "afrique-australe", description: "Afrique du Sud, Angola, Mozambique, Zimbabwe, Madagascar" },
  { name: "Afrique du Nord", slug: "afrique-nord", description: "Maroc, Algérie, Tunisie, Libye, Égypte" },
]

export const tags = [
  "Politique",
  "Finance",
  "Énergie",
  "Mines",
  "Défense",
  "Diplomatie",
  "Business",
  "Infrastructure",
  "Matières premières",
]

export const articles: Article[] = [
  {
    id: "1",
    title: "Tchiani jongle face à la crise sécuritaire croissante",
    subtitle: "Niger",
    excerpt: "Affaibli par l'avancée des groupes djihadistes, le président peine à rétablir l'ordre au sein de ses forces armées tout en ouvrant discrètement un canal de communication avec les insurgés pour alléger la pression sur la capitale, Niamey.",
    content: `
      <p>Le général Abdourahamane Tchiani, qui a pris le pouvoir au Niger en juillet 2023, fait face à une situation de plus en plus complexe. L'avancée des groupes djihadistes dans plusieurs régions du pays menace la stabilité du régime militaire.</p>
      
      <h2>Une pression sécuritaire grandissante</h2>
      <p>Depuis le retrait des forces françaises et américaines, la situation sécuritaire s'est considérablement dégradée dans les zones frontalières avec le Mali et le Burkina Faso. Les groupes affiliés à l'État islamique et à Al-Qaïda multiplient les attaques contre les positions militaires.</p>
      
      <h2>Des tensions internes au sein de l'armée</h2>
      <p>Le président fait également face à des frictions au sein de l'institution militaire. Plusieurs officiers supérieurs contestent la stratégie adoptée face aux insurgés.</p>

      <h2>Une ouverture diplomatique discrète</h2>
      <p>Selon nos informations, des contacts ont été établis avec certains groupes armés dans le but de négocier des cessez-le-feu locaux. Cette stratégie vise à réduire la pression sur Niamey et à permettre au régime de consolider son pouvoir.</p>
    `,
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&h=800&fit=crop",
    region: "Afrique de l'Ouest",
    regionSlug: "afrique-ouest",
    country: "Niger",
    tags: ["Politique", "Défense"],
    date: "2026-04-17",
    slug: "niger-tchiani-crise-securitaire",
    author: "Amadou Diallo",
    isSpotlight: true,
    status: "published",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&h=800&fit=crop",
        caption: "Le président nigérien, le général Abdourahamane Tchiani, à Niamey"
      }
    ]
  },
  {
    id: "2",
    title: "Les pays hôtes de la CAN 2027 sommés d'accélérer les préparatifs",
    subtitle: "Kenya, Tanzanie, Ouganda",
    excerpt: "Africa Intelligence a pu consulter des extraits d'un rapport d'inspection de l'instance dirigeante du football continental. Sans tirer la sonnette d'alarme, le document souligne un certain nombre de retards et de défaillances qui doivent être corrigés avant l'échéance d'août.",
    content: `
      <p>La préparation de la Coupe d'Afrique des Nations 2027, qui doit se tenir conjointement au Kenya, en Tanzanie et en Ouganda, suscite des inquiétudes au sein de la CAF.</p>
      
      <h2>Des infrastructures en retard</h2>
      <p>Le rapport d'inspection révèle que plusieurs stades ne répondent pas encore aux normes FIFA. Les travaux de rénovation accusent un retard de plusieurs mois.</p>
      
      <h2>Les recommandations de la CAF</h2>
      <p>L'instance africaine demande aux trois pays de mobiliser des ressources supplémentaires et d'accélérer les procédures administratives pour respecter le calendrier.</p>
    `,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=800&fit=crop",
    region: "Afrique de l'Est et Corne",
    regionSlug: "afrique-est",
    tags: ["Politique", "Infrastructure"],
    date: "2026-04-17",
    slug: "can-2027-preparatifs-kenya-tanzanie-ouganda",
    author: "Sarah Kimani",
    status: "published",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=800&fit=crop",
        caption: "Le stade Talanta de Nairobi, 31 janvier 2026"
      },
      {
        type: "video",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        caption: "Visite des installations sportives"
      }
    ]
  },
  {
    id: "3",
    title: "La nouvelle stratégie du gendarme financier IGF s'enlise",
    subtitle: "RDC",
    excerpt: "Le chef de l'Inspection Générale des Finances a retiré ses agents des entreprises publiques et des institutions étatiques, optant pour une approche systémique de surveillance des flux financiers gouvernementaux. Cette approche se heurte à d'importants obstacles techniques.",
    content: `
      <p>L'Inspection Générale des Finances de la République Démocratique du Congo traverse une période de transition difficile. La nouvelle stratégie adoptée par son directeur général peine à produire les résultats escomptés.</p>
      
      <h2>Un changement de paradigme</h2>
      <p>Plutôt que de maintenir une présence permanente dans les entreprises publiques, l'IGF a opté pour une surveillance à distance des flux financiers. Cette approche devait permettre une meilleure allocation des ressources humaines.</p>
      
      <h2>Des obstacles techniques majeurs</h2>
      <p>La mise en place des outils informatiques nécessaires à cette surveillance systémique accuse un retard important. Les systèmes d'information des différentes entités publiques ne sont pas interconnectés.</p>
    `,
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=800&fit=crop",
    region: "Afrique Centrale",
    regionSlug: "afrique-centrale",
    country: "RDC",
    tags: ["Finance", "Politique"],
    date: "2026-04-17",
    slug: "rdc-igf-strategie-surveillance-financiere",
    author: "Jean-Baptiste Lukusa",
    isSubscribersOnly: true,
    status: "published"
  },
  {
    id: "4",
    title: "Ibrahim Traoré entretient des liens avec Israël",
    subtitle: "Burkina Faso",
    excerpt: "Le chef de la junte, qui maintient une position fermement anti-occidentale et affiche des liens plus étroits avec Téhéran, entretient simultanément des liens discrets avec Tel-Aviv et son ambassadeur dans la région, dont il vient d'approuver les lettres de créance.",
    content: `
      <p>La politique étrangère du capitaine Ibrahim Traoré révèle des paradoxes intéressants. Tout en cultivant une rhétorique anti-occidentale, le chef de la junte burkinabè maintient des canaux de communication ouverts avec Israël.</p>
      
      <h2>Une diplomatie à géométrie variable</h2>
      <p>Malgré les déclarations publiques de rapprochement avec l'Iran et la Russie, le Burkina Faso n'a pas rompu ses relations avec Tel-Aviv. L'ambassadeur israélien accrédité pour la région a récemment vu ses lettres de créance acceptées.</p>
      
      <h2>Des intérêts sécuritaires convergents</h2>
      <p>Israël dispose d'une expertise en matière de lutte antiterroriste que le Burkina Faso pourrait trouver utile dans le contexte actuel d'insécurité.</p>
    `,
    image: "https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=1200&h=800&fit=crop",
    region: "Afrique de l'Ouest",
    regionSlug: "afrique-ouest",
    country: "Burkina Faso",
    tags: ["Politique", "Diplomatie"],
    date: "2026-04-17",
    slug: "burkina-faso-traore-israel",
    author: "Moussa Koné",
    status: "published",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=1200&h=800&fit=crop",
        caption: "Le capitaine Ibrahim Traoré à Moscou, mai 2025"
      },
      {
        type: "pdf",
        url: "/documents/analyse-diplomatie-burkina.pdf",
        caption: "Analyse complète de la diplomatie burkinabè (PDF)"
      }
    ]
  },
  {
    id: "5",
    title: "TotalEnergies travaille à contrer sa production en baisse constante",
    subtitle: "Angola",
    excerpt: "La major française n'a réussi à produire que 156 000 barils équivalent pétrole par jour en 2025, soit une baisse de 37% sur dix ans. La mise en service de deux nouveaux projets d'une capacité combinée de 60 000 barils par jour n'a pas réussi à inverser la tendance.",
    content: `
      <p>TotalEnergies fait face à un déclin structurel de sa production en Angola, malgré d'importants investissements dans de nouveaux projets. La major française cherche des solutions pour maintenir sa position dans ce pays stratégique.</p>
      
      <h2>Un déclin inexorable</h2>
      <p>La production angolaise de TotalEnergies a chuté de plus d'un tiers en une décennie. Les champs matures s'épuisent plus rapidement que prévu, tandis que les nouveaux projets peinent à compenser cette baisse.</p>
      
      <h2>De nouveaux projets insuffisants</h2>
      <p>Malgré le démarrage de Kaombo et de Zinia 2, la courbe de production reste orientée à la baisse. L'entreprise étudie de nouvelles options d'exploration en eaux ultra-profondes.</p>
    `,
    image: "https://images.unsplash.com/photo-1518173946687-a4c47d3a9f6a?w=1200&h=800&fit=crop",
    region: "Afrique australe et îles",
    regionSlug: "afrique-australe",
    country: "Angola",
    tags: ["Énergie"],
    date: "2026-04-17",
    slug: "angola-totalenergies-production-declin",
    author: "Pedro Silva",
    status: "published"
  },
  {
    id: "6",
    title: "La stratégie maritime chancelante du holding public Madar",
    subtitle: "Algérie",
    excerpt: "Ébranlé par les accusations contre son ancien patron, Charaf-Eddine Amara, placé en détention provisoire en décembre 2025, le conglomérat public réduit certains projets lancés ces dernières années, notamment dans le secteur maritime.",
    content: `
      <p>Le holding public algérien Madar traverse une période de turbulences. Les poursuites judiciaires contre son ancien dirigeant ont des répercussions sur les activités du groupe.</p>
    `,
    image: "https://images.unsplash.com/photo-1578575436955-ef29da568c6c?w=1200&h=800&fit=crop",
    region: "Afrique du Nord",
    regionSlug: "afrique-nord",
    country: "Algérie",
    tags: ["Business", "Politique"],
    date: "2026-04-17",
    slug: "algerie-madar-strategie-maritime",
    author: "Karim Benali",
    status: "published"
  },
  {
    id: "7",
    title: "Duel au sommet de la CAF",
    subtitle: "Le Continent",
    excerpt: "Samson Adamu du Nigeria et Gelson Fernandes du Cap-Vert s'affrontent pour la présidence de la Confédération Africaine de Football.",
    content: `
      <p>La course à la présidence de la CAF s'annonce serrée entre deux candidats aux profils très différents.</p>
    `,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=800&fit=crop",
    region: "Le Continent",
    regionSlug: "continent",
    tags: ["Politique"],
    date: "2026-04-10",
    slug: "caf-election-presidence",
    author: "Emmanuel Mensah",
    isSubscribersOnly: true,
    status: "published"
  },
  {
    id: "8",
    title: "Kinshasa visée par une plainte de 51 millions de dollars à New York",
    isBrief: true,
    subtitle: "RDC",
    excerpt: "Le gouvernement congolais fait face à une procédure judiciaire aux États-Unis.",
    content: `<p>Une plainte a été déposée contre la RDC devant les tribunaux new-yorkais.</p>`,
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=600&fit=crop",
    region: "Afrique Centrale",
    regionSlug: "afrique-centrale",
    country: "RDC",
    tags: ["Politique", "Business"],
    date: "2026-04-08",
    slug: "rdc-plainte-new-york",
    author: "Jean-Baptiste Lukusa",
    isSubscribersOnly: true,
    status: "published"
  },
  {
    id: "9",
    title: "Procédure de saisie contre l'ancienne banque du PM de Guinée équatoriale à Douala",
    isBrief: true,
    subtitle: "Cameroun, Guinée équatoriale",
    excerpt: "Des procédures judiciaires ciblent des actifs bancaires au Cameroun.",
    content: `<p>Des saisies sont en cours contre des actifs liés à l'ancien Premier ministre équato-guinéen.</p>`,
    image: "https://images.unsplash.com/photo-1504297050568-910d24c426d3?w=800&h=600&fit=crop",
    region: "Afrique Centrale",
    regionSlug: "afrique-centrale",
    tags: ["Finance"],
    date: "2026-04-13",
    slug: "cameroun-guinee-equatoriale-saisie-banque",
    author: "Paul Essomba",
    isSubscribersOnly: true,
    status: "published"
  },
  {
    id: "10",
    title: "La société pétrolière d'État GOC dans un bras de fer de 20M$ avec le turc Karpowership",
    subtitle: "Gabon",
    excerpt: "Gabon Oil Co, chargée de payer les factures de carburant pour le compte de la société de services publics SEEG afin de faire fonctionner les centrales électriques flottantes de Karpowership, est poursuivie par l'opérateur turc pour factures impayées.",
    content: `<p>Un contentieux oppose l'entreprise pétrolière nationale gabonaise à l'opérateur turc de centrales électriques flottantes.</p>`,
    image: "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=1200&h=800&fit=crop",
    region: "Afrique Centrale",
    regionSlug: "afrique-centrale",
    country: "Gabon",
    tags: ["Énergie"],
    date: "2026-04-13",
    slug: "gabon-goc-karpowership-contentieux",
    author: "Marie Ndong",
    isSubscribersOnly: true,
    status: "published"
  },
  {
    id: "11",
    title: "Chevron prépare son retour en Afrique dans les pas de Trump",
    subtitle: "Le Continent",
    excerpt: "Le géant pétrolier américain planifie une expansion significative sur le continent africain, porté par la nouvelle politique énergétique de Washington.",
    content: `<p>Chevron entend renforcer sa présence en Afrique, particulièrement dans les pays producteurs d'hydrocarbures.</p>`,
    image: "https://images.unsplash.com/photo-1518173946687-a4c47d3a9f6a?w=1200&h=800&fit=crop",
    region: "Le Continent",
    regionSlug: "continent",
    tags: ["Énergie", "Diplomatie"],
    date: "2026-03-25",
    slug: "chevron-retour-afrique",
    author: "John Smith",
    isSpotlight: true,
    isSubscribersOnly: true,
    status: "published"
  },
  {
    id: "12",
    title: "Dans l'ombre du roi, le chemin du prince Moulay El Hassan vers le trône",
    subtitle: "Maroc",
    excerpt: "Le prince héritier marocain se prépare progressivement à assumer ses futures responsabilités.",
    content: `<p>L'éducation et la formation du prince héritier marocain suivent un parcours minutieusement planifié.</p>`,
    image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&h=800&fit=crop",
    region: "Afrique du Nord",
    regionSlug: "afrique-nord",
    country: "Maroc",
    tags: ["Politique"],
    date: "2026-04-13",
    slug: "maroc-prince-moulay-el-hassan",
    author: "Yasmine Alaoui",
    isSubscribersOnly: true,
    status: "published"
  }
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(article => article.slug === slug)
}

export function getArticlesByRegion(regionSlug: string): Article[] {
  return articles.filter(article => article.regionSlug === regionSlug && article.status === "published")
}

export function getSpotlightArticles(): Article[] {
  return articles.filter(article => article.isSpotlight && article.status === "published")
}

export function getBriefArticles(regionSlug?: string): Article[] {
  return articles.filter(article => 
    article.isBrief && 
    article.status === "published" &&
    (!regionSlug || article.regionSlug === regionSlug)
  )
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return articles
    .filter(a => a.regionSlug === article.regionSlug && a.id !== article.id && a.status === "published")
    .slice(0, limit)
}

export function getRegionBySlug(slug: string) {
  return regions.find(r => r.slug === slug)
}

export function getLatestArticles(limit = 10): Article[] {
  return articles
    .filter(a => a.status === "published")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function getArticlesByTag(tag: string): Article[] {
  return articles.filter(a => a.tags.includes(tag) && a.status === "published")
}
