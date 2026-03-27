"use client"

import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"

export function OmniscientBanner() {
  const t = useTranslations("enterprise")

  return (
    <section className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {t("title")}
        </h2>
        <p className="text-lg mb-6 text-muted-foreground">
          {t("subtitle")}
        </p>
        <a
          href="https://omniscient.swiss"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          {t("cta")} <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}
