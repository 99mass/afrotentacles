import { ArticleEditor } from "@/components/article-editor"
import { articles } from "@/lib/data"
import { notFound } from "next/navigation"

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    id: article.id,
  }))
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params
  const article = articles.find((a) => a.id === id)

  if (!article) {
    notFound()
  }

  return <ArticleEditor article={article} mode="edit" />
}
