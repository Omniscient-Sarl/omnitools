/**
 * Enrich tools with keywords, best_for, not_good_for, etc. via OpenRouter
 *
 * Usage: npx tsx scripts/enrich-tools.ts
 *
 * Processes tools that have no keywords yet.
 * Limits to 50 tools per run to stay within API limits.
 */

import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://omnitool.ai",
    "X-Title": "OmniTool Enrichment",
  },
})

const MAX_TOOLS = 200 // Per run - free model, no cost

async function enrichTool(tool: {
  id: string
  name: string
  tagline: string | null
  description: string | null
  category: string | null
}) {
  const prompt = `Analyze this AI tool and return JSON with enrichment data.

Tool: ${tool.name}
Tagline: ${tool.tagline || "N/A"}
Description: ${tool.description?.slice(0, 300) || "N/A"}
Category: ${tool.category || "N/A"}

Return ONLY valid JSON (no markdown):
{
  "keywords": ["keyword1", "keyword2", ...],  // 5-8 short search keywords
  "specialties": ["specialty1", ...],  // 3-5 core capabilities
  "best_for": ["use case 1", ...],  // 3-5 ideal use cases
  "not_good_for": ["limitation 1", ...],  // 2-3 limitations
  "input_types": ["text"|"image"|"audio"|"video"|"url"|"code"|"data"],  // what it accepts
  "output_types": ["text"|"image"|"audio"|"video"|"code"|"data"],  // what it produces
  "integrations": ["api"|"zapier"|"slack"|"notion"|"no-code"|...],  // known integrations
  "pricing_type": "free"|"freemium"|"paid"  // best guess
}`

  const completion = await openrouter.chat.completions.create({
    model: "meta-llama/llama-3.3-70b-instruct:free",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 500,
    response_format: { type: "json_object" },
  })

  const content = completion.choices[0]?.message?.content || "{}"
  try {
    return JSON.parse(content)
  } catch {
    console.error(`   Failed to parse JSON for ${tool.name}`)
    return null
  }
}

async function main() {
  console.log("🧠 Starting tool enrichment...")

  // Get tools without keywords
  const { data: tools, error } = await supabase
    .from("tools")
    .select("id, name, tagline, description, category")
    .or("keywords.is.null,keywords.eq.{}")
    .limit(MAX_TOOLS)

  if (error || !tools) {
    console.error("❌ Failed to fetch tools:", error)
    return
  }

  console.log(`   Found ${tools.length} tools to enrich\n`)

  let enriched = 0
  let failed = 0

  for (const tool of tools) {
    try {
      console.log(`   🔄 Enriching: ${tool.name}...`)
      const data = await enrichTool(tool)

      if (!data) {
        failed++
        continue
      }

      const { error: updateError } = await supabase
        .from("tools")
        .update({
          keywords: data.keywords || [],
          specialties: data.specialties || [],
          best_for: data.best_for || [],
          not_good_for: data.not_good_for || [],
          input_types: data.input_types || [],
          output_types: data.output_types || [],
          integrations: data.integrations || [],
          pricing_type: data.pricing_type || "freemium",
        })
        .eq("id", tool.id)

      if (updateError) {
        console.error(`   ❌ Update failed for ${tool.name}:`, updateError.message)
        failed++
      } else {
        enriched++
        console.log(`   ✅ Done (${enriched}/${tools.length})`)
      }

      // Rate limit: 8 req/min max on free tier = 1 every 8 seconds
      await new Promise((r) => setTimeout(r, 8000))
    } catch (err) {
      const errMsg = err instanceof Error ? err.message.slice(0, 100) : String(err)
      console.error(`   ❌ Error: ${tool.name} - ${errMsg}`)
      failed++
      // Wait longer on rate limit
      await new Promise((r) => setTimeout(r, 15000))
    }
  }

  console.log(`\n✅ Enrichment complete!`)
  console.log(`   Enriched: ${enriched}`)
  console.log(`   Failed: ${failed}`)
}

main().catch(console.error)
