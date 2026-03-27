"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

const pricingOptions = ["free", "freemium", "paid"]

export function CategoryFilters() {
  const t = useTranslations("tools")
  const tCat = useTranslations("categories")
  const [activePricing, setActivePricing] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">
        {tCat("filterBy")}:
      </span>
      {pricingOptions.map((pricing) => (
        <Badge
          key={pricing}
          variant={activePricing === pricing ? "default" : "outline"}
          className="cursor-pointer transition-colors"
          onClick={() =>
            setActivePricing(activePricing === pricing ? null : pricing)
          }
        >
          {t(pricing as "free" | "freemium" | "paid")}
        </Badge>
      ))}
    </div>
  )
}
