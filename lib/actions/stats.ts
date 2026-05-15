"use server"

import { createClient } from "@/lib/supabase/server"

export interface ArticleStat {
  id: string
  title: string
  category: string
  categorySlug: string
  views: number
  viewsToday: number
  viewsWeek: number
  viewsMonth: number
}

export interface CategoryStat {
  name: string
  slug: string
  views: number
}

export interface DailyStat {
  day: string
  views: number
}

export interface SiteStats {
  totalViews: number
  totalViewsLastMonth: number
  totalViewsCurrentMonth: number
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  topArticles: ArticleStat[]
  categoryStats: CategoryStat[]
  dailyStats: DailyStat[]
}

const DAY_LABELS: Record<number, string> = {
  0: "Dim",
  1: "Lun",
  2: "Mar",
  3: "Mer",
  4: "Jeu",
  5: "Ven",
  6: "Sam",
}

export async function getSiteStats(): Promise<SiteStats> {
  const supabase = await createClient()

  // 1. Total views all time
  const { count: totalViews } = await supabase
    .from("article_views")
    .select("*", { count: "exact", head: true })

  // 2. Total views last month
  const lastMonthStart = new Date()
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1)
  lastMonthStart.setDate(1)
  lastMonthStart.setHours(0, 0, 0, 0)

  const lastMonthEnd = new Date()
  lastMonthEnd.setDate(0) // last day of previous month
  lastMonthEnd.setHours(23, 59, 59, 999)

  const { count: totalViewsLastMonth } = await supabase
    .from("article_views")
    .select("*", { count: "exact", head: true })
    .gte("viewed_at", lastMonthStart.toISOString())
    .lte("viewed_at", lastMonthEnd.toISOString())

  // Total views current month
  const currentMonthStart = new Date()
  currentMonthStart.setDate(1)
  currentMonthStart.setHours(0, 0, 0, 0)

  const { count: totalViewsCurrentMonth } = await supabase
    .from("article_views")
    .select("*", { count: "exact", head: true })
    .gte("viewed_at", currentMonthStart.toISOString())

  // 3. Article counts
  const { count: totalArticles } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })

  const { count: publishedArticles } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")

  // 4. Top articles from article_stats view
  const { data: statsRows } = await supabase
    .from("article_stats")
    .select("id, title, category, category_slug, view_count, views_today, views_week")
    .order("view_count", { ascending: false })
    .limit(10)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
  thirtyDaysAgo.setHours(0, 0, 0, 0)

  const topArticles: ArticleStat[] = []
  for (const r of (statsRows || [])) {
    const { count } = await supabase
      .from("article_views")
      .select("*", { count: "exact", head: true })
      .eq("article_id", r.id)
      .gte("viewed_at", thirtyDaysAgo.toISOString())

    topArticles.push({
      id: r.id,
      title: r.title,
      category: r.category,
      categorySlug: r.category_slug,
      views: r.view_count || 0,
      viewsToday: r.views_today || 0,
      viewsWeek: r.views_week || 0,
      viewsMonth: count || 0,
    })
  }

  // 5. Views by category
  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug")
    .order("name", { ascending: true })

  const categoryStats: CategoryStat[] = []
  for (const cat of categories || []) {
    const { data: catArticles } = await supabase
      .from("articles")
      .select("id")
      .eq("category_slug", cat.slug)

    const articleIds = (catArticles || []).map((a) => a.id)

    let catViews = 0
    if (articleIds.length > 0) {
      const { count } = await supabase
        .from("article_views")
        .select("*", { count: "exact", head: true })
        .in("article_id", articleIds)
      catViews = count || 0
    }

    categoryStats.push({ name: cat.name, slug: cat.slug, views: catViews })
  }

  // Sort by views descending
  categoryStats.sort((a, b) => b.views - a.views)

  // 6. Views per day for the last 30 days
  const { data: recentViews } = await supabase
    .from("article_views")
    .select("viewed_at")
    .gte("viewed_at", thirtyDaysAgo.toISOString())

  // Build daily buckets for last 30 days
  const dailyMap: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    dailyMap[key] = 0
  }

  for (const v of recentViews || []) {
    const key = new Date(v.viewed_at).toISOString().slice(0, 10)
    if (key in dailyMap) dailyMap[key]++
  }

  const dailyStats: DailyStat[] = Object.entries(dailyMap).map(([dateStr, views]) => {
    const d = new Date(dateStr)
    const formattedDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`
    return { day: formattedDate, views }
  })

  return {
    totalViews: totalViews || 0,
    totalViewsLastMonth: totalViewsLastMonth || 0,
    totalViewsCurrentMonth: totalViewsCurrentMonth || 0,
    totalArticles: totalArticles || 0,
    publishedArticles: publishedArticles || 0,
    draftArticles: (totalArticles || 0) - (publishedArticles || 0),
    topArticles,
    categoryStats,
    dailyStats,
  }
}
