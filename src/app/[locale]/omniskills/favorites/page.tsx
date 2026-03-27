"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { SkillCard } from "@/components/omniskills/SkillCard"
import { useSkillFavoritesContext } from "@/components/providers/SkillFavoritesProvider"
import { Heart } from "lucide-react"

interface Skill {
  id: string
  name: string
  slug: string
  tagline?: string
  category?: string
  pricing_type?: string
  author?: string
  install_count?: number
  is_new?: boolean
  is_trending?: boolean
}

export default function SkillFavoritesPage() {
  const t = useTranslations("omniskills")
  const { favoriteIds, loading: favsLoading } = useSkillFavoritesContext()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favsLoading) return
    if (favoriteIds.size === 0) {
      setSkills([])
      setLoading(false)
      return
    }

    // Fetch skill details from omniskills search API
    const ids = Array.from(favoriteIds)
    Promise.all(
      ids.map((id) =>
        fetch(`/api/omniskills/search?q=${encodeURIComponent(id)}`)
          .then((r) => r.json())
          .then((d) => d.results?.[0])
          .catch(() => null)
      )
    ).then((results) => {
      setSkills(results.filter(Boolean))
      setLoading(false)
    })
  }, [favoriteIds, favsLoading])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
        <Heart className="h-7 w-7 text-red-500 fill-red-500" />
        {t("favorites")}
      </h1>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading...</p>
      ) : skills.length === 0 ? (
        <p className="text-center py-16 text-muted-foreground">No favorite skills yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  )
}
