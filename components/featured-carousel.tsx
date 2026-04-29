'use client'

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { ArticleCard } from "@/components/article-card"
import type { Article } from "@/lib/data"

interface FeaturedCarouselProps {
  articles: Article[]
}

export function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
  const pluginRef = React.useRef<ReturnType<typeof Autoplay> | null>(null)

  // Initialize or reinitialize the autoplay plugin
  if (!pluginRef.current) {
    pluginRef.current = Autoplay({ delay: 5000, stopOnInteraction: true })
  }

  if (articles.length === 0) {
    return null
  }

  return (
    <Carousel
      plugins={[pluginRef.current]}
      className="w-full"
      onMouseEnter={() => pluginRef.current?.stop()}
      onMouseLeave={() => pluginRef.current?.reset()}
    >
      <CarouselContent>
        {articles.map((article) => (
          <CarouselItem key={article.id}>
            <ArticleCard article={article} variant="featured" priority={true} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
