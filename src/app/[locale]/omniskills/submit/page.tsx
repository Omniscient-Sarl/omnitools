"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SubmitSkillPage() {
  const t = useTranslations("omniskills")
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/omniskills/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, description, email }),
      })
      if (res.ok) {
        setStatus("success")
        setName("")
        setUrl("")
        setDescription("")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{t("submit")}</CardTitle>
        </CardHeader>
        <CardContent>
          {status === "success" ? (
            <p className="text-green-500 font-medium">Skill submitted successfully! We will review it soon.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                placeholder="Skill name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                placeholder="URL (GitHub, npm, etc.)"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <Input
                placeholder="Your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Submitting..." : t("submit")}
              </Button>
              {status === "error" && (
                <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
