"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { type Article, type MediaItem, type ContentBlock } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/rich-text-editor"
import { 
  ArrowLeft, Save, Upload, Trash2, Image, Video, FileText, 
  Loader2, Check, X, Eye, GripVertical, Plus, Type, ArrowUp, ArrowDown
} from "lucide-react"
import Link from "next/link"
import NextImage from "next/image"
import { createArticle, updateArticle } from "@/lib/actions/articles"
import { toast } from "sonner"

interface ArticleEditorProps {
  article?: Article
  mode: "create" | "edit"
  categories: any[]
  authors?: any[]
}

export function ArticleEditor({ article, mode, categories, authors = [] }: ArticleEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState<number | null>(null)
  const mainImageRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: article?.title || "",
    excerpt: article?.excerpt || "",
    category: article?.categorySlug || (categories.length > 0 ? categories[0].slug : ""),
    image: article?.image || "",
    status: article?.status || "draft",
    is_featured: article?.is_featured || false,
  })

  // Parse existing content or media into blocks
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => {
    if (article?.content) {
      try {
        const parsed = JSON.parse(article.content)
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
          return parsed as ContentBlock[]
        }
      } catch {
        // Not JSON, it's HTML/text
      }
      
      // Backward compatibility: Convert raw HTML and existing media to blocks
      const initialBlocks: ContentBlock[] = [
        { id: Math.random().toString(36).substr(2, 9), type: 'text', content: article.content }
      ]
      
      if (article.media && article.media.length > 0) {
        article.media.forEach(m => {
          initialBlocks.push({
            id: Math.random().toString(36).substr(2, 9),
            type: m.type as any,
            url: m.url,
            caption: m.caption
          })
        })
      }
      return initialBlocks
    }
    return [{ id: Math.random().toString(36).substr(2, 9), type: 'text', content: "" }]
  })

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
      updateBlock(index, "url", url)
    }
    setUploadingMedia(null)
  }

  const addBlock = (type: ContentBlock['type']) => {
    const newId = Math.random().toString(36).substr(2, 9)
    const newBlock: ContentBlock = 
      type === 'text' 
        ? { id: newId, type: 'text', content: "" } 
        : { id: newId, type, url: "", caption: "" }
    setBlocks(prev => [...prev, newBlock])

    // Scroll and focus the newly created block
    setTimeout(() => {
      const element = document.getElementById(`block-${newId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
    }, 100)
  }

  const updateBlock = (index: number, field: string, value: string) => {
    setBlocks(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value } as any
      return updated
    })
  }

  const removeBlock = (index: number) => {
    if (blocks.length === 1) return // Keep at least one block
    setBlocks(prev => prev.filter((_, i) => i !== index))
  }
  
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return
    setBlocks(prev => {
      const updated = [...prev]
      const newIndex = direction === 'up' ? index - 1 : index + 1
      const temp = updated[index]
      updated[index] = updated[newIndex]
      updated[newIndex] = temp
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Extract media for backward compatibility in the `article_media` table
      const mediaItems = blocks
        .filter(b => b.type !== 'text' && b.url)
        .map(b => ({
          type: b.type,
          url: (b as any).url,
          caption: (b as any).caption
        }))

      const dataToSave = { 
        ...formData, 
        content: JSON.stringify(blocks), 
        media: mediaItems 
      }

      if (mode === "create") {
        await createArticle(dataToSave)
        toast.success("Article créé avec succès !", {
          description: `"${formData.title}" a été enregistré.`,
        })
      } else if (mode === "edit" && article?.id) {
        await updateArticle(article.id, dataToSave)
        toast.success("Article mis à jour !", {
          description: `"${formData.title}" a été modifié.`,
        })
      }
      
      router.push("/admin/articles")
    } catch (error) {
      console.error("Error saving article:", error)
      toast.error("Une erreur est survenue", {
        description: "Impossible d'enregistrer l'article. Veuillez réessayer.",
      })
    } finally {
      setIsLoading(false)
    }
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

            {/* Content Blocks Card */}
            <div className="bg-background rounded-lg border border-border p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="font-semibold text-lg">Contenu de l&apos;article</h2>
                <div className="flex gap-2 flex-wrap justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addBlock("text")}
                    className="text-xs"
                  >
                    <Type className="h-3 w-3 mr-1" />
                    Texte
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addBlock("image")}
                    className="text-xs"
                  >
                    <Image className="h-3 w-3 mr-1" />
                    Image
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addBlock("video")}
                    className="text-xs"
                  >
                    <Video className="h-3 w-3 mr-1" />
                    Vidéo
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addBlock("pdf")}
                    className="text-xs"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {blocks.map((block, index) => (
                  <div 
                    key={block.id} 
                    className="group flex gap-4 p-4 bg-muted/20 border border-border rounded-lg relative transition-colors focus-within:border-primary/50"
                  >
                    {/* Controls */}
                    <div className="flex flex-col items-center gap-1 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => moveBlock(index, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <GripVertical className="h-4 w-4 my-1 cursor-grab" />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => moveBlock(index, 'down')}
                        disabled={index === blocks.length - 1}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex-1 space-y-3 min-w-0">
                      {/* Block Header */}
                      <div className="flex items-center justify-between">
                        <span className={`
                          inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded
                          ${block.type === 'text' ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" : ""}
                          ${block.type === 'image' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : ""}
                          ${block.type === 'video' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" : ""}
                          ${block.type === 'pdf' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : ""}
                        `}>
                          {block.type === 'text' && <Type className="h-3 w-3" />}
                          {block.type === 'image' && <Image className="h-3 w-3" />}
                          {block.type === 'video' && <Video className="h-3 w-3" />}
                          {block.type === 'pdf' && <FileText className="h-3 w-3" />}
                          {block.type.toUpperCase()}
                        </span>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBlock(index)}
                          className="h-6 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          disabled={blocks.length === 1}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Supprimer
                        </Button>
                      </div>

                      {/* Block Content */}
                      {block.type === 'text' ? (
                        <RichTextEditor
                          value={block.content}
                          onChange={(content) => updateBlock(index, "content", content)}
                          placeholder="Rédigez votre texte ici... Utilisez les boutons pour formater (gras, italique, listes, titres, etc.)"
                        />
                      ) : (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Input
                                id={`block-${block.id}`}
                                value={block.url}
                                onChange={(e) => updateBlock(index, "url", e.target.value)}
                                placeholder={
                                  block.type === "video"
                                    ? "URL YouTube (ex: https://www.youtube.com/embed/...)"
                                    : block.type === "pdf"
                                    ? "URL du fichier PDF"
                                    : "URL de l'image"
                                }
                                className="text-sm"
                              />
                            </div>
                            {(block.type === "image" || block.type === "pdf") && (
                              <div className="relative">
                                <input
                                  type="file"
                                  accept={block.type === "image" ? "image/*" : ".pdf"}
                                  onChange={(e) => handleMediaUpload(index, e)}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="icon"
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
                            value={block.caption || ""}
                            onChange={(e) => updateBlock(index, "caption", e.target.value)}
                            placeholder="Légende (optionnelle)"
                            className="text-sm"
                          />

                          {block.type === "image" && block.url && (
                            <div className="relative h-32 w-full rounded overflow-hidden bg-muted border border-border">
                              <NextImage
                                src={block.url}
                                alt={block.caption || "Preview"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="is_featured" className="text-sm font-medium cursor-pointer">
                  Mettre à la une (Hero Section)
                </Label>
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
