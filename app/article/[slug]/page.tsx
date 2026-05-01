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
import Script from "next/script"
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

  const BASE_URL = 'https://afrotentacles.com'
  const articleUrl = `${BASE_URL}/article/${article.slug}`

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: articleUrl,
    },
    authors: article.author ? [{ name: article.author }] : undefined,
    openGraph: {
      type: 'article',
      url: articleUrl,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      modifiedTime: article.date,
      section: article.category,
      images: article.image
        ? [{ url: article.image, width: 1200, height: 630, alt: article.title }]
        : [{ url: '/og-default.png', width: 1200, height: 630, alt: 'AfroTentacles' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : ['/og-default.png'],
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

  // Calculate reading time
  const textContent = article.content ? article.content.replace(/<[^>]*>?/gm, '') : '';
  const wordCount = textContent.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://afrotentacles.com/article/${article.slug}`
    },
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image ? [article.image] : ['https://afrotentacles.com/og-default.png'],
    "datePublished": new Date(article.date).toISOString(),
    "dateModified": new Date(article.date).toISOString(),
    "author": {
      "@type": "Person",
      "name": article.author || "AfroTentacles"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AfroTentacles",
      "logo": {
        "@type": "ImageObject",
        "url": "https://afrotentacles.com/logo.jpg"
      }
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://afrotentacles.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": article.category,
        "item": `https://afrotentacles.com/categorie/${article.categorySlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `https://afrotentacles.com/article/${article.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <Script
          id="article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <ViewTracker slug={article.slug} />
        <article>
          {/* Full-bleed Hero Image with Solid Color & Faded Right Image */}
          {/* === MOBILE HEADER === (hidden on md+) */}
          <header className="md:hidden font-serif bg-[#1a1a1a]">
            {/* Text on dark background */}
            <div className="px-4 pt-8 pb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3 font-sans">
                <span className="text-primary font-bold text-base tracking-widest uppercase">
                  {article.category}
                </span>
                <span className="text-white/40">•</span>
                <time className="text-white/70 text-sm tracking-wider">
                  {formatDate(article.date)}
                </time>
              </div>
              <h1 className="text-white text-2xl font-bold leading-tight tracking-tight">
                {article.title}
              </h1>
            </div>
            {/* Full-width image at natural aspect ratio */}
            {article.image && (
              <div className="relative w-full aspect-[2/1]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
              </div>
            )}
          </header>

          {/* === DESKTOP HEADER === (hidden on mobile) */}
          <header className="hidden md:block relative w-full h-[60vh] min-h-[500px] font-serif bg-[#1a1a1a] overflow-hidden">
            {article.image && (
              <div className="absolute right-0 top-0 h-full w-3/4 lg:w-2/3 xl:w-3/5">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover object-right"
                  priority
                  sizes="60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent"></div>
              </div>
            )}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 pb-16 h-full flex flex-col justify-end">
              <div className="flex items-center gap-4 mb-3 font-sans">
                <span className="text-primary font-bold text-xl tracking-widest uppercase">
                  {article.category}
                </span>
                <span className="text-white/40">•</span>
                <time className="text-white/80 text-sm tracking-wider">
                  Publié le {formatDate(article.date)}
                </time>
              </div>
              <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight max-w-4xl tracking-tight">
                {article.title}
              </h1>
            </div>
          </header>

          {/* Caption (right aligned below the image) */}
          {images[0]?.caption && (
            <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-2 text-right">
              <span className="text-xs text-muted-foreground italic font-sans">{images[0].caption}</span>
            </div>
          )}

          {/* Main Grid Layout */}
          <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-8 md:mt-12 mb-20 font-serif">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
              
              {/* Left Share Bar (Desktop) */}
              <div className="hidden lg:block lg:col-span-1 relative">
                <div className="sticky top-32 flex flex-col items-center gap-4 bg-[#1a1a1a] py-6 px-2 rounded-xl shadow-xl border border-white/5">
                  <Link
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    aria-label="Partager sur Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    aria-label="Partager sur LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    aria-label="Partager sur Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Main Content Column */}
              <div className="lg:col-span-7">
                
                {/* Mobile Share Bar */}
                <div className="flex lg:hidden items-center gap-4 mb-8 pb-4 border-b border-border">
                  <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Partager</span>
                  <Link href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full text-foreground"><Twitter className="h-4 w-4" /></Link>
                  <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full text-foreground"><Linkedin className="h-4 w-4" /></Link>
                  <Link href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full text-foreground"><Facebook className="h-4 w-4" /></Link>
                </div>

                {/* Excerpt (Chapeau) */}
                <p className="text-xl md:text-2xl text-foreground mb-12 leading-relaxed font-serif font-medium">
                  {article.excerpt}
                </p>

                {/* Article Body */}
                <div className="font-serif">
                  {isJsonBlocks ? (
                    <div className="space-y-8">
                      {blocks.map((block, idx) => (
                        <div key={block.id || idx}>
                          {block.type === 'text' && (
                            <div className="article-content" dangerouslySetInnerHTML={{ __html: block.content }} />
                          )}
                          {block.type === 'image' && block.url && (
                            <figure className="my-8">
                              <div className="relative aspect-[16/10] bg-muted w-full rounded-lg overflow-hidden">
                                <Image src={block.url} alt={block.caption || "Image"} fill className="object-cover" />
                              </div>
                              {block.caption && (
                                <figcaption className="mt-3 text-center text-sm text-muted-foreground italic font-serif">
                                  {block.caption}
                                </figcaption>
                              )}
                            </figure>
                          )}
                          {block.type === 'video' && block.url && (
                            <figure className="my-8">
                              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden shadow-sm border border-border">
                                <iframe src={getEmbedUrl(block.url)} className="absolute inset-0 w-full h-full" allowFullScreen title={block.caption || "Vidéo"} />
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
                                <div className="p-3 bg-background rounded-full shadow-sm"><FileText className="h-6 w-6 text-primary" /></div>
                                <div>
                                  <span className="font-medium text-foreground block font-serif">{block.caption || "Document PDF"}</span>
                                  <span className="text-sm text-muted-foreground font-serif">Cliquez pour consulter ou télécharger</span>
                                </div>
                              </div>
                              <Button asChild variant="default" className="w-full sm:w-auto shrink-0">
                                <Link href={block.url} target="_blank"><Download className="h-4 w-4 mr-2" />Télécharger</Link>
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Legacy Renderer
                    <>
                      {pdfs.length > 0 && (
                        <div className="mb-8 space-y-3 font-serif">
                          {pdfs.filter(pdf => pdf.url).map((pdf, index) => (
                            <div key={index} className="p-4 bg-muted border border-border flex items-center justify-between font-serif">
                              <div className="flex items-center gap-3"><FileText className="h-5 w-5 text-primary" /><div><span className="text-sm font-medium block font-serif">{pdf.caption || "Document PDF"}</span></div></div>
                              <Button asChild variant="outline" size="sm"><Link href={pdf.url} target="_blank"><Download className="h-4 w-4 mr-2" />Télécharger</Link></Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div 
                        className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline font-serif"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                      />
                      
                      {images.length > 1 && (
                        <div className="mt-12 space-y-8 font-serif">
                          <h3 className="font-serif text-xl font-bold border-b border-border pb-2">Images</h3>
                          <div className="grid gap-6">
                            {images.slice(1).map((image, index) => (
                              image.url && (
                                <figure key={index}>
                                  <div className="relative aspect-[16/10] bg-muted"><Image src={image.url} alt={image.caption || `Image ${index + 2}`} fill className="object-cover" /></div>
                                  {image.caption && <figcaption className="mt-2 text-sm text-muted-foreground italic font-serif">{image.caption}</figcaption>}
                                </figure>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {videos.length > 0 && (
                        <div className="mt-12 space-y-8 font-serif">
                          <h3 className="font-serif text-xl font-bold border-b border-border pb-2">Vidéos</h3>
                          <div className="space-y-6 font-serif">
                            {videos.filter(video => video.url).map((video, index) => (
                              <figure key={index}>
                                <div className="relative aspect-video bg-muted"><iframe src={getEmbedUrl(video.url)} className="absolute inset-0 w-full h-full" allowFullScreen title={video.caption || `Vidéo ${index + 1}`} /></div>
                                {video.caption && <figcaption className="mt-2 text-sm text-muted-foreground italic font-serif">{video.caption}</figcaption>}
                              </figure>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Right Sidebar (Related Articles) */}
              <aside className="lg:col-span-4">
                <div className="sticky top-32">
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider border-b-2 border-primary pb-2 mb-6">
                    Sur le même sujet
                  </h3>
                  <div className="flex flex-col gap-6">
                    {relatedArticles.length > 0 ? (
                      relatedArticles.slice(0, 4).map((related) => (
                        <ArticleCard key={related.id} article={related} variant="compact" />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic font-serif">Aucun article similaire pour le moment.</p>
                    )}
                  </div>
                </div>
              </aside>
              
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  )
}
