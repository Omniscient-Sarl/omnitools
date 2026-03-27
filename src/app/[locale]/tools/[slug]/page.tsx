import { getServiceClient } from "@/lib/supabase/service"
import { getLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { OmniscientBanner } from "@/components/OmniscientBanner"
import { ToolCard } from "@/components/ToolCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { data: tool } = await getServiceClient()
    .from("tools")
    .select("name, tagline, description")
    .eq("slug", slug)
    .single()

  if (!tool) return { title: "Tool not found" }

  return {
    title: `${tool.name} - AI Tool Review & Alternatives | OmniTool`,
    description: tool.tagline || tool.description?.slice(0, 155) || `Discover ${tool.name} on OmniTool.`,
  }
}

async function getToolData(slug: string) {
  const { data: tool } = await getServiceClient()
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!tool) return { tool: null, similar: [] }

  // Find similar tools (same category, exclude current)
  const { data: similar } = await getServiceClient()
    .from("tools")
    .select("id, name, slug, tagline, logo_url, pricing_type, category, categories, ph_votes, is_new, is_trending")
    .eq("category", tool.category)
    .neq("id", tool.id)
    .order("ph_votes", { ascending: false })
    .limit(5)

  return { tool, similar: similar || [] }
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const locale = await getLocale()
  const { tool, similar } = await getToolData(slug)

  if (!tool) return notFound()

  return (
    <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href={`/${locale}`} className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          {tool.category && (
            <>
              <Link
                href={`/${locale}/category/${tool.category}`}
                className="hover:text-primary"
              >
                {tool.category}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-foreground">{tool.name}</span>
        </nav>

        {/* Tool header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="h-20 w-20 rounded-xl bg-muted flex items-center justify-center shrink-0">
            {tool.logo_url ? (
              <img // eslint-disable-line @next/next/no-img-element
                src={tool.logo_url}
                alt={tool.name}
                className="h-16 w-16 object-contain rounded-lg"
              />
            ) : (
              <span className="text-3xl font-bold text-muted-foreground">
                {tool.name[0]}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">{tool.name}</h1>
              {tool.is_new && <Badge variant="new">NEW</Badge>}
              {tool.is_trending && <Badge variant="trending">HOT</Badge>}
            </div>
            {tool.tagline && (
              <p className="text-lg text-muted-foreground mb-4">{tool.tagline}</p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              {tool.pricing_type && (
                <Badge variant="outline">{tool.pricing_type}</Badge>
              )}
              {tool.ph_votes != null && tool.ph_votes > 0 && (
                <Badge variant="secondary">{tool.ph_votes} votes</Badge>
              )}
              {tool.url && (
                <Button size="sm" asChild>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    Visit site <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {tool.description && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {tool.description}
            </p>
          </div>
        )}

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {tool.best_for && tool.best_for.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Best for</h3>
              <div className="flex flex-wrap gap-2">
                {tool.best_for.map((item: string) => (
                  <Badge key={item} variant="secondary">{item}</Badge>
                ))}
              </div>
            </div>
          )}
          {tool.not_good_for && tool.not_good_for.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Not ideal for</h3>
              <div className="flex flex-wrap gap-2">
                {tool.not_good_for.map((item: string) => (
                  <Badge key={item} variant="outline">{item}</Badge>
                ))}
              </div>
            </div>
          )}
          {tool.integrations && tool.integrations.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Integrations</h3>
              <div className="flex flex-wrap gap-2">
                {tool.integrations.map((item: string) => (
                  <Badge key={item} variant="secondary">{item}</Badge>
                ))}
              </div>
            </div>
          )}
          {tool.input_types && tool.input_types.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Accepts</h3>
              <div className="flex flex-wrap gap-2">
                {tool.input_types.map((item: string) => (
                  <Badge key={item} variant="outline">{item}</Badge>
                ))}
              </div>
              {tool.output_types && tool.output_types.length > 0 && (
                <div className="mt-3">
                  <h3 className="font-semibold mb-2">Produces</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.output_types.map((item: string) => (
                      <Badge key={item} variant="outline">{item}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Omniscient Banner */}
        <div className="mb-12">
          <OmniscientBanner />
        </div>

        {/* Similar tools */}
        {similar.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Similar tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </div>
        )}
      </div>
  )
}
