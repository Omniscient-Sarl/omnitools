"use client"

import { useState, useEffect } from "react"
import { useLocale } from "next-intl"

const phrases: Record<string, string[]> = {
  en: [
    "Generate product images with AI",
    "Transcribe meetings automatically",
    "Write marketing copy in seconds",
    "Build a chatbot for your site",
    "Clone any voice with AI",
    "Automate your email campaigns",
    "Create videos from text prompts",
    "Translate content in 100+ languages",
    "Analyze data with natural language",
    "Design logos and brand assets",
    "Generate code from descriptions",
    "Summarize long documents instantly",
    "Create music with AI composers",
    "Remove backgrounds from photos",
    "Build no-code AI workflows",
  ],
  fr: [
    "Generer des images produit avec l'IA",
    "Transcrire des reunions automatiquement",
    "Rediger du contenu marketing en secondes",
    "Creer un chatbot pour votre site",
    "Cloner n'importe quelle voix avec l'IA",
    "Automatiser vos campagnes email",
    "Creer des videos a partir de texte",
    "Traduire du contenu en 100+ langues",
    "Analyser des donnees en langage naturel",
    "Designer des logos et identites visuelles",
    "Generer du code a partir de descriptions",
    "Resumer des documents longs instantanement",
    "Composer de la musique avec l'IA",
    "Supprimer les arriere-plans des photos",
    "Construire des workflows IA no-code",
  ],
  ja: [
    "AIで商品画像を生成する",
    "会議を自動で文字起こしする",
    "数秒でマーケティングコピーを作成",
    "サイト用チャットボットを構築",
    "AIで音声をクローンする",
    "メールキャンペーンを自動化",
    "テキストから動画を作成",
    "100以上の言語に翻訳",
    "自然言語でデータを分析",
    "ロゴやブランド素材をデザイン",
    "説明文からコードを生成",
    "長い文書を瞬時に要約",
    "AIで音楽を作曲",
    "写真の背景を削除",
    "ノーコードAIワークフローを構築",
  ],
  zh: [
    "用AI生成产品图片",
    "自动转录会议内容",
    "秒速撰写营销文案",
    "为网站创建聊天机器人",
    "用AI克隆任何声音",
    "自动化邮件营销",
    "从文字生成视频",
    "翻译100多种语言",
    "用自然语言分析数据",
    "设计Logo和品牌素材",
    "从描述生成代码",
    "即时总结长文档",
    "用AI作曲",
    "移除照片背景",
    "构建无代码AI工作流",
  ],
}

export function RotatingHero() {
  const locale = useLocale()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const localePhrases = phrases[locale] || phrases.en

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % localePhrases.length)
        setIsVisible(true)
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [localePhrases.length])

  return (
    <div className="relative flex items-center justify-center py-4">
      {/* Ellipse SVG */}
      <svg
        viewBox="0 0 400 200"
        className="w-full max-w-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ellipseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <ellipse
          cx="200"
          cy="100"
          rx="190"
          ry="90"
          fill="url(#ellipseGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
      </svg>

      {/* Rotating text */}
      <div className="absolute inset-0 flex items-center justify-center px-8">
        <p
          className={`text-center text-lg md:text-xl font-medium transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          {localePhrases[currentIndex]}
        </p>
      </div>
    </div>
  )
}
