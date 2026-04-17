import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// This endpoint creates the default admin user if it doesn't exist
export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

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

  const adminEmail = "admin@afrotentacles.com"
  const adminPassword = "afrotacles@123"

  // Check if admin already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const adminExists = existingUsers?.users?.some(
    (user) => user.email === adminEmail
  )

  if (adminExists) {
    return NextResponse.json({ message: "Admin already exists" })
  }

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

  return NextResponse.json({
    message: "Admin created successfully",
    user: { email: data.user?.email },
  })
}
