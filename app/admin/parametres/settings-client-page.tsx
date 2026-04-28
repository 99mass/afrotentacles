"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Pencil, Trash2, Loader2, Link as LinkIcon, Twitter, Linkedin, Facebook, Instagram, Youtube, Github, Send, Mail, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { createSocialLink, updateSocialLink, deleteSocialLink, updateYouTubeSettings, updateContactLinks, type SocialLink, type YouTubeSettings, type ContactLinks } from "@/lib/actions/settings"
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

export function SettingsClientPage({ initialLinks, initialYouTubeSettings, initialContactLinks }: SettingsClientPageProps) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null)
  
  // YouTube state
  const [youtubeSettings, setYouTubeSettings] = useState<YouTubeSettings>(
    initialYouTubeSettings || { url: "", is_active: false, articles_count: 3 }
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

      {/* YouTube Settings Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Vidéo YouTube - Section "Les plus lus"</h2>
        
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 max-w-2xl">
          <div className="space-y-6">
            {/* Enable/Disable YouTube */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div>
                <Label className="text-base font-semibold cursor-pointer">Activer la vidéo YouTube</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Si activée : affiche 3 articles + vidéo YouTube<br/>
                  Si désactivée : affiche 5 articles
                </p>
              </div>
              <Switch 
                checked={youtubeSettings.is_active}
                onCheckedChange={(checked) => setYouTubeSettings({...youtubeSettings, is_active: checked})}
              />
            </div>

            {/* YouTube URL Input */}
            <div className="space-y-2">
              <Label htmlFor="youtube_url">Lien YouTube</Label>
              <Input 
                id="youtube_url" 
                value={youtubeSettings.url}
                onChange={(e) => setYouTubeSettings({...youtubeSettings, url: e.target.value})}
                placeholder="Coller l'URL YouTube" 
                disabled={!youtubeSettings.is_active}
              />
              <p className="text-xs text-muted-foreground">
                Formats acceptés:
                <br/>• https://www.youtube.com/watch?v=VIDEO_ID
                <br/>• https://youtu.be/VIDEO_ID
                <br/>• https://www.youtube.com/embed/VIDEO_ID
                <br/>• VIDEO_ID seul
              </p>
            </div>

            {/* Article Count Selector */}
            <div className="space-y-2">
              <Label htmlFor="articles_count">Nombre d'articles à afficher (quand la vidéo est active)</Label>
              <Select 
                value={youtubeSettings.articles_count.toString()} 
                onValueChange={(value) => setYouTubeSettings({...youtubeSettings, articles_count: parseInt(value)})}
                disabled={!youtubeSettings.is_active}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir le nombre d'articles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 article</SelectItem>
                  <SelectItem value="2">2 articles</SelectItem>
                  <SelectItem value="3">3 articles</SelectItem>
                  <SelectItem value="4">4 articles</SelectItem>
                  <SelectItem value="5">5 articles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preview */}
            {youtubeSettings.is_active && youtubeSettings.url && (
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

            {/* Save Button */}
            <Button 
              onClick={handleYouTubeSave}
              disabled={isYouTubeSaving}
              className="w-full"
            >
              {isYouTubeSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enregistrer les paramètres YouTube
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
    </>
  )
}
