import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArticleCard } from "@/components/article-card"
import { articles, categories } from "@/lib/data"
import Link from "next/link"

export default function HomePage() {
  const publishedArticles = articles.filter(a => a.status === "published")
  const featuredArticle = publishedArticles[0]
  const secondaryArticles = publishedArticles.slice(1, 3)
  const latestArticles = publishedArticles.slice(3, 7)
  const sidebarArticles = publishedArticles.slice(0, 5)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section - À la Une */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                À la Une
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Featured article */}
              <div className="lg:col-span-2">
                {featuredArticle && (
                  <ArticleCard article={featuredArticle} variant="featured" />
                )}
              </div>
              
              {/* Secondary articles */}
              <div className="space-y-6">
                {secondaryArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Articles Grid */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-8">
                  <h2 className="font-serif text-2xl font-bold">Dernières analyses</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {latestArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
              
              {/* Sidebar */}
              <aside>
                <div className="sticky top-32">
                  <div className="flex items-center gap-2 mb-6">
                    <h3 className="font-semibold text-sm uppercase tracking-wider">
                      Articles récents
                    </h3>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  
                  <div className="border-l-2 border-primary pl-4">
                    {sidebarArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} variant="compact" />
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-muted py-12 border-t border-border">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center gap-2 mb-8">
              <h2 className="font-serif text-2xl font-bold">Explorer par catégorie</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map((category) => {
                const categoryArticles = publishedArticles.filter(
                  a => a.categorySlug === category.slug
                )
                return (
                  <Link
                    key={category.slug}
                    href={`/categorie/${category.slug}`}
                    className="group bg-background p-6 border border-border hover:border-primary transition-colors"
                  >
                    <h3 className="font-serif text-lg font-bold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {category.description}
                    </p>
                    <span className="text-xs text-primary font-semibold mt-3 block">
                      {categoryArticles.length} article{categoryArticles.length !== 1 ? "s" : ""}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
