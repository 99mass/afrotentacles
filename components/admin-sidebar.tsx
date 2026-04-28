"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Tags,
  Users,
} from "lucide-react"
import { useState } from "react"
import type { User } from "@supabase/supabase-js"

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/nouveau", label: "Nouvel article", icon: PlusCircle },
  { href: "/admin/categories", label: "Catégories", icon: Tags },
  { href: "/admin/auteurs", label: "Auteurs", icon: Users },
  { href: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
]

interface AdminSidebarProps {
  user: User
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(true)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  const SidebarContent = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
    <>
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 relative h-20">
        {!isCollapsed ? (
          <div>
            <Link href="/admin" className="block">
              <Logo variant="white" size="sm" />
            </Link>
            <span className="text-xs text-white/50 mt-1 block uppercase tracking-wider">
              Administration
            </span>
          </div>
        ) : (
          <div className="flex-1 flex justify-center">
             <div className="h-8 w-8 bg-primary rounded flex items-center justify-center font-serif font-bold text-white">AT</div>
          </div>
        )}

        {/* Desktop Toggle Button */}
        <button
          onClick={() => setDesktopOpen(!desktopOpen)}
          className="hidden lg:flex absolute -right-3 top-7 h-6 w-6 bg-primary text-white rounded-full items-center justify-center shadow-md hover:bg-primary/90 z-50 transition-transform"
        >
          {desktopOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                isActive
                  ? "bg-primary text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10",
                isCollapsed && "justify-center px-0"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-white/10">
        {!isCollapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-white truncate">
              {user.email}
            </p>
            <p className="text-xs text-white/50">Administrateur</p>
          </div>
        )}
        
        <Link
          href="/"
          target="_blank"
          title={isCollapsed ? "Voir le site" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 mb-1 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all",
            isCollapsed && "justify-center px-0"
          )}
        >
          <Home className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="truncate">Voir le site</span>}
        </Link>
        
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Déconnexion" : undefined}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="truncate">Déconnexion</span>}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar - Fixed position */}
      <aside className={cn(
        "bg-foreground flex-shrink-0 hidden lg:flex flex-col fixed left-0 top-0 bottom-0 h-screen transition-all duration-300 z-40 overflow-visible",
        desktopOpen ? "w-64" : "w-16"
      )}>
        <SidebarContent isCollapsed={!desktopOpen} />
      </aside>
      {/* Desktop spacer for fixed sidebar */}
      <div className={cn(
        "hidden lg:block flex-shrink-0 transition-all duration-300",
        desktopOpen ? "w-64" : "w-16"
      )} />

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-foreground text-white p-4 flex items-center justify-between">
        <Link href="/admin">
          <Logo variant="white" size="sm" />
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute top-0 left-0 bottom-0 w-64 bg-foreground flex flex-col pt-16">
            <SidebarContent isCollapsed={false} />
          </aside>
        </div>
      )}

      {/* Mobile spacer */}
      <div className="lg:hidden h-16" />
    </>
  )
}
