"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Twitter, Linkedin, Facebook, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  { name: "Géoéconomie", slug: "geoeconomie" },
  { name: "Géopolitique", slug: "geopolitique" },
  { name: "Ressources & Énergie", slug: "ressources-energie" },
  { name: "Flux & Corridors", slug: "flux-corridors" },
  { name: "Institutions", slug: "institutions" },
  { name: "Influences", slug: "influences" },
  { name: "Données & Insights", slug: "donnees-insights" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      {/* Top bar with social links */}
      <div className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="https://twitter.com" target="_blank" aria-label="Twitter" className="hover:text-primary transition-colors">
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn" className="hover:text-primary transition-colors">
              <Linkedin className="h-4 w-4" />
            </Link>
            <Link href="https://facebook.com" target="_blank" aria-label="Facebook" className="hover:text-primary transition-colors">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="https://telegram.org" target="_blank" aria-label="Telegram" className="hover:text-primary transition-colors">
              <Send className="h-4 w-4" />
            </Link>
          </div>
          <span className="text-xs uppercase tracking-wider">Analyse et Intelligence Africaine</span>
        </div>
      </div>

      {/* Main navbar */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight">
              Afro<span className="text-primary">Tentacles</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/a-propos" className="text-sm font-medium hover:text-primary transition-colors">
              À propos
            </Link>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Category navigation */}
        <nav className="hidden lg:flex items-center gap-1 pb-3 border-t border-border pt-3 overflow-x-auto">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categorie/${category.slug}`}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors whitespace-nowrap"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border">
          <nav className="flex flex-col px-4 py-4 gap-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categorie/${category.slug}`}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-2">
              <Link
                href="/a-propos"
                className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors block"
                onClick={() => setMobileMenuOpen(false)}
              >
                À propos
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
