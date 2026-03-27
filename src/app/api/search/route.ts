import { NextRequest, NextResponse } from "next/server"
import { getServiceClient } from "@/lib/supabase/service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.trim()
    const category = searchParams.get("category")
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50)

    if (!query || query.length < 2) {
      return NextResponse.json({ tools: [], total: 0 })
    }

    // Text search using pg_trgm similarity
    let dbQuery = getServiceClient()
      .from("tools")
      .select(
        "id, name, slug, tagline, logo_url, pricing_type, category, categories, ph_votes, is_new, is_trending"
      )
      .or(
        `name.ilike.%${query}%,tagline.ilike.%${query}%,description.ilike.%${query}%`
      )
      .order("ph_votes", { ascending: false })
      .limit(limit)

    if (category) {
      dbQuery = dbQuery.contains("categories", [category])
    }

    const { data: tools, error } = await dbQuery

    if (error) {
      console.error("Search error:", error)
      return NextResponse.json(
        { error: "Search failed" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      tools: tools || [],
      total: tools?.length || 0,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
