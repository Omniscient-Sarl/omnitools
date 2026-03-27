import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ favorites: [] })
  }

  const { data, error } = await supabase
    .from("skill_favorites")
    .select("skill_id")
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ favorites: [] })
  }

  return NextResponse.json({ favorites: data || [] })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { skillId } = body

  if (!skillId) {
    return NextResponse.json({ error: "skillId required" }, { status: 400 })
  }

  // Check max 8
  const { count } = await supabase
    .from("skill_favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  if (count && count >= 8) {
    return NextResponse.json({ error: "max_favorites" }, { status: 400 })
  }

  const { error } = await supabase
    .from("skill_favorites")
    .insert({ user_id: user.id, skill_id: skillId })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { skillId } = body

  if (!skillId) {
    return NextResponse.json({ error: "skillId required" }, { status: 400 })
  }

  const { error } = await supabase
    .from("skill_favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("skill_id", skillId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
