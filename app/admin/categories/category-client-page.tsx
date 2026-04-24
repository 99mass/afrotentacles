"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/articles"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

interface CategoryClientPageProps {
  initialCategories: Category[]
}

export function CategoryClientPage({ initialCategories }: CategoryClientPageProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: ""
  })

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "" })
    setEditingCategory(null)
  }

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || ""
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    // Auto-generate slug only if we are creating a new category, or if we want to update it.
    // Usually it's better to auto-generate if the slug is empty or user is typing the name for the first time
    if (!editingCategory) {
      const slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
      setFormData({ ...formData, name, slug })
    } else {
      setFormData({ ...formData, name })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.slug) {
      toast.error("Le nom et le slug sont obligatoires")
      return
    }

    setIsLoading(true)
    try {
      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, formData)
        setCategories(categories.map(c => c.id === updated.id ? updated : c))
        toast.success("Catégorie mise à jour")
      } else {
        const created = await createCategory(formData)
        setCategories([...categories, created])
        toast.success("Catégorie créée avec succès")
      }
      setIsDialogOpen(false)
      resetForm()
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${name}" ?`)) {
      return
    }
    
    try {
      await deleteCategory(id)
      setCategories(categories.filter(c => c.id !== id))
      toast.success("Catégorie supprimée")
    } catch (error: any) {
      toast.error("Impossible de supprimer la catégorie. Elle est peut-être utilisée par des articles.")
    }
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle catégorie
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Nom</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Aucune catégorie trouvée
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <code className="bg-muted px-2 py-1 rounded text-xs">{category.slug}</code>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                      {category.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(category)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id, category.name)}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
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
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </DialogTitle>
            <DialogDescription>
              Gérez les informations de la catégorie ici. Cliquez sur sauvegarder une fois terminé.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Ex: Géoéconomie"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Ex: geoeconomie"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optionnel)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Courte description de la catégorie..."
                rows={3}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sauvegarder
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
