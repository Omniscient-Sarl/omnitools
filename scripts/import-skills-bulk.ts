import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_OMNISKILLS_SUPABASE_URL!,
  process.env.OMNISKILLS_SERVICE_KEY!
)

// Skill templates per category - will be expanded with variations
const skillTemplates: Array<{
  prefix: string
  category: string
  categories: string[]
  templates: Array<{ name: string; tagline: string; keywords: string[] }>
}> = [
  {
    prefix: "code-assistant",
    category: "code-assistant",
    categories: ["code-assistant"],
    templates: [
      // Languages
      { name: "Python Expert", tagline: "Advanced Python development with best practices and optimization", keywords: ["python", "development"] },
      { name: "JavaScript Mastery", tagline: "Modern JavaScript and ES6+ patterns and techniques", keywords: ["javascript", "ES6", "frontend"] },
      { name: "TypeScript Advanced", tagline: "Complex TypeScript types, generics, and advanced patterns", keywords: ["typescript", "types", "generics"] },
      { name: "Rust Developer", tagline: "Safe and performant Rust programming assistance", keywords: ["rust", "systems", "performance"] },
      { name: "Go Engineer", tagline: "Idiomatic Go development with concurrency patterns", keywords: ["go", "golang", "concurrency"] },
      { name: "Java Spring Boot", tagline: "Enterprise Java development with Spring Boot framework", keywords: ["java", "spring boot", "enterprise"] },
      { name: "C++ Optimizer", tagline: "High-performance C++ code optimization and modern patterns", keywords: ["c++", "performance", "optimization"] },
      { name: "Swift iOS Dev", tagline: "Native iOS development with Swift and SwiftUI", keywords: ["swift", "ios", "swiftui", "mobile"] },
      { name: "Kotlin Android", tagline: "Android development with Kotlin and Jetpack Compose", keywords: ["kotlin", "android", "jetpack"] },
      { name: "PHP Laravel", tagline: "Modern PHP development with Laravel framework", keywords: ["php", "laravel", "backend"] },
      { name: "Ruby on Rails", tagline: "Full-stack Ruby on Rails development", keywords: ["ruby", "rails", "full-stack"] },
      { name: "Scala Functional", tagline: "Functional programming in Scala with type safety", keywords: ["scala", "functional", "JVM"] },
      { name: "Elixir Phoenix", tagline: "Concurrent Elixir applications with Phoenix framework", keywords: ["elixir", "phoenix", "concurrent"] },
      { name: "Dart Flutter", tagline: "Cross-platform mobile apps with Flutter and Dart", keywords: ["dart", "flutter", "mobile", "cross-platform"] },
      { name: "R Statistics", tagline: "Statistical computing and data visualization with R", keywords: ["R", "statistics", "data science"] },
      { name: "MATLAB Engineer", tagline: "Scientific computing and engineering with MATLAB", keywords: ["matlab", "engineering", "simulation"] },
      { name: "Perl Scripting", tagline: "Text processing and system administration with Perl", keywords: ["perl", "scripting", "text processing"] },
      { name: "Lua Game Dev", tagline: "Game scripting and embedded Lua development", keywords: ["lua", "game dev", "scripting"] },
      { name: "Haskell Functional", tagline: "Pure functional programming in Haskell", keywords: ["haskell", "functional", "pure"] },
      { name: "Clojure REPL", tagline: "Interactive Clojure development and REPL-driven design", keywords: ["clojure", "lisp", "REPL"] },
      // Frameworks
      { name: "React Expert", tagline: "Advanced React patterns, hooks, and performance optimization", keywords: ["react", "hooks", "frontend"] },
      { name: "Next.js Architect", tagline: "Full-stack Next.js applications with App Router", keywords: ["nextjs", "react", "full-stack"] },
      { name: "Vue.js Developer", tagline: "Reactive Vue.js applications with Composition API", keywords: ["vue", "vuejs", "frontend"] },
      { name: "Nuxt.js Builder", tagline: "Server-side rendered Vue applications with Nuxt", keywords: ["nuxt", "vue", "SSR"] },
      { name: "Angular Architect", tagline: "Enterprise Angular applications with RxJS and NgRx", keywords: ["angular", "rxjs", "enterprise"] },
      { name: "Svelte Creator", tagline: "Lightweight Svelte and SvelteKit applications", keywords: ["svelte", "sveltekit", "frontend"] },
      { name: "Remix Developer", tagline: "Full-stack web apps with Remix framework", keywords: ["remix", "react", "full-stack"] },
      { name: "Astro Builder", tagline: "Content-driven websites with Astro framework", keywords: ["astro", "static", "content"] },
      { name: "Express.js API", tagline: "RESTful APIs with Express.js and middleware", keywords: ["express", "nodejs", "API"] },
      { name: "NestJS Enterprise", tagline: "Scalable Node.js server applications with NestJS", keywords: ["nestjs", "nodejs", "enterprise"] },
      { name: "FastAPI Python", tagline: "High-performance Python APIs with FastAPI", keywords: ["fastapi", "python", "API"] },
      { name: "Django Expert", tagline: "Full-featured Django web applications", keywords: ["django", "python", "web"] },
      { name: "Flask Microservice", tagline: "Lightweight Python microservices with Flask", keywords: ["flask", "python", "microservice"] },
      { name: "GraphQL Designer", tagline: "Schema design and resolvers for GraphQL APIs", keywords: ["graphql", "API", "schema"] },
      { name: "tRPC Builder", tagline: "End-to-end typesafe APIs with tRPC", keywords: ["trpc", "typescript", "API"] },
      // Tools & Patterns
      { name: "Git Workflow Master", tagline: "Advanced Git strategies, branching, and conflict resolution", keywords: ["git", "version control", "branching"] },
      { name: "Code Reviewer Pro", tagline: "Thorough code reviews with actionable feedback", keywords: ["code review", "quality", "feedback"] },
      { name: "Refactoring Expert", tagline: "Code smell detection and refactoring strategies", keywords: ["refactoring", "clean code", "patterns"] },
      { name: "Debug Detective", tagline: "Systematic debugging and root cause analysis", keywords: ["debugging", "errors", "troubleshooting"] },
      { name: "Test Architect", tagline: "Testing strategies with unit, integration, and E2E tests", keywords: ["testing", "TDD", "jest", "cypress"] },
      { name: "Performance Profiler", tagline: "Application performance analysis and optimization", keywords: ["performance", "profiling", "optimization"] },
      { name: "Design Patterns", tagline: "GoF and modern design patterns implementation", keywords: ["design patterns", "architecture", "OOP"] },
      { name: "Clean Architecture", tagline: "SOLID principles and clean architecture implementation", keywords: ["clean architecture", "SOLID", "DDD"] },
      { name: "Microservices Designer", tagline: "Microservice architecture patterns and communication", keywords: ["microservices", "distributed", "architecture"] },
      { name: "WebSocket Expert", tagline: "Real-time communication with WebSockets and Socket.io", keywords: ["websocket", "real-time", "socket.io"] },
      { name: "OAuth Implementer", tagline: "Secure OAuth 2.0 and OpenID Connect implementations", keywords: ["oauth", "authentication", "security"] },
      { name: "JWT Handler", tagline: "JSON Web Token management and authentication flows", keywords: ["JWT", "authentication", "tokens"] },
      { name: "Webpack Configurator", tagline: "Webpack and build tool configuration optimization", keywords: ["webpack", "bundling", "build"] },
      { name: "ESLint Rule Crafter", tagline: "Custom ESLint rules and code quality configuration", keywords: ["eslint", "linting", "code quality"] },
      { name: "Monorepo Manager", tagline: "Turborepo, Nx, and monorepo workspace management", keywords: ["monorepo", "turborepo", "nx"] },
    ],
  },
  {
    prefix: "writing",
    category: "writing",
    categories: ["writing"],
    templates: [
      { name: "Blog Post Writer", tagline: "SEO-optimized blog posts with engaging structure", keywords: ["blog", "SEO", "content"] },
      { name: "Email Composer Pro", tagline: "Professional emails for business and marketing", keywords: ["email", "business", "communication"] },
      { name: "Technical Documentation", tagline: "Clear technical docs, READMEs, and API references", keywords: ["documentation", "technical", "API docs"] },
      { name: "Social Media Creator", tagline: "Engaging posts for Twitter, LinkedIn, and Instagram", keywords: ["social media", "twitter", "linkedin"] },
      { name: "Newsletter Writer", tagline: "Compelling newsletter content that drives engagement", keywords: ["newsletter", "email marketing", "engagement"] },
      { name: "Press Release Drafter", tagline: "Professional press releases for product launches", keywords: ["press release", "PR", "launch"] },
      { name: "Product Description", tagline: "Compelling e-commerce product descriptions", keywords: ["product", "e-commerce", "descriptions"] },
      { name: "Landing Page Copy", tagline: "High-converting landing page copy with CTA optimization", keywords: ["landing page", "conversion", "CTA"] },
      { name: "Resume Builder", tagline: "ATS-friendly resumes tailored to job descriptions", keywords: ["resume", "CV", "job search"] },
      { name: "Cover Letter Writer", tagline: "Personalized cover letters for any position", keywords: ["cover letter", "job application", "hiring"] },
      { name: "Script Writer", tagline: "Video scripts for YouTube, TikTok, and presentations", keywords: ["script", "video", "youtube"] },
      { name: "Podcast Show Notes", tagline: "Structured show notes and episode summaries", keywords: ["podcast", "show notes", "audio"] },
      { name: "Academic Writer", tagline: "Research papers and academic essays with citations", keywords: ["academic", "research", "citations"] },
      { name: "Grant Proposal Writer", tagline: "Compelling grant proposals for funding applications", keywords: ["grants", "proposals", "funding"] },
      { name: "Creative Fiction", tagline: "Short stories, narratives, and creative writing", keywords: ["fiction", "creative writing", "stories"] },
      { name: "Poetry Generator", tagline: "Poetry in various styles and forms", keywords: ["poetry", "creative", "literature"] },
      { name: "Speech Writer", tagline: "Persuasive speeches for any occasion", keywords: ["speech", "public speaking", "persuasion"] },
      { name: "White Paper Author", tagline: "In-depth white papers for thought leadership", keywords: ["white paper", "research", "B2B"] },
      { name: "Case Study Builder", tagline: "Compelling customer success stories and case studies", keywords: ["case study", "success story", "marketing"] },
      { name: "FAQ Generator", tagline: "Comprehensive FAQ sections from product information", keywords: ["FAQ", "support", "knowledge base"] },
      { name: "Tone Adjuster", tagline: "Rewrite text in any tone: formal, casual, friendly", keywords: ["tone", "rewriting", "style"] },
      { name: "Headline Generator", tagline: "Click-worthy headlines and subject lines", keywords: ["headlines", "subject lines", "engagement"] },
      { name: "Content Summarizer", tagline: "Concise summaries of long-form content", keywords: ["summary", "condensation", "brevity"] },
      { name: "Translation Assistant", tagline: "Natural translations between 50+ languages", keywords: ["translation", "multilingual", "localization"] },
      { name: "Proofreader", tagline: "Grammar, spelling, and style corrections", keywords: ["proofreading", "grammar", "editing"] },
      { name: "SEO Meta Writer", tagline: "Optimized meta titles and descriptions for search", keywords: ["SEO", "meta tags", "search"] },
      { name: "Ad Copy Master", tagline: "Google Ads, Facebook Ads, and PPC copy", keywords: ["ads", "PPC", "google ads"] },
      { name: "Brand Voice Guide", tagline: "Define and maintain consistent brand voice", keywords: ["brand", "voice", "consistency"] },
      { name: "Proposal Writer", tagline: "Business proposals and RFP responses", keywords: ["proposals", "business", "RFP"] },
      { name: "Contract Drafter", tagline: "Basic contract templates and legal documents", keywords: ["contracts", "legal", "agreements"] },
    ],
  },
  {
    prefix: "data",
    category: "data-analysis",
    categories: ["data-analysis"],
    templates: [
      { name: "CSV Data Analyzer", tagline: "Statistical analysis and insights from CSV files", keywords: ["CSV", "statistics", "analysis"] },
      { name: "SQL Query Builder", tagline: "Complex SQL queries from natural language", keywords: ["SQL", "database", "queries"] },
      { name: "SQL Optimizer", tagline: "Query optimization and index recommendations", keywords: ["SQL", "optimization", "performance"] },
      { name: "Pandas Expert", tagline: "Data manipulation with Python Pandas library", keywords: ["pandas", "python", "dataframes"] },
      { name: "JSON Transformer", tagline: "Parse, transform, and restructure JSON data", keywords: ["JSON", "data transformation"] },
      { name: "XML Parser", tagline: "XML data extraction and transformation", keywords: ["XML", "parsing", "data"] },
      { name: "Regex Builder", tagline: "Complex regex patterns from descriptions", keywords: ["regex", "patterns", "text"] },
      { name: "Data Visualizer", tagline: "Chart and graph recommendations from data", keywords: ["visualization", "charts", "graphs"] },
      { name: "Excel Formula Expert", tagline: "Complex Excel formulas and VBA macros", keywords: ["excel", "formulas", "VBA"] },
      { name: "Google Sheets Pro", tagline: "Advanced Google Sheets formulas and Apps Script", keywords: ["google sheets", "formulas", "apps script"] },
      { name: "Data Cleaner", tagline: "Clean and normalize messy datasets", keywords: ["data cleaning", "normalization"] },
      { name: "ETL Pipeline Designer", tagline: "Extract, Transform, Load pipeline design", keywords: ["ETL", "pipeline", "data engineering"] },
      { name: "Database Schema Designer", tagline: "Normalized database schema design", keywords: ["schema", "database design", "normalization"] },
      { name: "MongoDB Query Builder", tagline: "Complex MongoDB aggregation pipelines", keywords: ["mongodb", "nosql", "aggregation"] },
      { name: "Redis Expert", tagline: "Redis data structures and caching strategies", keywords: ["redis", "caching", "data structures"] },
      { name: "PostgreSQL Advanced", tagline: "Advanced PostgreSQL features and optimization", keywords: ["postgresql", "advanced", "optimization"] },
      { name: "BigQuery Analyst", tagline: "Google BigQuery queries and optimization", keywords: ["bigquery", "analytics", "google cloud"] },
      { name: "Snowflake Expert", tagline: "Snowflake data warehouse queries and design", keywords: ["snowflake", "data warehouse"] },
      { name: "dbt Modeler", tagline: "Data modeling with dbt transformations", keywords: ["dbt", "data modeling", "analytics"] },
      { name: "Apache Spark", tagline: "Big data processing with Spark and PySpark", keywords: ["spark", "big data", "pyspark"] },
      { name: "Tableau Assistant", tagline: "Tableau dashboard design and calculations", keywords: ["tableau", "dashboards", "BI"] },
      { name: "Power BI Expert", tagline: "Power BI reports, DAX formulas, and dashboards", keywords: ["power bi", "DAX", "reporting"] },
      { name: "Grafana Dashboard", tagline: "Monitoring dashboards with Grafana and PromQL", keywords: ["grafana", "monitoring", "prometheus"] },
      { name: "A/B Test Analyzer", tagline: "Statistical analysis of A/B test results", keywords: ["A/B testing", "statistics", "experimentation"] },
      { name: "Survey Analyzer", tagline: "Survey data analysis and insight extraction", keywords: ["survey", "analysis", "research"] },
      { name: "Financial Analyst", tagline: "Financial data analysis and modeling", keywords: ["finance", "analysis", "modeling"] },
      { name: "Time Series Forecaster", tagline: "Time series analysis and forecasting", keywords: ["time series", "forecasting", "prediction"] },
      { name: "Sentiment Analyzer", tagline: "Text sentiment analysis for reviews and feedback", keywords: ["sentiment", "NLP", "reviews"] },
      { name: "Log Analyzer", tagline: "Parse and analyze application log files", keywords: ["logs", "analysis", "debugging"] },
      { name: "API Response Parser", tagline: "Parse and transform API responses", keywords: ["API", "parsing", "data"] },
    ],
  },
  {
    prefix: "devops",
    category: "devops",
    categories: ["devops"],
    templates: [
      { name: "Docker Expert", tagline: "Dockerfile optimization and multi-stage builds", keywords: ["docker", "containers"] },
      { name: "Docker Compose Builder", tagline: "Production-ready Docker Compose configurations", keywords: ["docker compose", "orchestration"] },
      { name: "Kubernetes Architect", tagline: "K8s manifests, Helm charts, and cluster design", keywords: ["kubernetes", "k8s", "helm"] },
      { name: "GitHub Actions CI/CD", tagline: "GitHub Actions workflows for any project", keywords: ["github actions", "CI/CD"] },
      { name: "GitLab CI Designer", tagline: "GitLab CI/CD pipeline configurations", keywords: ["gitlab", "CI/CD", "pipelines"] },
      { name: "Jenkins Pipeline", tagline: "Jenkins pipeline scripts and configuration", keywords: ["jenkins", "CI/CD", "automation"] },
      { name: "Terraform Expert", tagline: "Infrastructure as Code with Terraform", keywords: ["terraform", "IaC", "cloud"] },
      { name: "AWS Architect", tagline: "AWS service selection and architecture design", keywords: ["AWS", "cloud", "architecture"] },
      { name: "GCP Engineer", tagline: "Google Cloud Platform services and configuration", keywords: ["GCP", "google cloud"] },
      { name: "Azure DevOps", tagline: "Microsoft Azure infrastructure and services", keywords: ["azure", "microsoft", "cloud"] },
      { name: "Nginx Configurator", tagline: "Nginx reverse proxy and load balancing config", keywords: ["nginx", "reverse proxy", "SSL"] },
      { name: "Apache Config", tagline: "Apache HTTP server configuration", keywords: ["apache", "httpd", "server"] },
      { name: "Caddy Server", tagline: "Caddy web server with automatic HTTPS", keywords: ["caddy", "HTTPS", "server"] },
      { name: "Linux Admin", tagline: "Linux system administration and troubleshooting", keywords: ["linux", "sysadmin", "bash"] },
      { name: "Shell Script Pro", tagline: "Robust bash scripts with error handling", keywords: ["bash", "shell", "scripting"] },
      { name: "Ansible Playbook", tagline: "Ansible automation playbooks and roles", keywords: ["ansible", "automation", "configuration"] },
      { name: "Prometheus Setup", tagline: "Prometheus monitoring and alerting configuration", keywords: ["prometheus", "monitoring", "alerting"] },
      { name: "ELK Stack Expert", tagline: "Elasticsearch, Logstash, Kibana setup", keywords: ["ELK", "logging", "elasticsearch"] },
      { name: "SSL/TLS Expert", tagline: "Certificate management and HTTPS configuration", keywords: ["SSL", "TLS", "certificates", "HTTPS"] },
      { name: "DNS Manager", tagline: "DNS configuration and troubleshooting", keywords: ["DNS", "networking", "domains"] },
      { name: "Firewall Rules", tagline: "iptables, UFW, and firewall configuration", keywords: ["firewall", "security", "iptables"] },
      { name: "Load Balancer Design", tagline: "Load balancing strategies and configuration", keywords: ["load balancing", "scaling", "HAProxy"] },
      { name: "Backup Strategy", tagline: "Backup and disaster recovery planning", keywords: ["backup", "disaster recovery", "resilience"] },
      { name: "Vercel Deploy", tagline: "Vercel deployment configuration and optimization", keywords: ["vercel", "deployment", "serverless"] },
      { name: "Netlify Expert", tagline: "Netlify deployment and serverless functions", keywords: ["netlify", "deployment", "JAMstack"] },
      { name: "Cloudflare Setup", tagline: "Cloudflare CDN, Workers, and security", keywords: ["cloudflare", "CDN", "workers"] },
      { name: "Supabase Admin", tagline: "Supabase project setup and optimization", keywords: ["supabase", "database", "auth"] },
      { name: "Firebase Expert", tagline: "Firebase services configuration and optimization", keywords: ["firebase", "google", "BaaS"] },
      { name: "PM2 Process Manager", tagline: "Node.js process management with PM2", keywords: ["PM2", "nodejs", "process"] },
      { name: "Systemd Service", tagline: "Create and manage systemd services", keywords: ["systemd", "linux", "services"] },
    ],
  },
  {
    prefix: "design",
    category: "design",
    categories: ["design"],
    templates: [
      { name: "Tailwind CSS Expert", tagline: "Beautiful UI components with Tailwind CSS", keywords: ["tailwind", "CSS", "UI"] },
      { name: "CSS Grid Master", tagline: "Complex CSS Grid layouts and responsive design", keywords: ["CSS grid", "layouts", "responsive"] },
      { name: "Flexbox Wizard", tagline: "Flexbox layouts for any design requirement", keywords: ["flexbox", "CSS", "layouts"] },
      { name: "CSS Animation Creator", tagline: "Smooth CSS animations and transitions", keywords: ["CSS", "animations", "transitions"] },
      { name: "Framer Motion Expert", tagline: "React animations with Framer Motion", keywords: ["framer motion", "react", "animations"] },
      { name: "shadcn/ui Builder", tagline: "Beautiful interfaces with shadcn/ui components", keywords: ["shadcn", "radix", "components"] },
      { name: "Material UI Designer", tagline: "Material Design components and theming", keywords: ["material ui", "MUI", "design system"] },
      { name: "Chakra UI Expert", tagline: "Accessible UI with Chakra UI components", keywords: ["chakra ui", "accessibility", "components"] },
      { name: "Color Palette Generator", tagline: "Harmonious color schemes with accessibility", keywords: ["colors", "palette", "accessibility"] },
      { name: "Typography Selector", tagline: "Font pairing and typography systems", keywords: ["typography", "fonts", "design"] },
      { name: "Icon Designer", tagline: "SVG icon creation and optimization", keywords: ["icons", "SVG", "design"] },
      { name: "Responsive Design", tagline: "Mobile-first responsive design patterns", keywords: ["responsive", "mobile", "breakpoints"] },
      { name: "Dark Mode Implementer", tagline: "Dark mode theming and color systems", keywords: ["dark mode", "theming", "colors"] },
      { name: "Accessibility Auditor", tagline: "WCAG compliance and accessibility fixes", keywords: ["accessibility", "WCAG", "a11y"] },
      { name: "Figma to Code", tagline: "Convert Figma designs to HTML/CSS/React", keywords: ["figma", "design to code", "conversion"] },
      { name: "UI Component Library", tagline: "Design system and component library creation", keywords: ["design system", "components", "library"] },
      { name: "Email Template Designer", tagline: "Responsive HTML email templates", keywords: ["email", "HTML", "templates"] },
      { name: "Print CSS", tagline: "Print-optimized CSS stylesheets", keywords: ["print", "CSS", "media queries"] },
      { name: "3D CSS Effects", tagline: "3D transforms and perspective effects", keywords: ["3D", "CSS", "transforms"] },
      { name: "Glassmorphism Creator", tagline: "Glassmorphism UI effects and designs", keywords: ["glassmorphism", "UI", "blur"] },
    ],
  },
  {
    prefix: "automation",
    category: "automation",
    categories: ["automation"],
    templates: [
      { name: "Zapier Flow Designer", tagline: "Zapier automation workflows and triggers", keywords: ["zapier", "automation", "workflows"] },
      { name: "Make.com Expert", tagline: "Complex Make.com (Integromat) scenarios", keywords: ["make", "integromat", "automation"] },
      { name: "n8n Workflow Builder", tagline: "Self-hosted automation with n8n workflows", keywords: ["n8n", "automation", "self-hosted"] },
      { name: "Cron Job Builder", tagline: "Cron expressions and scheduled task setup", keywords: ["cron", "scheduling", "automation"] },
      { name: "Web Scraper", tagline: "Web scraping scripts with Puppeteer or Playwright", keywords: ["scraping", "puppeteer", "playwright"] },
      { name: "API Integrator", tagline: "Connect and automate between different APIs", keywords: ["API", "integration", "webhooks"] },
      { name: "Webhook Handler", tagline: "Webhook endpoint design and processing", keywords: ["webhooks", "events", "processing"] },
      { name: "Slack Bot Builder", tagline: "Slack bot commands and interactive messages", keywords: ["slack", "bot", "chatops"] },
      { name: "Discord Bot Creator", tagline: "Discord bots with commands and events", keywords: ["discord", "bot", "gaming"] },
      { name: "Telegram Bot", tagline: "Telegram bot development and deployment", keywords: ["telegram", "bot", "messaging"] },
      { name: "GitHub Bot", tagline: "GitHub Apps and automation bots", keywords: ["github", "bot", "automation"] },
      { name: "IFTTT Recipe", tagline: "IFTTT applet design for smart automation", keywords: ["IFTTT", "smart home", "automation"] },
      { name: "Google Apps Script", tagline: "Google Workspace automation with Apps Script", keywords: ["google", "apps script", "automation"] },
      { name: "Power Automate", tagline: "Microsoft Power Automate flow design", keywords: ["power automate", "microsoft", "flows"] },
      { name: "Airtable Automator", tagline: "Airtable automations and scripting", keywords: ["airtable", "database", "automation"] },
      { name: "Notion Integration", tagline: "Notion API integration and automation", keywords: ["notion", "API", "productivity"] },
      { name: "File Processor", tagline: "Batch file processing and conversion scripts", keywords: ["files", "batch", "processing"] },
      { name: "PDF Automator", tagline: "PDF generation, merging, and manipulation", keywords: ["PDF", "documents", "automation"] },
      { name: "Image Processor", tagline: "Batch image resizing, cropping, and optimization", keywords: ["images", "processing", "optimization"] },
      { name: "Data Backup Automator", tagline: "Automated backup scripts and schedules", keywords: ["backup", "automation", "data"] },
    ],
  },
  {
    prefix: "research",
    category: "research",
    categories: ["research"],
    templates: [
      { name: "Paper Summarizer", tagline: "Academic paper summaries with key findings", keywords: ["papers", "academic", "summary"] },
      { name: "Literature Reviewer", tagline: "Systematic literature review assistance", keywords: ["literature review", "research", "academic"] },
      { name: "Market Researcher", tagline: "Market analysis and industry reports", keywords: ["market research", "analysis", "industry"] },
      { name: "Competitor Analyzer", tagline: "SWOT analysis and competitive intelligence", keywords: ["competitors", "SWOT", "strategy"] },
      { name: "Patent Researcher", tagline: "Patent landscape analysis and prior art search", keywords: ["patents", "IP", "research"] },
      { name: "Trend Spotter", tagline: "Identify emerging trends in any industry", keywords: ["trends", "prediction", "industry"] },
      { name: "Survey Designer", tagline: "Research survey design and question formulation", keywords: ["surveys", "research design", "questions"] },
      { name: "Interview Guide", tagline: "User interview scripts and analysis frameworks", keywords: ["interviews", "UX research", "qualitative"] },
      { name: "Fact Checker", tagline: "Claim verification and source validation", keywords: ["fact checking", "verification", "sources"] },
      { name: "Due Diligence", tagline: "Company and investment due diligence research", keywords: ["due diligence", "investment", "analysis"] },
      { name: "Legal Researcher", tagline: "Legal precedent and regulation research", keywords: ["legal", "regulations", "compliance"] },
      { name: "SEO Keyword Research", tagline: "Keyword research and search intent analysis", keywords: ["SEO", "keywords", "search"] },
      { name: "User Persona Builder", tagline: "Data-driven user personas for product design", keywords: ["personas", "UX", "product"] },
      { name: "Technology Scout", tagline: "Evaluate and compare technology solutions", keywords: ["technology", "evaluation", "comparison"] },
      { name: "Risk Assessor", tagline: "Risk analysis and mitigation strategies", keywords: ["risk", "assessment", "mitigation"] },
    ],
  },
  {
    prefix: "productivity",
    category: "productivity",
    categories: ["productivity"],
    templates: [
      { name: "Meeting Summarizer", tagline: "Actionable meeting summaries with decisions and tasks", keywords: ["meetings", "summary", "action items"] },
      { name: "Project Planner", tagline: "Project breakdown with tasks and milestones", keywords: ["project", "planning", "tasks"] },
      { name: "OKR Designer", tagline: "Objectives and Key Results framework setup", keywords: ["OKR", "goals", "strategy"] },
      { name: "Sprint Planner", tagline: "Agile sprint planning and story writing", keywords: ["agile", "sprint", "scrum"] },
      { name: "Standup Reporter", tagline: "Daily standup reports from work logs", keywords: ["standup", "daily", "agile"] },
      { name: "Retrospective Facilitator", tagline: "Sprint retrospective templates and analysis", keywords: ["retrospective", "agile", "improvement"] },
      { name: "Kanban Board Designer", tagline: "Kanban workflow design and optimization", keywords: ["kanban", "workflow", "management"] },
      { name: "Time Estimator", tagline: "Development time estimation techniques", keywords: ["estimation", "planning", "time"] },
      { name: "Decision Matrix", tagline: "Structured decision-making frameworks", keywords: ["decision", "matrix", "analysis"] },
      { name: "RACI Chart Builder", tagline: "Responsibility assignment matrices", keywords: ["RACI", "responsibilities", "management"] },
      { name: "Roadmap Builder", tagline: "Product and technology roadmap creation", keywords: ["roadmap", "product", "strategy"] },
      { name: "Release Notes Writer", tagline: "Clear and informative release notes", keywords: ["release notes", "changelog", "updates"] },
      { name: "Incident Report", tagline: "Post-mortem and incident report templates", keywords: ["incident", "post-mortem", "report"] },
      { name: "Knowledge Base Builder", tagline: "Organized knowledge base articles", keywords: ["knowledge base", "documentation", "wiki"] },
      { name: "Onboarding Guide", tagline: "New employee and developer onboarding docs", keywords: ["onboarding", "documentation", "guide"] },
      { name: "Process Documentation", tagline: "Standard operating procedure documentation", keywords: ["SOP", "process", "documentation"] },
      { name: "Presentation Creator", tagline: "Slide deck content and structure", keywords: ["presentations", "slides", "speaking"] },
      { name: "Mind Map Generator", tagline: "Visual mind maps for brainstorming", keywords: ["mind map", "brainstorming", "visual"] },
      { name: "Priority Matrix", tagline: "Eisenhower matrix and priority frameworks", keywords: ["priority", "matrix", "time management"] },
      { name: "Goal Tracker", tagline: "SMART goal setting and progress tracking", keywords: ["goals", "SMART", "tracking"] },
    ],
  },
  {
    prefix: "education",
    category: "education",
    categories: ["education"],
    templates: [
      { name: "Math Tutor", tagline: "Step-by-step math problem solving at any level", keywords: ["math", "tutoring", "problems"] },
      { name: "Physics Helper", tagline: "Physics concepts and problem solving", keywords: ["physics", "science", "problems"] },
      { name: "Chemistry Tutor", tagline: "Chemistry reactions, formulas, and concepts", keywords: ["chemistry", "science", "formulas"] },
      { name: "Biology Explainer", tagline: "Biology concepts from cells to ecosystems", keywords: ["biology", "science", "life sciences"] },
      { name: "History Analyzer", tagline: "Historical events, causes, and connections", keywords: ["history", "analysis", "events"] },
      { name: "Language Tutor", tagline: "Interactive language learning and practice", keywords: ["language", "learning", "practice"] },
      { name: "English Grammar", tagline: "English grammar rules and exercises", keywords: ["english", "grammar", "language"] },
      { name: "French Tutor", tagline: "French language learning and conversation", keywords: ["french", "language", "learning"] },
      { name: "Spanish Tutor", tagline: "Spanish language learning and practice", keywords: ["spanish", "language", "learning"] },
      { name: "German Tutor", tagline: "German language learning and grammar", keywords: ["german", "language", "learning"] },
      { name: "Japanese Tutor", tagline: "Japanese language, kanji, and culture", keywords: ["japanese", "language", "kanji"] },
      { name: "Chinese Tutor", tagline: "Mandarin Chinese learning and characters", keywords: ["chinese", "mandarin", "language"] },
      { name: "Code Teacher", tagline: "Programming concepts explained for beginners", keywords: ["coding", "beginner", "teaching"] },
      { name: "Flashcard Creator", tagline: "Study flashcards from any material", keywords: ["flashcards", "study", "memorization"] },
      { name: "Quiz Generator", tagline: "Practice quizzes from study material", keywords: ["quiz", "testing", "study"] },
      { name: "Essay Grader", tagline: "Essay feedback with improvement suggestions", keywords: ["essays", "grading", "feedback"] },
      { name: "Concept Explainer", tagline: "Complex concepts explained simply with analogies", keywords: ["explanation", "analogies", "learning"] },
      { name: "Study Plan Creator", tagline: "Personalized study plans and schedules", keywords: ["study plan", "schedule", "learning"] },
      { name: "Exam Prep Coach", tagline: "Exam preparation strategies and practice", keywords: ["exam", "preparation", "study"] },
      { name: "Philosophy Guide", tagline: "Philosophical concepts and critical thinking", keywords: ["philosophy", "logic", "thinking"] },
    ],
  },
  {
    prefix: "security",
    category: "security",
    categories: ["security"],
    templates: [
      { name: "OWASP Scanner", tagline: "OWASP Top 10 vulnerability detection in code", keywords: ["OWASP", "vulnerabilities", "security"] },
      { name: "Penetration Test Guide", tagline: "Penetration testing methodologies and checklists", keywords: ["pentest", "security testing"] },
      { name: "Security Headers", tagline: "HTTP security headers configuration", keywords: ["headers", "HTTP", "security"] },
      { name: "CORS Configurator", tagline: "Cross-Origin Resource Sharing setup", keywords: ["CORS", "security", "API"] },
      { name: "CSP Builder", tagline: "Content Security Policy creation and testing", keywords: ["CSP", "XSS", "security"] },
      { name: "Rate Limiter", tagline: "API rate limiting strategies and implementation", keywords: ["rate limiting", "API", "DDoS"] },
      { name: "Input Validator", tagline: "Input validation and sanitization patterns", keywords: ["validation", "sanitization", "XSS"] },
      { name: "Encryption Expert", tagline: "Encryption algorithms and key management", keywords: ["encryption", "cryptography", "keys"] },
      { name: "Auth Flow Designer", tagline: "Authentication and authorization flow design", keywords: ["auth", "authentication", "authorization"] },
      { name: "RBAC Designer", tagline: "Role-based access control system design", keywords: ["RBAC", "access control", "permissions"] },
      { name: "Privacy Policy Generator", tagline: "GDPR-compliant privacy policy creation", keywords: ["privacy", "GDPR", "compliance"] },
      { name: "Security Audit Report", tagline: "Security audit reports and recommendations", keywords: ["audit", "report", "compliance"] },
      { name: "Vulnerability Patching", tagline: "Dependency vulnerability analysis and fixes", keywords: ["CVE", "dependencies", "patching"] },
      { name: "API Security", tagline: "API security best practices and implementation", keywords: ["API", "security", "tokens"] },
      { name: "Cloud Security", tagline: "Cloud infrastructure security configuration", keywords: ["cloud", "AWS", "security"] },
    ],
  },
]

// Additional niche categories
const additionalSkills: Array<{
  name: string; slug: string; tagline: string; category: string; categories: string[]; keywords: string[]; author: string
}> = [
  // AI/ML specific
  { name: "Prompt Engineer", slug: "prompt-engineer", tagline: "Craft effective prompts for any LLM model", category: "code-assistant", categories: ["code-assistant", "research"], keywords: ["prompts", "LLM", "AI"], author: "PromptLab" },
  { name: "LangChain Builder", slug: "langchain-builder", tagline: "Build LangChain applications and chains", category: "code-assistant", categories: ["code-assistant", "automation"], keywords: ["langchain", "AI", "chains"], author: "AIChain" },
  { name: "OpenAI API Expert", slug: "openai-api-expert", tagline: "OpenAI API integration and optimization", category: "code-assistant", categories: ["code-assistant"], keywords: ["openai", "API", "GPT"], author: "APITools" },
  { name: "Hugging Face Hub", slug: "hugging-face-hub", tagline: "Navigate and use Hugging Face models", category: "code-assistant", categories: ["code-assistant", "research"], keywords: ["hugging face", "models", "NLP"], author: "MLTools" },
  { name: "Vector DB Expert", slug: "vector-db-expert", tagline: "Vector database setup with Pinecone, Weaviate, Chroma", category: "data-analysis", categories: ["data-analysis", "code-assistant"], keywords: ["vector DB", "embeddings", "RAG"], author: "VectorAI" },
  { name: "RAG Pipeline Builder", slug: "rag-pipeline-builder", tagline: "Retrieval-Augmented Generation pipeline design", category: "code-assistant", categories: ["code-assistant", "data-analysis"], keywords: ["RAG", "retrieval", "LLM"], author: "RAGTools" },
  { name: "Fine-Tuning Guide", slug: "fine-tuning-guide", tagline: "LLM fine-tuning strategies and datasets", category: "education", categories: ["education", "code-assistant"], keywords: ["fine-tuning", "LLM", "training"], author: "MLAcademy" },
  { name: "AI Ethics Advisor", slug: "ai-ethics-advisor", tagline: "AI ethics guidelines and bias detection", category: "research", categories: ["research", "security"], keywords: ["AI ethics", "bias", "fairness"], author: "EthicsAI" },
  // Business
  { name: "Business Plan Writer", slug: "business-plan-writer", tagline: "Comprehensive business plans for startups", category: "writing", categories: ["writing", "productivity"], keywords: ["business plan", "startup", "strategy"], author: "BizTools" },
  { name: "Pitch Deck Creator", slug: "pitch-deck-creator", tagline: "Investor pitch deck content and structure", category: "writing", categories: ["writing", "productivity"], keywords: ["pitch deck", "investors", "startup"], author: "PitchPro" },
  { name: "Financial Model Builder", slug: "financial-model-builder", tagline: "Financial projections and models for startups", category: "data-analysis", categories: ["data-analysis", "productivity"], keywords: ["financial model", "projections", "startup"], author: "FinModel" },
  { name: "Customer Interview Script", slug: "customer-interview-script", tagline: "Customer discovery interview scripts", category: "research", categories: ["research", "productivity"], keywords: ["customer discovery", "interviews", "product"], author: "ProductLab" },
  { name: "Pricing Strategy", slug: "pricing-strategy", tagline: "SaaS and product pricing analysis", category: "research", categories: ["research", "productivity"], keywords: ["pricing", "SaaS", "strategy"], author: "StrategyAI" },
  { name: "Sales Email Sequence", slug: "sales-email-sequence", tagline: "Cold outreach and follow-up email sequences", category: "writing", categories: ["writing", "automation"], keywords: ["sales", "email", "outreach"], author: "SalesPro" },
  { name: "Customer Support Bot", slug: "customer-support-bot", tagline: "Customer support response templates", category: "writing", categories: ["writing", "automation"], keywords: ["support", "customer service", "templates"], author: "SupportAI" },
  { name: "NPS Survey Analyzer", slug: "nps-survey-analyzer", tagline: "Net Promoter Score analysis and insights", category: "data-analysis", categories: ["data-analysis", "research"], keywords: ["NPS", "customer satisfaction", "feedback"], author: "MetricsAI" },
  { name: "Churn Predictor", slug: "churn-predictor", tagline: "Customer churn analysis and prevention", category: "data-analysis", categories: ["data-analysis", "research"], keywords: ["churn", "retention", "prediction"], author: "RetentionAI" },
  { name: "Cohort Analyzer", slug: "cohort-analyzer", tagline: "User cohort analysis and behavior patterns", category: "data-analysis", categories: ["data-analysis"], keywords: ["cohort", "analytics", "behavior"], author: "AnalyticsAI" },
]

function slugify(name: string, prefix: string): string {
  return `${prefix}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`
}

const authors = [
  "Claude Community", "DevTools Team", "CodeCraft", "AIAssist", "ToolMakers",
  "SkillForge", "ProDev", "SmartAI", "TechFlow", "BuilderAI",
  "QuickSkill", "AutoGen", "DevHelper", "CodeWise", "SkillPro",
  "NexusAI", "CloudSkill", "DataPro", "SecureSkill", "FlowAI"
]

async function importBulk() {
  const allSkills: Array<Record<string, unknown>> = []

  // Generate from templates
  for (const group of skillTemplates) {
    for (const template of group.templates) {
      const slug = slugify(template.name, group.prefix)
      allSkills.push({
        name: template.name,
        slug,
        tagline: template.tagline,
        description: `${template.tagline}. This skill helps you ${template.tagline.toLowerCase()} with best practices and proven approaches. Compatible with Claude and optimized for developer productivity.`,
        author: authors[Math.floor(Math.random() * authors.length)],
        category: group.category,
        categories: group.categories,
        pricing_type: Math.random() > 0.85 ? "freemium" : "free",
        keywords: template.keywords,
        install_count: Math.floor(Math.random() * 8000) + 500,
        is_new: Math.random() > 0.8,
        is_trending: Math.random() > 0.85,
      })
    }
  }

  // Add additional niche skills
  for (const skill of additionalSkills) {
    allSkills.push({
      ...skill,
      description: `${skill.tagline}. A specialized skill for ${skill.keywords.join(", ")} tasks. Built for Claude to maximize your productivity.`,
      pricing_type: "free",
      install_count: Math.floor(Math.random() * 6000) + 300,
      is_new: Math.random() > 0.75,
      is_trending: Math.random() > 0.8,
    })
  }

  console.log(`Total skills to import: ${allSkills.length}`)

  // Batch upsert
  const batchSize = 50
  let inserted = 0
  let errors = 0

  for (let i = 0; i < allSkills.length; i += batchSize) {
    const batch = allSkills.slice(i, i + batchSize)
    const { error } = await supabase
      .from("skills")
      .upsert(batch, { onConflict: "slug" })

    if (error) {
      console.error(`Batch error at ${i}:`, error.message)
      errors += batch.length
    } else {
      inserted += batch.length
    }
    process.stdout.write(`\r  Progress: ${inserted + errors}/${allSkills.length} (${errors} errors)`)
  }

  console.log(`\n\nDone! Inserted: ${inserted}, Errors: ${errors}`)

  // Update category counts
  const { data: cats } = await supabase.from("categories").select("slug")
  if (cats) {
    for (const cat of cats) {
      const { count } = await supabase
        .from("skills")
        .select("*", { count: "exact", head: true })
        .contains("categories", [cat.slug])
      await supabase.from("categories").update({ skill_count: count || 0 }).eq("slug", cat.slug)
    }
    console.log("Category counts updated!")
  }
}

importBulk().catch(console.error)
