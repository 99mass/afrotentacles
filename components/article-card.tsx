"use client"

import Link from "next/link"
import Image from "next/image"
import { Lock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Article } from "@/lib/data"

interface ArticleCardProps {
  article: Article
  variant?: "default" | "spotlight" | "horizontal" | "brief" | "sidebar"
  showImage?: boolean
}

export function ArticleCard({ article, variant = "default", showImage = true }: ArticleCardProps) {
  // Spotlight - Large featured article
  if (variant === "spotlight") {
    return (
      <article className="group">
        <Link href={`/article/${article.slug}`} className="block">
          {showImage && (
            <div className="relative aspect-[16/10] mb-4 overflow-hidden bg-muted">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {article.isSpotlight && (
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold uppercase">
                  Spotlight
                </span>
              )}
            </div>
          )}
          <div>
            {article.subtitle && (
              <span className="text-primary text-sm font-semibold uppercase tracking-wide">
                {article.subtitle}
              </span>
            )}
            <h2 className="font-serif text-2xl lg:text-3xl font-bold mt-1 mb-3 group-hover:text-primary transition-colors leading-tight">
              {article.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>
          </div>
        </Link>
      </article>
    )
  }

  // Horizontal layout - Image on left, content on right
  if (variant === "horizontal") {
    return (
      <article className="group flex gap-4">
        {showImage && (
          <Link href={`/article/${article.slug}`} className="shrink-0">
            <div className="relative w-32 h-24 lg:w-48 lg:h-32 overflow-hidden bg-muted">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <Link href={`/article/${article.slug}`}>
            {article.subtitle && (
              <span className="text-primary text-xs font-semibold uppercase tracking-wide">
                {article.subtitle}
              </span>
            )}
            <h3 className="font-serif text-base lg:text-lg font-bold mt-0.5 mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
              {article.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            {article.isSubscribersOnly && (
              <span className="flex items-center gap-1 text-primary">
                <Lock className="h-3 w-3" />
                Abonnés
              </span>
            )}
            {article.tags.slice(0, 2).map((tag, i) => (
              <span key={tag}>
                <Link href={`/tag/${tag.toLowerCase()}`} className="hover:text-primary">
                  {tag}
                </Link>
                {i < Math.min(article.tags.length, 2) - 1 && ","}
              </span>
            ))}
            <span>{formatDate(article.date)}</span>
          </div>
        </div>
      </article>
    )
  }

  // Brief - Short news item
  if (variant === "brief") {
    return (
      <article className="group py-3 border-b border-border last:border-0">
        <Link href={`/article/${article.slug}`}>
          <div className="flex items-start gap-2">
            {article.isSubscribersOnly && (
              <Lock className="h-3 w-3 text-primary shrink-0 mt-1" />
            )}
            <div>
              {article.subtitle && (
                <span className="text-primary text-xs font-semibold uppercase tracking-wide">
                  {article.subtitle}
                </span>
              )}
              <h4 className="text-sm font-medium group-hover:text-primary transition-colors leading-snug">
                {article.title}
              </h4>
              <span className="text-xs text-muted-foreground mt-1 block">
                {formatDate(article.date)}
              </span>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  // Sidebar - Compact list style
  if (variant === "sidebar") {
    return (
      <article className="group py-3 border-b border-border last:border-0">
        <Link href={`/article/${article.slug}`}>
          {article.subtitle && (
            <span className="text-primary text-xs font-semibold uppercase tracking-wide">
              {article.subtitle}
            </span>
          )}
          <h4 className="font-serif text-sm font-bold mt-0.5 group-hover:text-primary transition-colors leading-snug">
            {article.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            {article.isSubscribersOnly && (
              <span className="flex items-center gap-1 text-primary">
                <Lock className="h-3 w-3" />
              </span>
            )}
            {article.tags[0] && (
              <span>{article.tags[0]}</span>
            )}
            <span>{formatDate(article.date)}</span>
          </div>
        </Link>
      </article>
    )
  }

  // Default - Standard card with image on top
  return (
    <article className="group">
      <Link href={`/article/${article.slug}`} className="block">
        {showImage && (
          <div className="relative aspect-[16/10] mb-3 overflow-hidden bg-muted">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div>
          {article.subtitle && (
            <span className="text-primary text-xs font-semibold uppercase tracking-wide">
              {article.subtitle}
            </span>
          )}
          <h3 className="font-serif text-lg font-bold mt-1 mb-2 group-hover:text-primary transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {article.isSubscribersOnly && (
              <span className="flex items-center gap-1 text-primary">
                <Lock className="h-3 w-3" />
                Abonnés
              </span>
            )}
            {article.tags.slice(0, 2).map((tag, i) => (
              <span key={tag}>
                {tag}
                {i < Math.min(article.tags.length, 2) - 1 && ","}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  )
}
