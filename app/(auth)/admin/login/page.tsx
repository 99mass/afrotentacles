"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [setupDone, setSetupDone] = useState(false)
  const router = useRouter()

  // Setup admin on first load
  useEffect(() => {
    const setupAdmin = async () => {
      try {
        await fetch("/api/admin/setup", { method: "POST" })
        setSetupDone(true)
      } catch {
        setSetupDone(true)
      }
    }
    setupAdmin()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError("Email ou mot de passe incorrect")
      setLoading(false)
      return
    }

    // Check if user is admin
    const isAdmin = data.user?.user_metadata?.is_admin === true
    if (!isAdmin) {
      await supabase.auth.signOut()
      setError("Accès réservé aux administrateurs")
      setLoading(false)
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Login Card */}
        <div className="bg-background rounded-lg shadow-lg border border-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Espace Administration
            </h1>
            <p className="text-muted-foreground mt-2">
              Connectez-vous pour accéder au tableau de bord
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Adresse email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@afrotentacles.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading || !setupDone}
            >
              {!setupDone ? "Initialisation..." : loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          {/* Default credentials hint */}
          <div className="mt-6 p-4 bg-muted rounded-md border border-border">
            <p className="text-xs text-muted-foreground text-center mb-2">
              Identifiants par défaut :
            </p>
            <p className="text-xs text-foreground text-center font-mono">
              admin@afrotentacles.com
            </p>
            <p className="text-xs text-foreground text-center font-mono">
              afrotacles@123
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          AfroTentacles - Comprendre les équilibres africains
        </p>
      </div>
    </div>
  )
}
