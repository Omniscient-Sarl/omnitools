import { getServiceClient } from "@/lib/supabase/service"
import { getLocale, getTranslations } from "next-intl/server"
import { Link } from "@/i18n/routing"
import {
  Mic, Settings, MessageCircle, Code, Headphones, BarChart,
  Palette, GraduationCap, DollarSign, Heart, Users, Image,
  Shield, Megaphone, Zap, Search, Type, Globe, Video, PenTool,
} from "lucide-react"
import type { Metadata } from "next"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  mic: Mic, settings: Settings, "message-circle": MessageCircle,
  code: Code, headphones: Headphones, "bar-chart": BarChart,
  palette: Palette, "graduation-cap": GraduationCap, "dollar-sign": DollarSign,
  heart: Heart, users: Users, image: Image, shield: Shield,
  megaphone: Megaphone, zap: Zap, search: Search, type: Type,
  globe: Globe, video: Video, "pen-tool": PenTool,
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "AI Tool Categories | OmniTool",
    description: "Browse AI tools by category. Find the best AI tools for image generation, text, code, marketing, and more.",
  }
}

export default async function CategoriesPage() {
  const locale = await getLocale()
  const t = await getTranslations("categories")

  const { data: categories } = await getServiceClient()
    .from("categories")
    .select("slug, name_en, name_fr, name_ja, name_zh, description_en, description_fr, icon")
    .order("name_en")

  // Count tools per category
  const { data: tools } = await getServiceClient()
    .from("tools")
    .select("categories")

  const countMap: Record<string, number> = {}
  tools?.forEach((tool) => {
    const cats = tool.categories as string[] | null
    cats?.forEach((cat: string) => {
      countMap[cat] = (countMap[cat] || 0) + 1
    })
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("title")}</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        {t("subtitle")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories?.map((cat) => {
          const nameKey = `name_${locale}` as keyof typeof cat
          const descKey = `description_${locale}` as keyof typeof cat
          const name = (cat[nameKey] as string) || cat.name_en
          const desc = (cat[descKey] as string) || cat.description_en || ""
          const IconComp = iconMap[cat.icon || ""] || Zap
          const count = countMap[cat.slug] || 0

          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group flex flex-col gap-3 rounded-xl border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IconComp className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                    {name}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {count} {count === 1 ? "tool" : "tools"}
                  </span>
                </div>
              </div>
              {desc && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {desc}
                </p>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
