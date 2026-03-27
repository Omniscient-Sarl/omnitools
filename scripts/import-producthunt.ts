/**
 * Import AI tools from Product Hunt API
 *
 * Usage: npx tsx scripts/import-producthunt.ts
 *
 * Respects Supabase free tier limits:
 * - Imports max 500 tools per run (safe batch size)
 * - ~1-2KB per tool = ~1MB total
 * - Uses upsert to avoid duplicates
 */

import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const PH_API_URL = "https://api.producthunt.com/v2/api/graphql"
const PH_TOKEN = process.env.PRODUCTHUNT_API_TOKEN!

const MAX_TOOLS = 3000 // Import 3000 tools
const BATCH_SIZE = 20 // Products per API call

// GraphQL query for Product Hunt
const QUERY = `
query GetAIProducts($cursor: String) {
  posts(
    first: ${BATCH_SIZE}
    after: $cursor
    topic: "artificial-intelligence"
    order: VOTES
  ) {
    edges {
      node {
        id
        name
        tagline
        description
        url
        votesCount
        website
        thumbnail {
          url
        }
        topics {
          edges {
            node {
              name
              slug
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
}

function mapTopicsToCategory(topics: string[]): string {
  const topicMap: Record<string, string> = {
    "artificial-intelligence": "chatbot",
    "developer-tools": "code-assistant",
    "design-tools": "design-ui",
    "marketing": "marketing",
    "productivity": "productivity",
    "writing": "writing",
    "education": "education",
    "finance": "finance",
    "health": "healthcare",
    "analytics": "data-analytics",
    "automation": "automation",
    "customer-communication": "customer-support",
    "video": "video-generation",
    "audio": "audio-speech",
    "image-recognition": "image-generation",
    "image-generation": "image-generation",
    "translation": "translation",
    "legal": "legal",
    "recruiting": "hr-recruiting",
    "research": "research",
  }

  for (const topic of topics) {
    const mapped = topicMap[topic]
    if (mapped) return mapped
  }
  return "productivity" // default
}

interface PHNode {
  id: string
  name: string
  tagline: string
  description: string
  url: string
  votesCount: number
  website: string
  thumbnail?: { url: string }
  topics: {
    edges: { node: { name: string; slug: string } }[]
  }
}

async function fetchProductHuntPage(cursor?: string): Promise<{
  products: PHNode[]
  hasNext: boolean
  endCursor?: string
}> {
  const res = await fetch(PH_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PH_TOKEN}`,
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { cursor: cursor || null },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Product Hunt API error ${res.status}: ${text}`)
  }

  const data = await res.json()

  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
  }

  const posts = data.data?.posts
  if (!posts) {
    throw new Error(`No posts in response: ${JSON.stringify(data)}`)
  }

  return {
    products: posts.edges.map((e: { node: PHNode }) => e.node),
    hasNext: posts.pageInfo.hasNextPage,
    endCursor: posts.pageInfo.endCursor,
  }
}

async function main() {
  console.log("🚀 Starting Product Hunt import...")
  console.log(`   Max tools: ${MAX_TOOLS}`)

  let cursor: string | undefined
  let totalImported = 0
  let totalSkipped = 0
  let page = 0

  while (totalImported < MAX_TOOLS) {
    page++
    console.log(`\n📦 Fetching page ${page}...`)

    try {
      const { products, hasNext, endCursor } = await fetchProductHuntPage(cursor)

      if (products.length === 0) {
        console.log("   No more products.")
        break
      }

      // Prepare tools for upsert
      const tools = products.map((p) => {
        const topicSlugs = p.topics.edges.map((e) => e.node.slug)
        const topicNames = p.topics.edges.map((e) => e.node.name)
        const category = mapTopicsToCategory(topicSlugs)

        return {
          name: p.name,
          slug: slugify(p.name),
          tagline: p.tagline || null,
          description: p.description || null,
          url: p.website || p.url,
          logo_url: p.thumbnail?.url || null,
          ph_id: String(p.id),
          ph_votes: p.votesCount || 0,
          ph_url: p.url,
          category,
          categories: [category, ...topicSlugs.slice(0, 3)],
          pricing_type: "freemium", // default, enrichment will fix this
          is_new: false,
          is_trending: p.votesCount > 200,
        }
      })

      // Upsert into Supabase (on conflict ph_id)
      const { error, count } = await supabase
        .from("tools")
        .upsert(tools, { onConflict: "ph_id", ignoreDuplicates: false })

      if (error) {
        console.error(`   ❌ Supabase error:`, error.message)
        // Try individual inserts to skip duplicates
        for (const tool of tools) {
          const { error: singleError } = await supabase
            .from("tools")
            .upsert(tool, { onConflict: "ph_id" })

          if (singleError) {
            // Probably slug conflict, try with unique slug
            tool.slug = `${tool.slug}-${tool.ph_id?.slice(-4)}`
            const { error: retryError } = await supabase
              .from("tools")
              .upsert(tool, { onConflict: "ph_id" })
            if (retryError) {
              totalSkipped++
            } else {
              totalImported++
            }
          } else {
            totalImported++
          }
        }
      } else {
        totalImported += products.length
        console.log(`   ✅ Imported ${products.length} tools (total: ${totalImported})`)
      }

      if (!hasNext || totalImported >= MAX_TOOLS) break
      cursor = endCursor

      // Small delay to be nice to the API
      await new Promise((r) => setTimeout(r, 500))
    } catch (err) {
      console.error(`   ❌ Error on page ${page}:`, err)
      break
    }
  }

  // Update category counts
  console.log("\n📊 Updating category counts...")
  const { data: categories } = await supabase.from("categories").select("slug")
  if (categories) {
    for (const cat of categories) {
      const { count } = await supabase
        .from("tools")
        .select("id", { count: "exact", head: true })
        .contains("categories", [cat.slug])

      await supabase
        .from("categories")
        .update({ tool_count: count || 0 })
        .eq("slug", cat.slug)
    }
  }

  console.log(`\n✅ Import complete!`)
  console.log(`   Imported: ${totalImported}`)
  console.log(`   Skipped: ${totalSkipped}`)

  // Check DB size
  const { count: totalTools } = await supabase
    .from("tools")
    .select("id", { count: "exact", head: true })
  console.log(`   Total tools in DB: ${totalTools}`)
}

main().catch(console.error)
