"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu, X, Search, Twitter, Linkedin, Facebook, Instagram, Youtube, Github, Send, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo, LogoHorizontal } from "@/components/logo"
import { SearchDialog } from "@/components/search-dialog"

interface NavbarClientProps {
  categories: any[]
  socialLinks?: any[]
}

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

export function NavbarClient({ categories, socialLinks = [] }: NavbarClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(prev => {
        // Hysteresis: hide at 120px, only show again when back near top (< 20px)
        // This prevents the oscillation loop caused by header height changes
        if (!prev && scrollY > 120) return true
        if (prev && scrollY < 20) return false
        return prev
      })
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        hamburgerRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [mobileMenuOpen])

  // Close menu on window resize (when crossing from mobile to desktop breakpoint)
  useEffect(() => {
    const handleResize = () => {
      // Close menu if window width goes above lg breakpoint (1024px)
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <header className="sticky top-0 z-50 flex flex-col">
      {/* Top red accent bar */}
      <div className="h-1 bg-primary relative z-10 shrink-0" />
      
        {/* Top bar with social icons - dark background */}
        <div className="bg-foreground text-background shrink-0 relative z-30">
          <div className="mx-auto max-w-7xl px-4 py-2">
            
            {/* Desktop Top Bar */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xs text-background">Suivez-nous :</span>
                <div className="flex items-center gap-3">
                  {socialLinks.map((link) => {
                    const IconComponent = AVAILABLE_ICONS[link.icon_name] || LinkIcon
                    return (
                      <a 
                        key={link.id} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-background hover:text-primary transition-colors"
                        aria-label={link.platform}
                      >
                        <IconComponent className="h-4 w-4" />
                      </a>
                    )
                  })}
                  {socialLinks.length === 0 && (
                    <span className="text-xs text-background/50">Aucun réseau configuré</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/a-propos" className="text-xs text-background hover:text-primary transition-colors">
                  À propos
                </Link>
                {/* <Link href="/admin" className="text-xs text-background/70 hover:text-primary transition-colors">
                  Administration
                </Link> */}
              </div>
            </div>

            {/* Mobile Top Bar */}
            <div className="flex lg:hidden items-center justify-between relative h-8">
              {/* Left: Search */}
              <div className="flex-1 flex justify-start">
                <SearchDialog mode="mobile" />
              </div>

              {/* Center: Logo */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                <Link href="/">
                  <LogoHorizontal variant="white" className="scale-75 origin-center" showdescription={false} />
                </Link>
              </div>

              {/* Right: Hamburger */}
              <div className="flex-1 flex justify-end">
                <Button
                  ref={hamburgerRef}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-background hover:text-primary hover:bg-transparent relative z-30"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>

          </div>
        </div>

        {/* Main header with logo - white/light background (Desktop Only) */}
        <div 
          className={`hidden lg:block bg-background border-border shrink-0 transition-all duration-300 ease-in-out overflow-hidden relative z-0 ${
            isScrolled ? "max-h-0 border-b-0 opacity-0" : "max-h-[150px] border-b opacity-100"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <Logo />
              </Link>

              {/* Search */}
              <div className="flex items-center gap-3">
                <SearchDialog />
              </div>
            </div>
          </div>
        </div>

      {/* Category navigation - dark background like Africa Intelligence */}
      <nav className="bg-foreground relative z-10 shadow-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="hidden lg:flex items-center justify-center">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categorie/${category.slug}`}
                className="px-4 py-3 text-sm font-medium text-background hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef} className="lg:hidden bg-foreground absolute w-full z-20">
          <nav className="flex flex-col px-4 py-2 border-t border-background/10">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categorie/${category.slug}`}
                className="px-3 py-3 text-sm font-medium text-background hover:text-primary transition-colors border-b border-background/10 last:border-0"
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
