"use client"

import { useEffect } from "react"
import { incrementArticleView } from "@/lib/actions/articles"

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // We use a small delay to only track actual reads (e.g. user stays for > 2 seconds)
    const timer = setTimeout(() => {
      incrementArticleView(slug)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [slug])

  return null
}
