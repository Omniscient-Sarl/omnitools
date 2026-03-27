"use client"

import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { ThemeToggle } from "@/components/ThemeToggle"
import { UserMenu } from "@/components/UserMenu"
import { Menu, X, Search, Sparkles } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { href: "/categories", label: t("categories") },
    { href: "/new", label: t("new") },
    { href: "/enterprise", label: t("enterprise") },
  ]

  function openAskOmni() {
    window.dispatchEvent(new CustomEvent("open-askomni"))
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-tight">
              Omni<span className="text-primary">Tools</span>
            </span>
          </Link>
          <Link
            href="/omniskills"
            className={`flex items-center gap-1.5 text-sm font-bold px-3.5 py-1.5 rounded-full border-2 transition-all ${
              pathname.startsWith("/omniskills")
                ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/30"
                : "border-purple-500 text-purple-500 hover:bg-purple-600 hover:text-white hover:border-purple-600 hover:shadow-lg hover:shadow-purple-600/30"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            OmniSkills
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={openAskOmni}
            className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AskOmni
          </button>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/search" className="p-2 rounded-md hover:bg-accent transition-colors">
            <Search className="h-4 w-4 text-muted-foreground" />
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/submit">{t("submit")}</Link>
          </Button>
          <UserMenu />
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <UserMenu />
          <button
            className="p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <nav className="flex flex-col gap-3">
            <Link
              href="/omniskills"
              className="flex items-center gap-2 text-sm font-bold py-2 text-purple-500"
              onClick={() => setMobileOpen(false)}
            >
              <Sparkles className="h-4 w-4" />
              OmniSkills
            </Link>
            <button
              onClick={openAskOmni}
              className="text-sm font-medium py-2 text-left flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              AskOmni
            </button>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <hr className="my-2" />
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/submit">{t("submit")}</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
