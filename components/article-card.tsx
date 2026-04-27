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
  priority?: boolean
}

export function ArticleCard({ 
  article, 
  variant = "default",
  showCategory = true,
  showImage = true,
  priority = false
}: ArticleCardProps) {
  
  // Featured variant - large hero style
  if (variant === "featured") {
    return (
      <article className="group">
        <Link href={`/article/${article.slug}`} className="block">
          {showImage && article.image && (
            <div className="relative aspect-[16/9] mb-4 overflow-hidden bg-muted">
              <Image
                src={article.image}
                alt={article.title}
                fill
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
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors">
              {article.title}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium">{article.author}</span>
              <span>•</span>
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
      <article className="group">
        <Link href={`/article/${article.slug}`} className="flex gap-4">
          {showImage && article.image && (
            <div className="relative w-32 h-24 md:w-40 md:h-28 shrink-0 overflow-hidden bg-muted">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading={priority ? "eager" : "lazy"}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {showCategory && (
              <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                {article.category}
              </span>
            )}
            <h3 className="font-serif text-base md:text-lg font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 hidden md:block">
              {article.excerpt}
            </p>
            <time className="text-xs text-muted-foreground mt-2 block" dateTime={article.date}>
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
          <div className="relative aspect-[4/3] mb-3 overflow-hidden bg-muted">
            <Image
              src={article.image}
              alt={article.title}
              fill
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
          <h3 className="font-serif text-lg font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
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
