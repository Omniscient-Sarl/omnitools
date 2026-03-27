"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "@/i18n/routing"
import { Send, User, ExternalLink, ArrowRight, X, LogIn, Zap } from "lucide-react"

interface Recommendation {
  name: string
  slug: string
  reason: string
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  recommendations?: Recommendation[]
  showSignIn?: boolean
}

export function GlobalAskOmniSkills() {
  const t = useTranslations("omniskills")
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pendingQuestionRef = useRef<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null)
    })
  }, [])

  useEffect(() => {
    function handleOpen(e: Event) {
      const question = (e as CustomEvent).detail?.question
      if (question) pendingQuestionRef.current = question
      setOpen(true)
    }
    window.addEventListener("open-omni-skills", handleOpen)
    return () => window.removeEventListener("open-omni-skills", handleOpen)
  }, [])

  useEffect(() => {
    if (open && pendingQuestionRef.current) {
      const q = pendingQuestionRef.current
      pendingQuestionRef.current = null
      sendMessage(q)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open, messages])

  async function sendMessage(question: string) {
    if (!question.trim() || loading) return

    const userMessage: ChatMessage = { role: "user", content: question }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/omniskills/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, locale, userId }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.isAnonymous ? t("chatSignUpPrompt") : t("chatLimitReached"),
            showSignIn: data.isAnonymous,
          },
        ])
        setRemaining(0)
        return
      }

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, something went wrong." },
        ])
        return
      }

      setRemaining(data.remaining ?? null)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message || t("chatDefaultReply"),
          recommendations: data.recommendations || [],
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

  function closeChat() {
    setOpen(false)
    setMessages([])
    setInput("")
    setRemaining(null)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] bg-background flex flex-col animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h2 className="font-bold text-lg">AskSkills</h2>
            {remaining !== null && (
              <span className="text-xs text-muted-foreground">
                {remaining} questions restantes
              </span>
            )}
          </div>
        </div>
        <button
          onClick={closeChat}
          className="p-2 rounded-xl hover:bg-accent transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground text-center">
                {t("chatPlaceholder")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(t.raw("suggestedQuestions") as string[]).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-left text-sm p-4 rounded-xl border-2 hover:border-purple-500/50 hover:bg-accent transition-all"
                  >
                    {q}
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
                <div className="h-8 w-8 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="h-4 w-4 text-purple-500" />
                </div>
              )}
              <div
                className={`max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white rounded-2xl rounded-tr-sm px-4 py-3"
                    : "space-y-4"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>

                {msg.showSignIn && (
                  <Link
                    href="/login"
                    onClick={closeChat}
                    className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    Se connecter
                  </Link>
                )}

                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="space-y-3 mt-3">
                    {msg.recommendations.map((rec, j) => (
                      <Link
                        key={j}
                        href={`/omniskills/skill/${rec.slug}`}
                        onClick={closeChat}
                        className="flex items-start gap-3 p-4 rounded-xl border-2 hover:border-purple-500/50 hover:shadow-md hover:shadow-purple-500/5 bg-card transition-all group"
                      >
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-purple-500">{rec.name[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{rec.name}</span>
                            <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {rec.reason}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                <Zap className="h-4 w-4 text-purple-500 animate-pulse" />
              </div>
              <div className="space-y-2 flex-1 pt-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-background/95 backdrop-blur px-4 md:px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chatPlaceholder")}
            disabled={loading}
            autoFocus
            className="flex-1 h-12 px-5 text-sm rounded-xl border-2 bg-background focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading || !input.trim()}
            className="rounded-xl h-12 w-12 bg-purple-600 hover:bg-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
