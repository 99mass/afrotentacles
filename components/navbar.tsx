"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Search, Twitter, Linkedin, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { categories } from "@/lib/data"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-background sticky top-0 z-50">
      {/* Top bar with social icons */}
      <div className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xs hover:text-primary transition-colors">
              Administration
            </Link>
          </div>
        </div>
      </div>

      {/* Main header with logo */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.jpg" 
                alt="AfroTentacles - Comprendre les équilibres africains" 
                width={300} 
                height={120}
                className="h-20 w-auto"
                priority
              />
            </Link>

            {/* Search and mobile menu */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
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
      </div>

      {/* Category navigation */}
      <nav className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4">
          <div className="hidden lg:flex items-center justify-center">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categorie/${category.slug}`}
                className="px-4 py-3 text-sm font-medium text-foreground hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-background">
          <nav className="flex flex-col px-4 py-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categorie/${category.slug}`}
                className="px-3 py-3 text-sm font-medium hover:text-primary transition-colors border-b border-border last:border-0"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
