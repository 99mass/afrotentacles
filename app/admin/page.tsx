import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Eye,
  TrendingUp,
  PlusCircle,
  BarChart3,
  Clock,
  Image as ImageIcon,
  Video,
  FileIcon,
  ArrowUpRight,
} from "lucide-react"
import { getAllArticlesAdmin } from "@/lib/actions/articles"
import { getCategories } from "@/lib/actions/categories"
import DownPage from "../down/page"

export default async function AdminDashboard() {
  return DownPage();
  const articles = await getAllArticlesAdmin()
  const categories = await getCategories()

  const now = new Date()
  const publishedArticles = articles.filter((a) => a.status === "published" && (!a.published_date || new Date(a.published_date) <= now))
  const scheduledArticles = articles.filter((a) => a.status === "published" && a.published_date && new Date(a.published_date) > now)
  const draftArticles = articles.filter((a) => a.status === "draft")
  const recentArticles = [...articles].slice(0, 5) // already sorted by created_at

  const topArticles = [...articles]
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 5)

  const totalViews = articles.reduce((acc, a) => acc + (a.view_count || 0), 0)

  return (
    <div className="p-6 lg:p-8 lg:pt-8 pt-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground mt-1">
          Bienvenue dans votre espace d&apos;administration
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {publishedArticles.length} publiés, {scheduledArticles.length} planifiés, {draftArticles.length} brouillons
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Vues totales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% ce mois
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Catégories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              thématiques actives
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Médias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {articles.reduce((acc, a) => acc + (a.media?.length || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              images, vidéos, PDFs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-serif">Articles récents</CardTitle>
              <CardDescription>Les derniers articles publiés</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/articles">
                Voir tout
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/editer/${article.id}`}
                      className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(article.date)}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          article.status === "published"
                            ? article.published_date && new Date(article.published_date) > new Date()
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {article.status === "published"
                          ? article.published_date && new Date(article.published_date) > new Date()
                            ? "Planifié"
                            : "Publié"
                          : "Brouillon"}
                      </span>
                    </div>
                  </div>
                  {article.media && article.media.length > 0 && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {article.media.some((m) => m.type === "image") && (
                        <ImageIcon className="h-4 w-4" />
                      )}
                      {article.media.some((m) => m.type === "video") && (
                        <Video className="h-4 w-4" />
                      )}
                      {article.media.some((m) => m.type === "pdf") && (
                        <FileIcon className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Articles by Views */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-serif">Articles populaires</CardTitle>
              <CardDescription>Les plus vus ce mois-ci</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/statistiques">
                Statistiques
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/article/${article.slug}`}
                      target="_blank"
                      className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
                    >
                      {article.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {article.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">
                      {(article.view_count || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">vues</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Répartition par catégorie</CardTitle>
            <CardDescription>Nombre d&apos;articles par thématique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.map((category) => {
                const count = articles.filter(
                  (a) => a.categorySlug === category.slug
                ).length
                const percentage = Math.round((count / articles.length) * 100)
                return (
                  <div key={category.slug}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{category.name}</span>
                      <span className="text-muted-foreground">{count} articles</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Actions rapides</CardTitle>
            <CardDescription>Raccourcis pour les tâches courantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild className="h-auto py-6 flex-col gap-2">
                <Link href="/admin/nouveau">
                  <PlusCircle className="h-6 w-6" />
                  <span>Nouvel article</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-6 flex-col gap-2">
                <Link href="/admin/articles">
                  <FileText className="h-6 w-6" />
                  <span>Gérer articles</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-6 flex-col gap-2">
                <Link href="/admin/statistiques">
                  <BarChart3 className="h-6 w-6" />
                  <span>Voir stats</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-6 flex-col gap-2">
                <Link href="/" target="_blank">
                  <Eye className="h-6 w-6" />
                  <span>Voir le site</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
