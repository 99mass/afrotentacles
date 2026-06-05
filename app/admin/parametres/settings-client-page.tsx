"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Pencil, Trash2, Loader2, Link as LinkIcon, Twitter, Linkedin, Facebook, Instagram, Youtube, Github, Send, Mail, MessageCircle, Upload, Video, FileVideo, X, Play, Eye, EyeOff, Copy, Check, Tv } from "lucide-react"
import { toast } from "sonner"
import { createSocialLink, updateSocialLink, deleteSocialLink, updateYouTubeSettings, updateContactLinks, updateVideo, deleteVideo, getSignedVideoUploadUrl, saveVideoMetadata, type SocialLink, type YouTubeSettings, type ContactLinks, type Video as VideoType } from "@/lib/actions/settings"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface SettingsClientPageProps {
  initialLinks: SocialLink[]
  initialYouTubeSettings: YouTubeSettings | null
  initialContactLinks: ContactLinks | null
  initialVideos: VideoType[]
}

const AVAILABLE_ICONS = [
  { id: "Twitter", name: "Twitter / X", icon: Twitter },
  { id: "Facebook", name: "Facebook", icon: Facebook },
  { id: "Linkedin", name: "LinkedIn", icon: Linkedin },
  { id: "Instagram", name: "Instagram", icon: Instagram },
  { id: "Youtube", name: "YouTube", icon: Youtube },
  { id: "Github", name: "GitHub", icon: Github },
  { id: "Send", name: "Telegram", icon: Send },
  { id: "Link", name: "Autre lien", icon: LinkIcon },
]

export function SettingsClientPage({ initialLinks, initialYouTubeSettings, initialContactLinks, initialVideos }: SettingsClientPageProps) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null)
  
  // YouTube state
  const [youtubeSettings, setYouTubeSettings] = useState<YouTubeSettings>(
    initialYouTubeSettings || { url: "", is_active: false, articles_count: 3, video_type: 'youtube', uploaded_video_url: '' }
  )
  const [isYouTubeSaving, setIsYouTubeSaving] = useState(false)

  // Contact Links state
  const [contactLinks, setContactLinks] = useState<ContactLinks>(
    initialContactLinks || {
      newsletter_is_active: false,
      newsletter_url: "",
      whatsapp_is_active: false,
      whatsapp_number: "",
      email_is_active: false,
      email_address: ""
    }
  )
  const [isContactSaving, setIsContactSaving] = useState(false)

  // Videos state
  const [videos, setVideos] = useState<VideoType[]>(initialVideos)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [videoTitle, setVideoTitle] = useState("")
  const [videoDescription, setVideoDescription] = useState("")
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null)
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false)
  const [isVideoSaving, setIsVideoSaving] = useState(false)
  const [playingVideo, setPlayingVideo] = useState<VideoType | null>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [copiedVideoId, setCopiedVideoId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    icon_name: "Link",
    is_active: true,
    order_index: 0
  })

  const resetForm = () => {
    setFormData({ platform: "", url: "", icon_name: "Link", is_active: true, order_index: links.length })
    setEditingLink(null)
  }

  const handleOpenDialog = (link?: SocialLink) => {
    if (link) {
      setEditingLink(link)
      setFormData({
        platform: link.platform,
        url: link.url,
        icon_name: link.icon_name,
        is_active: link.is_active,
        order_index: link.order_index
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (editingLink) {
        const result = await updateSocialLink(editingLink.id, formData)
        if (result.error) throw new Error(result.error)
        
        setLinks(links.map(l => 
          l.id === editingLink.id ? { ...l, ...formData } : l
        ).sort((a, b) => a.order_index - b.order_index))
        toast.success("Lien mis à jour avec succès")
      } else {
        const result = await createSocialLink(formData)
        if (result.error) throw new Error(result.error)
        
        if (result.data && result.data[0]) {
          setLinks([...links, result.data[0]].sort((a, b) => a.order_index - b.order_index))
          toast.success("Lien créé avec succès")
        }
      }
      setIsDialogOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce lien ?")) return

    try {
      const result = await deleteSocialLink(id)
      if (result.error) throw new Error(result.error)
      
      setLinks(links.filter(l => l.id !== id))
      toast.success("Lien supprimé avec succès")
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue")
    }
  }

  const convertYouTubeToEmbed = (url: string): string => {
    if (!url) return ""
    
    // If it's already in embed format, return as is
    if (url.includes("/embed/")) return url
    
    // Extract video ID from various formats
    let videoId = ""
    
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    if (url.includes("youtube.com/watch")) {
      const match = url.match(/v=([a-zA-Z0-9_-]{11})/)
      videoId = match ? match[1] : ""
    }
    // Format: https://youtu.be/VIDEO_ID
    else if (url.includes("youtu.be/")) {
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
      videoId = match ? match[1] : ""
    }
    // Format: just the video ID
    else if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      videoId = url
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }

  const handleYouTubeSave = async () => {
    // Convert URL to embed format before saving
    const embedUrl = convertYouTubeToEmbed(youtubeSettings.url)
    const updatedSettings = { ...youtubeSettings, url: embedUrl }
    
    setIsYouTubeSaving(true)
    try {
      const result = await updateYouTubeSettings(updatedSettings)
      if (result.error) throw new Error(result.error)
      
      // Update state with converted URL
      setYouTubeSettings(updatedSettings)
      toast.success("Paramètres YouTube mis à jour avec succès")
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue")
    } finally {
      setIsYouTubeSaving(false)
    }
  }

  const handleContactSave = async () => {
    setIsContactSaving(true)
    try {
      const result = await updateContactLinks(contactLinks)
      if (result.error) throw new Error(result.error)
      toast.success("Paramètres de contact mis à jour avec succès")
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue")
    } finally {
      setIsContactSaving(false)
    }
  }

  // ========== Video Handlers ==========
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleVideoUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format vidéo non supporté. Formats acceptés : MP4, WebM, OGG, MOV, AVI')
      return
    }

    // Validate file size (500MB max)
    const maxSize = 500 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('La vidéo dépasse la taille maximale de 500 MB')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // 1. Get signed upload URL from server action
      const signedUrlResult = await getSignedVideoUploadUrl(file.name, file.type)
      if (signedUrlResult.error || !signedUrlResult.signedUrl) {
        throw new Error(signedUrlResult.error || "Impossible d'obtenir une URL d'upload")
      }
      
      const { signedUrl, storagePath, publicUrl } = signedUrlResult

      // 2. Upload file directly to Supabase Storage signed URL
      const xhr = new XMLHttpRequest()
      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100)
            setUploadProgress(percent)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error("Erreur lors de l'envoi du fichier vers le stockage"))
          }
        })

        xhr.addEventListener('error', () => reject(new Error('Erreur réseau lors de l\'upload')))
        xhr.addEventListener('abort', () => reject(new Error('Upload annulé')))

        xhr.open('PUT', signedUrl)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })

      await uploadPromise

      // 3. Save metadata to DB using server action
      const metadataResult = await saveVideoMetadata({
        title: videoTitle || file.name.replace(/\.[^/.]+$/, ''),
        description: videoDescription,
        url: publicUrl,
        storage_path: storagePath,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        is_active: true
      })

      if (metadataResult.error || !metadataResult.video) {
        throw new Error(metadataResult.error || 'Erreur lors de la sauvegarde des métadonnées')
      }

      setVideos(prev => [metadataResult.video, ...prev])
      toast.success('Vidéo uploadée avec succès !')
      setVideoTitle('')
      setVideoDescription('')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'upload de la vidéo')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleVideoUpload(files[0])
    }
  }, [videoTitle, videoDescription])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleVideoUpload(files[0])
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleVideoEdit = (video: VideoType) => {
    setEditingVideo(video)
    setIsVideoDialogOpen(true)
  }

  const handleVideoUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingVideo) return

    setIsVideoSaving(true)
    try {
      const result = await updateVideo(editingVideo.id, {
        title: editingVideo.title,
        description: editingVideo.description,
        is_active: editingVideo.is_active
      })
      if (result.error) throw new Error(result.error)
      
      setVideos(prev => prev.map(v => v.id === editingVideo.id ? { ...v, ...editingVideo } : v))
      setIsVideoDialogOpen(false)
      setEditingVideo(null)
      toast.success('Vidéo mise à jour avec succès')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour')
    } finally {
      setIsVideoSaving(false)
    }
  }

  const handleVideoDelete = async (video: VideoType) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la vidéo "${video.title}" ? Cette action est irréversible.`)) return

    try {
      const result = await deleteVideo(video.id, video.storage_path)
      if (result.error) throw new Error(result.error)
      
      setVideos(prev => prev.filter(v => v.id !== video.id))
      toast.success('Vidéo supprimée avec succès')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression')
    }
  }

  const handleToggleVideoActive = async (video: VideoType) => {
    try {
      const result = await updateVideo(video.id, { is_active: !video.is_active })
      if (result.error) throw new Error(result.error)
      
      setVideos(prev => prev.map(v => v.id === video.id ? { ...v, is_active: !v.is_active } : v))
      toast.success(video.is_active ? 'Vidéo désactivée' : 'Vidéo activée')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour')
    }
  }

  const handleCopyVideoLink = async (video: VideoType) => {
    try {
      await navigator.clipboard.writeText(video.url)
      setCopiedVideoId(video.id)
      toast.success('Lien copié dans le presse-papier !')
      setTimeout(() => setCopiedVideoId(null), 2000)
    } catch {
      toast.error('Impossible de copier le lien')
    }
  }

  const handlePlayVideo = (video: VideoType) => {
    setPlayingVideo(video)
    setIsPlayerOpen(true)
  }

  const handleSetAsLesplusLus = async (video: VideoType) => {
    setIsYouTubeSaving(true)
    try {
      const updatedSettings: YouTubeSettings = {
        ...youtubeSettings,
        is_active: true,
        video_type: 'uploaded',
        uploaded_video_url: video.url,
      }
      const result = await updateYouTubeSettings(updatedSettings)
      if (result.error) throw new Error(result.error)
      
      setYouTubeSettings(updatedSettings)
      toast.success(`"${video.title}" définie comme vidéo de la section Les plus lus !`)
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour')
    } finally {
      setIsYouTubeSaving(false)
    }
  }

  const getIconComponent = (iconName: string) => {
    const iconConfig = AVAILABLE_ICONS.find(i => i.id === iconName)
    const IconComponent = iconConfig ? iconConfig.icon : LinkIcon
    return <IconComponent className="h-5 w-5" />
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Réseaux Sociaux</h2>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Ajouter un réseau
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden max-w-4xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium w-16">Ordre</th>
                <th className="px-6 py-4 font-medium">Plateforme</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Lien URL</th>
                <th className="px-6 py-4 font-medium text-center">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {links.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Aucun lien social configuré.
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-center font-medium">
                      {link.order_index}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-muted-foreground">
                          {getIconComponent(link.icon_name)}
                        </div>
                        <span className="font-medium">{link.platform}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground hidden md:table-cell max-w-50 truncate">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                        {link.url}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        link.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {link.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenDialog(link)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(link.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingLink ? "Modifier le lien" : "Ajouter un réseau social"}</DialogTitle>
              <DialogDescription>
                Configurez les liens qui s'afficheront dans le header et footer.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Nom de la plateforme *</Label>
                  <Input 
                    id="platform" 
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    placeholder="ex: Twitter"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order_index">Ordre d'affichage</Label>
                  <Input 
                    id="order_index" 
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">Lien complet (URL) *</Label>
                <Input 
                  id="url" 
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Icône</Label>
                <Select 
                  value={formData.icon_name} 
                  onValueChange={(value) => setFormData({...formData, icon_name: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une icône" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_ICONS.map((icon) => (
                      <SelectItem key={icon.id} value={icon.id}>
                        <div className="flex items-center gap-2">
                          <icon.icon className="h-4 w-4" />
                          <span>{icon.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="is_active" className="cursor-pointer">Activer ce lien</Label>
                <Switch 
                  id="is_active" 
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingLink ? "Mettre à jour" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Video Settings Section - "Les plus lus" */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Vidéo - Section "Les plus lus"</h2>
        
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 max-w-2xl">
          <div className="space-y-6">
            {/* Enable/Disable Video */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div>
                <Label className="text-base font-semibold cursor-pointer">Activer la vidéo</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Affiche une vidéo dans la sidebar "Les plus lus"
                </p>
              </div>
              <Switch 
                checked={youtubeSettings.is_active}
                onCheckedChange={(checked) => setYouTubeSettings({...youtubeSettings, is_active: checked})}
              />
            </div>

            {youtubeSettings.is_active && (
              <>
                {/* Video Source Selector */}
                <div className="space-y-3">
                  <Label>Source de la vidéo</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setYouTubeSettings({...youtubeSettings, video_type: 'youtube'})}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                        (youtubeSettings.video_type || 'youtube') === 'youtube'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <Youtube className={`h-5 w-5 flex-shrink-0 ${(youtubeSettings.video_type || 'youtube') === 'youtube' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div>
                        <p className="text-sm font-medium">YouTube</p>
                        <p className="text-xs text-muted-foreground">Lien YouTube</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setYouTubeSettings({...youtubeSettings, video_type: 'uploaded'})}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                        youtubeSettings.video_type === 'uploaded'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <Upload className={`h-5 w-5 flex-shrink-0 ${youtubeSettings.video_type === 'uploaded' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div>
                        <p className="text-sm font-medium">Vidéo uploadée</p>
                        <p className="text-xs text-muted-foreground">Fichier uploadé</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* YouTube URL Input */}
                {(youtubeSettings.video_type || 'youtube') === 'youtube' && (
                  <div className="space-y-2">
                    <Label htmlFor="youtube_url">Lien YouTube</Label>
                    <Input 
                      id="youtube_url" 
                      value={youtubeSettings.url}
                      onChange={(e) => setYouTubeSettings({...youtubeSettings, url: e.target.value})}
                      placeholder="Coller l'URL YouTube" 
                    />
                  </div>
                )}

                {/* Uploaded Video Selector */}
                {youtubeSettings.video_type === 'uploaded' && (
                  <div className="space-y-3">
                    <Label>Vidéo sélectionnée</Label>
                    {youtubeSettings.uploaded_video_url ? (
                      <div className="rounded-lg border border-border p-3 bg-muted/20">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0 w-24 aspect-video rounded overflow-hidden bg-black">
                            <video 
                              src={youtubeSettings.uploaded_video_url} 
                              className="w-full h-full object-cover"
                              preload="metadata"
                              muted
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {videos.find(v => v.url === youtubeSettings.uploaded_video_url)?.title || 'Vidéo sélectionnée'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {videos.find(v => v.url === youtubeSettings.uploaded_video_url)?.file_name || ''}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setYouTubeSettings({...youtubeSettings, uploaded_video_url: ''})}
                            className="h-8 text-xs text-destructive hover:text-destructive"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Aucune vidéo sélectionnée.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Utilisez le bouton "Mettre en Les plus lus" sur une vidéo uploadée ci-dessous.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Preview */}
                {(youtubeSettings.video_type || 'youtube') === 'youtube' && youtubeSettings.url && (
                  <div className="space-y-2">
                    <Label>Aperçu</Label>
                    <div className="bg-black rounded-lg overflow-hidden aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={convertYouTubeToEmbed(youtubeSettings.url)}
                        title="Aperçu vidéo YouTube"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                {youtubeSettings.video_type === 'uploaded' && youtubeSettings.uploaded_video_url && (
                  <div className="space-y-2">
                    <Label>Aperçu</Label>
                    <div className="bg-black rounded-lg overflow-hidden aspect-video">
                      <video
                        src={youtubeSettings.uploaded_video_url}
                        controls
                        className="w-full h-full"
                        preload="metadata"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Save Button */}
            <Button 
              onClick={handleYouTubeSave}
              disabled={isYouTubeSaving}
              className="w-full"
            >
              {isYouTubeSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enregistrer les paramètres vidéo
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Links Settings Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Liens de Contact - Footer</h2>
        
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 max-w-2xl space-y-8">
          {/* Newsletter Subscription */}
          <div className="space-y-4 pb-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold cursor-pointer flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Newsletter
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Lien d'abonnement à la newsletter
                </p>
              </div>
              <Switch 
                checked={contactLinks.newsletter_is_active}
                onCheckedChange={(checked) => setContactLinks({...contactLinks, newsletter_is_active: checked})}
              />
            </div>
            {contactLinks.newsletter_is_active && (
              <div className="space-y-2">
                <Label htmlFor="newsletter_url">URL Newsletter</Label>
                <Input 
                  id="newsletter_url" 
                  value={contactLinks.newsletter_url}
                  onChange={(e) => setContactLinks({...contactLinks, newsletter_url: e.target.value})}
                  placeholder="https://..."
                />
              </div>
            )}
          </div>

          {/* WhatsApp Contact */}
          <div className="space-y-4 pb-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold cursor-pointer flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Numéro WhatsApp pour le contact
                </p>
              </div>
              <Switch 
                checked={contactLinks.whatsapp_is_active}
                onCheckedChange={(checked) => setContactLinks({...contactLinks, whatsapp_is_active: checked})}
              />
            </div>
            {contactLinks.whatsapp_is_active && (
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">Numéro WhatsApp</Label>
                <Input 
                  id="whatsapp_number" 
                  value={contactLinks.whatsapp_number}
                  onChange={(e) => setContactLinks({...contactLinks, whatsapp_number: e.target.value})}
                  placeholder="ex: +221771234567"
                />
                <p className="text-xs text-muted-foreground">
                  Format: +[code pays][numéro] (ex: +221771234567)
                </p>
              </div>
            )}
          </div>

          {/* Email Contact */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold cursor-pointer flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Adresse email pour le contact
                </p>
              </div>
              <Switch 
                checked={contactLinks.email_is_active}
                onCheckedChange={(checked) => setContactLinks({...contactLinks, email_is_active: checked})}
              />
            </div>
            {contactLinks.email_is_active && (
              <div className="space-y-2">
                <Label htmlFor="email_address">Adresse Email</Label>
                <Input 
                  id="email_address" 
                  type="email"
                  value={contactLinks.email_address}
                  onChange={(e) => setContactLinks({...contactLinks, email_address: e.target.value})}
                  placeholder="contact@afrotentacles.org"
                />
              </div>
            )}
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleContactSave}
            disabled={isContactSaving}
            className="w-full mt-6"
          >
            {isContactSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Enregistrer les paramètres de contact
          </Button>
        </div>
      </div>

      {/* Video Upload Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Video className="h-5 w-5" />
          Vidéos Uploadées
        </h2>
        
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 max-w-4xl space-y-6">
          {/* Upload Title & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="video_title">Titre de la vidéo</Label>
              <Input 
                id="video_title" 
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Titre de la vidéo (optionnel)"
                disabled={isUploading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video_description">Description</Label>
              <Input 
                id="video_description" 
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="Description courte (optionnel)"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragging 
                ? 'border-primary bg-primary/5 scale-[1.02]' 
                : isUploading 
                  ? 'border-muted cursor-not-allowed opacity-60' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
            
            {isUploading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Upload en cours... {uploadProgress}%</p>
                  <Progress value={uploadProgress} className="h-2 max-w-xs mx-auto" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-base font-medium">
                    Glissez-déposez une vidéo ici
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ou cliquez pour parcourir vos fichiers
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Formats : MP4, WebM, OGG, MOV, AVI — Max 500 MB
                </p>
              </div>
            )}
          </div>

          {/* Videos List */}
          {videos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {videos.length} vidéo{videos.length > 1 ? 's' : ''} uploadée{videos.length > 1 ? 's' : ''}
              </h3>
              <div className="space-y-3">
                {videos.map((video) => (
                  <div 
                    key={video.id} 
                    className={`group bg-muted/30 rounded-lg border p-4 hover:bg-muted/50 transition-all duration-200 ${
                      youtubeSettings.video_type === 'uploaded' && youtubeSettings.uploaded_video_url === video.url
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Video Preview Thumbnail - Click to play */}
                      <div 
                        className="relative flex-shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-black cursor-pointer"
                        onClick={() => handlePlayVideo(video)}
                      >
                        <video 
                          src={video.url} 
                          className="w-full h-full object-cover"
                          preload="metadata"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                            <Play className="h-6 w-6 text-white" fill="white" />
                          </div>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-medium truncate">{video.title}</h4>
                            {video.description && (
                              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{video.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {youtubeSettings.video_type === 'uploaded' && youtubeSettings.uploaded_video_url === video.url && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary gap-1">
                                <Tv className="h-3 w-3" />
                                Les plus lus
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              video.is_active 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {video.is_active ? "Actif" : "Inactif"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileVideo className="h-3 w-3" />
                            {video.file_name}
                          </span>
                          <span>{formatFileSize(video.file_size)}</span>
                          <span>{new Date(video.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1 mt-3 flex-wrap">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handlePlayVideo(video)}
                            className="h-8 text-xs gap-1.5"
                          >
                            <Play className="h-3.5 w-3.5" />
                            Lire
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopyVideoLink(video)}
                            className="h-8 text-xs gap-1.5"
                          >
                            {copiedVideoId === video.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                            {copiedVideoId === video.id ? 'Copié !' : 'Copier le lien'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSetAsLesplusLus(video)}
                            disabled={isYouTubeSaving}
                            className={`h-8 text-xs gap-1.5 ${
                              youtubeSettings.video_type === 'uploaded' && youtubeSettings.uploaded_video_url === video.url
                                ? 'text-primary'
                                : ''
                            }`}
                          >
                            <Tv className="h-3.5 w-3.5" />
                            {youtubeSettings.video_type === 'uploaded' && youtubeSettings.uploaded_video_url === video.url
                              ? 'Vidéo Les plus lus ✓'
                              : 'Mettre en Les plus lus'}
                          </Button>
                          <div className="border-l border-border h-4 mx-1" />
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleToggleVideoActive(video)}
                            className="h-8 text-xs gap-1.5"
                          >
                            {video.is_active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            {video.is_active ? 'Désactiver' : 'Activer'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleVideoEdit(video)}
                            className="h-8 text-xs gap-1.5"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Modifier
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleVideoDelete(video)}
                            className="h-8 text-xs gap-1.5 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {videos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileVideo className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune vidéo uploadée pour le moment.</p>
              <p className="text-xs mt-1">Uploadez votre première vidéo ci-dessus.</p>
            </div>
          )}
        </div>
      </div>

      {/* Video Edit Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent>
          <form onSubmit={handleVideoUpdate}>
            <DialogHeader>
              <DialogTitle>Modifier la vidéo</DialogTitle>
              <DialogDescription>
                Modifier les informations de la vidéo.
              </DialogDescription>
            </DialogHeader>
            
            {editingVideo && (
              <div className="space-y-4 py-4">
                {/* Video Preview */}
                <div className="rounded-lg overflow-hidden bg-black aspect-video">
                  <video 
                    src={editingVideo.url} 
                    controls 
                    className="w-full h-full"
                    preload="metadata"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_video_title">Titre *</Label>
                  <Input 
                    id="edit_video_title" 
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({...editingVideo, title: e.target.value})}
                    placeholder="Titre de la vidéo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_video_desc">Description</Label>
                  <Textarea 
                    id="edit_video_desc" 
                    value={editingVideo.description}
                    onChange={(e) => setEditingVideo({...editingVideo, description: e.target.value})}
                    placeholder="Description de la vidéo"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="edit_video_active" className="cursor-pointer">Vidéo active</Label>
                  <Switch 
                    id="edit_video_active" 
                    checked={editingVideo.is_active}
                    onCheckedChange={(checked) => setEditingVideo({...editingVideo, is_active: checked})}
                  />
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Fichier : {editingVideo.file_name}</p>
                  <p>Taille : {formatFileSize(editingVideo.file_size)}</p>
                  <p>Uploadée le : {new Date(editingVideo.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsVideoDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isVideoSaving}>
                {isVideoSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Mettre à jour
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Video Player Dialog */}
      <Dialog open={isPlayerOpen} onOpenChange={(open) => { setIsPlayerOpen(open); if (!open) setPlayingVideo(null) }}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>{playingVideo?.title || 'Lecture vidéo'}</DialogTitle>
            {playingVideo?.description && (
              <DialogDescription>{playingVideo.description}</DialogDescription>
            )}
          </DialogHeader>
          
          {playingVideo && (
            <div className="px-6 pb-6 space-y-4">
              <div className="rounded-lg overflow-hidden bg-black aspect-video">
                <video 
                  src={playingVideo.url} 
                  controls 
                  autoPlay
                  className="w-full h-full"
                  preload="auto"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <FileVideo className="h-3 w-3" />
                    {playingVideo.file_name}
                  </span>
                  <span>{formatFileSize(playingVideo.file_size)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopyVideoLink(playingVideo)}
                    className="h-8 text-xs gap-1.5"
                  >
                    {copiedVideoId === playingVideo.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedVideoId === playingVideo.id ? 'Copié !' : 'Copier le lien'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSetAsLesplusLus(playingVideo)}
                    disabled={isYouTubeSaving}
                    className="h-8 text-xs gap-1.5"
                  >
                    <Tv className="h-3.5 w-3.5" />
                    Mettre en Les plus lus
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
