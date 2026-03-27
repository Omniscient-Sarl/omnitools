import { createServerClient } from "@supabase/ssr"

// Service client for OmniSkills database (separate Supabase project)
// Used for all skill queries (read-only, no auth needed)
export function createOmniskillsServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_OMNISKILLS_SUPABASE_URL!,
    process.env.OMNISKILLS_SERVICE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    }
  )
}
