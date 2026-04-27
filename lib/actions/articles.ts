"use server"

import { createClient } from "@/lib/supabase/server"
import type { Article } from "@/lib/data"
import { revalidatePath } from "next/cache"

function mapToArticle(row: any): Article {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    image: row.image,
    category: row.category_name,
    categorySlug: row.category_slug,
    date: row.published_date || row.created_at,
    slug: row.slug,
    author: row.author,
    status: row.status,
    is_featured: row.is_featured,
  }
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_date", { ascending: false })
    .limit(1)
    .single()
    
  if (error || !data) {
    // Fallback to latest article if no featured
    const { data: latest } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_date", { ascending: false })
      .limit(1)
      .single()
      
    if (!latest) return null
    return mapToArticle(latest)
  }
  
  return mapToArticle(data)
}

export async function getLatestArticles(page = 1, limit = 10, excludeId?: string): Promise<Article[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_date", { ascending: false })
    
  if (excludeId) {
    query = query.neq("id", excludeId)
  }
    
  const from = (page - 1) * limit
  const to = from + limit - 1
  
  const { data } = await query.range(from, to)
  
  return (data || []).map(mapToArticle)
}

export async function searchArticles(query: string): Promise<Article[]> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order("published_date", { ascending: false })
    .limit(5)
    
  return (data || []).map(mapToArticle)
}


export async function getPopularArticles(limit = 5): Promise<Article[]> {
  const supabase = await createClient()
  
  const { data: stats } = await supabase
    .from("article_stats")
    .select("id")
    .order("view_count", { ascending: false })
    .limit(limit)
    
  if (!stats || stats.length === 0) return getLatestArticles(1, limit)
  
  const ids = stats.map(s => s.id)
  
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .in("id", ids)
    .eq("status", "published")
    
  const sortedArticles = (articles || []).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
  return sortedArticles.map(mapToArticle)
}

export async function incrementArticleView(slug: string) {
  const supabase = await createClient()
  
  const { data: article } = await supabase
    .from("articles")
    .select("id")
    .eq("slug", slug)
    .single()
    
  if (article) {
    await supabase.from("article_views").insert({
      article_id: article.id
    })
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("articles")
    .select(`
      *,
      categories (name)
    `)
    .eq("slug", slug)
    .single()
    
  if (error || !data) return null
  
  // Fetch media
  const { data: media } = await supabase
    .from("article_media")
    .select("*")
    .eq("article_id", data.id)
    .order("created_at", { ascending: true })
    
  const article = mapToArticle(data)
  article.media = media || []
  
  return article
}

export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from("articles")
    .select("*, categories(name)")
    .eq("status", "published")
    .eq("category_slug", article.categorySlug)
    .neq("id", article.id)
    .order("published_date", { ascending: false })
    .limit(limit)
    
  return (data || []).map(mapToArticle)
}

export async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true })
  return data || []
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()
  return data || null
}

export async function createCategory(category: { name: string, slug: string, description?: string }) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .insert([category])
    .select()
    .single()
    
  if (error) {
    console.error("Error creating category:", error)
    throw new Error(error.message)
  }
  
  revalidatePath("/")
  revalidatePath("/admin/categories")
  return data
}

export async function updateCategory(id: string, category: { name: string, slug: string, description?: string }) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id)
    .select()
    .single()
    
  if (error) {
    console.error("Error updating category:", error)
    throw new Error(error.message)
  }
  
  revalidatePath("/")
  revalidatePath("/admin/categories")
  return data
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    
  if (error) {
    console.error("Error deleting category:", error)
    throw new Error(error.message)
  }
  
  revalidatePath("/")
  revalidatePath("/admin/categories")
  return true
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("articles")
    .select("*, categories(name)")
    .eq("status", "published")
    .eq("category_slug", categorySlug)
    .order("published_date", { ascending: false })
  return (data || []).map(mapToArticle)
}

export async function getArticlesForSitemap(): Promise<{slug: string}[]> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from("articles")
    .select("slug")
    .eq("status", "published")
    
  return data || []
}

// ==========================================
// ADMIN ACTIONS
// ==========================================

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export async function getArticleById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("articles")
    .select(`
      *,
      categories (name),
      article_media (*)
    `)
    .eq("id", id)
    .single()
    
  if (error || !data) return null
  
  const article = mapToArticle(data)
  article.media = data.article_media || []
  
  return article
}

export async function getAllArticlesAdmin() {
  const supabase = await createClient()
  
  // Get all articles with categories and media
  const { data: articles, error } = await supabase
    .from("articles")
    .select(`
      *,
      categories (name),
      article_media (*)
    `)
    .order("created_at", { ascending: false })
    
  if (error || !articles) return []
  
  // Get all views from article_stats
  const { data: stats } = await supabase
    .from("article_stats")
    .select("id, view_count")
    
  const statsMap = new Map((stats || []).map(s => [s.id, s.view_count]))
  
  return articles.map(article => {
    const mapped = mapToArticle(article)
    mapped.media = article.article_media || []
    return {
      ...mapped,
      view_count: statsMap.get(article.id) || 0
    }
  })
}

export async function deleteArticle(id: string) {
  const supabase = await createClient()
  await supabase.from("articles").delete().eq("id", id)
  revalidatePath('/admin/articles')
  revalidatePath('/')
}

export async function createArticle(data: any) {
  const supabase = await createClient()
  
  let slug = generateSlug(data.title)
  // Check if slug exists
  const { data: existing } = await supabase.from("articles").select("id").eq("slug", slug).single()
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`
  }
  
  // Insert article
  const { data: article, error } = await supabase.from("articles").insert({
    title: data.title,
    slug: slug,
    excerpt: data.excerpt,
    content: data.content,
    image: data.image,
    category_slug: data.category,
    category_name: data.categoryName || data.category, // we can just pass name or let trigger/view handle
    status: data.status,
    author: data.author,
    is_featured: data.is_featured,
    published_date: new Date().toISOString()
  }).select().single()
  
  if (error) throw new Error(error.message)
    
  // Insert media if any
  if (data.media && data.media.length > 0) {
    const mediaToInsert = data.media.map((m: any, index: number) => ({
      article_id: article.id,
      type: m.type,
      url: m.url,
      caption: m.caption,
      position: index
    }))
    await supabase.from("article_media").insert(mediaToInsert)
  }
  
  revalidatePath('/admin/articles')
  revalidatePath('/')
  
  return article
}

export async function updateArticle(id: string, data: any) {
  const supabase = await createClient()
  
  // Update article
  const { error } = await supabase.from("articles").update({
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    image: data.image,
    category_slug: data.category,
    category_name: data.categoryName || data.category,
    status: data.status,
    author: data.author,
    is_featured: data.is_featured,
    updated_at: new Date().toISOString()
  }).eq("id", id)
  
  if (error) throw new Error(error.message)
    
  // Update media: delete all existing and re-insert
  await supabase.from("article_media").delete().eq("article_id", id)
  
  if (data.media && data.media.length > 0) {
    const mediaToInsert = data.media.map((m: any, index: number) => ({
      article_id: id,
      type: m.type,
      url: m.url,
      caption: m.caption,
      position: index
    }))
    await supabase.from("article_media").insert(mediaToInsert)
  }

  revalidatePath('/admin/articles')
  revalidatePath('/')
  revalidatePath(`/article/${data.slug}`)
}
