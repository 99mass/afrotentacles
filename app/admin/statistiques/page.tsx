import { getSiteStats } from "@/lib/actions/stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Eye,
  TrendingUp,
  TrendingDown,
  FileText,
  BarChart3,
  ArrowUpRight,
  CheckCircle,
  Clock,
} from "lucide-react"

// Format number with spaces as thousands separator
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0")
}

export default async function StatistiquesPage() {
  const stats = await getSiteStats()

  const {
    totalViews,
    totalViewsLastMonth,
    totalArticles,
    publishedArticles,
    draftArticles,
    topArticles,
    categoryStats,
    dailyStats,
  } = stats

  const viewsGrowth =
    totalViewsLastMonth > 0
      ? (((totalViews - totalViewsLastMonth) / totalViewsLastMonth) * 100).toFixed(1)
      : null

  const maxDayViews = Math.max(...dailyStats.map((d) => d.views), 1)
  const totalCategoryViews = categoryStats.reduce((s, c) => s + c.views, 0) || 1

  return (
    <div className="p-6 lg:p-8 lg:pt-8 pt-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Statistiques</h1>
        <p className="text-muted-foreground mt-1">
          Données réelles — performances de votre contenu
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total views */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Vues totales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(totalViews)}</div>
            {viewsGrowth !== null ? (
              <p
                className={`text-xs mt-1 flex items-center gap-1 ${
                  Number(viewsGrowth) >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {Number(viewsGrowth) >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {viewsGrowth}% vs mois dernier
              </p>
            ) : (
              <p className="text-xs mt-1 text-muted-foreground">Aucune donnée comparative</p>
            )}
          </CardContent>
        </Card>

        {/* Last month */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Mois dernier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(totalViewsLastMonth)}</div>
            <p className="text-xs text-muted-foreground mt-1">vues le mois précédent</p>
          </CardContent>
        </Card>

        {/* Published articles */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Publiés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{publishedArticles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              sur {totalArticles} articles
            </p>
          </CardContent>
        </Card>

        {/* Drafts */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Brouillons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{draftArticles}</div>
            <p className="text-xs text-muted-foreground mt-1">en attente de publication</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Vues — 7 derniers jours</CardTitle>
            <CardDescription>Évolution quotidienne des visites</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyStats.every((d) => d.views === 0) ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                Aucune vue enregistrée sur cette période
              </div>
            ) : (
              <div className="flex items-end justify-between gap-2 h-48">
                {dailyStats.map((day) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center justify-end h-40">
                      <span className="text-xs font-medium mb-1">
                        {day.views > 0 ? day.views : ""}
                      </span>
                      <div
                        className="w-full bg-primary rounded-t transition-all"
                        style={{ height: `${(day.views / maxDayViews) * 100}%`, minHeight: day.views > 0 ? "4px" : "0px" }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{day.day}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Views by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Vues par catégorie</CardTitle>
            <CardDescription>Répartition des visites par thématique</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryStats.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune catégorie trouvée</p>
            ) : (
              <div className="space-y-4">
                {categoryStats.map((category) => {
                  const percentage = Math.round((category.views / totalCategoryViews) * 100)
                  return (
                    <div key={category.slug}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{category.name}</span>
                        <span className="font-medium">{formatNumber(category.views)} vues</span>
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Articles les plus consultés
          </CardTitle>
          <CardDescription>Classement des articles par nombre de vues</CardDescription>
        </CardHeader>
        <CardContent>
          {topArticles.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              Aucun article ou aucune vue enregistrée pour l&apos;instant.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      #
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Article
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                      Catégorie
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Total
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                      7 jours
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                      Aujourd&apos;hui
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topArticles.map((article, index) => (
                    <tr key={article.id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            index < 3
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium line-clamp-1">{article.title}</span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">{article.category}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold">{formatNumber(article.views)}</span>
                      </td>
                      <td className="py-3 px-4 text-right hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1 text-blue-600 text-sm">
                          <ArrowUpRight className="h-3 w-3" />
                          {formatNumber(article.viewsWeek)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {formatNumber(article.viewsToday)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
