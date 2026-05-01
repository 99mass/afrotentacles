'use client'

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import type { Article } from "@/lib/data"
import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

interface FeaturedCarouselProps {
  articles: Article[]
}

export function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const pluginRef = React.useRef<ReturnType<typeof Autoplay> | null>(null)

  // Initialize or reinitialize the autoplay plugin
  if (!pluginRef.current) {
    pluginRef.current = Autoplay({ 
      delay: 3500, 
      stopOnInteraction: false,
      stopOnMouseEnter: true 
    })
  }

  React.useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })

    // Guarantee autoplay starts even after client-side navigation
    const autoplay = api.plugins()?.autoplay
    if (autoplay) {
      autoplay.play()
    }
  }, [api])

  if (articles.length === 0) {
    return null
  }

  return (
    <div className="w-full flex flex-col">
      {/* Image Carousel - Only images slide */}
      <Carousel
        setApi={setApi}
        plugins={[pluginRef.current]}
        className="w-full mb-4"
      >
        <CarouselContent>
          {articles.map((article, index) => (
            <CarouselItem key={article.id}>
              <Link href={`/article/${article.slug}`} className="block group">
                <div className="relative aspect-[2/1] overflow-hidden bg-muted rounded-xl">
                  <Image
                    src={article.image || ""}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Text Content - Crossfades without sliding */}
      <div className="grid">
        {articles.map((article, index) => (
          <div
            key={article.id}
            className={`col-start-1 row-start-1 transition-opacity duration-500 ease-in-out ${
              index === current ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={index !== current}
          >
            <Link href={`/article/${article.slug}`} className="block group">
              <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                {article.category}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-3">
                {article.title}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <time dateTime={article.date}>{formatDate(article.date)}</time>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
