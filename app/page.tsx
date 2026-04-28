import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArticleCard } from "@/components/article-card"
import { getLatestArticles, getFeaturedArticles, getArticlesByCategory, getPopularArticles, getCategories } from "@/lib/actions/articles"
import { getYouTubeSettings } from "@/lib/actions/settings"
import { InfiniteArticleList } from "@/components/infinite-article-list"
import { FeaturedCarousel } from "@/components/featured-carousel"
import Link from "next/link"

export default async function HomePage() {
  // Fetch initial data simultaneously
  const [featuredArticles, latestArticles, popularArticles, categories, youtubeSettings] = await Promise.all([
    getFeaturedArticles(),
    getLatestArticles(1, 11), // 5 for sidebar/top + 6 for infinite list start
    getPopularArticles(5),
    getCategories(),
    getYouTubeSettings()
  ])

  // Determine number of articles to display based on YouTube settings
  const articlesToDisplay = youtubeSettings?.is_active 
    ? Math.min(youtubeSettings.articles_count || 3, popularArticles.length)
    : 5

  // Infinite list = everything from index 0 onward
  const initialInfiniteArticles = latestArticles.slice(0, 10)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section - À la Une */}
        <section className="border-b border-border font-serif">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary border-b-2 border-primary pb-2 mb-6 inline-block font-serif">
              À la Une
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 font-serif">
              {/* Featured Carousel */}
              <div className="lg:col-span-7">
                <FeaturedCarousel articles={featuredArticles} />
              </div>

              {/* Secondary Articles */}
              <div className="lg:col-span-5">
                <div className="grid gap-4 lg:gap-6">
                  {latestArticles.slice(0, 4).map((article, index) => (
                    <ArticleCard key={article.id} article={article} variant="horizontal" priority={index === 0} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <section className="py-8 font-serif">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 font-serif">
              {/* Main Column - Latest Articles Grid */}
              <div className="lg:col-span-8 font-serif">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2 mb-6 font-serif">
                  Derniers articles
                </h2>
                <InfiniteArticleList initialArticles={initialInfiniteArticles} />
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 font-serif">
                <div className="sticky top-32 font-serif">
                  {/* Trending */}
                  <div className="mb-8 font-serif">
                    <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-primary pb-2 mb-4 font-serif">
                      Les plus lus
                    </h3>
                    <div>
                      {popularArticles.slice(0, articlesToDisplay).map((article) => (
                        <ArticleCard key={article.id} article={article} variant="compact" />
                      ))}
                    </div>
                  </div>

                  {/* YouTube Video */}
                  {youtubeSettings?.is_active && youtubeSettings?.url && (
                    <div className="mb-8 font-serif">
                      <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-primary pb-2 mb-4 font-serif">
                        À regarder
                      </h3>
                      <div className="bg-black rounded-lg overflow-hidden aspect-video mb-6">
                        <iframe
                          width="100%"
                          height="100%"
                          src={youtubeSettings.url}
                          title="Vidéo YouTube"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Category Sections */}
        {await Promise.all(categories.map(async (category: any) => {
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
    <section className="py-8 border-t border-border font-serif">
      <div className="mx-auto max-w-7xl px-4 font-serif">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 font-serif">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground border-b-2 border-primary pb-2 font-serif">
            {title}
          </h2>
          <Link href={`/categorie/${slug}`} className="text-sm text-primary hover:underline font-serif">
            Tous les articles &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 font-serif">
          {/* Main Article */}
          <div className="lg:col-span-6 font-serif">
            {mainArticle && (
              <ArticleCard article={mainArticle} showCategory={false} />
            )}
          </div>

          {/* Secondary Articles */}
          <div className="lg:col-span-6 font-serif">
            <div className="grid gap-4 font-serif">
              {secondaryArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="horizontal" showCategory={false} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
