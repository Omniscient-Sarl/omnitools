import { NextRequest, NextResponse } from "next/server"
import { getServiceClient } from "@/lib/supabase/service"

const PH_API_URL = "https://api.producthunt.com/v2/api/graphql"

const QUERY = `
query GetNewAIProducts($cursor: String) {
  posts(
    first: 50
    after: $cursor
    topic: "artificial-intelligence"
    order: NEWEST
    postedAfter: "${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}"
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

// Verify cron secret to prevent unauthorized access
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || ""}` && process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const res = await fetch(PH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PRODUCTHUNT_API_TOKEN}`,
      },
      body: JSON.stringify({ query: QUERY, variables: { cursor: null } }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: "PH API error" }, { status: 500 })
    }

    const data = await res.json()
    const posts = data.data?.posts?.edges || []

    let imported = 0
    for (const { node: p } of posts) {
      const topicSlugs = p.topics?.edges?.map((e: { node: { slug: string } }) => e.node.slug) || []

      const tool = {
        name: p.name,
        slug: slugify(p.name),
        tagline: p.tagline || null,
        description: p.description || null,
        url: p.website || p.url,
        logo_url: p.thumbnail?.url || null,
        ph_id: String(p.id),
        ph_votes: p.votesCount || 0,
        ph_url: p.url,
        category: "productivity",
        categories: topicSlugs.slice(0, 4),
        is_new: true,
        is_trending: p.votesCount > 100,
      }

      const { error } = await getServiceClient()
        .from("tools")
        .upsert(tool, { onConflict: "ph_id" })

      if (!error) imported++
    }

    return NextResponse.json({
      success: true,
      imported,
      total: posts.length,
    })
  } catch (error) {
    console.error("Cron sync error:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
