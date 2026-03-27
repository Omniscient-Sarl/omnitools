"use client"

import { createContext, useContext } from "react"
import { useFavorites } from "@/lib/use-favorites"

interface FavoritesContextValue {
  favoriteIds: Set<string>
  toggleFavorite: (toolId: string) => Promise<void>
  loading: boolean
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favoriteIds: new Set(),
  toggleFavorite: async () => {},
  loading: true,
})

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const favorites = useFavorites()
  return (
    <FavoritesContext.Provider value={favorites}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavoritesContext() {
  return useContext(FavoritesContext)
}
