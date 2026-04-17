"use client"

import { articles, categories } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Eye,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  BarChart3,
  ArrowUpRight,
} from "lucide-react"

// Format number with spaces as thousands separator (consistent between server/client)
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

// Mock statistics data
const mockStats = {
  totalViews: 6615,
  totalViewsLastMonth: 5892,
  uniqueVisitors: 3247,
  avgTimeOnPage: "3:42",
  bounceRate: 42,
  viewsByArticle: {
    "1": 1247,
    "2": 892,
    "3": 2341,
    "4": 567,
    "5": 1123,
    "6": 445,
  } as Record<string, number>,
  viewsByCategory: {
    "geoeconomie": 2139,
    "geopolitique": 1892,
    "ressources-energie": 1341,
    "flux-corridors": 567,
    "institutions": 445,
    "influences": 231,
  } as Record<string, number>,
  viewsByDay: [
    { day: "Lun", views: 890 },
    { day: "Mar", views: 1234 },
    { day: "Mer", views: 987 },
    { day: "Jeu", views: 1456 },
    { day: "Ven", views: 1123 },
    { day: "Sam", views: 567 },
    { day: "Dim", views: 358 },
  ],
}

const viewsGrowth = ((mockStats.totalViews - mockStats.totalViewsLastMonth) / mockStats.totalViewsLastMonth * 100).toFixed(1)

export default function StatistiquesPage() {
  const topArticles = articles
    .map((a) => ({
      ...a,
      views: mockStats.viewsByArticle[a.id] || 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  const maxDayViews = Math.max(...mockStats.viewsByDay.map((d) => d.views))

  return (
    <div className="p-6 lg:p-8 lg:pt-8 pt-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Statistiques</h1>
        <p className="text-muted-foreground mt-1">
          Analysez les performances de votre contenu
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Vues totales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(mockStats.totalViews)}</div>
            <p className={`text-xs mt-1 flex items-center gap-1 ${Number(viewsGrowth) >= 0 ? "text-green-600" : "text-red-600"}`}>
              {Number(viewsGrowth) >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {viewsGrowth}% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Visiteurs uniques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(mockStats.uniqueVisitors)}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8.3% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Temps moyen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockStats.avgTimeOnPage}</div>
            <p className="text-xs text-muted-foreground mt-1">
              par article
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Taux de rebond
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockStats.bounceRate}%</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              -2.1% vs mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Vues cette semaine</CardTitle>
            <CardDescription>Évolution quotidienne des visites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-48">
              {mockStats.viewsByDay.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-40">
                    <span className="text-xs font-medium mb-1">{day.views}</span>
                    <div
                      className="w-full bg-primary rounded-t transition-all"
                      style={{ height: `${(day.views / maxDayViews) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Views by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Vues par catégorie</CardTitle>
            <CardDescription>Répartition des visites par thématique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => {
                const views = mockStats.viewsByCategory[category.slug] || 0
                const percentage = Math.round((views / mockStats.totalViews) * 100)
                return (
                  <div key={category.slug}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{category.name}</span>
                      <span className="font-medium">{formatNumber(views)} vues</span>
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
      </div>

      {/* Top Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Articles les plus consultés</CardTitle>
          <CardDescription>Classement des articles par nombre de vues</CardDescription>
        </CardHeader>
        <CardContent>
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
                    Vues
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                    Tendance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topArticles.map((article, index) => (
                  <tr key={article.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        index < 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
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
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                        <ArrowUpRight className="h-3 w-3" />
                        {Math.floor(Math.random() * 20 + 5)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
