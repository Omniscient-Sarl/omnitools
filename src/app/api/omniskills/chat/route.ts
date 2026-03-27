import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createOmniskillsServiceClient } from "@/lib/supabase/omniskills-server"
import { authenticatedLimiter, anonymousLimiter, getCachedResponse, setCachedResponse } from "@/lib/upstash"
import OpenAI from "openai"

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

function sanitize(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, "")
    .slice(0, 500)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const question = sanitize(body.question || "")
    const locale = (body.locale || "en").slice(0, 5)

    if (!question || question.length < 3) {
      return NextResponse.json({ error: "Question too short" }, { status: 400 })
    }

    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Rate limiting
    const identifier = user ? user.id : request.headers.get("x-forwarded-for") || "unknown"
    const limiter = user ? authenticatedLimiter : anonymousLimiter
    const { success, remaining } = await limiter.limit(identifier)

    if (!success) {
      return NextResponse.json({
        error: "rate_limit",
        message: user
          ? "Rate limit exceeded. Try again later."
          : "Sign in for 5 questions per hour.",
        remaining: 0,
        isAnonymous: !user,
      }, { status: 429 })
    }

    // Cache
    const cacheKey = `skills:${question}:${locale}`
    const cached = await getCachedResponse(cacheKey)
    if (cached) {
      return NextResponse.json({ ...JSON.parse(cached), remaining, cached: true })
    }

    // Search skills
    const skillsDb = createOmniskillsServiceClient()
    const searchWords = question.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2).slice(0, 5)
    const orConditions = searchWords
      .map((w: string) => `name.ilike.%${w}%,tagline.ilike.%${w}%,category.ilike.%${w}%,description.ilike.%${w}%`)
      .join(",")

    const { data: skills } = orConditions
      ? await skillsDb.from("skills").select("name, slug, tagline, description, pricing_type, category, author").or(orConditions).order("install_count", { ascending: false }).limit(15)
      : await skillsDb.from("skills").select("name, slug, tagline, description, pricing_type, category, author").order("install_count", { ascending: false }).limit(15)

    const skillsContext = (skills || [])
      .map((s) => `- ${s.name} (slug: ${s.slug}): ${s.tagline || ""} by ${s.author || "unknown"} [${s.pricing_type || "free"}]`)
      .join("\n")

    const lang: Record<string, string> = { fr: "French", en: "English", ja: "Japanese", zh: "Chinese" }

    const systemPrompt = `You are OmniSkills' AI assistant. You ONLY recommend Claude AI skills from the list below. You NEVER answer questions unrelated to Claude skills. If a user asks anything off-topic, reply: "I can only help with Claude skill recommendations."

Reply in ${lang[locale] || "English"}.
You MUST recommend EXACTLY 3 skills. For each, explain in 1 sentence why it fits.

Format your response as JSON:
{"message": "brief intro", "recommendations": [{"name": "Skill Name", "slug": "skill-slug", "reason": "Why this skill fits"}]}

Available skills:
${skillsContext || "No skills available yet. Tell the user to check back soon."}`

    const completion = await openrouter.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      max_tokens: 400,
      temperature: 0.3,
      response_format: { type: "json_object" },
      provider: { order: ["Groq"] },
    } as Parameters<typeof openrouter.chat.completions.create>[0])

    const rawContent = completion.choices[0]?.message?.content || "{}"
    let parsed: { message: string; recommendations: Array<{ name: string; slug: string; reason: string }> }

    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent)
      if (typeof parsed.message === "string" && parsed.message.startsWith("{")) {
        try {
          const inner = JSON.parse(parsed.message)
          if (inner.message) parsed.message = inner.message
          if (Array.isArray(inner.recommendations)) parsed.recommendations = inner.recommendations
        } catch { /* ignore */ }
      }
      if (!Array.isArray(parsed.recommendations)) parsed.recommendations = []
    } catch {
      parsed = { message: rawContent, recommendations: [] }
    }

    const response = { message: parsed.message, recommendations: parsed.recommendations }
    await setCachedResponse(cacheKey, JSON.stringify(response))

    return NextResponse.json({ ...response, remaining, cached: false })
  } catch (error) {
    console.error("OmniSkills chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
