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

export interface YouTubeSettings {
  url: string
  is_active: boolean
  articles_count: number
  video_type: 'youtube' | 'uploaded'
  uploaded_video_url: string
}

export async function getYouTubeSettings(): Promise<YouTubeSettings | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "youtube_video")
    .single()

  if (error) {
    console.error("Error fetching YouTube settings:", error)
    return null
  }

  return data?.value as YouTubeSettings | null
}

export async function updateYouTubeSettings(settings: YouTubeSettings) {
  const supabase = await createClient()
  
  // First try to update if it exists
  const { data: existingData, error: selectError } = await supabase
    .from("site_settings")
    .select("id")
    .eq("key", "youtube_video")
    .single()

  if (selectError && selectError.code !== "PGRST116") {
    // Error other than "not found"
    return { error: selectError.message }
  }

  // If exists, update it; otherwise insert
  let result
  if (existingData?.id) {
    result = await supabase
      .from("site_settings")
      .update({ value: settings, updated_at: new Date().toISOString() })
      .eq("key", "youtube_video")
      .select()
  } else {
    result = await supabase
      .from("site_settings")
      .insert([{ key: "youtube_video", value: settings }])
      .select()
  }

  if (result.error) {
    return { error: result.error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/parametres")
  return { success: true, data: result.data }
}

export interface ContactLinks {
  newsletter_is_active: boolean
  newsletter_url: string
  whatsapp_is_active: boolean
  whatsapp_number: string
  email_is_active: boolean
  email_address: string
}

export async function getContactLinks(): Promise<ContactLinks | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "contact_links")
    .single()

  if (error) {
    console.error("Error fetching contact links:", error)
    return null
  }

  return data?.value as ContactLinks | null
}

export async function updateContactLinks(settings: ContactLinks) {
  const supabase = await createClient()
  
  // First try to update if it exists
  const { data: existingData, error: selectError } = await supabase
    .from("site_settings")
    .select("id")
    .eq("key", "contact_links")
    .single()

  if (selectError && selectError.code !== "PGRST116") {
    // Error other than "not found"
    return { error: selectError.message }
  }

  // If exists, update it; otherwise insert
  let result
  if (existingData?.id) {
    result = await supabase
      .from("site_settings")
      .update({ value: settings, updated_at: new Date().toISOString() })
      .eq("key", "contact_links")
      .select()
  } else {
    result = await supabase
      .from("site_settings")
      .insert([{ key: "contact_links", value: settings }])
      .select()
  }

  if (result.error) {
    return { error: result.error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/parametres")
  return { success: true, data: result.data }
}

// ========== Videos ==========

export interface Video {
  id: string
  title: string
  description: string
  url: string
  storage_path: string
  file_name: string
  file_size: number
  file_type: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getVideos(): Promise<Video[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching videos:", error)
    return []
  }

  return data as Video[]
}

export async function updateVideo(id: string, videoData: Partial<Video>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("videos")
    .update({ ...videoData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/parametres")
  return { success: true, data }
}

export async function deleteVideo(id: string, storagePath: string) {
  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js")
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const adminSupabase = createSupabaseClient(supabaseUrl, supabaseServiceKey)

  // Delete from storage
  if (storagePath) {
    const { error: storageError } = await adminSupabase.storage
      .from("media")
      .remove([storagePath])
    
    if (storageError) {
      console.error("Error deleting from storage:", storageError)
    }
  }

  // Delete from database
  const supabase = await createClient()
  const { error } = await supabase
    .from("videos")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/parametres")
  return { success: true }
}

export async function getSignedVideoUploadUrl(fileName: string, fileType: string) {
  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js")
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const adminSupabase = createSupabaseClient(supabaseUrl, supabaseServiceKey)
  
  const timestamp = Date.now()
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const storagePath = `videos/${timestamp}-${sanitizedName}`

  const { data, error } = await adminSupabase.storage
    .from("media")
    .createSignedUploadUrl(storagePath)

  if (error) {
    return { error: error.message }
  }

  const { data: publicUrlData } = adminSupabase.storage
    .from("media")
    .getPublicUrl(storagePath)

  return { 
    success: true, 
    signedUrl: data.signedUrl, 
    token: data.token, 
    storagePath, 
    publicUrl: publicUrlData.publicUrl 
  }
}

export async function saveVideoMetadata(videoData: {
  title: string
  description: string
  url: string
  storage_path: string
  file_name: string
  file_size: number
  file_type: string
  is_active: boolean
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("videos")
    .insert([videoData])
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/parametres")
  return { success: true, video: data as Video }
}
