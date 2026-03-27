import { getServiceClient } from "@/lib/supabase/service"
import { getLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { ToolCard } from "@/components/ToolCard"
import { SearchBar } from "@/components/SearchBar"
import { CategoryFilters } from "@/components/CategoryFilters"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()

  const { data: category } = await getServiceClient()
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!category) return { title: "Category not found" }

  const nameKey = `name_${locale}` as keyof typeof category
  const descKey = `description_${locale}` as keyof typeof category
  const name = (category[nameKey] as string) || category.name_en || slug

  return {
    title: `Best AI ${name} Tools 2025 | OmniTool`,
    description:
      (category[descKey] as string) ||
      `Discover the best AI tools for ${name}. Compare features, pricing, and find the perfect tool.`,
  }
}

async function getCategoryData(slug: string) {
  const [categoryRes, toolsRes] = await Promise.all([
    getServiceClient().from("categories").select("*").eq("slug", slug).single(),
    getServiceClient()
      .from("tools")
      .select(
        "id, name, slug, tagline, logo_url, pricing_type, category, categories, ph_votes, is_new, is_trending"
      )
      .contains("categories", [slug])
      .order("ph_votes", { ascending: false })
      .limit(50),
  ])

  return {
    category: categoryRes.data,
    tools: toolsRes.data || [],
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const locale = await getLocale()
  const { category, tools } = await getCategoryData(slug)

  if (!category) notFound()

  const nameKey = `name_${locale}` as keyof typeof category
  const descKey = `description_${locale}` as keyof typeof category
  const name = (category[nameKey] as string) || category.name_en || slug
  const description = category[descKey] as string

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="text-sm text-muted-foreground mb-6">
        <a href={`/${locale}`} className="hover:text-primary">
          Home
        </a>
        <span className="mx-2">/</span>
        <span className="text-foreground">{name}</span>
      </nav>

      {/* Search bar */}
      <div className="mb-8 max-w-xl">
        <SearchBar />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4">{name}</h1>
      {description && (
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
          {description}
        </p>
      )}

      {/* Filters */}
      <CategoryFilters />

      {/* Tools grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground mt-8">
          No tools in this category yet. Check back soon!
        </div>
      )}
    </div>
  )
}
