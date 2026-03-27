import { createOmniskillsServiceClient } from "@/lib/supabase/omniskills-server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Download, User } from "lucide-react"

export default async function SkillDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createOmniskillsServiceClient()

  const { data: skill } = await supabase
    .from("skills")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!skill) return notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-4 mb-6">
          <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-muted-foreground">{skill.name[0]}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{skill.name}</h1>
              {skill.is_new && <Badge variant="new">NEW</Badge>}
              {skill.is_trending && <Badge variant="trending">HOT</Badge>}
            </div>
            {skill.tagline && (
              <p className="text-lg text-muted-foreground mt-1">{skill.tagline}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          {skill.pricing_type && (
            <Badge variant="outline">{skill.pricing_type}</Badge>
          )}
          {skill.author && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" /> {skill.author}
            </span>
          )}
          {skill.install_count > 0 && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Download className="h-3 w-3" /> {skill.install_count} installs
            </span>
          )}
        </div>

        {skill.url && (
          <Button asChild className="mb-8">
            <a href={skill.url} target="_blank" rel="noopener noreferrer" className="gap-2">
              View Skill <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}

        {skill.description && (
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{skill.description}</p>
          </div>
        )}

        {skill.keywords && skill.keywords.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {skill.keywords.map((kw: string) => (
                <Badge key={kw} variant="secondary">{kw}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
