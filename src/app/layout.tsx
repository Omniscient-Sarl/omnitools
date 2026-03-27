import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "OmniTool - AI Tools Directory | Find the Best AI Tools",
    template: "%s | OmniTool",
  },
  description:
    "Discover 5000+ AI tools with smart recommendations. Describe your project and get personalized AI tool suggestions in seconds. By Omniscient SARL.",
  keywords: [
    "AI tools",
    "artificial intelligence",
    "AI directory",
    "AI recommendations",
    "best AI tools",
    "AI tool finder",
    "Omniscient SARL",
  ],
  authors: [{ name: "Omniscient SARL", url: "https://omniscient.swiss" }],
  creator: "Omniscient SARL",
  metadataBase: new URL("https://omnitool.ai"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://omnitool.ai",
    siteName: "OmniTool",
    title: "OmniTool - Find the Best AI Tools for Your Project",
    description:
      "Discover 5000+ AI tools with smart recommendations. Describe your project and get personalized suggestions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniTool - AI Tools Directory",
    description: "Find the best AI tools for your project. Smart recommendations powered by AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
