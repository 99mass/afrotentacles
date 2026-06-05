import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArticleCard } from "@/components/article-card"
import { getLatestArticles, getFeaturedArticles, getArticlesByCategory, getPopularArticles, getCategories } from "@/lib/actions/articles"
import { getYouTubeSettings } from "@/lib/actions/settings"
import { FeaturedCarousel } from "@/components/featured-carousel"
import Link from "next/link"
import type { Metadata } from "next"

const BASE_URL = 'https://afrotentacles.com'

export const metadata: Metadata = {
  title: {
    absolute: 'AfroTentacles - Géoéconomie et Géopolitique Africaine',
  },
  description: 'Décryptez les dynamiques africaines : géopolitique, géoéconomie, ressources et réseaux d\'influence. Analyses approfondies et accessibles sur l\'Afrique contemporaine.',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    url: BASE_URL,
    title: 'AfroTentacles - Géoéconomie et Géopolitique Africaine',
    description: 'Décryptez les dynamiques africaines : géopolitique, géoéconomie, ressources et réseaux d\'influence.',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'AfroTentacles' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AfroTentacles - Géoéconomie et Géopolitique Africaine',
    description: 'Décryptez les dynamiques africaines : géopolitique, géoéconomie, ressources et réseaux d\'influence.',
    images: ['/og-default.png'],
  },
}

export default async function HomePage() {
  // Fetch initial data simultaneously
  const [featuredArticles, latestArticles, popularArticles, categories, youtubeSettings] = await Promise.all([
    getFeaturedArticles(),
    getLatestArticles(1, 11), // 5 for sidebar/top + 6 for infinite list start
    getPopularArticles(5),
    getCategories(),
    getYouTubeSettings()
  ])



  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section - À la Une */}
        <section className="border-b border-border font-serif">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <h1 className="text-sm font-bold uppercase tracking-wider text-primary border-b-2 border-primary pb-2 mb-6 inline-block font-serif">
              À la Une
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 font-serif">
              {/* Featured Carousel */}
              <div className="lg:col-span-7">
                <FeaturedCarousel articles={featuredArticles} />
              </div>

              {/* Secondary Articles */}
              <div className="lg:col-span-5">
                <div className="grid gap-4 lg:gap-6">
                  {latestArticles.slice(0, 4).map((article, index) => (
                    <ArticleCard key={article.id} article={article} variant="horizontal" priority={index === 0} showExcerpt={true} excerptClamp={1} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Main Content Area: Categories (Left) & Sidebar (Right) */}
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            
            {/* Left Column: Categories */}
            <div className="lg:col-span-9 flex flex-col">
              {await Promise.all(categories.filter((c: any) => c.name !== "À la Une").map(async (category: any) => {
                const categoryArticles = await getArticlesByCategory(category.slug)
                if (categoryArticles.length === 0) return null
                
                return (
                  <CategorySection 
                    key={category.slug}
                    title={category.name}
                    slug={category.slug}
                    articles={categoryArticles}
                  />
                )
              }))}
            </div>

            {/* Right Column: Sidebar */}
            <aside className="lg:col-span-3 font-serif">
              <div className="sticky top-32 font-serif">
                {/* Trending */}
                <div className="mb-8 font-serif">
                  <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-primary pb-2 mb-4 font-serif text-foreground">
                    Les plus lus
                  </h3>
                  <div>
                    {popularArticles.slice(0, 3).map((article) => (
                      <ArticleCard key={article.id} article={article} variant="compact" />
                    ))}
                  </div>
                </div>

                {/* Video Section */}
                {youtubeSettings?.is_active && (
                  ((!youtubeSettings.video_type || youtubeSettings.video_type === 'youtube') && youtubeSettings.url) ||
                  (youtubeSettings.video_type === 'uploaded' && youtubeSettings.uploaded_video_url)
                ) && (
                  <div className="mb-8 font-serif">
                    <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-primary pb-2 mb-4 font-serif text-foreground">
                      À regarder
                    </h3>
                    <div className="bg-black rounded-lg overflow-hidden aspect-video mb-6">
                      {(!youtubeSettings.video_type || youtubeSettings.video_type === 'youtube') && youtubeSettings.url ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={youtubeSettings.url}
                          title="Vidéo YouTube"
                          style={{ border: 'none' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : youtubeSettings.video_type === 'uploaded' && youtubeSettings.uploaded_video_url ? (
                        <video
                          src={youtubeSettings.uploaded_video_url}
                          controls
                          playsInline
                          preload="auto"
                          className="w-full h-full object-contain"
                          style={{ maxHeight: '100%' }}
                        />
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </aside>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

function CategorySection({ 
  title, 
  slug, 
  articles 
}: { 
  title: string
  slug: string
  articles: any[]
}) {
  const mainArticle = articles[0]
  const secondaryArticles = articles.slice(1, 4)

  return (
    <section className="py-8 border-t border-border font-serif first:border-t-0 first:pt-0">
      <div className="font-serif">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 font-serif">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground border-b-2 border-primary pb-2 font-serif">
            {title}
          </h2>
          <Link href={`/categorie/${slug}`} className="text-sm text-primary hover:underline font-serif">
            Tous les articles &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 font-serif">
          {/* Main Article */}
          <div className="font-serif">
            {mainArticle && (
              <ArticleCard article={mainArticle} showCategory={false} />
            )}
          </div>

          {/* Secondary Articles */}
          <div className="font-serif">
            <div className="grid gap-4 font-serif">
              {secondaryArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="horizontal" showCategory={false} excerptClamp={1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
