import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArticleCard } from "@/components/article-card"
import { getArticlesByCategory, getCategoryBySlug, getCategories, getLatestArticles } from "@/lib/actions/articles"
import { createStaticClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // Utilise un client sans cookies — safe au build time
  const supabase = createStaticClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("slug")
  return (categories || []).map((c) => ({ slug: c.slug }))
}


export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  
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
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    notFound()
  }

  const [categoryArticles, latestArticles, categories] = await Promise.all([
    getArticlesByCategory(slug),
    getLatestArticles(1, 5),
    getCategories()
  ])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Category Header */}
        <section className="border-b border-border bg-muted/30 font-serif">
          <div className="mx-auto max-w-7xl px-4 py-8 font-serif">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              {category.name}
            </h1>
            <p className="text-muted-foreground text-lg font-serif">
              {category.description}
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-8 font-serif">
          <div className="mx-auto max-w-7xl px-4 font-serif">
            <div className="grid lg:grid-cols-12 gap-8 font-serif">
              {/* Main Content */}
              <div className="lg:col-span-8 font-serif">
                {categoryArticles.length > 0 ? (
                  <>
                    {/* Featured Article */}
                    <div className="mb-8 pb-8 border-b border-border font-serif">
                      <ArticleCard article={categoryArticles[0]} variant="featured" showCategory={false} />
                    </div>

                    {/* Articles Grid */}
                    <div className="grid md:grid-cols-2 gap-6 font-serif">
                      {categoryArticles.slice(1).map((article) => (
                        <ArticleCard key={article.id} article={article} showCategory={false} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 font-serif">
                    <p className="text-muted-foreground font-serif">Aucun article dans cette catégorie pour le moment.</p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 font-serif">
                <div className="sticky top-32 font-serif">
                  {/* Other Categories */}
                  <div className="mb-8 font-serif">
                    <h3 className="text-sm font-bold uppercase tracking-wider border-b border-border pb-2 mb-4 font-serif">
                      Autres catégories
                    </h3>
                    <nav className="space-y-2 font-serif">
                      {categories
                        .filter(c => c.slug !== slug)
                        .map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/categorie/${cat.slug}`}
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 font-serif"
                          >
                            {cat.name}
                          </Link>
                        ))}
                    </nav>
                  </div>

                  {/* Recent Articles */}
                  <div className="font-serif">
                    <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-primary pb-2 mb-4 font-serif">
                      À la une globale
                    </h3>
                    <div className="font-serif">
                      {latestArticles.slice(0, 3).map((article) => (
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
