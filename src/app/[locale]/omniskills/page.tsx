import { useTranslations, useLocale } from "next-intl"
import { createOmniskillsServiceClient } from "@/lib/supabase/omniskills-server"
import { SkillCard } from "@/components/omniskills/SkillCard"
import { SkillHero } from "@/components/omniskills/SkillHero"
import { Link } from "@/i18n/routing"
import { ArrowLeft } from "lucide-react"

export default async function OmniskillsPage() {
  const supabase = createOmniskillsServiceClient()

  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("install_count", { ascending: false })
    .limit(12)

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("skill_count", { ascending: false })

  return (
    <div className="min-h-screen">
      <SkillHero />

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/omniskills/category/${cat.slug}`}
                className="px-4 py-2 rounded-full border hover:bg-accent transition-colors text-sm"
              >
                {cat.name_en}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Popular Skills */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(skills || []).map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>

        {(!skills || skills.length === 0) && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              Skills coming soon! Check back later.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
