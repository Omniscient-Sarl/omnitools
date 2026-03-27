import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"
import { createHash } from "crypto"

// Lazy singletons to avoid build-time crashes when env vars are missing
let _redis: Redis | null = null
function getRedis() {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }
  return _redis
}

let _authLimiter: Ratelimit | null = null
export const authenticatedLimiter = {
  get limit() {
    if (!_authLimiter) {
      _authLimiter = new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(5, "1 h"),
        prefix: "ratelimit:auth",
      })
    }
    return _authLimiter.limit.bind(_authLimiter)
  },
}

let _anonLimiter: Ratelimit | null = null
export const anonymousLimiter = {
  get limit() {
    if (!_anonLimiter) {
      _anonLimiter = new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(1, "24 h"),
        prefix: "ratelimit:anon",
      })
    }
    return _anonLimiter.limit.bind(_anonLimiter)
  },
}

// Cache helpers
function getCacheKey(question: string): string {
  const hash = createHash("md5").update(question.toLowerCase().trim()).digest("hex")
  return `cache:chat:${hash}`
}

export async function getCachedResponse(question: string): Promise<string | null> {
  const key = getCacheKey(question)
  return getRedis().get<string>(key)
}

export async function setCachedResponse(question: string, response: string): Promise<void> {
  const key = getCacheKey(question)
  await getRedis().set(key, response, { ex: 3600 }) // 1 hour TTL
}
