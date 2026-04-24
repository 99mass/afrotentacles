import { getCategories } from "@/lib/actions/articles"
import { CategoryClientPage } from "./category-client-page"

export const metadata = {
  title: "Catégories | Administration AfroTentacles",
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif">Catégories</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les thématiques abordées dans vos articles.
          </p>
        </div>
      </div>
      
      <CategoryClientPage initialCategories={categories} />
    </div>
  )
}
