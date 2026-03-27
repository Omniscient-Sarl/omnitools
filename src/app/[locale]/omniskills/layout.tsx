import { SkillFavoritesProvider } from "@/components/providers/SkillFavoritesProvider"

export default function OmniskillsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SkillFavoritesProvider>
      {children}
    </SkillFavoritesProvider>
  )
}
