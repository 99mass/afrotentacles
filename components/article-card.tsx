import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

interface ArticleCardProps {
  article: {
    id: string
    title: string
    excerpt: string
    image: string
    category: string
    categorySlug: string
    date: string
    slug: string
  }
  variant?: "default" | "featured" | "compact"
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "featured") {
    return (
      <article className="group relative">
        <Link href={`/article/${article.slug}`} className="block">
          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <Link
                href={`/categorie/${article.categorySlug}`}
                className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-2 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {article.category}
              </Link>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-balance mb-3">
                {article.title}
              </h2>
              <p className="text-sm text-white/80 line-clamp-2 max-w-2xl">
                {article.excerpt}
              </p>
              <time className="text-xs text-white/60 mt-3 block">
                {formatDate(article.date)}
              </time>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  if (variant === "compact") {
    return (
      <article className="group flex gap-4 py-4 border-b border-border last:border-0">
        <Link href={`/article/${article.slug}`} className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-muted">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="flex flex-col justify-center">
          <Link
            href={`/categorie/${article.categorySlug}`}
            className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
          >
            {article.category}
          </Link>
          <Link href={`/article/${article.slug}`}>
            <h3 className="font-serif text-base font-semibold leading-snug mt-1 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>
          <time className="text-xs text-muted-foreground mt-1">
            {formatDate(article.date)}
          </time>
        </div>
      </article>
    )
  }

  return (
    <article className="group">
      <Link href={`/article/${article.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted mb-4">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <Link
        href={`/categorie/${article.categorySlug}`}
        className="inline-block text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
      >
        {article.category}
      </Link>
      <Link href={`/article/${article.slug}`}>
        <h3 className="font-serif text-xl font-bold leading-tight mt-2 mb-2 group-hover:text-primary transition-colors text-balance">
          {article.title}
        </h3>
      </Link>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
        {article.excerpt}
      </p>
      <time className="text-xs text-muted-foreground">
        {formatDate(article.date)}
      </time>
    </article>
  )
}
