"use client"

import { useState, useEffect, useCallback } from "react"

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        const ids = new Set<string>(
          (data.favorites || []).map((t: { id: string }) => t.id)
        )
        setFavoriteIds(ids)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleFavorite = useCallback(async (toolId: string): Promise<{ error?: string } | void> => {
    const isFav = favoriteIds.has(toolId)

    // Check max 8 before adding
    if (!isFav && favoriteIds.size >= 8) {
      return { error: "max_favorites" }
    }

    // Optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (isFav) next.delete(toolId)
      else next.add(toolId)
      return next
    })

    try {
      const res = await fetch("/api/favorites", {
        method: isFav ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        // Revert on error
        setFavoriteIds((prev) => {
          const next = new Set(prev)
          if (isFav) next.add(toolId)
          else next.delete(toolId)
          return next
        })
        if (data.error === "max_favorites") return { error: "max_favorites" }
      }
    } catch {
      // Revert
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        if (isFav) next.add(toolId)
        else next.delete(toolId)
        return next
      })
    }
  }, [favoriteIds])

  return { favoriteIds, toggleFavorite, loading }
}
