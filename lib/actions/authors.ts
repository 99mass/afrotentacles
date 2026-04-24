"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Author {
  id: string
  name: string
  bio?: string
  avatar_url?: string
  created_at: string
}

export async function getAuthors(): Promise<Author[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching authors:", error)
    return []
  }

  return data as Author[]
}

export async function getAuthor(id: string): Promise<Author | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching author:", error)
    return null
  }

  return data as Author
}

export async function createAuthor(authorData: Partial<Author>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("authors")
    .insert([authorData])
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/auteurs")
  return { success: true, data }
}

export async function updateAuthor(id: string, authorData: Partial<Author>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("authors")
    .update(authorData)
    .eq("id", id)
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/auteurs")
  return { success: true, data }
}

export async function deleteAuthor(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("authors")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/auteurs")
  return { success: true }
}
