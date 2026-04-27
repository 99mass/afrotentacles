import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArticleCard } from "@/components/article-card"
import { getArticleBySlug, getRelatedArticles, getArticlesForSitemap } from "@/lib/actions/articles"
import { ViewTracker } from "@/components/view-tracker"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Twitter, Linkedin, Facebook, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import "@/styles/article-content.css"

function getEmbedUrl(url: string) {
  if (!url) return url
  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("youtube.com/watch?v=", "youtube.com/embed/").split("&")[0]
  }
  if (url.includes("youtu.be/")) {
    return url.replace("youtu.be/", "youtube.com/embed/").split("?")[0]
  }
  return url
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  
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
  const article = await getArticleBySlug(slug)

  if (!article || article.status !== "published") {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article)
  const shareUrl = encodeURIComponent(`https://afrotentacles.com/article/${article.slug}`)
  const shareText = encodeURIComponent(article.title)

  // Separate media by type (for Legacy HTML articles)
  const images = article.media?.filter(m => m.type === "image") || []
  const videos = article.media?.filter(m => m.type === "video") || []
  const pdfs = article.media?.filter(m => m.type === "pdf") || []

  // Parse blocks if the content is JSON
  let blocks: any[] = []
  let isJsonBlocks = false
  try {
    const parsed = JSON.parse(article.content)
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
      blocks = parsed
      isJsonBlocks = true
    }
  } catch {
    // Legacy HTML content
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <ViewTracker slug={article.slug} />
        <article>
          {/* Article Header */}
          <header className="border-b border-border font-serif">
            <div className="mx-auto max-w-4xl px-4 py-8">
              {/* Breadcrumb */}
              <nav className="text-sm text-muted-foreground mb-6 font-serif">
                <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
                <span className="mx-2">/</span>
                <Link 
                  href={`/categorie/${article.categorySlug}`} 
                  className="hover:text-primary transition-colors"
                >
                  {article.category}
                </Link>
              </nav>
              
              {/* Category tag */}
              <span className="inline-block text-sm font-semibold uppercase tracking-wider text-primary mb-3 font-serif">
                {article.category}
              </span>
              
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance">
                {article.title}
              </h1>
              
              <p className="text-lg text-muted-foreground mt-4 max-w-3xl leading-relaxed font-serif">
                {article.excerpt}
              </p>
              
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground font-serif">
                <span>Par <strong className="text-foreground font-serif">{article.author}</strong></span>
                <span className="text-border">|</span>
                <time className="font-serif">{formatDate(article.date)}</time>
              </div>
              
              {/* Share buttons */}
              <div className="flex items-center gap-3 mt-6 font-serif">
                <span className="text-sm text-muted-foreground font-serif">Partager:</span>
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
          <figure className="relative">
            <div className="relative aspect-[21/9] bg-muted">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {images[0]?.caption && (
              <figcaption className="mx-auto max-w-4xl px-4 py-2 text-sm text-muted-foreground italic font-serif">
                {images[0].caption}
              </figcaption>
            )}
          </figure>
          
          {/* Article Content */}
          <div className="mx-auto max-w-3xl px-4 py-12 font-serif">
            {isJsonBlocks ? (
              <div className="space-y-8 font-serif">
                {blocks.map((block, idx) => (
                  <div key={block.id || idx} className="font-serif">
                    {block.type === 'text' && (
                      <div 
                        className="article-content"
                        dangerouslySetInnerHTML={{ __html: block.content }}
                      />
                    )}
                    {block.type === 'image' && block.url && (
                      <figure className="my-8 font-serif">
                        <div className="relative aspect-[16/10] bg-muted w-full rounded-lg overflow-hidden">
                          <Image
                            src={block.url}
                            alt={block.caption || "Image"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {block.caption && (
                          <figcaption className="mt-3 text-center text-sm text-muted-foreground italic font-serif">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    )}
                    {block.type === 'video' && block.url && (
                      <figure className="my-8 font-serif">
                        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden shadow-sm border border-border">
                          <iframe
                            src={getEmbedUrl(block.url)}
                            className="absolute inset-0 w-full h-full"
                            allowFullScreen
                            title={block.caption || "Vidéo"}
                          />
                        </div>
                        {block.caption && (
                          <figcaption className="mt-3 text-center text-sm text-muted-foreground italic font-serif">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    )}
                    {block.type === 'pdf' && block.url && (
                      <div className="my-8 p-6 bg-muted/50 rounded-lg border border-border flex flex-col sm:flex-row items-center justify-between gap-4 font-serif">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-background rounded-full shadow-sm">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <span className="font-medium text-foreground block font-serif">{block.caption || "Document PDF"}</span>
                            <span className="text-sm text-muted-foreground font-serif">Cliquez pour consulter ou télécharger</span>
                          </div>
                        </div>
                        <Button asChild variant="default" className="w-full sm:w-auto shrink-0">
                          <Link href={block.url} target="_blank">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Legacy Renderer (pour les anciens articles non convertis en blocs)
              <>
                {/* Legacy PDF documents */}
                {pdfs.length > 0 && (
                  <div className="mb-8 space-y-3 font-serif">
                    {pdfs.map((pdf, index) => (
                      <div key={index} className="p-4 bg-muted border border-border flex items-center justify-between font-serif">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <span className="text-sm font-medium block font-serif">{pdf.caption || "Document PDF"}</span>
                          </div>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={pdf.url} target="_blank">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Legacy Article body */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline font-serif"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
                
                {/* Legacy Additional Images */}
                {images.length > 1 && (
                  <div className="mt-12 space-y-8 font-serif">
                    <h3 className="font-serif text-xl font-bold border-b border-border pb-2">
                      Images
                    </h3>
                    <div className="grid gap-6">
                      {images.slice(1).map((image, index) => (
                        <figure key={index}>
                          <div className="relative aspect-[16/10] bg-muted">
                            <Image
                              src={image.url}
                              alt={image.caption || `Image ${index + 2}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {image.caption && (
                            <figcaption className="mt-2 text-sm text-muted-foreground italic font-serif">
                              {image.caption}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Legacy Videos */}
                {videos.length > 0 && (
                  <div className="mt-12 space-y-8 font-serif">
                    <h3 className="font-serif text-xl font-bold border-b border-border pb-2">
                      Vidéos
                    </h3>
                    <div className="space-y-6 font-serif">
                      {videos.map((video, index) => (
                        <figure key={index}>
                          <div className="relative aspect-video bg-muted">
                            <iframe
                              src={getEmbedUrl(video.url)}
                              className="absolute inset-0 w-full h-full"
                              allowFullScreen
                              title={video.caption || `Vidéo ${index + 1}`}
                            />
                          </div>
                          {video.caption && (
                            <figcaption className="mt-2 text-sm text-muted-foreground italic font-serif">
                              {video.caption}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </article>
        
        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-muted border-t border-border py-12 font-serif">
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
