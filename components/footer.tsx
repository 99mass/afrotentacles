import Link from "next/link"
import { Twitter, Linkedin, Facebook, Instagram, Youtube, Github, Send, Link as LinkIcon } from "lucide-react"
import { getCategories } from "@/lib/actions/articles"
import { getActiveSocialLinks } from "@/lib/actions/settings"
import { LogoHorizontal } from "@/components/logo"

const AVAILABLE_ICONS: Record<string, any> = {
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  Github,
  Send,
  Link: LinkIcon
}

export async function Footer() {
  const [categories, socialLinks] = await Promise.all([
    getCategories(),
    getActiveSocialLinks()
  ])
  return (
    <footer className="bg-foreground text-background">
      {/* Top accent line */}
      <div className="h-1 bg-primary" />
      
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <LogoHorizontal variant="white" />
            </Link>
            <p className="mt-6 text-sm text-background/60 leading-relaxed max-w-md">
              Blog analytique des dynamiques africaines à travers une approche croisée entre économie, géopolitique et réseaux d&apos;influence. Décryptage des enjeux stratégiques du continent.
            </p>
            {/* Social links - dynamic */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((link) => {
                const IconComponent = AVAILABLE_ICONS[link.icon_name] || LinkIcon
                return (
                  <Link
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    aria-label={link.platform}
                    className="text-background/60 hover:text-primary transition-colors"
                  >
                    <IconComponent className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-background">Catégories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categorie/${category.slug}`}
                    className="text-sm text-background/60 hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-background">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-background/60 hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-sm text-background/60 hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sm text-background/60 hover:text-primary transition-colors">
                  Administration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-sm text-background/40">
            © {new Date().getFullYear()} AfroTentacles. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
