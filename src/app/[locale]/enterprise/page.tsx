import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

export default function EnterprisePage() {
  const t = useTranslations("enterprise")
  const services = t.raw("services") as string[]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl text-muted-foreground mb-12">{t("subtitle")}</p>

        <div className="grid gap-4 mb-12 text-left max-w-md mx-auto">
          {services.map((service, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{service}</span>
            </div>
          ))}
        </div>

        <a
          href="https://omniscient.swiss"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          {t("cta")} <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
