import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin-sidebar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Administration - AfroTentacles",
  description: "Tableau de bord d'administration AfroTentacles",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/admin/login")
  }

  // Check if user is admin
  const isAdmin = user.user_metadata?.is_admin === true
  if (!isAdmin) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen flex bg-muted">
      <AdminSidebar user={user} />
      <main className="flex-1 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  )
}
