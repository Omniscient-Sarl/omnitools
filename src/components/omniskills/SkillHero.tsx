"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

export function SkillHero() {
  const t = useTranslations("omniskills")
  const heroSkills = t.raw("heroSkills") as string[]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true)
  const [input, setInput] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroSkills.length)
        setFade(true)
      }, 500)
    }, 4000)
    return () => clearInterval(interval)
  }, [heroSkills.length])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    window.dispatchEvent(new CustomEvent("open-omni-skills", { detail: { question: input } }))
    setInput("")
  }

  function sendSuggestion(q: string) {
    window.dispatchEvent(new CustomEvent("open-omni-skills", { detail: { question: q } }))
  }

  return (
    <section className="container mx-auto px-4 pt-8 pb-4 text-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-3">
        {t("title")}
      </h1>
      <p className="text-muted-foreground text-base md:text-lg mb-6 max-w-xl mx-auto">
        {t("subtitle")}
      </p>

      {/* Rotating skill text */}
      <div className="relative mx-auto w-full max-w-md h-12 flex items-center justify-center mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-purple-500/10 rounded-full blur-xl" />
        <p
          className={`relative text-lg md:text-xl font-medium transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {heroSkills[currentIndex]}
        </p>
      </div>

      {/* Search bar */}
      <div className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chatPlaceholder")}
            className="w-full h-14 pl-5 pr-14 text-base rounded-2xl border-2 border-border bg-background focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl h-10 w-10 bg-purple-600 hover:bg-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {/* Suggestion chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {(t.raw("suggestedQuestions") as string[]).map((q, i) => (
            <button
              key={i}
              onClick={() => sendSuggestion(q)}
              className="text-xs px-3 py-1.5 rounded-full border hover:bg-accent hover:border-purple-500/50 transition-colors text-muted-foreground"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
