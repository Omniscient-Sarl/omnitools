import { createClient } from "@supabase/supabase-js"
import type { MetadataRoute } from "next"

const BASE_URL = "https://omnitool.ai"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const locales = ["en", "fr", "ja", "zh"]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  const staticPages = ["", "/new", "/enterprise", "/about", "/submit", "/blog"]
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1.0 : 0.7,
      })
    }
  }

  // Category pages
  const { data: categories } = await supabase
    .from("categories")
    .select("slug")

  if (categories) {
    for (const locale of locales) {
      for (const cat of categories) {
        entries.push({
          url: `${BASE_URL}/${locale}/category/${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        })
      }
    }
  }

  // Tool pages (high priority - 695+ pages per locale)
  const { data: tools } = await supabase
    .from("tools")
    .select("slug, updated_at")

  if (tools) {
    for (const locale of locales) {
      for (const tool of tools) {
        entries.push({
          url: `${BASE_URL}/${locale}/tools/${tool.slug}`,
          lastModified: new Date(tool.updated_at),
          changeFrequency: "monthly",
          priority: 0.6,
        })
      }
    }
  }

  return entries
}
