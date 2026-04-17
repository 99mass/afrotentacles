"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { categories, type Article } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"

interface ArticleEditorProps {
  article?: Article
  mode: "create" | "edit"
}

export function ArticleEditor({ article, mode }: ArticleEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: article?.title || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    category: article?.categorySlug || categories[0].slug,
    image: article?.image || "",
    videoUrl: article?.videoUrl || "",
    pdfUrl: article?.pdfUrl || "",
    author: article?.author || "",
    status: article?.status || "draft",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // In a real app, this would save to a database
    console.log("Saving article:", formData)
    
    setIsLoading(false)
    router.push("/admin")
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux articles
        </Link>
        <h1 className="font-serif text-3xl font-bold">
          {mode === "create" ? "Nouvel article" : "Modifier l'article"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Titre de l'article"
            required
            className="text-lg"
          />
        </div>

        {/* Author */}
        <div className="space-y-2">
          <Label htmlFor="author">Auteur *</Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Nom de l'auteur"
            required
          />
        </div>

        {/* Category and Status */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Statut *</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="excerpt">Résumé *</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Court résumé de l'article (affiché dans les listes)"
            required
            rows={3}
          />
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <Label htmlFor="image">URL de l&apos;image *</Label>
          <div className="flex gap-2">
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
            />
            <Button type="button" variant="outline" className="flex-shrink-0">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Utilisez une URL d&apos;image externe ou uploadez une image
          </p>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Contenu *</Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Contenu de l'article (HTML supporté)"
            required
            rows={15}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Vous pouvez utiliser du HTML pour formater le contenu (h2, p, ul, li, strong, etc.)
          </p>
        </div>

        {/* Video URL */}
        <div className="space-y-2">
          <Label htmlFor="videoUrl">URL Vidéo YouTube (optionnel)</Label>
          <Input
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        {/* PDF URL */}
        <div className="space-y-2">
          <Label htmlFor="pdfUrl">URL du document PDF (optionnel)</Label>
          <div className="flex gap-2">
            <Input
              id="pdfUrl"
              name="pdfUrl"
              value={formData.pdfUrl}
              onChange={handleChange}
              placeholder="https://example.com/document.pdf"
            />
            <Button type="button" variant="outline" className="flex-shrink-0">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin">Annuler</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
