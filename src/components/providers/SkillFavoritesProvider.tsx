"use client"

import { createContext, useContext } from "react"
import { useSkillFavorites } from "@/lib/use-skill-favorites"

interface SkillFavoritesContextValue {
  favoriteIds: Set<string>
  toggleFavorite: (skillId: string) => Promise<{ error?: string } | void>
  loading: boolean
}

const SkillFavoritesContext = createContext<SkillFavoritesContextValue>({
  favoriteIds: new Set(),
  toggleFavorite: async () => {},
  loading: true,
})

export function SkillFavoritesProvider({ children }: { children: React.ReactNode }) {
  const favorites = useSkillFavorites()
  return (
    <SkillFavoritesContext.Provider value={favorites}>
      {children}
    </SkillFavoritesContext.Provider>
  )
}

export function useSkillFavoritesContext() {
  return useContext(SkillFavoritesContext)
}
