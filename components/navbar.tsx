"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { regions } from "@/lib/data"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-background sticky top-0 z-50">
      {/* Top bar - Date and search */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-sm">
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-sm">
                <User className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main header with logo */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.jpg" 
                alt="AfroTentacles" 
                width={280} 
                height={100}
                className="h-16 w-auto"
                priority
              />
            </Link>

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
        </div>
      </div>

      {/* Region navigation */}
      <nav className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="hidden lg:flex items-center">
            {regions.map((region) => (
              <Link
                key={region.slug}
                href={`/region/${region.slug}`}
                className="px-4 py-3 text-sm font-medium hover:bg-primary transition-colors whitespace-nowrap"
              >
                {region.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-foreground text-background">
          <nav className="flex flex-col px-4 py-2">
            {regions.map((region) => (
              <Link
                key={region.slug}
                href={`/region/${region.slug}`}
                className="px-3 py-3 text-sm font-medium hover:bg-primary transition-colors border-b border-muted-foreground/20 last:border-0"
                onClick={() => setMobileMenuOpen(false)}
              >
                {region.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
