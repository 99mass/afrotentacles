import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Search, MapPin } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center">
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          {/* Decorative number */}
          <div className="relative mb-8 select-none">
            <span className="text-[10rem] md:text-[14rem] font-serif font-black leading-none text-muted/30 tracking-tight">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-primary/10 border border-primary/20 rounded-full p-4">
                <MapPin className="h-10 w-10 text-primary" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Page introuvable
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
              La page que vous cherchez n&apos;existe pas ou a été déplacée.
              Explorez nos dernières analyses géopolitiques depuis l&apos;accueil.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8 max-w-xs mx-auto">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              AfroTentacles
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Retour à l&apos;accueil
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/categorie/geopolitique">
                <Search className="h-4 w-4 mr-2" />
                Explorer les articles
              </Link>
            </Button>
          </div>

          {/* Quick links */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Sections populaires
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "Géopolitique", href: "/categorie/geopolitique" },
                { label: "Économie", href: "/categorie/economie" },
                { label: "À propos", href: "/a-propos" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-primary hover:underline underline-offset-4 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
