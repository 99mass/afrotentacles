import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArticleCard } from "@/components/article-card"
import { getArticlesByCategory, getCategoryBySlug, categories, getLatestArticles } from "@/lib/data"
import { notFound } from "next/navigation"
import Link from "next/link"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  
  if (!category) {
    return { title: "Catégorie non trouvée" }
  }

  return {
    title: `${category.name} - AfroTentacles`,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  
  if (!category) {
    notFound()
  }

  const categoryArticles = getArticlesByCategory(slug)
  const latestArticles = getLatestArticles(5)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Category Header */}
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              {category.name}
            </h1>
            <p className="text-muted-foreground text-lg">
              {category.description}
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-8">
                {categoryArticles.length > 0 ? (
                  <>
                    {/* Featured Article */}
                    <div className="mb-8 pb-8 border-b border-border">
                      <ArticleCard article={categoryArticles[0]} variant="featured" showCategory={false} />
                    </div>

                    {/* Articles Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {categoryArticles.slice(1).map((article) => (
                        <ArticleCard key={article.id} article={article} showCategory={false} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Aucun article dans cette catégorie pour le moment.</p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4">
                <div className="sticky top-32">
                  {/* Other Categories */}
                  <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider border-b border-border pb-2 mb-4">
                      Autres catégories
                    </h3>
                    <nav className="space-y-2">
                      {categories
                        .filter(c => c.slug !== slug)
                        .map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/categorie/${cat.slug}`}
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                          >
                            {cat.name}
                          </Link>
                        ))}
                    </nav>
                  </div>

                  {/* Recent Articles */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-primary pb-2 mb-4">
                      Articles récents
                    </h3>
                    <div>
                      {latestArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} variant="compact" />
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
