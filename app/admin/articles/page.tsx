import { getAllArticlesAdmin } from "@/lib/actions/articles"
import { getCategories } from "@/lib/actions/categories"
import { ArticlesListClient } from "./articles-list-client"

export default async function ArticlesPage() {
  const articles = await getAllArticlesAdmin()
  const categories = await getCategories()
  
  return <ArticlesListClient initialArticles={articles} categories={categories} />
}
