import { createClient } from "@supabase/supabase-js"

// Lazy service client — avoids crashing at build time when env vars are missing
let _client: ReturnType<typeof createClient> | null = null

export function getServiceClient() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    )
  }
  return _client
}
