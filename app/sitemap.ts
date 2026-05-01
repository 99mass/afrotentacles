import type { MetadataRoute } from 'next'
import { getArticlesForSitemap, getCategories } from '@/lib/actions/articles'

const BASE_URL = 'https://afrotentacles.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/a-propos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/politique-confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Dynamic article pages
  let articlePages: MetadataRoute.Sitemap = []
  try {
    const articles = await getArticlesForSitemap()
    articlePages = articles.map((article) => ({
      url: `${BASE_URL}/article/${article.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // Silently fail — sitemap still works without articles
  }

  // Dynamic category pages
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const categories = await getCategories()
    categoryPages = categories.map((category) => ({
      url: `${BASE_URL}/categorie/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  } catch {
    // Silently fail
  }

  return [...staticPages, ...articlePages, ...categoryPages]
}
