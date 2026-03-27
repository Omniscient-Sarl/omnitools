"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function SubmitPage() {
  const t = useTranslations("submit")
  const [submitted, setSubmitted] = useState(false)

  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          url: form.get("url"),
          description: form.get("description"),
          submitted_by: form.get("submitted_by"),
          email: form.get("email"),
        }),
      })
      if (res.ok) setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">{t("success")}</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground mb-8">{t("subtitle")}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">{t("name")}</label>
            <Input name="name" required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t("url")}</label>
            <Input name="url" type="url" required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t("description")}</label>
            <textarea
              name="description"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t("yourName")}</label>
            <Input name="submitted_by" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t("yourEmail")}</label>
            <Input name="email" type="email" />
          </div>
          <Button type="submit" className="mt-2" disabled={loading}>
            {loading ? "..." : t("send")}
          </Button>
        </form>
      </div>
    </div>
  )
}
