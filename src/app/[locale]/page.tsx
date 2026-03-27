import { useTranslations } from "next-intl"
import { createClient } from "@supabase/supabase-js"
import { HeroChatBot } from "@/components/HeroChatBot"
import { RotatingHero } from "@/components/RotatingHero"
import { ToolCard } from "@/components/ToolCard"
import { OmniscientBanner } from "@/components/OmniscientBanner"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"

const trendingTags = [
  { slug: "image-generation", label: "Image Generation" },
  { slug: "code-assistant", label: "Code Assistant" },
  { slug: "audio-speech", label: "Voice Cloning" },
  { slug: "video-generation", label: "Video AI" },
  { slug: "chatbot", label: "Chatbot" },
  { slug: "writing", label: "Writing" },
  { slug: "marketing", label: "Marketing" },
  { slug: "automation", label: "Automation" },
]

async function getTopTools() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
  const { data } = await supabase
    .from("tools")
    .select("id, name, slug, tagline, logo_url, pricing_type, category, categories, ph_votes, is_new, is_trending")
    .order("ph_votes", { ascending: false })
    .limit(12)

  return data || []
}

export default async function HomePage() {
  const tools = await getTopTools()
  return <HomePageClient tools={tools} />
}

function HomePageClient({ tools }: { tools: Awaited<ReturnType<typeof getTopTools>> }) {
  const t = useTranslations("hero")
  const tSearch = useTranslations("search")

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-8 pb-2 md:pt-12 md:pb-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4">
            {t("subtitle")}
          </p>

          <RotatingHero />
        </div>
      </section>

      {/* ChatBot (acts as search bar, expands on send) */}
      <section className="container mx-auto px-4 py-3">
        <HeroChatBot />
      </section>

      {/* Trending Tags */}
      <section className="container mx-auto px-4 pb-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {tSearch("trending")}
          </span>
          {trendingTags.map((tag) => (
            <Link key={tag.slug} href={`/category/${tag.slug}`}>
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag.label}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Top AI Tools</h2>
          {tools.length > 0 && (
            <Link
              href="/category/image-generation"
              className="text-sm text-primary hover:underline"
            >
              View all →
            </Link>
          )}
        </div>
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            <p>Tools will appear here once the database is populated.</p>
          </div>
        )}
      </section>

      <OmniscientBanner />
    </div>
  )
}
