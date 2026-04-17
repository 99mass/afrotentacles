"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { regions, tags as availableTags, type Article, type MediaItem } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Upload, Plus, Trash2, Image, Video, FileText } from "lucide-react"
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
    subtitle: article?.subtitle || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    region: article?.regionSlug || regions[0].slug,
    country: article?.country || "",
    tags: article?.tags || [],
    image: article?.image || "",
    author: article?.author || "",
    status: article?.status || "draft",
    isSpotlight: article?.isSpotlight || false,
    isBrief: article?.isBrief || false,
    isSubscribersOnly: article?.isSubscribersOnly || false,
  })

  const [media, setMedia] = useState<MediaItem[]>(article?.media || [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const addMedia = (type: "image" | "video" | "pdf") => {
    setMedia((prev) => [...prev, { type, url: "", caption: "" }])
  }

  const updateMedia = (index: number, field: keyof MediaItem, value: string) => {
    setMedia((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // In a real app, this would save to a database
    console.log("Saving article:", { ...formData, media })
    
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

        {/* Subtitle (Country) */}
        <div className="space-y-2">
          <Label htmlFor="subtitle">Sous-titre / Pays</Label>
          <Input
            id="subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Ex: Niger, Maroc, RDC..."
          />
          <p className="text-xs text-muted-foreground">
            Affiché au-dessus du titre (style Africa Intelligence)
          </p>
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

        {/* Region, Country, Status */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="region">Région *</Label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              {regions.map((region) => (
                <option key={region.slug} value={region.slug}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Pays</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Ex: Nigeria"
            />
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

        {/* Article Type Checkboxes */}
        <div className="space-y-2">
          <Label>Type d&apos;article</Label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isSpotlight"
                checked={formData.isSpotlight}
                onChange={handleChange}
                className="rounded border-border"
              />
              <span className="text-sm">Spotlight (article vedette)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isBrief"
                checked={formData.isBrief}
                onChange={handleChange}
                className="rounded border-border"
              />
              <span className="text-sm">En bref (brève)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isSubscribersOnly"
                checked={formData.isSubscribersOnly}
                onChange={handleChange}
                className="rounded border-border"
              />
              <span className="text-sm">Réservé aux abonnés</span>
            </label>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags *</Label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 text-sm border transition-colors ${
                  formData.tags.includes(tag)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:border-primary"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="excerpt">Résumé / Chapô *</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Court résumé de l'article (affiché dans les listes et sous le titre)"
            required
            rows={3}
          />
        </div>

        {/* Main Image URL */}
        <div className="space-y-2">
          <Label htmlFor="image">Image principale *</Label>
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
            Utilisez du HTML pour formater: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, etc.
          </p>
        </div>

        {/* Media Section */}
        <div className="space-y-4 border-t border-border pt-6">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Médias additionnels</Label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => addMedia("image")}>
                <Image className="h-4 w-4 mr-1" />
                Image
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addMedia("video")}>
                <Video className="h-4 w-4 mr-1" />
                Vidéo
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addMedia("pdf")}>
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>

          {media.length > 0 && (
            <div className="space-y-4">
              {media.map((item, index) => (
                <div key={index} className="p-4 bg-muted border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      {item.type === "image" && <Image className="h-4 w-4" />}
                      {item.type === "video" && <Video className="h-4 w-4" />}
                      {item.type === "pdf" && <FileText className="h-4 w-4" />}
                      {item.type === "image" ? "Image" : item.type === "video" ? "Vidéo" : "PDF"} {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedia(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Input
                      value={item.url}
                      onChange={(e) => updateMedia(index, "url", e.target.value)}
                      placeholder={
                        item.type === "video"
                          ? "https://www.youtube.com/embed/..."
                          : item.type === "pdf"
                          ? "https://example.com/document.pdf"
                          : "https://example.com/image.jpg"
                      }
                    />
                    <Input
                      value={item.caption || ""}
                      onChange={(e) => updateMedia(index, "caption", e.target.value)}
                      placeholder="Légende (optionnel)"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {media.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Ajoutez des images, vidéos ou documents PDF supplémentaires à votre article.
            </p>
          )}
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
