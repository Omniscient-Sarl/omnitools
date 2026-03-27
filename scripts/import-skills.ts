import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_OMNISKILLS_SUPABASE_URL!,
  process.env.OMNISKILLS_SERVICE_KEY!
)

// Curated list of Claude/AI skills from various sources
const skills = [
  // Code & Development
  { name: "Code Review Assistant", slug: "code-review-assistant", tagline: "Automated code reviews with best practices and security checks", description: "Analyzes your code for bugs, security vulnerabilities, performance issues, and style violations. Provides actionable suggestions with explanations.", author: "Claude Community", category: "code-assistant", categories: ["code-assistant", "automation"], pricing_type: "free", install_count: 4520, keywords: ["code review", "security", "bugs", "linting"] },
  { name: "Test Generator", slug: "test-generator", tagline: "Generate comprehensive unit and integration tests automatically", description: "Creates thorough test suites for your code including edge cases, mocking strategies, and both unit and integration tests.", author: "DevTools Team", category: "code-assistant", categories: ["code-assistant", "automation"], pricing_type: "free", install_count: 3890, keywords: ["testing", "unit tests", "jest", "pytest"] },
  { name: "API Builder", slug: "api-builder", tagline: "Design and generate REST/GraphQL APIs from descriptions", description: "Takes a natural language description of your API requirements and generates complete endpoint definitions, schemas, and implementation code.", author: "Claude Community", category: "code-assistant", categories: ["code-assistant"], pricing_type: "free", install_count: 3200, keywords: ["API", "REST", "GraphQL", "backend"] },
  { name: "Git Commit Craft", slug: "git-commit-craft", tagline: "Write perfect conventional commit messages from your diffs", description: "Analyzes staged changes and generates clear, conventional commit messages following best practices.", author: "DevFlow", category: "code-assistant", categories: ["code-assistant", "productivity"], pricing_type: "free", install_count: 5100, keywords: ["git", "commits", "conventional commits"] },
  { name: "Refactoring Guru", slug: "refactoring-guru", tagline: "Identify code smells and suggest refactoring patterns", description: "Detects anti-patterns, duplicate code, and complexity issues. Suggests appropriate design patterns and refactoring strategies.", author: "Claude Community", category: "code-assistant", categories: ["code-assistant"], pricing_type: "free", install_count: 2980, keywords: ["refactoring", "design patterns", "clean code"] },
  { name: "Debug Detective", slug: "debug-detective", tagline: "Systematic debugging assistant that traces errors to root causes", description: "Helps trace bugs through stack traces, logs, and code paths. Suggests hypotheses and verification steps.", author: "BugSquash", category: "code-assistant", categories: ["code-assistant"], pricing_type: "free", install_count: 4100, keywords: ["debugging", "errors", "stack trace", "troubleshooting"] },
  { name: "SQL Optimizer", slug: "sql-optimizer", tagline: "Optimize SQL queries for performance and readability", description: "Analyzes SQL queries, suggests index strategies, rewrites for performance, and explains execution plans.", author: "DataTeam", category: "code-assistant", categories: ["code-assistant", "data-analysis"], pricing_type: "free", install_count: 2750, keywords: ["SQL", "database", "optimization", "queries"] },
  { name: "TypeScript Wizard", slug: "typescript-wizard", tagline: "Advanced TypeScript types, generics, and pattern assistance", description: "Helps with complex TypeScript types, generic patterns, type guards, and migration from JavaScript.", author: "TSCommunity", category: "code-assistant", categories: ["code-assistant"], pricing_type: "free", install_count: 3600, keywords: ["TypeScript", "types", "generics"] },

  // Writing & Content
  { name: "Blog Writer Pro", slug: "blog-writer-pro", tagline: "SEO-optimized blog posts with structured outlines", description: "Creates well-structured, engaging blog posts with SEO optimization, meta descriptions, and internal linking suggestions.", author: "ContentAI", category: "writing", categories: ["writing", "productivity"], pricing_type: "free", install_count: 6200, keywords: ["blog", "SEO", "content writing", "marketing"] },
  { name: "Email Composer", slug: "email-composer", tagline: "Professional emails for any context in seconds", description: "Drafts professional emails adapted to context: business proposals, follow-ups, customer support, negotiations, etc.", author: "CommTools", category: "writing", categories: ["writing", "productivity"], pricing_type: "free", install_count: 7800, keywords: ["email", "business", "communication", "professional"] },
  { name: "Technical Writer", slug: "technical-writer", tagline: "Generate clear technical documentation and README files", description: "Creates comprehensive technical docs, API references, README files, and user guides from code or specifications.", author: "DocGen", category: "writing", categories: ["writing", "code-assistant"], pricing_type: "free", install_count: 4300, keywords: ["documentation", "README", "API docs", "technical writing"] },
  { name: "Content Repurposer", slug: "content-repurposer", tagline: "Transform content between formats: blog to thread, video to article", description: "Converts content between different formats while maintaining key messages and adapting tone for each platform.", author: "ContentAI", category: "writing", categories: ["writing", "productivity"], pricing_type: "free", install_count: 3100, keywords: ["content", "repurpose", "social media", "threads"] },
  { name: "Copywriting Master", slug: "copywriting-master", tagline: "High-converting copy for landing pages, ads, and products", description: "Creates persuasive copy using proven frameworks (AIDA, PAS, etc.) for various marketing contexts.", author: "MarketPro", category: "writing", categories: ["writing"], pricing_type: "free", install_count: 5400, keywords: ["copywriting", "marketing", "landing page", "ads"] },

  // Data Analysis
  { name: "CSV Analyzer", slug: "csv-analyzer", tagline: "Instant insights from CSV data with visualizations", description: "Analyzes CSV files, generates statistical summaries, identifies patterns, and suggests visualizations.", author: "DataViz", category: "data-analysis", categories: ["data-analysis"], pricing_type: "free", install_count: 4800, keywords: ["CSV", "data analysis", "statistics", "visualization"] },
  { name: "JSON Transformer", slug: "json-transformer", tagline: "Transform, flatten, and restructure JSON data effortlessly", description: "Converts between JSON structures, flattens nested data, generates schemas, and validates data.", author: "DataTools", category: "data-analysis", categories: ["data-analysis", "code-assistant"], pricing_type: "free", install_count: 2900, keywords: ["JSON", "data transformation", "schema"] },
  { name: "Regex Builder", slug: "regex-builder", tagline: "Build and explain complex regex patterns step by step", description: "Creates regex patterns from natural language descriptions and explains existing patterns in plain English.", author: "DevTools Team", category: "data-analysis", categories: ["data-analysis", "code-assistant"], pricing_type: "free", install_count: 3400, keywords: ["regex", "patterns", "text processing"] },
  { name: "Data Cleaner", slug: "data-cleaner", tagline: "Clean and normalize messy datasets automatically", description: "Identifies and fixes data quality issues: duplicates, missing values, inconsistent formats, outliers.", author: "DataTeam", category: "data-analysis", categories: ["data-analysis"], pricing_type: "free", install_count: 2600, keywords: ["data cleaning", "normalization", "quality"] },

  // Research
  { name: "Paper Summarizer", slug: "paper-summarizer", tagline: "Summarize academic papers with key findings and methodology", description: "Extracts key findings, methodology, limitations, and practical implications from academic papers.", author: "ResearchAI", category: "research", categories: ["research", "education"], pricing_type: "free", install_count: 5600, keywords: ["academic", "papers", "summary", "research"] },
  { name: "Competitive Analyst", slug: "competitive-analyst", tagline: "Analyze competitors with structured SWOT frameworks", description: "Creates structured competitive analyses using SWOT, Porter's Five Forces, and feature comparison matrices.", author: "StrategyAI", category: "research", categories: ["research", "productivity"], pricing_type: "free", install_count: 3200, keywords: ["competitive analysis", "SWOT", "market research"] },
  { name: "Fact Checker", slug: "fact-checker", tagline: "Verify claims and identify potential misinformation", description: "Analyzes statements for accuracy, identifies logical fallacies, and suggests verification methods.", author: "TruthAI", category: "research", categories: ["research"], pricing_type: "free", install_count: 2100, keywords: ["fact checking", "verification", "misinformation"] },

  // Automation
  { name: "Workflow Automator", slug: "workflow-automator", tagline: "Design automation workflows from natural language descriptions", description: "Converts process descriptions into structured workflows with triggers, conditions, and actions for tools like Zapier or Make.", author: "AutoFlow", category: "automation", categories: ["automation", "productivity"], pricing_type: "free", install_count: 4200, keywords: ["automation", "workflow", "Zapier", "Make"] },
  { name: "Cron Expression Builder", slug: "cron-expression-builder", tagline: "Build and explain cron expressions in plain English", description: "Converts natural language scheduling descriptions to cron expressions and vice versa.", author: "DevTools Team", category: "automation", categories: ["automation", "devops"], pricing_type: "free", install_count: 1800, keywords: ["cron", "scheduling", "automation"] },
  { name: "Shell Script Generator", slug: "shell-script-generator", tagline: "Generate bash scripts from task descriptions", description: "Creates robust bash/shell scripts with error handling, logging, and best practices from plain English descriptions.", author: "CLITools", category: "automation", categories: ["automation", "devops", "code-assistant"], pricing_type: "free", install_count: 3700, keywords: ["bash", "shell", "scripts", "CLI"] },

  // Design
  { name: "UI Component Designer", slug: "ui-component-designer", tagline: "Generate React/Tailwind components from descriptions", description: "Creates beautiful, accessible UI components with React and Tailwind CSS from natural language descriptions.", author: "UILab", category: "design", categories: ["design", "code-assistant"], pricing_type: "free", install_count: 5800, keywords: ["UI", "React", "Tailwind", "components", "design"] },
  { name: "Color Palette Generator", slug: "color-palette-generator", tagline: "Create harmonious color palettes for any project", description: "Generates color palettes based on mood, brand identity, or existing colors with accessibility contrast checks.", author: "DesignAI", category: "design", categories: ["design"], pricing_type: "free", install_count: 2400, keywords: ["colors", "palette", "design", "branding"] },
  { name: "CSS Architect", slug: "css-architect", tagline: "Solve complex CSS layouts and animations", description: "Helps with CSS Grid, Flexbox layouts, animations, and responsive design patterns.", author: "CSSPro", category: "design", categories: ["design", "code-assistant"], pricing_type: "free", install_count: 3100, keywords: ["CSS", "layouts", "animations", "responsive"] },

  // DevOps
  { name: "Docker Compose Builder", slug: "docker-compose-builder", tagline: "Generate Docker Compose files for any stack", description: "Creates production-ready Docker Compose configurations with proper networking, volumes, and environment variables.", author: "ContainerPro", category: "devops", categories: ["devops", "automation"], pricing_type: "free", install_count: 4600, keywords: ["Docker", "containers", "DevOps", "infrastructure"] },
  { name: "CI/CD Pipeline Designer", slug: "cicd-pipeline-designer", tagline: "Design GitHub Actions and CI/CD pipelines", description: "Creates CI/CD pipeline configurations for GitHub Actions, GitLab CI, or Jenkins from requirements.", author: "DevOpsAI", category: "devops", categories: ["devops", "automation"], pricing_type: "free", install_count: 3800, keywords: ["CI/CD", "GitHub Actions", "DevOps", "pipelines"] },
  { name: "Nginx Config Generator", slug: "nginx-config-generator", tagline: "Generate optimized Nginx configurations", description: "Creates Nginx server configs for reverse proxying, SSL, load balancing, and static file serving.", author: "ServerPro", category: "devops", categories: ["devops"], pricing_type: "free", install_count: 2200, keywords: ["Nginx", "server", "configuration", "SSL"] },

  // Productivity
  { name: "Meeting Notes Summarizer", slug: "meeting-notes-summarizer", tagline: "Transform meeting transcripts into actionable summaries", description: "Extracts key decisions, action items, deadlines, and discussion points from meeting notes or transcripts.", author: "ProductiveAI", category: "productivity", categories: ["productivity"], pricing_type: "free", install_count: 6800, keywords: ["meetings", "notes", "summary", "action items"] },
  { name: "Project Planner", slug: "project-planner", tagline: "Break down projects into tasks with estimates and dependencies", description: "Converts project descriptions into structured task lists with time estimates, dependencies, and milestones.", author: "PlanAI", category: "productivity", categories: ["productivity", "automation"], pricing_type: "free", install_count: 4100, keywords: ["project management", "planning", "tasks", "estimation"] },
  { name: "Presentation Creator", slug: "presentation-creator", tagline: "Create compelling presentation outlines and content", description: "Generates presentation structures, talking points, and slide content for any topic and audience.", author: "SlideAI", category: "productivity", categories: ["productivity", "writing"], pricing_type: "free", install_count: 3500, keywords: ["presentations", "slides", "public speaking"] },

  // Education
  { name: "Language Tutor", slug: "language-tutor", tagline: "Interactive language learning with conversations and exercises", description: "Provides conversational practice, grammar explanations, vocabulary building, and cultural context for language learning.", author: "LinguaAI", category: "education", categories: ["education"], pricing_type: "free", install_count: 7200, keywords: ["language learning", "tutor", "grammar", "vocabulary"] },
  { name: "Math Solver", slug: "math-solver", tagline: "Step-by-step solutions for math problems at any level", description: "Solves math problems with detailed step-by-step explanations, from algebra to calculus and statistics.", author: "MathAI", category: "education", categories: ["education"], pricing_type: "free", install_count: 5900, keywords: ["math", "algebra", "calculus", "statistics"] },
  { name: "Flashcard Generator", slug: "flashcard-generator", tagline: "Create study flashcards from any learning material", description: "Generates spaced-repetition flashcards from textbooks, notes, or any learning material with Q&A format.", author: "StudyAI", category: "education", categories: ["education"], pricing_type: "free", install_count: 4400, keywords: ["flashcards", "study", "learning", "spaced repetition"] },
  { name: "Code Explainer", slug: "code-explainer", tagline: "Explain code line-by-line for beginners and intermediate developers", description: "Breaks down code into understandable explanations with analogies, highlighting key concepts and patterns.", author: "LearnCode", category: "education", categories: ["education", "code-assistant"], pricing_type: "free", install_count: 6100, keywords: ["code explanation", "learning", "beginner", "programming"] },

  // Security
  { name: "Security Auditor", slug: "security-auditor", tagline: "Scan code for OWASP Top 10 vulnerabilities", description: "Identifies security vulnerabilities in code including SQL injection, XSS, CSRF, and authentication issues.", author: "SecureCode", category: "security", categories: ["security", "code-assistant"], pricing_type: "free", install_count: 3900, keywords: ["security", "OWASP", "vulnerabilities", "audit"] },
  { name: "Privacy Policy Generator", slug: "privacy-policy-generator", tagline: "Generate GDPR-compliant privacy policies", description: "Creates comprehensive privacy policies tailored to your application's data collection and processing practices.", author: "LegalAI", category: "security", categories: ["security"], pricing_type: "free", install_count: 2800, keywords: ["privacy", "GDPR", "legal", "compliance"] },
  { name: "Password Policy Advisor", slug: "password-policy-advisor", tagline: "Design secure authentication and password policies", description: "Recommends authentication best practices, password policies, and MFA implementation strategies.", author: "SecureCode", category: "security", categories: ["security", "devops"], pricing_type: "free", install_count: 1500, keywords: ["authentication", "passwords", "security", "MFA"] },
]

async function importSkills() {
  console.log(`Importing ${skills.length} skills...`)

  let inserted = 0
  let skipped = 0

  for (const skill of skills) {
    const { error } = await supabase
      .from("skills")
      .upsert(
        {
          ...skill,
          is_new: Math.random() > 0.7,
          is_trending: Math.random() > 0.8,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      )

    if (error) {
      console.error(`Error inserting ${skill.name}:`, error.message)
      skipped++
    } else {
      inserted++
      process.stdout.write(`\r  Inserted: ${inserted}/${skills.length}`)
    }
  }

  console.log(`\n\nDone! Inserted: ${inserted}, Skipped: ${skipped}`)

  // Update category counts
  const { data: cats } = await supabase.from("categories").select("slug")
  if (cats) {
    for (const cat of cats) {
      const { count } = await supabase
        .from("skills")
        .select("*", { count: "exact", head: true })
        .contains("categories", [cat.slug])

      await supabase
        .from("categories")
        .update({ skill_count: count || 0 })
        .eq("slug", cat.slug)
    }
    console.log("Category counts updated!")
  }
}

importSkills().catch(console.error)
