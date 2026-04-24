"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon_name: string
  is_active: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("order_index", { ascending: true })

  if (error) {
    console.error("Error fetching social links:", error)
    return []
  }

  return data as SocialLink[]
}

export async function getActiveSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true })

  if (error) {
    console.error("Error fetching active social links:", error)
    return []
  }

  return data as SocialLink[]
}

export async function createSocialLink(linkData: Partial<SocialLink>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("social_links")
    .insert([{ ...linkData, updated_at: new Date().toISOString() }])
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/parametres")
  return { success: true, data }
}

export async function updateSocialLink(id: string, linkData: Partial<SocialLink>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("social_links")
    .update({ ...linkData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/parametres")
  return { success: true, data }
}

export async function deleteSocialLink(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("social_links")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/parametres")
  return { success: true }
}
