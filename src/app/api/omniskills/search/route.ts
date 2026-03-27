import { NextRequest, NextResponse } from "next/server"
import { createOmniskillsServiceClient } from "@/lib/supabase/omniskills-server"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim()

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const supabase = createOmniskillsServiceClient()

  const searchWords = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w: string) => w.length > 2)
    .slice(0, 5)

  const orConditions = searchWords
    .map((w: string) => `name.ilike.%${w}%,tagline.ilike.%${w}%,category.ilike.%${w}%,description.ilike.%${w}%`)
    .join(",")

  const { data, error } = orConditions
    ? await supabase
        .from("skills")
        .select("id, name, slug, tagline, category, pricing_type, author, install_count, is_new, is_trending")
        .or(orConditions)
        .order("install_count", { ascending: false })
        .limit(20)
    : await supabase
        .from("skills")
        .select("id, name, slug, tagline, category, pricing_type, author, install_count, is_new, is_trending")
        .order("install_count", { ascending: false })
        .limit(20)

  if (error) {
    return NextResponse.json({ results: [], error: error.message }, { status: 500 })
  }

  return NextResponse.json({ results: data || [] })
}
