'use client'

import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Affiche le bouton seulement si on a scrollé plus de 300px vers le bas
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div
      className={`flex items-center justify-center fixed bottom-6 right-6 z-40 transition-all duration-300 ease-in-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12 pointer-events-none'
      }`}
    >
      <Button
        onClick={scrollToTop}
        size="icon"
        className="rounded-full shadow-lg hover:shadow-xl bg-primary hover:bg-primary/90"
        aria-label="Retour en haut"
      >
        <ChevronUp className="h-5 w-5" />
      </Button>
    </div>
  )
}
