"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Pencil, Trash2, Loader2, Link as LinkIcon, Twitter, Linkedin, Facebook, Instagram, Youtube, Github, Send } from "lucide-react"
import { toast } from "sonner"
import { createSocialLink, updateSocialLink, deleteSocialLink, type SocialLink } from "@/lib/actions/settings"
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

export function SettingsClientPage({ initialLinks }: SettingsClientPageProps) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null)
  
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
                    <td className="px-6 py-4 text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
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
    </>
  )
}
