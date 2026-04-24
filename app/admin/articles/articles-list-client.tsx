"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Pencil,
  Trash2,
  Eye,
  PlusCircle,
  Search,
  Image as ImageIcon,
  Video,
  FileIcon,
  MoreVertical,
  Loader2,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteArticle } from "@/lib/actions/articles"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function ArticlesListClient({ initialArticles, categories }: { initialArticles: any[], categories: any[] }) {
  const [articles, setArticles] = useState(initialArticles)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  const filteredArticles = articles.filter((article) => {
    if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (filterCategory && article.categorySlug !== filterCategory) return false
    if (filterStatus && article.status !== filterStatus) return false
    return true
  })

  const handleDelete = async (id: string, title: string) => {
    setIsDeleting(id)
    try {
      await deleteArticle(id)
      setArticles(articles.filter((a) => a.id !== id))
      toast.success("Article supprimé", {
        description: `"${title}" a été supprimé définitivement.`,
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to delete article", error)
      toast.error("Erreur lors de la suppression", {
        description: "Impossible de supprimer cet article. Veuillez réessayer.",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="p-6 lg:p-8 lg:pt-8 pt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Articles</h1>
          <p className="text-muted-foreground mt-1">
            Gérez tous vos articles
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/nouveau">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouvel article
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Tous les statuts</option>
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} trouvé{filteredArticles.length !== 1 ? "s" : ""}
      </p>

      {/* Articles Grid */}
      <div className="grid gap-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0 bg-muted">
                {article.image && (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-primary">
                        {article.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          article.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {article.status === "published" ? "Publié" : "Brouillon"}
                      </span>
                      {article.is_featured && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          À la une
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-lg mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Actions dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0" disabled={isDeleting === article.id}>
                        {isDeleting === article.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreVertical className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/article/${article.slug}`} target="_blank">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/editer/${article.id}`}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer cet article ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. L&apos;article sera définitivement supprimé de la base de données.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(article.id, article.title)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span>{formatDate(article.date)}</span>
                    {article.media && article.media.length > 0 && (
                      <div className="flex items-center gap-2">
                        {article.media.some((m: any) => m.type === "image") && (
                          <span className="flex items-center gap-1">
                            <ImageIcon className="h-4 w-4" />
                            {article.media.filter((m: any) => m.type === "image").length}
                          </span>
                        )}
                        {article.media.some((m: any) => m.type === "video") && (
                          <span className="flex items-center gap-1">
                            <Video className="h-4 w-4" />
                            {article.media.filter((m: any) => m.type === "video").length}
                          </span>
                        )}
                        {article.media.some((m: any) => m.type === "pdf") && (
                          <span className="flex items-center gap-1">
                            <FileIcon className="h-4 w-4" />
                            {article.media.filter((m: any) => m.type === "pdf").length}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {(article.view_count || 0).toLocaleString()} vues
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Aucun article trouvé.</p>
        </Card>
      )}
    </div>
  )
}
