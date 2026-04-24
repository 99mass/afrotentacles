export interface MediaItem {
  type: "image" | "video" | "pdf"
  url: string
  caption?: string
  thumbnail?: string
}

export type ContentBlock = 
  | { id: string; type: 'text'; content: string }
  | { id: string; type: 'image'; url: string; caption?: string }
  | { id: string; type: 'video'; url: string; caption?: string }
  | { id: string; type: 'pdf'; url: string; caption?: string }

export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  categorySlug: string
  date: string
  slug: string
  author: string
  media?: MediaItem[]
  status: "published" | "draft"
  is_featured?: boolean
}


