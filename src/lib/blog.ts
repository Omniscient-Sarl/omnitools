import fs from "fs"
import path from "path"
import matter from "gray-matter"

const BLOG_DIR = path.join(process.cwd(), "src/content/blog")

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  categories: string[]
  tags: string[]
  seo_title: string
  seo_description: string
  content: string
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8")
    const { data, content } = matter(raw)

    return {
      slug: data.slug || file.replace(".md", ""),
      title: data.title || "",
      excerpt: data.excerpt || "",
      author: data.author || "Omniscient SARL",
      date: data.date || "",
      categories: data.categories || [],
      tags: data.tags || [],
      seo_title: data.seo_title || data.title || "",
      seo_description: data.seo_description || data.excerpt || "",
      content,
    }
  })

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts()
  return posts.find((p) => p.slug === slug) || null
}
