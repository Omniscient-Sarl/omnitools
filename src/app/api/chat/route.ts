import { NextRequest, NextResponse } from "next/server"
import { getServiceClient } from "@/lib/supabase/service"
import { chatWithTools } from "@/lib/openrouter"
import {
  authenticatedLimiter,
  anonymousLimiter,
  getCachedResponse,
  setCachedResponse,
} from "@/lib/upstash"

export async function POST(request: NextRequest) {
  try {
    const { question, locale = "en", userId } = await request.json()

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      )
    }

    // Sanitize input (basic XSS protection)
    const sanitizedQuestion = question.trim().slice(0, 500)

    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const identifier = userId || `ip:${ip}`
    const limiter = userId ? authenticatedLimiter : anonymousLimiter

    const { success, remaining, reset } = await limiter.limit(identifier)

    if (!success) {
      const resetInMinutes = Math.ceil((reset - Date.now()) / 60000)
      return NextResponse.json(
        {
          error: "rate_limit",
          message: `Rate limit exceeded. Try again in ${resetInMinutes} minutes.`,
          remaining: 0,
          resetInMinutes,
          isAnonymous: !userId,
        },
        { status: 429 }
      )
    }

    // Check cache
    const cached = await getCachedResponse(sanitizedQuestion)
    if (cached) {
      const parsed = JSON.parse(cached)
      return NextResponse.json({
        ...parsed,
        remaining,
        cached: true,
      })
    }

    // Search tools using text search on name, tagline, description, category
    const searchWords = sanitizedQuestion
      .toLowerCase()
      .replace(/[^a-z0-9àâäéèêëïîôùûüç\s]/g, "")
      .split(/\s+/)
      .filter((w: string) => w.length > 2)
      .slice(0, 5)

    const selectCols = "name, slug, tagline, description, pricing_type, category, keywords, best_for, not_good_for, integrations, input_types, output_types"

    // Search with ilike on multiple columns
    const orConditions = searchWords
      .map((w: string) => `name.ilike.%${w}%,tagline.ilike.%${w}%,category.ilike.%${w}%,description.ilike.%${w}%`)
      .join(",")

    const toolsResult = orConditions
      ? await getServiceClient().from("tools").select(selectCols).or(orConditions).order("ph_votes", { ascending: false }).limit(20)
      : await getServiceClient().from("tools").select(selectCols).order("ph_votes", { ascending: false }).limit(15)

    let tools = toolsResult.data
    let searchError = toolsResult.error

    // Fallback: if too few results, supplement with top tools
    if (!tools || tools.length < 10) {
      const fallback = await getServiceClient().from("tools").select(selectCols).order("ph_votes", { ascending: false }).limit(15)
      if (fallback.data) {
        const existingSlugs = new Set((tools || []).map((t) => t.slug))
        const extra = fallback.data.filter((t) => !existingSlugs.has(t.slug))
        tools = [...(tools || []), ...extra].slice(0, 20)
      }
      if (!tools || tools.length === 0) {
        tools = fallback.data
        searchError = fallback.error
      }
    }

    if (searchError) {
      console.error("Supabase search error:", searchError)
      return NextResponse.json(
        { error: "Failed to search tools" },
        { status: 500 }
      )
    }

    // If no tools in DB yet, return a helpful message
    if (!tools || tools.length === 0) {
      return NextResponse.json({
        message:
          locale === "fr"
            ? "La base de donnees est en cours de remplissage. Revenez bientot !"
            : "The database is being populated. Come back soon!",
        recommendations: [],
        isEnterprise: false,
        remaining,
        cached: false,
      })
    }

    // Call OpenRouter LLM
    const response = await chatWithTools(sanitizedQuestion, tools, locale)

    // Enrich recommendations with the tool's external URL
    if (response.recommendations.length > 0) {
      const slugs = response.recommendations.map((r) => r.slug)
      const { data: urlData } = await getServiceClient()
        .from("tools")
        .select("slug, url")
        .in("slug", slugs)
      if (urlData) {
        const urlMap = Object.fromEntries(urlData.map((t) => [t.slug, t.url]))
        response.recommendations = response.recommendations.map((r) => ({
          ...r,
          url: urlMap[r.slug] || null,
        }))
      }
    }

    // Cache the response
    await setCachedResponse(
      sanitizedQuestion,
      JSON.stringify(response)
    )

    return NextResponse.json({
      ...response,
      remaining,
      cached: false,
    })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)
    const errStack = error instanceof Error ? error.stack : ""
    console.error("Chat API error:", errMsg, errStack)
    return NextResponse.json(
      { error: "Internal server error", details: errMsg },
      { status: 500 }
    )
  }
}
