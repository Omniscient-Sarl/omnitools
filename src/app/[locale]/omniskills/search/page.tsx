"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { SkillCard } from "@/components/omniskills/SkillCard"
import { Search } from "lucide-react"

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

export default function SkillSearchPage() {
  const t = useTranslations("omniskills")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Skill[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSearch(q: string) {
    setQuery(q)
    if (q.length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/omniskills/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("search")}</h1>
      <div className="max-w-xl mx-auto mb-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("placeholder")}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      {loading && <p className="text-center text-muted-foreground">Loading...</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
      {query.length >= 2 && !loading && results.length === 0 && (
        <p className="text-center py-8 text-muted-foreground">No skills found.</p>
      )}
    </div>
  )
}
