"use client"

import { useState, useEffect, useCallback } from "react"

export function useSkillFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/omniskills/favorites")
      .then((res) => res.json())
      .then((data) => {
        const ids = new Set<string>(
          (data.favorites || []).map((f: { skill_id: string }) => f.skill_id)
        )
        setFavoriteIds(ids)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleFavorite = useCallback(async (skillId: string): Promise<{ error?: string } | void> => {
    const isFav = favoriteIds.has(skillId)

    if (!isFav && favoriteIds.size >= 8) {
      return { error: "max_favorites" }
    }

    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (isFav) next.delete(skillId)
      else next.add(skillId)
      return next
    })

    try {
      const res = await fetch("/api/omniskills/favorites", {
        method: isFav ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setFavoriteIds((prev) => {
          const next = new Set(prev)
          if (isFav) next.add(skillId)
          else next.delete(skillId)
          return next
        })
        if (data.error === "max_favorites") return { error: "max_favorites" }
      }
    } catch {
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        if (isFav) next.add(skillId)
        else next.delete(skillId)
        return next
      })
    }
  }, [favoriteIds])

  return { favoriteIds, toggleFavorite, loading }
}
