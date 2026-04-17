import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArticleCard } from "@/components/article-card"
import { articles, regions, getSpotlightArticles, getBriefArticles, getLatestArticles } from "@/lib/data"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default function HomePage() {
  const publishedArticles = articles.filter(a => a.status === "published")
  const spotlightArticles = getSpotlightArticles()
  const latestArticles = getLatestArticles(8)
  const todayArticles = publishedArticles.filter(a => a.date === "2026-04-17")

  // Get articles by region for each section
  const centralAfricaArticles = publishedArticles.filter(a => a.regionSlug === "afrique-centrale").slice(0, 6)
  const westAfricaArticles = publishedArticles.filter(a => a.regionSlug === "afrique-ouest").slice(0, 6)
  const eastAfricaArticles = publishedArticles.filter(a => a.regionSlug === "afrique-est").slice(0, 4)
  const southernAfricaArticles = publishedArticles.filter(a => a.regionSlug === "afrique-australe").slice(0, 4)
  const northAfricaArticles = publishedArticles.filter(a => a.regionSlug === "afrique-nord").slice(0, 4)
  
  const briefArticles = getBriefArticles()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Today's Edition Header */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <span className="text-sm font-semibold whitespace-nowrap">
                {formatDate("2026-04-17")}
              </span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {["17 Avril", "16 Avril", "15 Avril", "14 Avril", "13 Avril"].map((date, i) => (
                  <button 
                    key={date} 
                    className={`whitespace-nowrap px-2 py-1 hover:text-primary transition-colors ${i === 0 ? "text-foreground font-medium" : ""}`}
                  >
                    {date}
                  </button>
                ))}
                <Link href="/archives" className="text-primary hover:underline whitespace-nowrap">
                  Archives
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Main Column */}
              <div className="lg:col-span-8">
                {/* Spotlight Article */}
                {spotlightArticles[0] && (
                  <div className="mb-8 pb-8 border-b border-border">
                    <ArticleCard article={spotlightArticles[0]} variant="spotlight" />
                  </div>
                )}

                {/* Today's Articles Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {todayArticles.slice(1, 5).map((article) => (
                    <ArticleCard key={article.id} article={article} variant="horizontal" />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4">
                <div className="sticky top-32">
                  {/* Most Read */}
                  <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-primary pb-2 mb-4">
                      Les plus lus
                    </h3>
                    <div>
                      {latestArticles.slice(0, 5).map((article) => (
                        <ArticleCard key={article.id} article={article} variant="sidebar" />
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Regional Sections */}
        {/* Afrique Centrale */}
        <RegionSection 
          title="Afrique Centrale"
          slug="afrique-centrale"
          articles={centralAfricaArticles}
          briefArticles={briefArticles.filter(a => a.regionSlug === "afrique-centrale")}
        />

        {/* Afrique de l'Ouest */}
        <RegionSection 
          title="Afrique de l'Ouest"
          slug="afrique-ouest"
          articles={westAfricaArticles}
          briefArticles={briefArticles.filter(a => a.regionSlug === "afrique-ouest")}
        />

        {/* Afrique de l'Est */}
        <RegionSection 
          title="Afrique de l'Est et Corne"
          slug="afrique-est"
          articles={eastAfricaArticles}
          briefArticles={[]}
        />

        {/* Afrique australe */}
        <RegionSection 
          title="Afrique australe et îles"
          slug="afrique-australe"
          articles={southernAfricaArticles}
          briefArticles={[]}
        />

        {/* Afrique du Nord */}
        <RegionSection 
          title="Afrique du Nord"
          slug="afrique-nord"
          articles={northAfricaArticles}
          briefArticles={[]}
        />
      </main>
      
      <Footer />
    </div>
  )
}

function RegionSection({ 
  title, 
  slug, 
  articles, 
  briefArticles 
}: { 
  title: string
  slug: string
  articles: typeof import("@/lib/data").articles
  briefArticles: typeof import("@/lib/data").articles
}) {
  if (articles.length === 0) return null

  const mainArticles = articles.filter(a => !a.isBrief).slice(0, 3)
  const sideArticles = articles.filter(a => !a.isBrief).slice(3, 6)

  return (
    <section className="py-8 border-t border-border">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">{title}</h2>
          <Link href={`/region/${slug}`} className="text-sm text-primary hover:underline">
            Tous les articles {title} &rarr;
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Articles */}
          <div className="lg:col-span-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* First article larger */}
              {mainArticles[0] && (
                <div className="md:col-span-2">
                  <ArticleCard article={mainArticles[0]} variant="horizontal" />
                </div>
              )}
              {/* Other articles */}
              {mainArticles.slice(1).map((article) => (
                <ArticleCard key={article.id} article={article} variant="horizontal" />
              ))}
            </div>

            {/* Side Articles below on mobile */}
            {sideArticles.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border grid md:grid-cols-3 gap-4">
                {sideArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="sidebar" showImage={false} />
                ))}
              </div>
            )}
          </div>

          {/* Brief Section */}
          {briefArticles.length > 0 && (
            <aside className="lg:col-span-4">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-border pb-2 mb-2">
                En bref
              </h3>
              <div>
                {briefArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="brief" />
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  )
}
