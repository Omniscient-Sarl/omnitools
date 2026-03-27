import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About OmniTool</h1>
        <div className="prose prose-neutral dark:prose-invert">
          <p className="text-lg text-muted-foreground">
            OmniTool is the intelligent AI tools directory, developed by Omniscient SARL.
            We help individuals and businesses find the right AI tools for their needs.
          </p>
          <p className="text-muted-foreground mt-4">
            With 5000+ AI tools indexed and smart recommendations powered by AI,
            OmniTool makes it easy to discover, compare, and choose the best tools
            for your projects.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Omniscient SARL</h2>
          <p className="text-muted-foreground">
            Omniscient SARL is a Swiss company specializing in AI integration for businesses.
            We help companies select, integrate, and optimize AI tools within their workflows.
          </p>
          <div className="mt-8">
            <Button asChild>
              <a
                href="https://omniscient.swiss"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                Visit omniscient.swiss <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
