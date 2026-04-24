"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { searchArticles } from "@/lib/actions/articles"
import type { Article } from "@/lib/data"

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

export function SearchDialog({ mode = "default" }: { mode?: "default" | "mobile" | "desktop" }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const data = await searchArticles(debouncedQuery)
        setResults(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    
    fetchResults()
  }, [debouncedQuery])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      {mode !== "mobile" && (
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden lg:flex border-foreground/20 text-muted-foreground w-64 justify-start relative"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4 mr-2" />
          Rechercher un article...
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      )}
      
      {/* Mobile search button */}
      {mode !== "desktop" && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-background hover:text-primary hover:bg-transparent"
          onClick={() => setOpen(true)}
        >
          <Search className="h-5 w-5" />
        </Button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Titre, sujet, mot-clé..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length >= 2 && results.length === 0 && !loading && (
            <CommandEmpty>Aucun résultat trouvé pour &quot;{query}&quot;.</CommandEmpty>
          )}
          {loading && (
            <div className="p-4 text-center text-sm text-muted-foreground">Recherche en cours...</div>
          )}
          {results.length > 0 && (
            <CommandGroup heading="Articles pertinents">
              {results.map((article) => (
                <CommandItem
                  key={article.id}
                  value={article.title}
                  onSelect={() => {
                    setOpen(false)
                    router.push(`/article/${article.slug}`)
                  }}
                  className="flex flex-col items-start py-3 cursor-pointer"
                >
                  <span className="font-medium text-sm line-clamp-1">{article.title}</span>
                  <span className="text-xs text-primary mt-1">{article.category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
