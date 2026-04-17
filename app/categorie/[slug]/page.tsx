import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArticleCard } from "@/components/article-card"
import { getArticlesByCategory, getCategoryBySlug, categories } from "@/lib/data"
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Category Header */}
        <section className="border-b border-border bg-muted">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{category.name}</span>
            </nav>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-balance">
              {category.name}
            </h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
              {category.description}
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            {categoryArticles.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-8">
                  {categoryArticles.length} article{categoryArticles.length !== 1 ? "s" : ""} dans cette catégorie
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  Aucun article dans cette catégorie pour le moment.
                </p>
                <Link 
                  href="/" 
                  className="inline-block mt-4 text-primary font-medium hover:underline"
                >
                  Retour à l&apos;accueil
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
