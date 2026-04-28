'use client'

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { ArticleCard } from "@/components/article-card"
import type { Article } from "@/lib/data"

interface FeaturedCarouselProps {
  articles: Article[]
}

export function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  if (articles.length === 0) {
    return null
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {articles.map((article) => (
          <CarouselItem key={article.id}>
            <div className="lg:col-span-7">
              <ArticleCard article={article} variant="featured" priority={true} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {articles.length > 1 && (
        <>
          <CarouselPrevious className="left-0 hover:bg-primary/80 hover:text-primary-foreground" />
          <CarouselNext className="right-0 hover:bg-primary/80 hover:text-primary-foreground" />
        </>
      )}
    </Carousel>
  )
}
