import { ArticleEditor } from "@/components/article-editor"
import { getArticleById, getCategories } from "@/lib/actions/articles"
import { getAuthors } from "@/lib/actions/authors"
import { notFound } from "next/navigation"

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}


export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params
  
  // getArticleById isn't created yet, wait, we have getArticleBySlug but not getArticleById!
  const [article, categories, authors] = await Promise.all([
    getArticleById(id),
    getCategories(),
    getAuthors()
  ])
  
  if (!article) {
    notFound()
  }

  return <ArticleEditor article={article} mode="edit" categories={categories} authors={authors} />
}
