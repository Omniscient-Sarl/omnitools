import { createClient } from "@supabase/supabase-js"
import { getLocale } from "next-intl/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugs: string[] }>
}): Promise<Metadata> {
  const { slugs } = await params
  const names = slugs.map((s) => s.replace(/-/g, " ")).join(" vs ")
  return {
    title: `${names} - AI Tool Comparison | OmniTool`,
    description: `Compare ${names}. Side-by-side features, pricing, integrations.`,
  }
}

async function getToolsForComparison(slugs: string[]) {
  const { data } = await supabase
    .from("tools")
    .select("*")
    .in("slug", slugs)

  return data || []
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slugs: string[] }>
}) {
  const { slugs } = await params
  const locale = await getLocale()
  const tools = await getToolsForComparison(slugs)

  if (tools.length < 2) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Compare AI Tools</h1>
        <p className="text-muted-foreground mb-8">
          Select 2-3 tools to compare. Add tool slugs to the URL: /compare/tool-a/tool-b
        </p>
        <Button asChild>
          <Link href={`/${locale}`}>Browse tools</Link>
        </Button>
      </div>
    )
  }

  const rows = [
    { label: "Pricing", key: "pricing_type" },
    { label: "Category", key: "category" },
    { label: "Votes", key: "ph_votes" },
    { label: "Best for", key: "best_for", isArray: true },
    { label: "Not ideal for", key: "not_good_for", isArray: true },
    { label: "Integrations", key: "integrations", isArray: true },
    { label: "Accepts", key: "input_types", isArray: true },
    { label: "Produces", key: "output_types", isArray: true },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">
        {tools.map((t) => t.name).join(" vs ")}
      </h1>
      <p className="text-muted-foreground mb-8">Side-by-side comparison</p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 border-b font-medium text-muted-foreground w-40">
                Feature
              </th>
              {tools.map((tool) => (
                <th key={tool.id} className="text-left p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <span className="font-bold">{tool.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{tool.name}</div>
                      {tool.url && (
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Visit <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Tagline row */}
            <tr className="border-b">
              <td className="p-4 font-medium text-muted-foreground">Description</td>
              {tools.map((tool) => (
                <td key={tool.id} className="p-4 text-sm">
                  {tool.tagline || "-"}
                </td>
              ))}
            </tr>

            {rows.map((row) => (
              <tr key={row.key} className="border-b">
                <td className="p-4 font-medium text-muted-foreground">
                  {row.label}
                </td>
                {tools.map((tool) => {
                  const value = tool[row.key as keyof typeof tool]
                  return (
                    <td key={tool.id} className="p-4">
                      {row.isArray && Array.isArray(value) ? (
                        value.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {(value as string[]).map((v) => (
                              <Badge key={v} variant="secondary" className="text-xs">
                                {v}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )
                      ) : (
                        <span className="text-sm">
                          {value != null ? String(value) : "-"}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
