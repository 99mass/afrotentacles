"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { categories, type Article, type MediaItem } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, Save, Upload, Trash2, Image, Video, FileText, 
  Loader2, Check, X, Eye, GripVertical 
} from "lucide-react"
import Link from "next/link"
import NextImage from "next/image"

interface ArticleEditorProps {
  article?: Article
  mode: "create" | "edit"
}

export function ArticleEditor({ article, mode }: ArticleEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState<number | null>(null)
  const mainImageRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: article?.title || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    category: article?.categorySlug || categories[0].slug,
    image: article?.image || "",
    author: article?.author || "",
    status: article?.status || "draft",
  })

  const [media, setMedia] = useState<MediaItem[]>(article?.media || [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Upload file to Vercel Blob
  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      
      if (!response.ok) throw new Error("Upload failed")
      
      const data = await response.json()
      return data.url
    } catch (error) {
      console.error("Upload error:", error)
      return null
    }
  }

  // Handle main image upload
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploadingMain(true)
    const url = await uploadFile(file)
    if (url) {
      setFormData((prev) => ({ ...prev, image: url }))
    }
    setUploadingMain(false)
  }

  // Handle media upload
  const handleMediaUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploadingMedia(index)
    const url = await uploadFile(file)
    if (url) {
      updateMedia(index, "url", url)
    }
    setUploadingMedia(null)
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
    router.push("/admin/articles")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/articles"
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-serif text-xl font-bold">
                {mode === "create" ? "Nouvel article" : "Modifier l'article"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {formData.status === "draft" ? "Brouillon" : "Publié"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/articles">Annuler</Link>
            </Button>
            <Button 
              type="submit" 
              form="article-form"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Enregistrer
            </Button>
          </div>
        </div>
      </div>

      <form id="article-form" onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <div className="bg-background rounded-lg border border-border p-6 space-y-4">
              <h2 className="font-semibold text-lg border-b border-border pb-3">Informations principales</h2>
              
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Titre de l&apos;article <span className="text-primary">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Entrez le titre de l'article"
                  required
                  className="text-lg font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-medium">
                  Résumé / Chapô <span className="text-primary">*</span>
                </Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Court résumé qui apparaît dans les listes d'articles et sous le titre"
                  required
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Ce texte sera affiché dans les aperçus et les résultats de recherche.
                </p>
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-background rounded-lg border border-border p-6 space-y-4">
              <h2 className="font-semibold text-lg border-b border-border pb-3">Contenu de l&apos;article</h2>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Corps de l&apos;article <span className="text-primary">*</span>
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Rédigez le contenu de votre article ici..."
                  required
                  rows={20}
                  className="font-mono text-sm resize-none"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    HTML supporté: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;blockquote&gt;
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formData.content.length} caractères
                  </span>
                </div>
              </div>
            </div>

            {/* Media Card */}
            <div className="bg-background rounded-lg border border-border p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="font-semibold text-lg">Médias additionnels</h2>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addMedia("image")}
                    className="text-xs"
                  >
                    <Image className="h-3 w-3 mr-1" />
                    Image
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addMedia("video")}
                    className="text-xs"
                  >
                    <Video className="h-3 w-3 mr-1" />
                    Vidéo
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addMedia("pdf")}
                    className="text-xs"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>

              {media.length > 0 ? (
                <div className="space-y-3">
                  {media.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex gap-4 p-4 bg-muted/50 rounded-lg border border-border"
                    >
                      <div className="flex items-center text-muted-foreground">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className={`
                            inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded
                            ${item.type === "image" ? "bg-blue-100 text-blue-700" : ""}
                            ${item.type === "video" ? "bg-red-100 text-red-700" : ""}
                            ${item.type === "pdf" ? "bg-green-100 text-green-700" : ""}
                          `}>
                            {item.type === "image" && <Image className="h-3 w-3" />}
                            {item.type === "video" && <Video className="h-3 w-3" />}
                            {item.type === "pdf" && <FileText className="h-3 w-3" />}
                            {item.type.toUpperCase()}
                          </span>
                          <span className="text-sm text-muted-foreground">#{index + 1}</span>
                        </div>

                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              value={item.url}
                              onChange={(e) => updateMedia(index, "url", e.target.value)}
                              placeholder={
                                item.type === "video"
                                  ? "URL YouTube (ex: https://www.youtube.com/embed/...)"
                                  : item.type === "pdf"
                                  ? "URL du fichier PDF"
                                  : "URL de l'image"
                              }
                              className="text-sm"
                            />
                          </div>
                          {(item.type === "image" || item.type === "pdf") && (
                            <div className="relative">
                              <input
                                type="file"
                                accept={item.type === "image" ? "image/*" : ".pdf"}
                                onChange={(e) => handleMediaUpload(index, e)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                disabled={uploadingMedia === index}
                              >
                                {uploadingMedia === index ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Upload className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          )}
                        </div>

                        <Input
                          value={item.caption || ""}
                          onChange={(e) => updateMedia(index, "caption", e.target.value)}
                          placeholder="Légende (optionnel)"
                          className="text-sm"
                        />

                        {item.type === "image" && item.url && (
                          <div className="relative h-32 w-full rounded overflow-hidden bg-muted">
                            <NextImage
                              src={item.url}
                              alt={item.caption || "Preview"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedia(index)}
                        className="text-muted-foreground hover:text-destructive self-start"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Image className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Aucun média additionnel</p>
                  <p className="text-xs mt-1">
                    Ajoutez des images, vidéos YouTube ou documents PDF
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Publication Card */}
            <div className="bg-background rounded-lg border border-border p-6 space-y-4">
              <h2 className="font-semibold text-lg border-b border-border pb-3">Publication</h2>
              
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Statut</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="text-sm font-medium">
                  Auteur <span className="text-primary">*</span>
                </Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Nom de l'auteur"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Catégorie <span className="text-primary">*</span>
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured Image Card */}
            <div className="bg-background rounded-lg border border-border p-6 space-y-4">
              <h2 className="font-semibold text-lg border-b border-border pb-3">Image principale</h2>
              
              {formData.image ? (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <NextImage
                      src={formData.image}
                      alt="Image principale"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{formData.image}</p>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => mainImageRef.current?.click()}
                >
                  {uploadingMain ? (
                    <Loader2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground animate-spin" />
                  ) : (
                    <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  )}
                  <p className="text-sm font-medium">
                    {uploadingMain ? "Téléchargement..." : "Cliquez pour uploader"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG ou WebP (max 5MB)
                  </p>
                </div>
              )}
              
              <input
                ref={mainImageRef}
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="hidden"
              />
              
              <div className="text-center text-xs text-muted-foreground">ou</div>
              
              <Input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Coller l'URL de l'image"
                className="text-sm"
              />
            </div>

            {/* Preview Card */}
            <div className="bg-background rounded-lg border border-border p-6">
              <h2 className="font-semibold text-lg border-b border-border pb-3 mb-4">Aperçu</h2>
              
              <div className="space-y-3">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                  {formData.image ? (
                    <NextImage
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Image className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-primary font-medium uppercase">
                    {categories.find(c => c.slug === formData.category)?.name || "Catégorie"}
                  </p>
                  <h3 className="font-serif font-bold text-sm line-clamp-2">
                    {formData.title || "Titre de l'article"}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {formData.excerpt || "Résumé de l'article..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
