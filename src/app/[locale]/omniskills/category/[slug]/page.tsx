import { createOmniskillsServiceClient } from "@/lib/supabase/omniskills-server"
import { SkillCard } from "@/components/omniskills/SkillCard"
import { notFound } from "next/navigation"

export default async function SkillCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createOmniskillsServiceClient()

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!category) return notFound()

  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .contains("categories", [slug])
    .order("install_count", { ascending: false })
    .limit(50)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{category.name_en}</h1>
      {category.description_en && (
        <p className="text-muted-foreground mb-8">{category.description_en}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(skills || []).map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
      {(!skills || skills.length === 0) && (
        <p className="text-center py-16 text-muted-foreground">No skills in this category yet.</p>
      )}
    </div>
  )
}
