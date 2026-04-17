import Link from "next/link"
import { Twitter, Linkedin, Facebook, Send } from "lucide-react"

const categories = [
  { name: "Géoéconomie", slug: "geoeconomie" },
  { name: "Géopolitique", slug: "geopolitique" },
  { name: "Ressources & Énergie", slug: "ressources-energie" },
  { name: "Flux & Corridors", slug: "flux-corridors" },
  { name: "Institutions", slug: "institutions" },
  { name: "Influences", slug: "influences" },
  { name: "Données & Insights", slug: "donnees-insights" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-tight">
                Afro<span className="text-primary">Tentacles</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-background/70 leading-relaxed">
              Blog analytique des dynamiques africaines à travers une approche croisée entre économie, géopolitique et réseaux d&apos;influence.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4 mt-6">
              <Link href="https://twitter.com" target="_blank" aria-label="Twitter" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn" className="hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://facebook.com" target="_blank" aria-label="Facebook" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://telegram.org" target="_blank" aria-label="Telegram" className="hover:text-primary transition-colors">
                <Send className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Catégories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categorie/${category.slug}`}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-background/70 hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-sm text-background/70 hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sm text-background/70 hover:text-primary transition-colors">
                  Administration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} AfroTentacles. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
