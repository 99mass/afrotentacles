import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// This endpoint creates the default admin user if it doesn't exist
export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY!

  if (!supabaseServiceKey) {
    return NextResponse.json(
      { error: "Service role key not configured" },
      { status: 500 }
    )
  }

  // Use service role client for admin operations
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  // Check if admin already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existingAdmin = existingUsers?.users?.find(
    (user) => user.email === adminEmail
  )

  let adminId = existingAdmin?.id

  if (!existingAdmin) {
    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        is_admin: true,
        full_name: "Administrateur",
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    adminId = data.user?.id
  }

  // Ensure user is in the admins table for RLS policies
  if (adminId) {
    const { data: adminRecord } = await supabase
      .from("admins")
      .select("id")
      .eq("id", adminId)
      .maybeSingle()
      
    if (!adminRecord) {
      await supabase.from("admins").insert({
        id: adminId,
        email: adminEmail
      })
    }
  }

  return NextResponse.json({
    message: "Admin created and configured successfully"
  })
}
