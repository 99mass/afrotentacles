import { ArticleEditor } from "@/components/article-editor"
import { getArticleById, getArticlesForSitemap } from "@/lib/actions/articles"
import { notFound } from "next/navigation"

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}


export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params
  
  // getArticleById isn't created yet, wait, we have getArticleBySlug but not getArticleById!
  const article = await getArticleById(id)

  if (!article) {
    notFound()
  }

  return <ArticleEditor article={article} mode="edit" />
}
