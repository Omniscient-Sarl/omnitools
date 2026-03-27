"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "@/i18n/routing"
import { Send, Bot, User, ExternalLink, ArrowRight } from "lucide-react"

interface Recommendation {
  name: string
  slug: string
  reason: string
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  recommendations?: Recommendation[]
  isEnterprise?: boolean
}

export function ChatBot() {
  const t = useTranslations("chatbot")
  const locale = useLocale()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestions = t.raw("suggestions") as string[]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(question: string) {
    if (!question.trim() || loading) return

    const userMessage: ChatMessage = { role: "user", content: question }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, locale }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: t("limitReached", { minutes: data.resetInMinutes || 60 }),
          },
        ])
        setRemaining(0)
        return
      }

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, something went wrong. Please try again." },
        ])
        return
      }

      setRemaining(data.remaining ?? null)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message || "Here are my recommendations:",
          recommendations: data.recommendations || [],
          isEnterprise: data.isEnterprise || false,
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <Card className="flex flex-col h-[600px] max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{t("title")}</h3>
        {remaining !== null && (
          <Badge variant="secondary" className="ml-auto text-xs">
            {t("remaining", { count: remaining })}
          </Badge>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center mb-4">
              {t("placeholder")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(suggestion)}
                  className="text-left text-sm p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2"
                  : "space-y-3"
              }`}
            >
              <p className={`text-sm ${msg.role === "assistant" ? "text-foreground" : ""}`}>
                {msg.content}
              </p>

              {/* Tool recommendations */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="space-y-2 mt-3">
                  {msg.recommendations.map((rec, j) => (
                    <Link
                      key={j}
                      href={`/tools/${rec.slug}`}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors group"
                    >
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold">{rec.name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{rec.name}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {rec.reason}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Enterprise CTA */}
              {msg.isEnterprise && (
                <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("enterpriseCta")}
                  </p>
                  <a
                    href="https://omniscient.swiss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    omniscient.swiss <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  )
}
