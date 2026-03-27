import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_OMNISKILLS_SUPABASE_URL!;
const SUPABASE_KEY = process.env.OMNISKILLS_SERVICE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SERVICE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Author mapping ──────────────────────────────────────────────────
function mapAuthor(repo: string): string {
  const owner = repo.split("/")[0];
  const map: Record<string, string> = {
    "anthropics": "Anthropic",
    "vercel-labs": "Vercel",
    "vercel": "Vercel",
    "microsoft": "Microsoft",
    "google-labs-code": "Google Labs",
    "googleworkspace": "Google Workspace",
    "supabase": "Supabase",
    "github": "GitHub",
    "expo": "Expo",
    "remotion-dev": "Remotion",
    "inferen-sh": "Inferen",
    "shadcn": "shadcn",
    "browser-use": "Browser Use",
    "obra": "obra",
    "pbakaus": "Paul Bakaus",
    "coreyhaines31": "Corey Haines",
    "nextlevelbuilder": "Next Level Builder",
    "sleekdotdesign": "Sleek Design",
    "better-auth": "Better Auth",
    "firecrawl": "Firecrawl",
    "wshobson": "wshobson",
    "neondatabase": "Neon",
    "supercent-io": "Supercent",
    "currents-dev": "Currents",
    "charon-fan": "Charon Fan",
    "resciencelab": "ReScience Lab",
    "tavily-ai": "Tavily",
    "useai-pro": "UseAI Pro",
    "kepano": "Kepano",
    "elevenlabs": "ElevenLabs",
    "madteacher": "Mad Teacher",
    "avdlee": "Antoine van der Lee",
    "hyf0": "hyf0",
    "othmanadi": "Othman Adi",
    "halthelobster": "Hal the Lobster",
  };
  return map[owner] || owner;
}

// ── Category mapping ────────────────────────────────────────────────
function mapCategories(skillName: string, repo: string): string[] {
  const n = skillName.toLowerCase();
  const cats: string[] = [];

  // Code assistant
  if (
    n.includes("react") || n.includes("vue") || n.includes("typescript") ||
    n.includes("python") || n.includes("nodejs") || n.includes("swiftui") ||
    n.includes("flutter") || n.includes("shadcn") || n.includes("tailwind") ||
    n.includes("next-best") || n.includes("composition") ||
    n.includes("state-management") || n.includes("ui-component") ||
    n.includes("remotion") || n.includes("expo") || n.includes("native-ui") ||
    n.includes("native-data") || n.includes("ai-sdk") || n.includes("better-auth") ||
    n.includes("firebase") || n.includes("neon-postgres") ||
    n.includes("supabase-postgres")
  ) cats.push("code-assistant");

  // Writing
  if (
    n.includes("writing") || n.includes("copy") || n.includes("doc") ||
    n.includes("pptx") || n.includes("xlsx") || n.includes("docx") ||
    n.includes("pdf") || n.includes("technical-writing") ||
    n.includes("content-strategy") || n.includes("internal-comms") ||
    n.includes("brand-guidelines") || n.includes("prd") ||
    n.includes("changelog") || n.includes("user-guide") ||
    n.includes("obsidian")
  ) cats.push("writing");

  // Data analysis
  if (
    n.includes("data-analysis") || n.includes("analytics") ||
    n.includes("sql") || n.includes("database") || n.includes("schema") ||
    n.includes("log-analysis")
  ) cats.push("data-analysis");

  // Research
  if (
    n.includes("search") || n.includes("research") || n.includes("brainstorm") ||
    n.includes("firecrawl") || n.includes("web-search") || n.includes("find-skills") ||
    n.includes("competitor") || n.includes("seo") || n.includes("ai-seo") ||
    n.includes("site-architecture")
  ) cats.push("research");

  // Automation
  if (
    n.includes("automation") || n.includes("workflow") || n.includes("browser-use") ||
    n.includes("agent-browser") || n.includes("deploy") || n.includes("ci") ||
    n.includes("dispatching") || n.includes("subagent") ||
    n.includes("proactive-agent") || n.includes("self-improving") ||
    n.includes("stitch-loop")
  ) cats.push("automation");

  // Design
  if (
    n.includes("design") || n.includes("ui-ux") || n.includes("frontend-design") ||
    n.includes("canvas") || n.includes("theme") || n.includes("responsive") ||
    n.includes("excalidraw") || n.includes("landing-page") ||
    n.includes("algorithmic-art") || n.includes("sleek") ||
    n.includes("colorize") || n.includes("typeset") || n.includes("arrange")
  ) cats.push("design");

  // DevOps
  if (
    n.includes("azure") || n.includes("kubernetes") || n.includes("deploy") ||
    n.includes("vercel-deploy") || n.includes("monitoring") ||
    n.includes("observability") || n.includes("git-workflow") ||
    n.includes("git-commit") || n.includes("worktree") ||
    n.includes("finishing-a-development") || n.includes("gh-cli") ||
    n.includes("deployment-automation")
  ) cats.push("devops");

  // Productivity
  if (
    n.includes("planning") || n.includes("task") || n.includes("sprint") ||
    n.includes("onboard") || n.includes("file-organization") ||
    n.includes("codebase-search") || n.includes("clarify") ||
    n.includes("distill") || n.includes("extract") || n.includes("enhance-prompt") ||
    n.includes("slack-gif") || n.includes("gws-") || n.includes("gmail") ||
    n.includes("calendar") || n.includes("sheets") || n.includes("refactor") ||
    n.includes("code-review") || n.includes("receiving-code-review") ||
    n.includes("verification") || n.includes("skill-creator") ||
    n.includes("skill-vetter") || n.includes("template-skill") ||
    n.includes("mcp-builder") || n.includes("playwright")
  ) cats.push("productivity");

  // Education
  if (
    n.includes("teach") || n.includes("education") || n.includes("test-driven") ||
    n.includes("best-practices") || n.includes("api-design-principles") ||
    n.includes("patterns")
  ) cats.push("education");

  // Security
  if (
    n.includes("security") || n.includes("harden") || n.includes("auth") ||
    n.includes("authentication-setup")
  ) cats.push("security");

  // Marketing bucket
  if (
    n.includes("marketing") || n.includes("pricing-strategy") ||
    n.includes("email-sequence") || n.includes("paid-ads") ||
    n.includes("referral") || n.includes("ab-test") || n.includes("cro") ||
    n.includes("churn") || n.includes("cold-email") || n.includes("ad-creative") ||
    n.includes("revops") || n.includes("sales") || n.includes("launch-strategy") ||
    n.includes("social-content") || n.includes("copywriting") ||
    n.includes("free-tool-strategy") || n.includes("popup-cro") ||
    n.includes("paywall") || n.includes("signup-flow")
  ) cats.push("productivity"); // map marketing to productivity

  // AI / image / video generation
  if (
    n.includes("ai-image") || n.includes("ai-video") || n.includes("elevenlabs") ||
    n.includes("tts") || n.includes("image-generation") ||
    n.includes("video-generation")
  ) cats.push("automation");

  // Testing
  if (
    n.includes("testing") || n.includes("test") || n.includes("playwright") ||
    n.includes("webapp-testing") || n.includes("backend-testing")
  ) cats.push("code-assistant");

  // Performance / optimization
  if (
    n.includes("performance") || n.includes("optimization") || n.includes("optimize")
  ) cats.push("code-assistant");

  // Code refactoring / debugging
  if (
    n.includes("refactoring") || n.includes("debugging") || n.includes("refactor")
  ) cats.push("code-assistant");

  // API
  if (n.includes("api-doc") || n.includes("api-design")) cats.push("code-assistant");

  // Fallback
  if (cats.length === 0) cats.push("productivity");

  // Deduplicate
  return Array.from(new Set(cats));
}

// ── Tagline generator ───────────────────────────────────────────────
function generateTagline(name: string, repo: string): string {
  const taglines: Record<string, string> = {
    "find-skills": "Discover and install the best agent skills",
    "vercel-react-best-practices": "React best practices for production apps on Vercel",
    "frontend-design": "Build beautiful, accessible frontend interfaces",
    "web-design-guidelines": "Professional web design guidelines and patterns",
    "remotion-best-practices": "Create stunning programmatic videos with Remotion",
    "azure-ai": "Integrate Azure AI services into your workflow",
    "agent-browser": "Automate browser tasks with an AI agent",
    "ai-image-generation": "Generate images using AI models",
    "ai-video-generation": "Generate videos using AI models",
    "skill-creator": "Create and publish your own agent skills",
    "microsoft-foundry": "Build AI apps with Microsoft Foundry",
    "vercel-composition-patterns": "Advanced composition patterns for React on Vercel",
    "ui-ux-pro-max": "Elevate your UI/UX to professional quality",
    "brainstorming": "Generate creative ideas through structured brainstorming",
    "browser-use": "Control browsers programmatically with AI",
    "pdf": "Create and manipulate PDF documents",
    "supabase-postgres-best-practices": "Best practices for Supabase Postgres databases",
    "pptx": "Generate PowerPoint presentations programmatically",
    "shadcn": "Build UIs with shadcn/ui components",
    "docx": "Generate Word documents programmatically",
    "xlsx": "Create and manipulate Excel spreadsheets",
    "webapp-testing": "Test web applications with automated strategies",
    "clarify": "Improve clarity and readability of your content",
    "teach-impeccable": "Learn to write impeccable prose",
    "marketing-ideas": "Generate creative marketing campaign ideas",
    "colorize": "Add vibrant color to your designs",
    "optimize": "Optimize content for maximum impact",
    "normalize": "Normalize formatting and style across content",
    "sleek-design-mobile-apps": "Design sleek mobile app interfaces",
    "bolder": "Make your writing bolder and more impactful",
    "delight": "Add delightful micro-interactions to your UI",
    "pricing-strategy": "Develop effective pricing strategies",
    "distill": "Distill complex information into clear insights",
    "extract": "Extract key data from unstructured content",
    "harden": "Harden your application security posture",
    "onboard": "Create smooth user onboarding experiences",
    "subagent-driven-development": "Coordinate sub-agents for parallel development",
    "quieter": "Tone down and simplify verbose content",
    "better-auth-best-practices": "Implement authentication with Better Auth",
    "mcp-builder": "Build Model Context Protocol servers and tools",
    "copy-editing": "Professional copy editing for polished content",
    "verification-before-completion": "Verify work quality before marking tasks complete",
    "page-cro": "Optimize page conversion rates",
    "receiving-code-review": "Handle code review feedback effectively",
    "analytics-tracking": "Set up analytics tracking for data-driven decisions",
    "canvas-design": "Create visual designs on HTML canvas",
    "writing-skills": "Improve your writing with structured techniques",
    "launch-strategy": "Plan and execute effective product launches",
    "schema-markup": "Add structured data markup for SEO",
    "email-sequence": "Design effective email marketing sequences",
    "paid-ads": "Create and optimize paid advertising campaigns",
    "using-git-worktrees": "Manage parallel development with git worktrees",
    "competitor-alternatives": "Analyze competitor alternatives and positioning",
    "onboarding-cro": "Optimize user onboarding conversion rates",
    "dispatching-parallel-agents": "Dispatch and coordinate parallel AI agents",
    "tailwind-design-system": "Build a design system with Tailwind CSS",
    "form-cro": "Optimize form conversion rates",
    "referral-program": "Design effective referral programs",
    "free-tool-strategy": "Use free tools as a growth strategy",
    "react:components": "Build reusable React components with Google Stitch",
    "signup-flow-cro": "Optimize signup flow conversion rates",
    "ab-test-setup": "Set up A/B tests for data-driven optimization",
    "paywall-upgrade-cro": "Optimize paywall upgrade conversion",
    "popup-cro": "Optimize popup conversion rates",
    "finishing-a-development-branch": "Cleanly finish and merge development branches",
    "design-md": "Design with Markdown using Google Stitch",
    "azure-enterprise-infra-planner": "Plan enterprise infrastructure on Azure",
    "building-native-ui": "Build native mobile UIs with Expo",
    "stitch-loop": "Iterative design loop with Google Stitch",
    "algorithmic-art": "Create generative algorithmic art",
    "enhance-prompt": "Enhance and refine AI prompts",
    "web-artifacts-builder": "Build interactive web artifacts",
    "doc-coauthoring": "Collaborate on document writing with AI",
    "theme-factory": "Generate and customize UI themes",
    "firecrawl": "Crawl and extract web data at scale",
    "ai-seo": "AI-powered SEO optimization strategies",
    "shadcn-ui": "Build UIs with shadcn components via Stitch",
    "brand-guidelines": "Create comprehensive brand guidelines",
    "self-improving-agent": "Build agents that improve over time",
    "git-commit": "Write better git commit messages",
    "typescript-advanced-types": "Master advanced TypeScript type patterns",
    "seo-geo": "Optimize for local and geographic SEO",
    "cold-email": "Write effective cold outreach emails",
    "ad-creative": "Design compelling ad creatives",
    "internal-comms": "Craft effective internal communications",
    "churn-prevention": "Strategies to reduce customer churn",
    "native-data-fetching": "Efficient data fetching for native apps",
    "playwright-best-practices": "Best practices for Playwright testing",
    "web-search": "Search the web programmatically",
    "deploy-to-vercel": "Deploy applications to Vercel",
    "slack-gif-creator": "Create animated GIFs for Slack",
    "template-skill": "Template for creating new agent skills",
    "site-architecture": "Plan effective site architecture for SEO",
    "arrange": "Arrange and layout design elements",
    "sales-enablement": "Create sales enablement materials",
    "upgrading-expo": "Upgrade Expo projects smoothly",
    "typeset": "Apply professional typography to designs",
    "revops": "Optimize revenue operations workflows",
    "python-executor": "Execute Python code in a sandboxed environment",
    "gh-cli": "Automate GitHub workflows with the CLI",
    "neon-postgres": "Build with Neon serverless Postgres",
    "security-best-practices": "Apply security best practices to your codebase",
    "expo-tailwind-setup": "Set up Tailwind CSS in Expo projects",
    "ai-sdk": "Build AI features with the Vercel AI SDK",
    "vue-best-practices": "Vue.js best practices for production apps",
    "api-design-principles": "Design clean, consistent APIs",
    "python-performance-optimization": "Optimize Python code for peak performance",
    "azure-observability": "Monitor Azure infrastructure effectively",
    "web-accessibility": "Build accessible web experiences for all users",
    "nodejs-backend-patterns": "Node.js backend architecture patterns",
    "workflow-automation": "Automate repetitive development workflows",
    "code-review": "Conduct thorough, constructive code reviews",
    "swiftui-expert-skill": "Build expert-level SwiftUI interfaces",
    "database-schema-design": "Design efficient database schemas",
    "prd": "Write effective product requirement documents",
    "gws-gmail": "Automate Gmail with Google Workspace",
    "search": "Search the web with Tavily AI",
    "code-refactoring": "Refactor code for clarity and maintainability",
    "backend-testing": "Test backend services comprehensively",
    "technical-writing": "Write clear technical documentation",
    "skill-vetter": "Vet and validate agent skills for security",
    "playwright-cli": "Run Playwright tests from the command line",
    "api-documentation": "Generate comprehensive API documentation",
    "documentation-writer": "Write clear project documentation",
    "api-design": "Design robust and scalable APIs",
    "performance-optimization": "Optimize application performance",
    "gws-docs": "Automate Google Docs with Workspace API",
    "create-auth-skill": "Create authentication skills with Better Auth",
    "task-planning": "Plan and organize development tasks",
    "responsive-design": "Build responsive layouts for all screens",
    "testing-strategies": "Choose effective testing strategies",
    "deployment-automation": "Automate deployment pipelines",
    "excalidraw-diagram-generator": "Generate diagrams with Excalidraw",
    "planning-with-files": "Plan projects using structured files",
    "proactive-agent": "Build AI agents that act proactively",
    "git-workflow": "Streamline git workflows for teams",
    "file-organization": "Organize project files effectively",
    "gws-calendar": "Automate Google Calendar with Workspace API",
    "refactor": "Refactor code for better architecture",
    "monitoring-observability": "Set up monitoring and observability",
    "changelog-maintenance": "Maintain clear, useful changelogs",
    "codebase-search": "Search and navigate large codebases",
    "azure-kubernetes": "Deploy and manage Kubernetes on Azure",
    "debugging": "Debug issues systematically and efficiently",
    "gws-sheets": "Automate Google Sheets with Workspace API",
    "user-guide-writing": "Write user-friendly product guides",
    "flutter-animations": "Create smooth Flutter animations",
    "ui-component-patterns": "Reusable UI component design patterns",
    "log-analysis": "Analyze logs to diagnose issues",
    "authentication-setup": "Set up authentication for your app",
    "vercel-deploy": "Deploy to Vercel with best practices",
    "state-management": "Manage application state effectively",
    "obsidian-markdown": "Write and format Obsidian markdown notes",
    "obsidian-bases": "Build knowledge bases in Obsidian",
    "firebase-ai-logic": "Add AI logic with Firebase",
    "python-testing-patterns": "Python testing patterns and best practices",
    "sprint-retrospective": "Run effective sprint retrospectives",
    "elevenlabs-tts": "Generate lifelike text-to-speech with ElevenLabs",
    "test-driven-development": "Practice test-driven development effectively",
    "data-analysis": "Analyze data for actionable insights",
    "sql-optimization": "Optimize SQL queries for performance",
    "content-strategy": "Develop effective content strategies",
    "social-content": "Create engaging social media content",
    "landing-page-design": "Design high-converting landing pages",
    "seo-audit": "Audit your site for SEO improvements",
    "copywriting": "Write persuasive, conversion-focused copy",
    "next-best-practices": "Next.js best practices for production apps",
  };

  if (taglines[name]) return taglines[name];

  // Fallback: generate from skill name
  const words = name.replace(/[:\-]/g, " ").replace(/\s+/g, " ").trim();
  return `${words.charAt(0).toUpperCase() + words.slice(1)} agent skill`;
}

// ── Description generator ───────────────────────────────────────────
function generateDescription(name: string, repo: string, tagline: string): string {
  const author = mapAuthor(repo);
  return `${tagline}. Built by ${author}, this skill enhances your AI coding agent with specialized capabilities.`;
}

// ── Parse install count ─────────────────────────────────────────────
function parseInstalls(raw: string): number {
  const s = raw.trim().replace(/,/g, "");
  if (s.endsWith("K")) return Math.round(parseFloat(s) * 1000);
  if (s.endsWith("M")) return Math.round(parseFloat(s) * 1000000);
  return parseInt(s, 10) || 0;
}

// ── Skill data ──────────────────────────────────────────────────────
interface RawSkill {
  name: string;
  repo: string;
  installs: string;
}

const rawSkills: RawSkill[] = [
  // RANK 1-22
  { name: "find-skills", repo: "vercel-labs/skills", installs: "742.4K" },
  { name: "vercel-react-best-practices", repo: "vercel-labs/agent-skills", installs: "254.0K" },
  { name: "frontend-design", repo: "anthropics/skills", installs: "208.5K" },
  { name: "web-design-guidelines", repo: "vercel-labs/agent-skills", installs: "204.3K" },
  { name: "remotion-best-practices", repo: "remotion-dev/skills", installs: "179.7K" },
  { name: "azure-ai", repo: "microsoft/github-copilot-for-azure", installs: "145.8K" },
  { name: "agent-browser", repo: "vercel-labs/agent-browser", installs: "135.2K" },
  { name: "ai-image-generation", repo: "inferen-sh/skills", installs: "113.7K" },
  { name: "ai-video-generation", repo: "inferen-sh/skills", installs: "111.2K" },
  { name: "skill-creator", repo: "anthropics/skills", installs: "111.1K" },
  { name: "microsoft-foundry", repo: "microsoft/azure-skills", installs: "105.5K" },
  { name: "vercel-composition-patterns", repo: "vercel-labs/agent-skills", installs: "103.2K" },
  { name: "ui-ux-pro-max", repo: "nextlevelbuilder/ui-ux-pro-max-skill", installs: "84.9K" },
  { name: "brainstorming", repo: "obra/superpowers", installs: "76.5K" },
  { name: "browser-use", repo: "browser-use/browser-use", installs: "57.1K" },
  { name: "pdf", repo: "anthropics/skills", installs: "52.9K" },
  { name: "supabase-postgres-best-practices", repo: "supabase/agent-skills", installs: "52.8K" },
  { name: "pptx", repo: "anthropics/skills", installs: "48.4K" },
  { name: "shadcn", repo: "shadcn/ui", installs: "46.3K" },
  { name: "docx", repo: "anthropics/skills", installs: "41.6K" },
  { name: "xlsx", repo: "anthropics/skills", installs: "37.9K" },
  { name: "webapp-testing", repo: "anthropics/skills", installs: "34.3K" },

  // RANK 100-200
  { name: "clarify", repo: "pbakaus/impeccable", installs: "30.0K" },
  { name: "teach-impeccable", repo: "pbakaus/impeccable", installs: "30.0K" },
  { name: "marketing-ideas", repo: "coreyhaines31/marketingskills", installs: "30.0K" },
  { name: "colorize", repo: "pbakaus/impeccable", installs: "29.9K" },
  { name: "optimize", repo: "pbakaus/impeccable", installs: "29.9K" },
  { name: "normalize", repo: "pbakaus/impeccable", installs: "29.9K" },
  { name: "sleek-design-mobile-apps", repo: "sleekdotdesign/agent-skills", installs: "29.6K" },
  { name: "bolder", repo: "pbakaus/impeccable", installs: "29.6K" },
  { name: "delight", repo: "pbakaus/impeccable", installs: "29.5K" },
  { name: "pricing-strategy", repo: "coreyhaines31/marketingskills", installs: "29.4K" },
  { name: "distill", repo: "pbakaus/impeccable", installs: "29.4K" },
  { name: "extract", repo: "pbakaus/impeccable", installs: "29.3K" },
  { name: "harden", repo: "pbakaus/impeccable", installs: "29.2K" },
  { name: "onboard", repo: "pbakaus/impeccable", installs: "29.2K" },
  { name: "subagent-driven-development", repo: "obra/superpowers", installs: "29.0K" },
  { name: "quieter", repo: "pbakaus/impeccable", installs: "29.0K" },
  { name: "better-auth-best-practices", repo: "better-auth/skills", installs: "28.7K" },
  { name: "mcp-builder", repo: "anthropics/skills", installs: "28.1K" },
  { name: "copy-editing", repo: "coreyhaines31/marketingskills", installs: "28.1K" },
  { name: "verification-before-completion", repo: "obra/superpowers", installs: "27.1K" },
  { name: "page-cro", repo: "coreyhaines31/marketingskills", installs: "27.0K" },
  { name: "receiving-code-review", repo: "obra/superpowers", installs: "27.0K" },
  { name: "analytics-tracking", repo: "coreyhaines31/marketingskills", installs: "26.8K" },
  { name: "canvas-design", repo: "anthropics/skills", installs: "26.7K" },
  { name: "writing-skills", repo: "obra/superpowers", installs: "26.2K" },
  { name: "launch-strategy", repo: "coreyhaines31/marketingskills", installs: "26.1K" },
  { name: "schema-markup", repo: "coreyhaines31/marketingskills", installs: "25.9K" },
  { name: "email-sequence", repo: "coreyhaines31/marketingskills", installs: "25.6K" },
  { name: "paid-ads", repo: "coreyhaines31/marketingskills", installs: "25.5K" },
  { name: "using-git-worktrees", repo: "obra/superpowers", installs: "25.4K" },
  { name: "competitor-alternatives", repo: "coreyhaines31/marketingskills", installs: "25.4K" },
  { name: "onboarding-cro", repo: "coreyhaines31/marketingskills", installs: "25.3K" },
  { name: "dispatching-parallel-agents", repo: "obra/superpowers", installs: "25.2K" },
  { name: "tailwind-design-system", repo: "wshobson/agents", installs: "24.8K" },
  { name: "form-cro", repo: "coreyhaines31/marketingskills", installs: "24.6K" },
  { name: "referral-program", repo: "coreyhaines31/marketingskills", installs: "24.4K" },
  { name: "free-tool-strategy", repo: "coreyhaines31/marketingskills", installs: "24.4K" },
  { name: "react:components", repo: "google-labs-code/stitch-skills", installs: "24.3K" },
  { name: "signup-flow-cro", repo: "coreyhaines31/marketingskills", installs: "24.0K" },
  { name: "ab-test-setup", repo: "coreyhaines31/marketingskills", installs: "23.9K" },
  { name: "paywall-upgrade-cro", repo: "coreyhaines31/marketingskills", installs: "23.8K" },
  { name: "popup-cro", repo: "coreyhaines31/marketingskills", installs: "23.5K" },
  { name: "finishing-a-development-branch", repo: "obra/superpowers", installs: "23.4K" },
  { name: "design-md", repo: "google-labs-code/stitch-skills", installs: "23.3K" },
  { name: "azure-enterprise-infra-planner", repo: "microsoft/azure-skills", installs: "22.7K" },
  { name: "building-native-ui", repo: "expo/skills", installs: "22.2K" },
  { name: "stitch-loop", repo: "google-labs-code/stitch-skills", installs: "21.3K" },
  { name: "algorithmic-art", repo: "anthropics/skills", installs: "20.9K" },
  { name: "enhance-prompt", repo: "google-labs-code/stitch-skills", installs: "20.7K" },
  { name: "web-artifacts-builder", repo: "anthropics/skills", installs: "20.6K" },
  { name: "doc-coauthoring", repo: "anthropics/skills", installs: "20.0K" },
  { name: "theme-factory", repo: "anthropics/skills", installs: "19.9K" },
  { name: "firecrawl", repo: "firecrawl/cli", installs: "19.5K" },
  { name: "ai-seo", repo: "coreyhaines31/marketingskills", installs: "19.3K" },
  { name: "shadcn-ui", repo: "google-labs-code/stitch-skills", installs: "18.8K" },
  { name: "brand-guidelines", repo: "anthropics/skills", installs: "18.8K" },
  { name: "self-improving-agent", repo: "charon-fan/agent-playbook", installs: "18.7K" },
  { name: "git-commit", repo: "github/awesome-copilot", installs: "18.5K" },
  { name: "typescript-advanced-types", repo: "wshobson/agents", installs: "18.4K" },
  { name: "seo-geo", repo: "resciencelab/opc-skills", installs: "17.8K" },
  { name: "cold-email", repo: "coreyhaines31/marketingskills", installs: "17.8K" },
  { name: "ad-creative", repo: "coreyhaines31/marketingskills", installs: "17.5K" },
  { name: "internal-comms", repo: "anthropics/skills", installs: "17.0K" },
  { name: "churn-prevention", repo: "coreyhaines31/marketingskills", installs: "16.6K" },
  { name: "native-data-fetching", repo: "expo/skills", installs: "16.5K" },
  { name: "playwright-best-practices", repo: "currents-dev/playwright-best-practices-skill", installs: "16.4K" },
  { name: "web-search", repo: "inferen-sh/skills", installs: "16.3K" },
  { name: "deploy-to-vercel", repo: "vercel-labs/agent-skills", installs: "16.1K" },
  { name: "slack-gif-creator", repo: "anthropics/skills", installs: "16.0K" },
  { name: "template-skill", repo: "anthropics/skills", installs: "16.0K" },
  { name: "site-architecture", repo: "coreyhaines31/marketingskills", installs: "15.0K" },
  { name: "arrange", repo: "pbakaus/impeccable", installs: "14.9K" },
  { name: "sales-enablement", repo: "coreyhaines31/marketingskills", installs: "14.8K" },
  { name: "upgrading-expo", repo: "expo/skills", installs: "14.7K" },
  { name: "typeset", repo: "pbakaus/impeccable", installs: "14.6K" },
  { name: "revops", repo: "coreyhaines31/marketingskills", installs: "14.3K" },
  { name: "python-executor", repo: "inferen-sh/skills", installs: "14.3K" },
  { name: "gh-cli", repo: "github/awesome-copilot", installs: "14.3K" },
  { name: "neon-postgres", repo: "neondatabase/agent-skills", installs: "14.2K" },
  { name: "security-best-practices", repo: "supercent-io/skills-template", installs: "14.1K" },
  { name: "expo-tailwind-setup", repo: "expo/skills", installs: "14.1K" },
  { name: "ai-sdk", repo: "vercel/ai", installs: "14.0K" },
  { name: "vue-best-practices", repo: "hyf0/vue-skills", installs: "13.4K" },
  { name: "api-design-principles", repo: "wshobson/agents", installs: "12.9K" },
  { name: "python-performance-optimization", repo: "wshobson/agents", installs: "12.8K" },
  { name: "azure-observability", repo: "microsoft/azure-skills", installs: "12.7K" },
  { name: "web-accessibility", repo: "supercent-io/skills-template", installs: "12.7K" },
  { name: "nodejs-backend-patterns", repo: "wshobson/agents", installs: "12.6K" },
  { name: "workflow-automation", repo: "supercent-io/skills-template", installs: "12.6K" },
  { name: "code-review", repo: "supercent-io/skills-template", installs: "12.5K" },
  { name: "swiftui-expert-skill", repo: "avdlee/swiftui-agent-skill", installs: "12.2K" },
  { name: "database-schema-design", repo: "supercent-io/skills-template", installs: "12.1K" },
  { name: "prd", repo: "github/awesome-copilot", installs: "12.1K" },
  { name: "gws-gmail", repo: "googleworkspace/cli", installs: "12.0K" },
  { name: "search", repo: "tavily-ai/skills", installs: "11.9K" },
  { name: "code-refactoring", repo: "supercent-io/skills-template", installs: "11.9K" },
  { name: "backend-testing", repo: "supercent-io/skills-template", installs: "11.8K" },
  { name: "technical-writing", repo: "supercent-io/skills-template", installs: "11.7K" },
  { name: "skill-vetter", repo: "useai-pro/openclaw-skills-security", installs: "11.7K" },
  { name: "playwright-cli", repo: "microsoft/playwright-cli", installs: "11.7K" },
  { name: "api-documentation", repo: "supercent-io/skills-template", installs: "11.7K" },

  // RANK 200-244
  { name: "documentation-writer", repo: "github/awesome-copilot", installs: "11.5K" },
  { name: "api-design", repo: "supercent-io/skills-template", installs: "11.5K" },
  { name: "performance-optimization", repo: "supercent-io/skills-template", installs: "11.5K" },
  { name: "gws-docs", repo: "googleworkspace/cli", installs: "11.4K" },
  { name: "create-auth-skill", repo: "better-auth/skills", installs: "11.3K" },
  { name: "task-planning", repo: "supercent-io/skills-template", installs: "11.3K" },
  { name: "responsive-design", repo: "supercent-io/skills-template", installs: "11.2K" },
  { name: "testing-strategies", repo: "supercent-io/skills-template", installs: "11.2K" },
  { name: "deployment-automation", repo: "supercent-io/skills-template", installs: "11.2K" },
  { name: "excalidraw-diagram-generator", repo: "github/awesome-copilot", installs: "11.2K" },
  { name: "planning-with-files", repo: "othmanadi/planning-with-files", installs: "11.2K" },
  { name: "proactive-agent", repo: "halthelobster/proactive-agent", installs: "11.1K" },
  { name: "git-workflow", repo: "supercent-io/skills-template", installs: "11.1K" },
  { name: "file-organization", repo: "supercent-io/skills-template", installs: "11.0K" },
  { name: "gws-calendar", repo: "googleworkspace/cli", installs: "11.0K" },
  { name: "refactor", repo: "github/awesome-copilot", installs: "11.0K" },
  { name: "monitoring-observability", repo: "supercent-io/skills-template", installs: "10.9K" },
  { name: "changelog-maintenance", repo: "supercent-io/skills-template", installs: "10.9K" },
  { name: "codebase-search", repo: "supercent-io/skills-template", installs: "10.9K" },
  { name: "azure-kubernetes", repo: "microsoft/azure-skills", installs: "10.8K" },
  { name: "debugging", repo: "supercent-io/skills-template", installs: "10.8K" },
  { name: "gws-sheets", repo: "googleworkspace/cli", installs: "10.8K" },
  { name: "user-guide-writing", repo: "supercent-io/skills-template", installs: "10.7K" },
  { name: "flutter-animations", repo: "madteacher/mad-agents-skills", installs: "10.7K" },
  { name: "ui-component-patterns", repo: "supercent-io/skills-template", installs: "10.7K" },
  { name: "log-analysis", repo: "supercent-io/skills-template", installs: "10.6K" },
  { name: "authentication-setup", repo: "supercent-io/skills-template", installs: "10.6K" },
  { name: "vercel-deploy", repo: "supercent-io/skills-template", installs: "10.6K" },
  { name: "state-management", repo: "supercent-io/skills-template", installs: "10.5K" },
  { name: "obsidian-markdown", repo: "kepano/obsidian-skills", installs: "10.4K" },
  { name: "obsidian-bases", repo: "kepano/obsidian-skills", installs: "10.4K" },
  { name: "firebase-ai-logic", repo: "supercent-io/skills-template", installs: "10.4K" },
  { name: "python-testing-patterns", repo: "wshobson/agents", installs: "10.4K" },
  { name: "sprint-retrospective", repo: "supercent-io/skills-template", installs: "10.4K" },
  { name: "elevenlabs-tts", repo: "elevenlabs/skills", installs: "10.0K" },
  { name: "test-driven-development", repo: "supercent-io/skills-template", installs: "10.0K" },
  { name: "data-analysis", repo: "supercent-io/skills-template", installs: "13.8K" },
  { name: "sql-optimization", repo: "supercent-io/skills-template", installs: "10.0K" },
  { name: "content-strategy", repo: "supercent-io/skills-template", installs: "10.0K" },
  { name: "social-content", repo: "supercent-io/skills-template", installs: "10.0K" },
  { name: "landing-page-design", repo: "supercent-io/skills-template", installs: "10.0K" },
  { name: "seo-audit", repo: "supercent-io/skills-template", installs: "10.0K" },
  { name: "copywriting", repo: "supercent-io/skills-template", installs: "10.0K" },
  { name: "next-best-practices", repo: "supercent-io/skills-template", installs: "10.0K" },
];

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log(`Preparing ${rawSkills.length} skills for import...`);

  const rows = rawSkills.map((s) => {
    const slug = `sh-${s.name}`;
    const displayName = s.name
      .replace(/:/g, " ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace(/\bUi\b/g, "UI")
      .replace(/\bUx\b/g, "UX")
      .replace(/\bAi\b/g, "AI")
      .replace(/\bSdk\b/g, "SDK")
      .replace(/\bSeo\b/g, "SEO")
      .replace(/\bCro\b/g, "CRO")
      .replace(/\bApi\b/g, "API")
      .replace(/\bCli\b/g, "CLI")
      .replace(/\bPdf\b/g, "PDF")
      .replace(/\bSql\b/g, "SQL")
      .replace(/\bTts\b/g, "TTS")
      .replace(/\bGws\b/g, "GWS")
      .replace(/\bMcp\b/g, "MCP")
      .replace(/\bPrd\b/g, "PRD")
      .replace(/\bPptx\b/g, "PPTX")
      .replace(/\bDocx\b/g, "DOCX")
      .replace(/\bXlsx\b/g, "XLSX")
      .replace(/\bGit\b/g, "Git")
      .replace(/\bAb\b/g, "A/B");

    const cats = mapCategories(s.name, s.repo);
    const tagline = generateTagline(s.name, s.repo);
    const description = generateDescription(s.name, s.repo, tagline);
    const installCount = parseInstalls(s.installs);

    return {
      slug,
      name: displayName,
      tagline,
      description,
      author: mapAuthor(s.repo),
      url: `https://github.com/${s.repo}`,
      category: cats[0],
      categories: cats,
      keywords: [s.name, ...s.name.split("-").filter((w) => w.length > 2)],
      pricing_type: "free",
      install_count: installCount,
      is_new: false,
      is_trending: installCount > 50000,
    };
  });

  // Batch upsert in chunks of 50
  const BATCH_SIZE = 50;
  let totalUpserted = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase
      .from("skills")
      .upsert(batch, { onConflict: "slug" })
      .select("slug");

    if (error) {
      console.error(`Error upserting batch ${i / BATCH_SIZE + 1}:`, error.message);
      console.error("Details:", JSON.stringify(error, null, 2));
    } else {
      totalUpserted += (data?.length ?? 0);
      console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: upserted ${data?.length ?? 0} skills`);
    }
  }

  console.log(`\nTotal upserted: ${totalUpserted} skills`);

  // Verify count
  const { count } = await supabase
    .from("skills")
    .select("*", { count: "exact", head: true });
  console.log(`Total skills in database: ${count}`);

  // Show category distribution
  const { data: allSkills } = await supabase
    .from("skills")
    .select("category");

  if (allSkills) {
    const catCounts: Record<string, number> = {};
    for (const s of allSkills) {
      catCounts[s.category] = (catCounts[s.category] || 0) + 1;
    }
    console.log("\nCategory distribution:");
    for (const [cat, cnt] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${cat}: ${cnt}`);
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
