import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getCategories } from "@/lib/actions/articles"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "À propos - AfroTentacles",
  description: "AfroTentacles - Comprendre les équilibres africains. Blog analytique des dynamiques africaines à travers une approche croisée entre économie, géopolitique et réseaux d'influence.",
}

export default async function AboutPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 font-serif">
        {/* Header */}
        <section className="border-b border-border bg-foreground text-background font-serif">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center font-serif">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-balance">
              À propos d&apos;AfroTentacles
            </h1>
            <p className="text-lg text-background/70 mt-4 max-w-2xl mx-auto font-serif">
              Comprendre les équilibres africains
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 font-serif">
          <div className="mx-auto max-w-3xl px-4 font-serif">
            <div className="prose prose-lg max-w-none font-serif">
              <p className="text-xl leading-relaxed text-foreground">
                <strong className="font-serif">AfroTentacles</strong> est une plateforme d&apos;information et d&apos;analyse qui propose une lecture approfondie des dynamiques africaines à travers une approche croisée entre économie, géopolitique et réseaux d&apos;influence.
              </p>
              
              <h2 className="font-serif text-2xl font-bold mt-12 mb-4">Notre mission</h2>
              <p className="leading-relaxed text-foreground">
                Dans un contexte mondial où l&apos;Afrique occupe une place de plus en plus centrale dans les équilibres géostratégiques, il devient essentiel de disposer d&apos;outils d&apos;analyse capables de décrypter les dynamiques complexes qui façonnent le continent.
              </p>
              <p className="leading-relaxed text-foreground">
                AfroTentacles ambitionne de combler ce besoin en offrant des analyses approfondies, documentées et accessibles sur les enjeux économiques, politiques et stratégiques de l&apos;Afrique contemporaine.
              </p>
              
              <h2 className="font-serif text-2xl font-bold mt-12 mb-4">Notre approche éditoriale</h2>
              <p className="leading-relaxed text-foreground">
                Inspirés par les standards de l&apos;intelligence économique, nous privilégions une approche rigoureuse qui combine :
              </p>
              <ul className="space-y-2 text-foreground">
                <li><strong>L&apos;analyse géoéconomique</strong> pour comprendre les flux financiers et les stratégies économiques</li>
                <li><strong>Le décryptage géopolitique</strong> pour identifier les rapports de force et les alliances</li>
                <li><strong>La veille sectorielle</strong> sur l&apos;énergie, les ressources et les infrastructures</li>
                <li><strong>Le suivi institutionnel</strong> des politiques publiques et des réformes</li>
              </ul>
              
              <h2 className="font-serif text-2xl font-bold mt-12 mb-4">Nos thématiques</h2>
            </div>
            
            {/* Categories */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categorie/${category.slug}`}
                  className="group p-6 border border-border hover:border-primary transition-colors bg-background"
                >
                  <h3 className="font-serif text-lg font-bold group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
            
            <div className="prose prose-lg max-w-none mt-12">
              <h2 className="font-serif text-2xl font-bold mt-12 mb-4">Nous contacter</h2>
              <p className="leading-relaxed text-foreground">
                Pour toute question, suggestion ou proposition de collaboration, n&apos;hésitez pas à nous contacter via nos réseaux sociaux ou par email.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
