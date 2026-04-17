import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArticleCard } from "@/components/article-card"
import { articles, categories, getLatestArticles, getArticlesByCategory, getFeaturedArticle } from "@/lib/data"
import Link from "next/link"

export default function HomePage() {
  const featuredArticle = getFeaturedArticle()
  const latestArticles = getLatestArticles(10)
  const secondaryArticles = latestArticles.slice(1, 5)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section - À la Une */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary border-b-2 border-primary pb-2 mb-6 inline-block">
              À la Une
            </h2>
            
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Featured Article */}
              <div className="lg:col-span-7">
                {featuredArticle && (
                  <ArticleCard article={featuredArticle} variant="featured" />
                )}
              </div>

              {/* Secondary Articles */}
              <div className="lg:col-span-5">
                <div className="grid gap-6">
                  {secondaryArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="horizontal" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Main Column - Latest Articles Grid */}
              <div className="lg:col-span-8">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2 mb-6">
                  Derniers articles
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {latestArticles.slice(5, 11).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4">
                <div className="sticky top-32">
                  {/* Trending */}
                  <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-primary pb-2 mb-4">
                      Les plus lus
                    </h3>
                    <div>
                      {latestArticles.slice(0, 5).map((article) => (
                        <ArticleCard key={article.id} article={article} variant="compact" />
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Category Sections */}
        {categories.map((category) => {
          const categoryArticles = getArticlesByCategory(category.slug)
          if (categoryArticles.length === 0) return null
          
          return (
            <CategorySection 
              key={category.slug}
              title={category.name}
              slug={category.slug}
              articles={categoryArticles}
            />
          )
        })}
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
  articles: typeof import("@/lib/data").articles
}) {
  const mainArticle = articles[0]
  const secondaryArticles = articles.slice(1, 4)

  return (
    <section className="py-8 border-t border-border">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground border-b-2 border-primary pb-2">
            {title}
          </h2>
          <Link href={`/categorie/${slug}`} className="text-sm text-primary hover:underline">
            Tous les articles &rarr;
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Article */}
          <div className="lg:col-span-6">
            {mainArticle && (
              <ArticleCard article={mainArticle} showCategory={false} />
            )}
          </div>

          {/* Secondary Articles */}
          <div className="lg:col-span-6">
            <div className="grid gap-4">
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
