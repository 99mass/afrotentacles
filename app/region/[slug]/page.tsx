import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArticleCard } from "@/components/article-card"
import { getArticlesByRegion, getRegionBySlug, regions, getBriefArticles } from "@/lib/data"
import { notFound } from "next/navigation"
import Link from "next/link"

interface RegionPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return regions.map((region) => ({
    slug: region.slug,
  }))
}

export async function generateMetadata({ params }: RegionPageProps) {
  const { slug } = await params
  const region = getRegionBySlug(slug)
  
  if (!region) {
    return { title: "Région non trouvée" }
  }

  return {
    title: `${region.name} - AfroTentacles`,
    description: region.description,
  }
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { slug } = await params
  const region = getRegionBySlug(slug)

  if (!region) {
    notFound()
  }

  const articles = getArticlesByRegion(slug)
  const briefArticles = getBriefArticles(slug)
  const mainArticles = articles.filter(a => !a.isBrief)
  const spotlightArticle = mainArticles.find(a => a.isSpotlight) || mainArticles[0]
  const otherArticles = mainArticles.filter(a => a.id !== spotlightArticle?.id)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Region Header */}
        <header className="border-b border-border bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold">
              {region.name}
            </h1>
            <p className="text-background/70 mt-2 max-w-2xl">
              {region.description}
            </p>
          </div>
        </header>

        {/* Navigation */}
        <nav className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center gap-1 py-3 overflow-x-auto">
              {regions.map((r) => (
                <Link
                  key={r.slug}
                  href={`/region/${r.slug}`}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    r.slug === slug 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Articles */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4">
            {articles.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Aucun article dans cette région pour le moment.</p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-8">
                {/* Main content */}
                <div className="lg:col-span-8">
                  {/* Spotlight */}
                  {spotlightArticle && (
                    <div className="mb-8 pb-8 border-b border-border">
                      <ArticleCard article={spotlightArticle} variant="spotlight" />
                    </div>
                  )}

                  {/* Other articles */}
                  <div className="space-y-6">
                    {otherArticles.map((article) => (
                      <div key={article.id} className="pb-6 border-b border-border last:border-0">
                        <ArticleCard article={article} variant="horizontal" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-4">
                  {/* Brief section */}
                  {briefArticles.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-primary pb-2 mb-4">
                        En bref
                      </h3>
                      <div>
                        {briefArticles.map((article) => (
                          <ArticleCard key={article.id} article={article} variant="brief" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other regions */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider border-b border-border pb-2 mb-4">
                      Autres régions
                    </h3>
                    <div className="space-y-2">
                      {regions.filter(r => r.slug !== slug).map((r) => (
                        <Link
                          key={r.slug}
                          href={`/region/${r.slug}`}
                          className="block py-2 px-3 text-sm hover:bg-muted hover:text-primary transition-colors"
                        >
                          {r.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
