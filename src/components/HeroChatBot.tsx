"use client"

import { useState, useRef } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

export function HeroChatBot() {
  const tHero = useTranslations("hero")
  const t = useTranslations("chatbot")
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions = t.raw("suggestions") as string[]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    window.dispatchEvent(new CustomEvent("open-askomni", { detail: { question: input } }))
    setInput("")
  }

  function sendSuggestion(suggestion: string) {
    window.dispatchEvent(new CustomEvent("open-askomni", { detail: { question: suggestion } }))
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={tHero("placeholder")}
          className="w-full h-14 pl-5 pr-14 text-base rounded-2xl border-2 border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl h-10 w-10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      {/* Suggestion chips */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => sendSuggestion(suggestion)}
            className="text-xs px-3 py-1.5 rounded-full border hover:bg-accent hover:border-primary/50 transition-colors text-muted-foreground"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
