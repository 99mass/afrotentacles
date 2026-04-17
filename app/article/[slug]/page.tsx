import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArticleCard } from "@/components/article-card"
import { getArticleBySlug, getRelatedArticles, articles } from "@/lib/data"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Twitter, Linkedin, Facebook, FileText, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  
  if (!article) {
    return { title: "Article non trouvé" }
  }

  return {
    title: `${article.title} - AfroTentacles`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article || article.status !== "published") {
    notFound()
  }

  const relatedArticles = getRelatedArticles(article)
  const shareUrl = encodeURIComponent(`https://afrotentacles.com/article/${article.slug}`)
  const shareText = encodeURIComponent(article.title)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <article>
          {/* Article Header */}
          <header className="border-b border-border">
            <div className="mx-auto max-w-4xl px-4 py-8">
              <nav className="text-sm text-muted-foreground mb-6">
                <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
                <span className="mx-2">/</span>
                <Link 
                  href={`/categorie/${article.categorySlug}`} 
                  className="hover:text-primary transition-colors"
                >
                  {article.category}
                </Link>
              </nav>
              
              <Link
                href={`/categorie/${article.categorySlug}`}
                className="inline-block text-xs font-semibold uppercase tracking-wider text-primary hover:underline mb-4"
              >
                {article.category}
              </Link>
              
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance">
                {article.title}
              </h1>
              
              <p className="text-lg text-muted-foreground mt-4 max-w-3xl">
                {article.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
                <span>Par <strong className="text-foreground">{article.author}</strong></span>
                <span className="text-border">|</span>
                <time>{formatDate(article.date)}</time>
              </div>
              
              {/* Share buttons */}
              <div className="flex items-center gap-3 mt-6">
                <span className="text-sm text-muted-foreground">Partager:</span>
                <Link
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                  target="_blank"
                  className="p-2 hover:bg-muted transition-colors"
                  aria-label="Partager sur Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  className="p-2 hover:bg-muted transition-colors"
                  aria-label="Partager sur LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
                <Link
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  className="p-2 hover:bg-muted transition-colors"
                  aria-label="Partager sur Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </header>
          
          {/* Cover Image */}
          <div className="relative aspect-[21/9] bg-muted">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Article Content */}
          <div className="mx-auto max-w-3xl px-4 py-12">
            {/* Video embed */}
            {article.videoUrl && (
              <div className="mb-8">
                <div className="relative aspect-video bg-muted flex items-center justify-center">
                  <iframe
                    src={article.videoUrl.replace("watch?v=", "embed/")}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    title="Video"
                  />
                </div>
              </div>
            )}
            
            {/* PDF download */}
            {article.pdfUrl && (
              <div className="mb-8 p-4 bg-muted border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Document PDF disponible</span>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={article.pdfUrl} target="_blank">
                    Télécharger
                  </Link>
                </Button>
              </div>
            )}
            
            {/* Article body */}
            <div 
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>
        
        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-muted border-t border-border py-12">
            <div className="mx-auto max-w-7xl px-4">
              <div className="flex items-center gap-2 mb-8">
                <h2 className="font-serif text-2xl font-bold">Articles similaires</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {relatedArticles.map((related) => (
                  <ArticleCard key={related.id} article={related} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
