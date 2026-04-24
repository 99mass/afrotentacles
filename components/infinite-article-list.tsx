"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { ArticleCard } from "@/components/article-card"
import { ArticleCardSkeleton } from "@/components/skeletons"
import { getLatestArticles } from "@/lib/actions/articles"
import type { Article } from "@/lib/data"

export function InfiniteArticleList({ initialArticles = [] }: { initialArticles?: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)

    try {
      const nextPage = page + 1
      const newArticles = await getLatestArticles(nextPage, 6)
      
      if (newArticles.length === 0) {
        setHasMore(false)
      } else {
        setArticles(prev => {
          const existingIds = new Set(prev.map(a => a.id))
          const uniqueNewArticles = newArticles.filter(a => !existingIds.has(a.id))
          return [...prev, ...uniqueNewArticles]
        })
        setPage(nextPage)
      }
    } catch (error) {
      console.error("Failed to load more articles:", error)
    } finally {
      setIsLoading(false)
    }
  }, [page, isLoading, hasMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 1.0, rootMargin: "100px" }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      
      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
        </div>
      )}
      
      {/* Observer Target */}
      {hasMore && (
        <div ref={observerTarget} className="h-10 mt-4" />
      )}
      
      {!hasMore && articles.length > 0 && (
        <p className="text-center text-muted-foreground text-sm mt-8 pb-4">
          Vous avez lu tous nos derniers articles.
        </p>
      )}
    </div>
  )
}
