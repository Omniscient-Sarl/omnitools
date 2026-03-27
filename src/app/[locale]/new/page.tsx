import { createClient } from "@supabase/supabase-js"
import { ToolCard } from "@/components/ToolCard"
import { SearchBar } from "@/components/SearchBar"
import { Badge } from "@/components/ui/badge"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "New AI Tools This Week | OmniTool",
  description: "Discover the latest AI tools added this week. Stay ahead with fresh AI tools from Product Hunt.",
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

async function getNewTools() {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const { data } = await supabase
    .from("tools")
    .select("id, name, slug, tagline, logo_url, pricing_type, category, categories, ph_votes, is_new, is_trending")
    .gte("created_at", oneWeekAgo.toISOString())
    .order("created_at", { ascending: false })
    .limit(50)

  return data || []
}

export default async function NewToolsPage() {
  const tools = await getNewTools()

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search bar */}
      <div className="mb-8 max-w-xl">
        <SearchBar />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-3xl font-bold">New AI Tools</h1>
        <Badge variant="new">This Week</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Latest AI tools added from Product Hunt. Updated every Monday.
      </p>

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          No new tools this week. Check back Monday!
        </div>
      )}
    </div>
  )
}
