"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

export function Footer() {
  const t = useTranslations("footer")

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <span className="text-xl font-bold">
              Omni<span className="text-primary">Tools</span>
            </span>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("builtBy")}{" "}
              <a
                href="https://omniscient.swiss"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                {t("omniscient")}
              </a>
            </p>
          </div>

          {/* Categories quick links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Categories</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/category/image-generation" className="hover:text-primary">Image Generation</Link>
              <Link href="/category/text-generation" className="hover:text-primary">Text Generation</Link>
              <Link href="/category/code-assistant" className="hover:text-primary">Code Assistant</Link>
              <Link href="/category/video-generation" className="hover:text-primary">Video Generation</Link>
              <Link href="/category/automation" className="hover:text-primary">Automation</Link>
            </nav>
          </div>

          {/* OmniSkills */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">OmniSkills</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/omniskills" className="hover:text-primary">All Skills</Link>
              <Link href="/omniskills/categories" className="hover:text-primary">Categories</Link>
              <Link href="/omniskills/submit" className="hover:text-primary">Submit a skill</Link>
            </nav>
          </div>

          {/* Blog */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Blog</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/blog" className="hover:text-primary">Tous les articles</Link>
              <Link href="/blog/top-5-outils-ia-rh-2025" className="hover:text-primary">Top 5 IA pour les RH</Link>
              <Link href="/blog/automatiser-facturation-ia-2025" className="hover:text-primary">Automatiser sa facturation</Link>
              <Link href="/blog/midjourney-vs-dalle-vs-stable-diffusion-2025" className="hover:text-primary">Midjourney vs DALL-E</Link>
              <Link href="/blog/meilleurs-assistants-ia-developpeurs-2025" className="hover:text-primary">Assistants IA dev</Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">{t("legal")}</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-primary">About</Link>
              <Link href="/enterprise" className="hover:text-primary">Enterprise</Link>
              <Link href="/submit" className="hover:text-primary">Submit a tool</Link>
              <a href="mailto:contact@omniscient.swiss" className="hover:text-primary">{t("contact")}</a>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} OmniTools &middot;{" "}
          <a
            href="https://omniscient.swiss"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            Omniscient SARL
          </a>
        </div>
      </div>
    </footer>
  )
}
