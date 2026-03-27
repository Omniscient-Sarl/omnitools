import OpenAI from "openai"

// OpenRouter with Groq provider for Llama 3.1 8B (lazy singleton)
let _openrouter: OpenAI | null = null
function getOpenRouter() {
  if (!_openrouter) {
    _openrouter = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "https://omnitool.ai",
        "X-Title": "OmniToolss",
      },
    })
  }
  return _openrouter
}

const LLM_MODEL = "meta-llama/llama-3.1-8b-instruct"

interface Tool {
  name: string
  slug: string
  tagline?: string
  description?: string
  pricing_type?: string
  category?: string
  keywords?: string[]
  best_for?: string[]
  not_good_for?: string[]
  integrations?: string[]
  input_types?: string[]
  output_types?: string[]
}

interface ChatResponse {
  message: string
  recommendations: {
    name: string
    slug: string
    reason: string
  }[]
  isEnterprise: boolean
}

const ENTERPRISE_KEYWORDS = [
  "entreprise", "company", "equipe", "team", "budget", "roi",
  "integration", "custom", "deploiement", "deploy", "conformite",
  "rgpd", "gdpr", "securite", "security", "api sur-mesure",
  "collaborateurs", "staff", "production", "scaling", "b2b",
  "saas", "solution metier", "enterprise",
]

// Off-topic detection: only answer AI tool questions
const OFF_TOPIC_RESPONSES: Record<string, string> = {
  fr: "Je suis l'assistant OmniTools, specialise dans les outils IA. Pose-moi une question sur les outils IA et je te recommanderai les meilleurs !",
  en: "I'm OmniTools's assistant, specialized in AI tools. Ask me about AI tools and I'll recommend the best ones!",
  ja: "私はOmniToolsのAIツール専門アシスタントです。AIツールについて聞いてください！",
  zh: "我是OmniTools的AI工具助手。请问我关于AI工具的问题！",
}

function isOffTopic(question: string): boolean {
  const lower = question.toLowerCase()
  // AI/tool related keywords in multiple languages
  const onTopicKeywords = [
    "outil", "tool", "ia", "ai", "intelligence artificielle", "artificial intelligence",
    "generer", "generate", "creer", "create", "image", "video", "texte", "text",
    "audio", "voix", "voice", "code", "developer", "dev", "marketing", "seo",
    "automatiser", "automate", "automation", "chatbot", "assistant", "writing",
    "redaction", "traduction", "translate", "design", "ui", "ux", "data",
    "analytics", "productivite", "productivity", "education", "learning",
    "recherche", "research", "finance", "comptabilite", "legal", "juridique",
    "hr", "rh", "recrutement", "recruiting", "healthcare", "sante",
    "recommande", "recommend", "suggest", "meilleur", "best", "comparer", "compare",
    "alternative", "gratuit", "free", "paid", "freemium", "prix", "price", "pricing",
    "besoin", "need", "cherche", "looking", "want", "veux", "trouver", "find",
    "logiciel", "software", "app", "application", "plateforme", "platform",
    "saas", "api", "integration", "workflow", "no-code", "low-code",
    "transcri", "sous-titr", "subtitle", "clone", "synthes", "detect",
    "analys", "optimi", "resum", "summariz", "edit", "montage",
  ]
  return !onTopicKeywords.some((kw) => lower.includes(kw))
}

function detectEnterprise(message: string): boolean {
  const lower = message.toLowerCase()
  return ENTERPRISE_KEYWORDS.some((kw) => lower.includes(kw))
}

export async function chatWithTools(
  question: string,
  tools: Tool[],
  locale: string
): Promise<ChatResponse> {
  // Security: reject off-topic questions
  if (isOffTopic(question)) {
    return {
      message: OFF_TOPIC_RESPONSES[locale] || OFF_TOPIC_RESPONSES.en,
      recommendations: [],
      isEnterprise: false,
    }
  }

  const limitedTools = tools.slice(0, 15)
  const toolsContext = limitedTools
    .map((t) => `- ${t.name} (slug: ${t.slug}): ${t.tagline || ""} [${t.pricing_type || "N/A"}]`)
    .join("\n")

  const lang: Record<string, string> = { fr: "French", en: "English", ja: "Japanese", zh: "Chinese" }

  const systemPrompt = `You are OmniTools's AI assistant. You ONLY recommend AI tools from the list below. You NEVER answer questions unrelated to AI tools. If a user asks anything off-topic, reply: "I can only help with AI tool recommendations."

Reply in ${lang[locale] || "English"}.
You MUST recommend EXACTLY 3 tools. Pick the 3 most relevant from the list. For each, explain in 1 sentence why it fits. Even if only 1 tool seems perfect, still pick 2 more that could help.

Available tools:
${toolsContext}

IMPORTANT: Reply ONLY as valid JSON. No markdown, no extra text.
Format: {"message":"brief intro sentence","recommendations":[{"name":"Tool Name","slug":"tool-slug","reason":"1 sentence why"}]}`

  const completion = await getOpenRouter().chat.completions.create({
    model: LLM_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ],
    temperature: 0.3,
    max_tokens: 500,
    provider: {
      order: ["Groq"],
    },
  } as Parameters<typeof openrouter.chat.completions.create>[0])

  const rawContent = completion.choices[0]?.message?.content
  const content = typeof rawContent === "string"
    ? rawContent
    : typeof rawContent === "object" && rawContent !== null
      ? JSON.stringify(rawContent)
      : "{}"

  let parsed: ChatResponse
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? jsonMatch[0] : content
    parsed = JSON.parse(jsonStr)

    // Handle double-encoded JSON: if message is itself a JSON string with recommendations
    if (typeof parsed.message === "string" && parsed.message.startsWith("{")) {
      try {
        const inner = JSON.parse(parsed.message)
        if (inner.message) parsed.message = inner.message
        if (Array.isArray(inner.recommendations) && inner.recommendations.length > 0) {
          parsed.recommendations = inner.recommendations
        }
      } catch { /* not double-encoded, ignore */ }
    }

    // Ensure recommendations is an array
    if (!Array.isArray(parsed.recommendations)) {
      parsed.recommendations = []
    }
    parsed.isEnterprise = detectEnterprise(question)
  } catch {
    parsed = {
      message: typeof rawContent === "string" ? rawContent : "Sorry, I could not process that request.",
      recommendations: [],
      isEnterprise: detectEnterprise(question),
    }
  }

  return parsed
}
