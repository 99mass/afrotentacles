import { ArticleEditor } from "@/components/article-editor"
import { getCategories } from "@/lib/actions/articles"
import { getAuthors } from "@/lib/actions/authors"

export default async function NewArticlePage() {
  const [categories, authors] = await Promise.all([
    getCategories(),
    getAuthors()
  ])
  return <ArticleEditor mode="create" categories={categories} authors={authors} />
}
