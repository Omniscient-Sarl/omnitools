"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { LogOut, Heart } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function UserMenu() {
  const t = useTranslations("nav")
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setOpen(false)
    window.location.href = "/"
  }

  // Not logged in
  if (!user) {
    return (
      <Button size="sm" asChild>
        <Link href="/login">{t("login")}</Link>
      </Button>
    )
  }

  // Logged in - show avatar
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture
  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-primary/50 transition-all"
      >
        {avatarUrl ? (
          <img // eslint-disable-line @next/next/no-img-element
            src={avatarUrl}
            alt={name || "User"}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">
              {(name || "U")[0].toUpperCase()}
            </span>
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-background border rounded-lg shadow-lg z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium truncate">{name}</p>
            {user.email && (
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/favorites"
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
              onClick={() => setOpen(false)}
            >
              <Heart className="h-4 w-4 text-red-500" />
              {t("favorites")}
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-accent transition-colors text-destructive"
            >
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
