"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, ExternalLink, RefreshCw } from "lucide-react"

interface Submission {
  id: string
  name: string
  url: string
  description: string | null
  submitted_by: string | null
  email: string | null
  status: string
  created_at: string
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)

  // Simple password protection (not production-grade, but functional)
  const ADMIN_PASSWORD = "omniscient2025"

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      fetchSubmissions()
    }
  }

  async function fetchSubmissions() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/submissions")
      if (res.ok) {
        const data = await res.json()
        setSubmissions(data.submissions || [])
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: "approved" | "rejected") {
    const res = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      )
    }
  }

  if (!authenticated) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <Button type="submit">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tool Submissions</h1>
        <Button variant="outline" size="sm" onClick={fetchSubmissions} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : submissions.length === 0 ? (
        <p className="text-muted-foreground">No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{sub.name}</h3>
                      <Badge
                        variant={
                          sub.status === "approved"
                            ? "default"
                            : sub.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {sub.status}
                      </Badge>
                    </div>
                    <a
                      href={sub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1 mb-2"
                    >
                      {sub.url} <ExternalLink className="h-3 w-3" />
                    </a>
                    {sub.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {sub.description}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      {sub.submitted_by && <span>By: {sub.submitted_by} </span>}
                      {sub.email && <span>({sub.email}) </span>}
                      <span>
                        &middot; {new Date(sub.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {sub.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => updateStatus(sub.id, "approved")}
                        className="gap-1"
                      >
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateStatus(sub.id, "rejected")}
                        className="gap-1"
                      >
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
