"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Pencil, Trash2, Loader2, User as UserIcon } from "lucide-react"
import { toast } from "sonner"
import { createAuthor, updateAuthor, deleteAuthor, type Author } from "@/lib/actions/authors"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AuthorClientPageProps {
  initialAuthors: Author[]
}

export function AuthorClientPage({ initialAuthors }: AuthorClientPageProps) {
  const [authors, setAuthors] = useState<Author[]>(initialAuthors)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatar_url: ""
  })

  const resetForm = () => {
    setFormData({ name: "", bio: "", avatar_url: "" })
    setEditingAuthor(null)
  }

  const handleOpenDialog = (author?: Author) => {
    if (author) {
      setEditingAuthor(author)
      setFormData({
        name: author.name,
        bio: author.bio || "",
        avatar_url: author.avatar_url || ""
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
      if (editingAuthor) {
        const result = await updateAuthor(editingAuthor.id, formData)
        if (result.error) throw new Error(result.error)
        
        setAuthors(authors.map(a => 
          a.id === editingAuthor.id ? { ...a, ...formData } : a
        ))
        toast.success("Auteur mis à jour avec succès")
      } else {
        const result = await createAuthor(formData)
        if (result.error) throw new Error(result.error)
        
        if (result.data && result.data[0]) {
          setAuthors([...authors, result.data[0]])
          toast.success("Auteur créé avec succès")
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
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet auteur ?")) return

    try {
      const result = await deleteAuthor(id)
      if (result.error) throw new Error(result.error)
      
      setAuthors(authors.filter(a => a.id !== id))
      toast.success("Auteur supprimé avec succès")
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue")
    }
  }

  return (
    <>
      <div className="mb-6">
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Nouvel auteur
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium">Nom</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Bio</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {authors.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                    Aucun auteur n'a été créé pour le moment.
                  </td>
                </tr>
              ) : (
                authors.map((author) => (
                  <tr key={author.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                          {author.avatar_url ? (
                            <img src={author.avatar_url} alt={author.name} className="h-full w-full object-cover" />
                          ) : (
                            <UserIcon className="h-4 w-4" />
                          )}
                        </div>
                        <span className="font-medium">{author.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground hidden md:table-cell max-w-[300px] truncate">
                      {author.bio || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenDialog(author)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(author.id)}
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
              <DialogTitle>{editingAuthor ? "Modifier l'auteur" : "Ajouter un auteur"}</DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea 
                  id="bio" 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar_url">URL de l'avatar (optionnel)</Label>
                <Input 
                  id="avatar_url" 
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                  placeholder="https://..."
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingAuthor ? "Mettre à jour" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
