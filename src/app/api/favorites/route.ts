import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

async function getSupabaseUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch { /* ignore */ }
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, user }
}

// GET: list user's favorites
export async function GET() {
  const { supabase, user } = await getSupabaseUser()
  if (!user) return NextResponse.json({ favorites: [] })

  const { data } = await supabase
    .from("favorites")
    .select("tool_id, tools(id, name, slug, tagline, logo_url, pricing_type, category, categories, ph_votes, is_new, is_trending)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const tools = data?.map((f: { tool_id: string; tools: unknown }) => f.tools).filter(Boolean) || []

  return NextResponse.json({ favorites: tools })
}

// POST: add a favorite
export async function POST(request: NextRequest) {
  const { supabase, user } = await getSupabaseUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { toolId } = await request.json()
  if (!toolId) return NextResponse.json({ error: "toolId required" }, { status: 400 })

  // Check max 8 favorites per user
  const { count } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  if (count !== null && count >= 8) {
    return NextResponse.json(
      { error: "max_favorites", message: "Maximum 8 favorites reached" },
      { status: 403 }
    )
  }

  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, tool_id: toolId })

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ success: true, message: "Already favorited" })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// DELETE: remove a favorite
export async function DELETE(request: NextRequest) {
  const { supabase, user } = await getSupabaseUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { toolId } = await request.json()
  if (!toolId) return NextResponse.json({ error: "toolId required" }, { status: 400 })

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("tool_id", toolId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
