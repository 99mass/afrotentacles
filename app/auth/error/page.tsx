import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-6">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Erreur d&apos;authentification
        </h1>
        <p className="text-muted-foreground mb-6">
          Une erreur est survenue lors de la connexion. Veuillez réessayer.
        </p>
        <Button asChild>
          <Link href="/admin/login">Retour à la connexion</Link>
        </Button>
      </div>
    </div>
  )
}
