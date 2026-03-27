"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Input } from "@/components/ui/input"
import { Search, ExternalLink } from "lucide-react"

interface SearchResult {
  id: string
  name: string
  slug: string
  tagline?: string
  logo_url?: string
  pricing_type?: string
  category?: string
}

export function SearchBar() {
  const t = useTranslations("search")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`)
        const data = await res.json()
        setResults(data.tools || [])
        setIsOpen(true)
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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || results.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      // Navigation handled by Link component
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedIndex(-1)
          }}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t("placeholder")}
          className="pl-10 h-12 text-base rounded-xl border-2 focus-visible:ring-primary"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map((tool, i) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors ${
                i === selectedIndex ? "bg-accent" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-muted-foreground">
                  {tool.name[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tool.name}</p>
                {tool.tagline && (
                  <p className="text-xs text-muted-foreground truncate">
                    {tool.tagline}
                  </p>
                )}
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-xl shadow-lg z-50 p-4 text-center">
          <p className="text-sm text-muted-foreground">{t("noResults")}</p>
        </div>
      )}
    </div>
  )
}
