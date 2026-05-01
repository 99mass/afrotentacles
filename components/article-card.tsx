"use client"

import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import type { Article } from "@/lib/data"

interface ArticleCardProps {
  article: Article
  variant?: "default" | "featured" | "horizontal" | "compact"
  showCategory?: boolean
  showImage?: boolean
  showExcerpt?: boolean
  excerptClamp?: 1 | 2 | 3 | 4
  priority?: boolean
}

export function ArticleCard({ 
  article, 
  variant = "default",
  showCategory = true,
  showImage = true,
  showExcerpt = true,
  excerptClamp = 2,
  priority = false
}: ArticleCardProps) {
  
  // Featured variant - large hero style
  if (variant === "featured") {
    return (
      <article className="group">
        <Link href={`/article/${article.slug}`} className="block">
          {showImage && article.image && (
            <div className="relative aspect-[2/1] mb-4 overflow-hidden bg-muted rounded-xl">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading={priority ? "eager" : "lazy"}
              />
            </div>
          )}
          <div>
            {showCategory && (
              <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                {article.category}
              </span>
            )}
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-3">
              {article.title}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4 line-clamp-3">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <time dateTime={article.date}>{formatDate(article.date)}</time>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  // Horizontal variant - image on left, text on right
  if (variant === "horizontal") {
    return (
      <article className="group overflow-hidden">
        <Link href={`/article/${article.slug}`} className="flex gap-4 items-stretch h-28 md:h-32 min-w-0 overflow-hidden">
          {showImage && article.image && (
            <div className="relative w-32 md:w-44 shrink-0 overflow-hidden bg-muted h-full rounded-xl">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100px, 150px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading={priority ? "eager" : "lazy"}
              />
            </div>
          )}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 overflow-hidden">
            <div className="min-w-0 w-full">
              {showCategory && (
                <span className="inline-block text-[10px] md:text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                  {article.category}
                </span>
              )}
              <h3 className="font-serif text-sm md:text-base font-bold text-foreground leading-tight mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              {showExcerpt && (
                <p className={`text-xs md:text-sm text-muted-foreground hidden md:block leading-snug ${
                  excerptClamp === 1 ? 'truncate' :
                  excerptClamp === 3 ? 'line-clamp-3' :
                  excerptClamp === 4 ? 'line-clamp-4' : 'line-clamp-2'
                }`}>
                  {article.excerpt}
                </p>
              )}
            </div>
            <time className="text-[10px] md:text-xs text-muted-foreground mt-1 block shrink-0" dateTime={article.date}>
              {formatDate(article.date)}
            </time>
          </div>
        </Link>
      </article>
    )
  }

  // Compact variant - for sidebar lists
  if (variant === "compact") {
    return (
      <article className="group py-3 border-b border-border last:border-0">
        <Link href={`/article/${article.slug}`} className="block">
          {showCategory && (
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              {article.category}
            </span>
          )}
          <h3 className="font-serif text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <time className="text-xs text-muted-foreground mt-1 block" dateTime={article.date}>
            {formatDate(article.date)}
          </time>
        </Link>
      </article>
    )
  }

  // Default variant - card with image on top
  return (
    <article className="group">
      <Link href={`/article/${article.slug}`} className="block">
        {showImage && article.image && (
          <div className="relative aspect-[2/1] mb-3 overflow-hidden bg-muted rounded-xl">
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading={priority ? "eager" : "lazy"}
            />
          </div>
        )}
        <div>
          {showCategory && (
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              {article.category}
            </span>
          )}
          <h3 className="font-serif text-lg font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {article.excerpt}
          </p>
          <time className="text-xs text-muted-foreground" dateTime={article.date}>
            {formatDate(article.date)}
          </time>
        </div>
      </Link>
    </article>
  )
}
