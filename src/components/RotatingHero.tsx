"use client"

import { useState, useEffect } from "react"
import { useLocale } from "next-intl"

const phrases: Record<string, string[]> = {
  en: [
    "Best AI tool to edit my videos?",
    "I need to transcribe meetings",
    "What AI writes marketing copy?",
    "Find me a chatbot builder",
    "Tool to clone voices?",
    "Automate my email campaigns",
    "AI to create videos from text?",
    "Best translator for 100+ languages",
    "Analyze my data with AI",
    "AI tool for logo design?",
    "Generate code from a description",
    "Summarize my PDFs quickly",
    "AI music generator?",
    "Remove photo backgrounds",
    "No-code AI workflow tool?",
  ],
  fr: [
    "Meilleur outil IA pour monter mes videos ?",
    "Je dois transcrire des reunions",
    "Quelle IA redige du contenu marketing ?",
    "Trouve-moi un createur de chatbot",
    "Outil pour cloner des voix ?",
    "Automatiser mes campagnes email",
    "IA pour creer des videos depuis du texte ?",
    "Meilleur traducteur 100+ langues",
    "Analyser mes donnees avec l'IA",
    "Outil IA pour creer un logo ?",
    "Generer du code depuis une description",
    "Resumer mes PDF rapidement",
    "Generateur de musique IA ?",
    "Supprimer le fond de mes photos",
    "Outil workflow IA no-code ?",
  ],
  ja: [
    "動画編集に最適なAIツールは？",
    "会議の文字起こしがしたい",
    "マーケティング文章を書くAIは？",
    "チャットボット作成ツールを探して",
    "音声クローンツールは？",
    "メールキャンペーンを自動化したい",
    "テキストから動画を作るAIは？",
    "100言語以上の翻訳ツール",
    "AIでデータ分析したい",
    "ロゴデザインのAIツールは？",
    "説明文からコードを生成したい",
    "PDFを素早く要約したい",
    "AI音楽ジェネレーターは？",
    "写真の背景を消したい",
    "ノーコードAIワークフローツール？",
  ],
  zh: [
    "最好的AI视频编辑工具？",
    "我需要转录会议内容",
    "哪个AI能写营销文案？",
    "帮我找个聊天机器人工具",
    "有克隆声音的工具吗？",
    "自动化我的邮件营销",
    "从文字生成视频的AI？",
    "最好的100+语言翻译器",
    "用AI分析我的数据",
    "AI设计Logo工具？",
    "从描述生成代码",
    "快速总结我的PDF",
    "AI音乐生成器？",
    "去除照片背景",
    "无代码AI工作流工具？",
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

      {/* Rotating text — clickable to send to AskOmni */}
      <div className="absolute inset-0 flex items-center justify-center px-8">
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("open-askomni", { detail: { question: localePhrases[currentIndex] } }))
          }}
          className={`text-center text-lg md:text-xl font-medium transition-all duration-500 cursor-pointer hover:text-primary ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          {localePhrases[currentIndex]}
        </button>
      </div>
    </div>
  )
}
