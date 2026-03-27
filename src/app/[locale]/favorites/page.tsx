"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { ToolCard } from "@/components/ToolCard"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { Heart, ArrowRight } from "lucide-react"

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

export default function FavoritesPage() {
  const t = useTranslations("nav")
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => setTools(data.favorites || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-6 w-6 text-red-500 fill-red-500" />
        <h1 className="text-3xl font-bold">{t("favorites")}</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-12 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Aucun favori</h2>
          <p className="text-muted-foreground mb-6">
            Cliquez sur le coeur sur un outil pour l&apos;ajouter a votre stack.
          </p>
          <Button asChild>
            <Link href="/" className="gap-2">
              Decouvrir les outils <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
