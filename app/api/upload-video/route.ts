import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

// Allow larger video files (up to 500MB)
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string || ''
    const description = formData.get('description') as string || ''

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format vidéo non supporté. Formats acceptés : MP4, WebM, OGG, MOV, AVI' },
        { status: 400 }
      )
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'La vidéo dépasse la taille maximale de 500 MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `videos/${timestamp}-${sanitizedName}`

    // Create a Supabase client with the Service Role key to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(filename)

    // Save video metadata to the videos table
    const { data: videoData, error: dbError } = await supabase
      .from('videos')
      .insert([{
        title: title || file.name.replace(/\.[^/.]+$/, ''),
        description,
        url: publicUrlData.publicUrl,
        storage_path: filename,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        is_active: true
      }])
      .select()

    if (dbError) {
      console.error('Database error:', dbError)
      // If DB insert fails, clean up the uploaded file
      await supabase.storage.from('media').remove([filename])
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      video: videoData?.[0],
      url: publicUrlData.publicUrl
    })
  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json({ error: 'Échec de l\'upload de la vidéo' }, { status: 500 })
  }
}
