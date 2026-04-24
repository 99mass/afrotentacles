import { getAuthors } from "@/lib/actions/authors"
import { AuthorClientPage } from "./author-client-page"

export const metadata = {
  title: "Auteurs | Administration AfroTentacles",
}

export default async function AuthorsPage() {
  const authors = await getAuthors()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif">Auteurs</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les auteurs des articles de votre blog.
          </p>
        </div>
      </div>
      
      <AuthorClientPage initialAuthors={authors} />
    </div>
  )
}
