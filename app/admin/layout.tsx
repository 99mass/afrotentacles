import Link from "next/link"
import { FileText, PlusCircle, Home } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Administration - AfroTentacles",
  description: "Tableau de bord d'administration AfroTentacles",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-foreground text-background flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-background/10">
          <Link href="/" className="block">
            <span className="font-serif text-xl font-bold">
              Afro<span className="text-primary">Tentacles</span>
            </span>
          </Link>
          <span className="text-xs text-background/60 mt-1 block">Administration</span>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-background/80 hover:text-background hover:bg-background/10 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Tous les articles
              </Link>
            </li>
            <li>
              <Link
                href="/admin/nouveau"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-background/80 hover:text-background hover:bg-background/10 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Nouvel article
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-background/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-background/60 hover:text-background transition-colors"
          >
            <Home className="h-4 w-4" />
            Retour au site
          </Link>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 bg-muted min-h-screen">
        {/* Mobile header */}
        <div className="md:hidden bg-foreground text-background p-4 flex items-center justify-between">
          <Link href="/" className="block">
            <span className="font-serif text-lg font-bold">
              Afro<span className="text-primary">Tentacles</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="p-2 hover:bg-background/10 transition-colors">
              <FileText className="h-5 w-5" />
            </Link>
            <Link href="/admin/nouveau" className="p-2 hover:bg-background/10 transition-colors">
              <PlusCircle className="h-5 w-5" />
            </Link>
          </div>
        </div>
        
        {children}
      </main>
    </div>
  )
}
