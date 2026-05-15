import { getSiteStats } from "@/lib/actions/stats"

export async function GET() {
  const stats = await getSiteStats()

  const rows: string[] = []

  // Summary
  rows.push(`Clé,Valeur`)
  rows.push(`Vues totales,${stats.totalViews}`)
  rows.push(`Vues mois dernier,${stats.totalViewsLastMonth}`)
  rows.push(`Articles totaux,${stats.totalArticles}`)
  rows.push(`Articles publiés,${stats.publishedArticles}`)
  rows.push(`Brouillons,${stats.draftArticles}`)
  rows.push("")

  // Top articles
  rows.push(`Top Articles`)
  rows.push(`Rang,Titre,Catégorie,Total,7 jours,Aujourd'hui`)
  stats.topArticles.forEach((a, i) => {
    rows.push(`${i + 1},"${a.title.replace(/"/g, '""')}",${a.category},${a.views},${a.viewsWeek},${a.viewsToday}`)
  })
  rows.push("")

  // Categories
  rows.push(`Vues par catégorie`)
  rows.push(`Nom,Slug,Vues`)
  stats.categoryStats.forEach((c) => {
    rows.push(`"${c.name.replace(/"/g, '""')}",${c.slug},${c.views}`)
  })
  rows.push("")

  // Daily
  rows.push(`Vues quotidiennes`)
  rows.push(`Jour,Vues`)
  stats.dailyStats.forEach((d) => {
    rows.push(`${d.day},${d.views}`)
  })

  const csv = rows.join("\n")

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="site-stats.csv"`,
    },
  })
}
