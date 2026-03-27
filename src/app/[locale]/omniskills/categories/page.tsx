import { createOmniskillsServiceClient } from "@/lib/supabase/omniskills-server"
import { Link } from "@/i18n/routing"

export default async function SkillCategoriesPage() {
  const supabase = createOmniskillsServiceClient()


  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("skill_count", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Skill Categories</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(categories || []).map((cat) => (
          <Link
            key={cat.slug}
            href={`/omniskills/category/${cat.slug}`}
            className="p-6 rounded-xl border hover:bg-accent transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">{cat.name_en}</h2>
            <p className="text-sm text-muted-foreground">{cat.description_en}</p>
            {cat.skill_count > 0 && (
              <p className="text-xs text-muted-foreground mt-2">{cat.skill_count} skills</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
