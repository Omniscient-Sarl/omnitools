"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useFavoritesContext } from "@/components/providers/FavoritesProvider"
import { ExternalLink, Heart } from "lucide-react"
import Image from "next/image"

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

export function ToolCard({ tool }: { tool: Tool }) {
  const t = useTranslations("tools")
  const { favoriteIds, toggleFavorite } = useFavoritesContext()
  const isFavorite = favoriteIds.has(tool.id)
  const [maxToast, setMaxToast] = useState(false)

  async function handleFavorite() {
    const result = await toggleFavorite(tool.id)
    if (result && result.error === "max_favorites") {
      setMaxToast(true)
      setTimeout(() => setMaxToast(false), 3000)
    }
  }

  return (
    <Card className="group hover:shadow-md transition-shadow relative">
      {/* Max favorites toast */}
      {maxToast && (
        <div className="absolute top-12 right-2 z-20 bg-card border-2 border-red-500/30 rounded-xl px-4 py-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 max-w-[220px]">
          <p className="text-xs font-medium text-red-500">
            {t("maxFavoritesJoke")}
          </p>
        </div>
      )}

      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          handleFavorite()
        }}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-accent transition-colors"
        title={isFavorite ? t("removeFavorite") : t("addFavorite")}
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-muted-foreground hover:text-red-500"
          }`}
        />
      </button>

      <CardHeader className="flex flex-row items-start gap-4 pb-3 pr-10">
        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
          {tool.logo_url ? (
            <Image
              src={tool.logo_url}
              alt={tool.name}
              width={48}
              height={48}
              className="object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-muted-foreground">
              {tool.name[0]}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{tool.name}</h3>
            {tool.is_new && <Badge variant="new">NEW</Badge>}
            {tool.is_trending && <Badge variant="trending">HOT</Badge>}
          </div>
          {tool.tagline && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {tool.tagline}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {tool.pricing_type && (
              <Badge variant="outline" className="text-xs">
                {t(tool.pricing_type as "free" | "freemium" | "paid")}
              </Badge>
            )}
            {tool.ph_votes != null && tool.ph_votes > 0 && (
              <span className="text-xs text-muted-foreground">
                {tool.ph_votes} votes
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/tools/${tool.slug}`} className="gap-1">
              {t("viewTool")} <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
