"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { ToolCard } from "@/components/ToolCard"
import { Search } from "lucide-react"

interface Tool {
  id: string
  name: string
  slug: string
  tagline?: string
  logo_url?: string
  pricing_type?: string
  category?: string
  categories?: string[]
  ph_votes?: number
  is_new?: boolean
  is_trending?: boolean
}

export default function SearchPage() {
  const t = useTranslations("search")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Tool[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length < 2) {
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=30`)
        const data = await res.json()
        setResults(data.tools || [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            className="w-full h-14 pl-12 pr-4 text-base rounded-2xl border-2 border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : query.length >= 2 && !loading ? (
        <p className="text-center text-muted-foreground">{t("noResults")}</p>
      ) : null}
    </div>
  )
}
