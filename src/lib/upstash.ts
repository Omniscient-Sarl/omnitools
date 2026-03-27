import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"
import { createHash } from "crypto"

// Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Rate limiter: 5 requests per hour for authenticated users
export const authenticatedLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "ratelimit:auth",
})

// Rate limiter: 1 request total for anonymous users (per IP)
export const anonymousLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "24 h"),
  prefix: "ratelimit:anon",
})

// Cache helpers
function getCacheKey(question: string): string {
  const hash = createHash("md5").update(question.toLowerCase().trim()).digest("hex")
  return `cache:chat:${hash}`
}

export async function getCachedResponse(question: string): Promise<string | null> {
  const key = getCacheKey(question)
  return redis.get<string>(key)
}

export async function setCachedResponse(question: string, response: string): Promise<void> {
  const key = getCacheKey(question)
  await redis.set(key, response, { ex: 3600 }) // 1 hour TTL
}
