import { getAllPosts, getPostBySlug } from "@/lib/blog"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getLocale } from "next-intl/server"
import type { Metadata } from "next"

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Post not found" }

  return {
    title: post.seo_title,
    description: post.seo_description,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const locale = await getLocale()
  const post = getPostBySlug(slug)

  if (!post) return notFound()

  // Simple markdown to HTML (basic conversion for headings, bold, links, lists)
  const htmlContent = post.content
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-8 mb-3">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^---$/gm, '<hr class="my-8 border-border" />')
    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/\n\n/g, '</p><p class="text-muted-foreground leading-relaxed mb-4">')

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au blog
        </Link>

        {/* Post header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <CalendarDays className="h-4 w-4" />
            <span>
              {new Date(post.date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>&middot;</span>
            <span>{post.author}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

          <p className="text-lg text-muted-foreground mb-4">{post.excerpt}</p>

          <div className="flex flex-wrap gap-2">
            {post.categories.map((cat) => (
              <Badge key={cat} variant="secondary">
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Post content */}
        <article
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: `<p class="text-muted-foreground leading-relaxed mb-4">${htmlContent}</p>`,
          }}
        />

        {/* Author footer */}
        <div className="mt-12 p-6 rounded-lg bg-muted/50 border">
          <p className="font-semibold">{post.author}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Experts en integration d&apos;outils IA pour les entreprises.
          </p>
          <a
            href="https://omniscient.swiss"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline mt-2 inline-block"
          >
            omniscient.swiss →
          </a>
        </div>
      </div>
    </div>
  )
}
