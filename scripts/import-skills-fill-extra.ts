import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_OMNISKILLS_SUPABASE_URL!;
const supabaseKey = process.env.OMNISKILLS_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type Cat = "code-assistant" | "writing" | "data-analysis" | "research" | "automation" | "design" | "devops" | "productivity" | "education" | "security";

interface S { slug: string; name: string; tagline: string; desc: string; author: string; url: string; cat: Cat; cats: Cat[]; kw: string[]; }

const extra: S[] = [
  // Additional cloud & infra
  { slug: "digitalocean-app-platform", name: "DigitalOcean App Platform", tagline: "Deploy apps on DigitalOcean's managed platform", desc: "Build and deploy web apps, APIs, and static sites with DigitalOcean App Platform's Git-based deployment.", author: "DigitalOcean", url: "https://github.com/digitalocean/app_action", cat: "devops", cats: ["devops", "automation"], kw: ["digitalocean", "app-platform", "deploy", "managed"] },
  { slug: "digitalocean-kubernetes", name: "DigitalOcean Kubernetes", tagline: "Managed Kubernetes on DigitalOcean", desc: "Run Kubernetes workloads on DigitalOcean's managed DOKS service with integrated load balancers and storage.", author: "DigitalOcean", url: "https://github.com/digitalocean/doctl", cat: "devops", cats: ["devops", "automation"], kw: ["digitalocean", "kubernetes", "doks", "managed"] },
  { slug: "cloudflare-workers", name: "Cloudflare Workers", tagline: "Run JavaScript at the edge with Cloudflare", desc: "Deploy serverless functions to Cloudflare's global edge network for ultra-low latency compute.", author: "Cloudflare", url: "https://github.com/cloudflare/workers-sdk", cat: "devops", cats: ["devops", "automation"], kw: ["cloudflare", "workers", "edge", "serverless"] },
  { slug: "cloudflare-d1", name: "Cloudflare D1", tagline: "Serverless SQLite database at the edge", desc: "Run SQLite databases globally on Cloudflare's edge network with D1's serverless SQL database.", author: "Cloudflare", url: "https://github.com/cloudflare/workers-sdk", cat: "data-analysis", cats: ["data-analysis", "devops"], kw: ["cloudflare", "d1", "sqlite", "edge"] },
  { slug: "cloudflare-r2", name: "Cloudflare R2 Storage", tagline: "S3-compatible object storage with zero egress", desc: "Store objects with Cloudflare R2's S3-compatible API and zero egress fees for cost-effective cloud storage.", author: "Cloudflare", url: "https://github.com/cloudflare/workers-sdk", cat: "devops", cats: ["devops", "data-analysis"], kw: ["cloudflare", "r2", "storage", "s3-compatible"] },
  { slug: "cloudflare-pages", name: "Cloudflare Pages", tagline: "Full-stack website deployment on Cloudflare", desc: "Deploy static and server-rendered websites with Cloudflare Pages' Git integration and edge functions.", author: "Cloudflare", url: "https://github.com/cloudflare/workers-sdk", cat: "devops", cats: ["devops", "design"], kw: ["cloudflare", "pages", "static", "deployment"] },
  { slug: "cloudflare-kv", name: "Cloudflare KV", tagline: "Global key-value storage at the edge", desc: "Store and retrieve key-value data globally with Cloudflare KV's eventually consistent edge storage.", author: "Cloudflare", url: "https://github.com/cloudflare/workers-sdk", cat: "data-analysis", cats: ["data-analysis", "devops"], kw: ["cloudflare", "kv", "key-value", "edge"] },
  { slug: "cloudflare-durable-objects", name: "Cloudflare Durable Objects", tagline: "Stateful serverless objects at the edge", desc: "Build stateful applications with Cloudflare Durable Objects for consistent storage and WebSocket coordination.", author: "Cloudflare", url: "https://github.com/cloudflare/workers-sdk", cat: "devops", cats: ["devops", "code-assistant"], kw: ["cloudflare", "durable-objects", "stateful", "websocket"] },
  { slug: "vercel-deployment", name: "Vercel Deployment", tagline: "Zero-configuration frontend deployment platform", desc: "Deploy frontend frameworks with Vercel's Git-based workflow, preview deployments, and edge functions.", author: "Vercel", url: "https://github.com/vercel/vercel", cat: "devops", cats: ["devops", "design"], kw: ["vercel", "deployment", "preview", "edge"] },
  { slug: "netlify-functions", name: "Netlify Functions", tagline: "Serverless functions on Netlify's platform", desc: "Deploy serverless functions alongside your site with Netlify Functions' AWS Lambda-based compute.", author: "Netlify", url: "https://github.com/netlify/cli", cat: "devops", cats: ["devops", "automation"], kw: ["netlify", "functions", "serverless", "lambda"] },
  { slug: "railway-deployment", name: "Railway Deployment", tagline: "Deploy apps and databases instantly", desc: "Ship web services, databases, and cron jobs with Railway's one-click deployment and infrastructure platform.", author: "Railway", url: "https://github.com/railwayapp/cli", cat: "devops", cats: ["devops", "automation"], kw: ["railway", "deployment", "databases", "instant"] },
  { slug: "render-services", name: "Render Cloud Services", tagline: "Unified cloud platform for apps and databases", desc: "Deploy web services, static sites, cron jobs, and managed databases on Render's developer-friendly platform.", author: "Render", url: "https://github.com/nicedoc/nicedoc.io", cat: "devops", cats: ["devops", "automation"], kw: ["render", "cloud", "services", "managed"] },
  { slug: "fly-io-deployment", name: "Fly.io Deployment", tagline: "Run apps close to users with Fly.io", desc: "Deploy Docker containers to Fly.io's global edge network for low-latency applications near your users.", author: "Fly.io", url: "https://github.com/superfly/flyctl", cat: "devops", cats: ["devops", "automation"], kw: ["fly-io", "edge", "containers", "global"] },

  // Additional Python ecosystem
  { slug: "fastapi-patterns", name: "FastAPI Patterns", tagline: "High-performance Python APIs with FastAPI", desc: "Build async Python APIs with FastAPI's automatic OpenAPI docs, Pydantic validation, and dependency injection.", author: "Tiangolo", url: "https://github.com/tiangolo/fastapi", cat: "code-assistant", cats: ["code-assistant", "devops"], kw: ["fastapi", "python", "async", "openapi"] },
  { slug: "django-best-practices", name: "Django Best Practices", tagline: "Production patterns for Django web framework", desc: "Build scalable web applications with Django's ORM, admin interface, authentication, and security best practices.", author: "Django", url: "https://github.com/django/django", cat: "code-assistant", cats: ["code-assistant", "security"], kw: ["django", "python", "orm", "web"] },
  { slug: "flask-extensions", name: "Flask Extensions", tagline: "Extend Flask with community extensions", desc: "Build Flask applications with popular extensions for SQLAlchemy, authentication, CORS, and API documentation.", author: "Pallets", url: "https://github.com/pallets/flask", cat: "code-assistant", cats: ["code-assistant", "devops"], kw: ["flask", "python", "extensions", "microframework"] },
  { slug: "pydantic-validation", name: "Pydantic Validation", tagline: "Data validation using Python type annotations", desc: "Validate and serialize data with Pydantic's type annotations, custom validators, and settings management.", author: "Samuel Colvin", url: "https://github.com/pydantic/pydantic", cat: "code-assistant", cats: ["code-assistant", "data-analysis"], kw: ["pydantic", "validation", "python", "types"] },
  { slug: "sqlalchemy-patterns", name: "SQLAlchemy Patterns", tagline: "Advanced database patterns with SQLAlchemy", desc: "Master SQLAlchemy's ORM and Core for complex queries, relationships, migrations, and performance optimization.", author: "SQLAlchemy", url: "https://github.com/sqlalchemy/sqlalchemy", cat: "code-assistant", cats: ["code-assistant", "data-analysis"], kw: ["sqlalchemy", "orm", "python", "database"] },
  { slug: "celery-tasks", name: "Celery Task Queues", tagline: "Distributed task processing with Celery", desc: "Run background tasks and scheduled jobs with Celery's distributed task queue for Python applications.", author: "Celery", url: "https://github.com/celery/celery", cat: "automation", cats: ["automation", "devops"], kw: ["celery", "tasks", "queues", "distributed"] },
  { slug: "poetry-dependency", name: "Poetry Dependency Management", tagline: "Modern Python dependency management with Poetry", desc: "Manage Python project dependencies, virtual environments, and package publishing with Poetry's intuitive CLI.", author: "Poetry", url: "https://github.com/python-poetry/poetry", cat: "devops", cats: ["devops", "code-assistant"], kw: ["poetry", "python", "dependencies", "packaging"] },
  { slug: "pandas-dataframes", name: "Pandas DataFrames", tagline: "Data manipulation and analysis with Pandas", desc: "Transform, clean, and analyze tabular data with Pandas DataFrames' powerful groupby, merge, and pivot operations.", author: "Pandas", url: "https://github.com/pandas-dev/pandas", cat: "data-analysis", cats: ["data-analysis", "research"], kw: ["pandas", "dataframes", "python", "analysis"] },
  { slug: "polars-dataframes", name: "Polars DataFrames", tagline: "Lightning-fast DataFrame library in Rust and Python", desc: "Process large datasets faster than Pandas with Polars' lazy evaluation, parallel execution, and Rust core.", author: "Ritchie Vink", url: "https://github.com/pola-rs/polars", cat: "data-analysis", cats: ["data-analysis", "research"], kw: ["polars", "dataframes", "rust", "fast"] },
  { slug: "numpy-scientific", name: "NumPy Scientific Computing", tagline: "Fundamental package for scientific computing", desc: "Perform numerical computations with NumPy's N-dimensional arrays, linear algebra, and Fourier transforms.", author: "NumPy", url: "https://github.com/numpy/numpy", cat: "data-analysis", cats: ["data-analysis", "research"], kw: ["numpy", "scientific", "arrays", "python"] },
  { slug: "matplotlib-viz", name: "Matplotlib Visualization", tagline: "Publication-quality plots with Matplotlib", desc: "Create static, animated, and interactive visualizations with Matplotlib's comprehensive plotting library.", author: "Matplotlib", url: "https://github.com/matplotlib/matplotlib", cat: "data-analysis", cats: ["data-analysis", "design"], kw: ["matplotlib", "visualization", "plots", "python"] },
  { slug: "plotly-interactive", name: "Plotly Interactive Charts", tagline: "Interactive data visualization with Plotly", desc: "Build interactive charts and dashboards with Plotly's graphing library for Python, R, and JavaScript.", author: "Plotly", url: "https://github.com/plotly/plotly.py", cat: "data-analysis", cats: ["data-analysis", "design"], kw: ["plotly", "interactive", "charts", "dashboards"] },
  { slug: "streamlit-apps", name: "Streamlit Data Apps", tagline: "Turn Python scripts into web apps instantly", desc: "Build and share data apps with Streamlit's simple API for turning data scripts into interactive web applications.", author: "Streamlit", url: "https://github.com/streamlit/streamlit", cat: "data-analysis", cats: ["data-analysis", "design"], kw: ["streamlit", "data-apps", "python", "interactive"] },
  { slug: "gradio-interfaces", name: "Gradio ML Interfaces", tagline: "Build ML demos with Gradio's UI components", desc: "Create machine learning demos and web interfaces with Gradio's input/output components for any Python function.", author: "Hugging Face", url: "https://github.com/gradio-app/gradio", cat: "research", cats: ["research", "design"], kw: ["gradio", "ml-demo", "interface", "python"] },

  // Additional Go ecosystem
  { slug: "go-gin-framework", name: "Go Gin Framework", tagline: "Fast HTTP web framework for Go", desc: "Build high-performance HTTP APIs with Gin's fast router, middleware support, and JSON validation.", author: "Gin-Gonic", url: "https://github.com/gin-gonic/gin", cat: "code-assistant", cats: ["code-assistant", "devops"], kw: ["go", "gin", "http", "api"] },
  { slug: "go-fiber-framework", name: "Go Fiber Framework", tagline: "Express-inspired web framework for Go", desc: "Build fast web applications with Fiber's Express-like syntax, zero-allocation routing, and middleware ecosystem.", author: "Fiber", url: "https://github.com/gofiber/fiber", cat: "code-assistant", cats: ["code-assistant", "devops"], kw: ["go", "fiber", "web", "fast"] },
  { slug: "go-echo-framework", name: "Go Echo Framework", tagline: "High-performance minimalist Go web framework", desc: "Create RESTful APIs with Echo's optimized HTTP router, middleware, and data binding for Go applications.", author: "LabStack", url: "https://github.com/labstack/echo", cat: "code-assistant", cats: ["code-assistant", "devops"], kw: ["go", "echo", "rest", "minimal"] },
  { slug: "go-grpc", name: "Go gRPC Services", tagline: "Build high-performance RPC services in Go", desc: "Implement efficient inter-service communication with gRPC's protocol buffers, streaming, and code generation in Go.", author: "gRPC", url: "https://github.com/grpc/grpc-go", cat: "code-assistant", cats: ["code-assistant", "devops"], kw: ["go", "grpc", "protobuf", "rpc"] },
  { slug: "go-sqlc", name: "Go sqlc", tagline: "Generate type-safe Go code from SQL", desc: "Write SQL queries and generate type-safe Go code with sqlc for compile-time verified database access.", author: "sqlc", url: "https://github.com/sqlc-dev/sqlc", cat: "code-assistant", cats: ["code-assistant", "data-analysis"], kw: ["go", "sqlc", "sql", "type-safe"] },

  // Additional Rust ecosystem
  { slug: "rust-actix-web", name: "Rust Actix Web", tagline: "Powerful web framework for Rust", desc: "Build blazing-fast web services with Actix Web's actor-based architecture, middleware, and async support.", author: "Actix", url: "https://github.com/actix/actix-web", cat: "code-assistant", cats: ["code-assistant", "devops"], kw: ["rust", "actix", "web", "async"] },
  { slug: "rust-axum", name: "Rust Axum", tagline: "Ergonomic web framework built on Tokio and Tower", desc: "Build modular web applications with Axum's extractor-based request handling and Tower middleware ecosystem.", author: "Tokio", url: "https://github.com/tokio-rs/axum", cat: "code-assistant", cats: ["code-assistant", "devops"], kw: ["rust", "axum", "tokio", "tower"] },
  { slug: "rust-diesel-orm", name: "Rust Diesel ORM", tagline: "Safe, extensible ORM and query builder for Rust", desc: "Write type-safe SQL queries in Rust with Diesel's compile-time verified query builder and migrations.", author: "Diesel", url: "https://github.com/diesel-rs/diesel", cat: "code-assistant", cats: ["code-assistant", "data-analysis"], kw: ["rust", "diesel", "orm", "sql"] },
  { slug: "rust-serde", name: "Rust Serde", tagline: "Serialization framework for Rust", desc: "Serialize and deserialize Rust data structures with Serde's derive macros for JSON, TOML, YAML, and more.", author: "David Tolnay", url: "https://github.com/serde-rs/serde", cat: "code-assistant", cats: ["code-assistant", "data-analysis"], kw: ["rust", "serde", "serialization", "json"] },
  { slug: "rust-tokio", name: "Rust Tokio Runtime", tagline: "Async runtime for building reliable network applications", desc: "Build async Rust applications with Tokio's event-driven runtime for IO, timers, and task scheduling.", author: "Tokio", url: "https://github.com/tokio-rs/tokio", cat: "code-assistant", cats: ["code-assistant", "devops"], kw: ["rust", "tokio", "async", "runtime"] },

  // Additional writing & content
  { slug: "markdown-lint", name: "Markdown Lint", tagline: "Enforce consistent Markdown style and formatting", desc: "Lint and fix Markdown files with markdownlint's configurable rules for headings, lists, and formatting.", author: "David Anson", url: "https://github.com/DavidAnson/markdownlint", cat: "writing", cats: ["writing", "code-assistant"], kw: ["markdown", "lint", "formatting", "style"] },
  { slug: "vale-prose-linting", name: "Vale Prose Linting", tagline: "Enforce editorial style with Vale linter", desc: "Check prose against editorial style guides with Vale's extensible, syntax-aware linting for docs and content.", author: "Joseph Kato", url: "https://github.com/errata-ai/vale", cat: "writing", cats: ["writing", "education"], kw: ["vale", "prose", "linting", "style-guide"] },
  { slug: "technical-writing-guide", name: "Technical Writing Guide", tagline: "Best practices for developer documentation", desc: "Write clear technical documentation with patterns for API references, tutorials, how-to guides, and READMEs.", author: "Google", url: "https://github.com/google/styleguide", cat: "writing", cats: ["writing", "education"], kw: ["technical-writing", "docs", "api-reference", "tutorials"] },
  { slug: "docusaurus-docs", name: "Docusaurus Documentation", tagline: "Build documentation websites with React", desc: "Create versioned documentation sites with Docusaurus's MDX support, search, internationalization, and theming.", author: "Meta", url: "https://github.com/facebook/docusaurus", cat: "writing", cats: ["writing", "design"], kw: ["docusaurus", "docs", "react", "mdx"] },
  { slug: "mintlify-docs", name: "Mintlify Documentation", tagline: "Beautiful documentation that converts users", desc: "Build modern API documentation with Mintlify's components, OpenAPI support, and analytics-driven design.", author: "Mintlify", url: "https://github.com/mintlify/mint", cat: "writing", cats: ["writing", "design"], kw: ["mintlify", "docs", "api", "beautiful"] },
  { slug: "nextra-docs", name: "Nextra Documentation", tagline: "Simple documentation with Next.js and MDX", desc: "Create documentation websites with Nextra's Next.js-powered framework featuring MDX, search, and theming.", author: "Vercel", url: "https://github.com/shuding/nextra", cat: "writing", cats: ["writing", "code-assistant"], kw: ["nextra", "nextjs", "mdx", "docs"] },
  { slug: "vitepress-docs", name: "VitePress Documentation", tagline: "Vite-powered static site generator for docs", desc: "Build fast documentation sites with VitePress's Vue-powered SSG featuring markdown extensions and theming.", author: "Evan You", url: "https://github.com/vuejs/vitepress", cat: "writing", cats: ["writing", "code-assistant"], kw: ["vitepress", "vite", "vue", "docs"] },
  { slug: "storybook-docs", name: "Storybook Documentation", tagline: "Component documentation and visual testing", desc: "Document and test UI components in isolation with Storybook's interactive component explorer and addon ecosystem.", author: "Storybook", url: "https://github.com/storybookjs/storybook", cat: "design", cats: ["design", "writing"], kw: ["storybook", "components", "docs", "visual-testing"] },

  // Additional security
  { slug: "owasp-zap-scanning", name: "OWASP ZAP Scanning", tagline: "Automated security testing for web applications", desc: "Find security vulnerabilities in web applications with OWASP ZAP's automated scanner and attack proxy.", author: "OWASP", url: "https://github.com/zaproxy/zaproxy", cat: "security", cats: ["security", "devops"], kw: ["owasp", "zap", "scanning", "vulnerabilities"] },
  { slug: "trivy-security", name: "Trivy Security Scanner", tagline: "All-in-one security scanner for containers and code", desc: "Scan container images, filesystems, and IaC for vulnerabilities, misconfigurations, and secrets with Trivy.", author: "Aqua Security", url: "https://github.com/aquasecurity/trivy", cat: "security", cats: ["security", "devops"], kw: ["trivy", "scanner", "containers", "vulnerabilities"] },
  { slug: "falco-runtime-security", name: "Falco Runtime Security", tagline: "Cloud-native runtime threat detection", desc: "Detect threats at runtime in containers and Kubernetes with Falco's system call monitoring and custom rules.", author: "Sysdig", url: "https://github.com/falcosecurity/falco", cat: "security", cats: ["security", "devops"], kw: ["falco", "runtime", "threat-detection", "kubernetes"] },
  { slug: "oauth2-patterns", name: "OAuth 2.0 Patterns", tagline: "Implement secure OAuth 2.0 authentication flows", desc: "Build secure authentication with OAuth 2.0 authorization code, PKCE, client credentials, and device code flows.", author: "IETF", url: "https://github.com/nicedoc/nicedoc.io", cat: "security", cats: ["security", "education"], kw: ["oauth2", "authentication", "pkce", "authorization"] },
  { slug: "jwt-best-practices", name: "JWT Best Practices", tagline: "Secure JSON Web Token implementation patterns", desc: "Implement JWTs securely with proper signing, validation, expiration, refresh token rotation, and revocation.", author: "Auth0", url: "https://github.com/auth0/node-jsonwebtoken", cat: "security", cats: ["security", "education"], kw: ["jwt", "tokens", "signing", "security"] },
  { slug: "passkey-authentication", name: "Passkey Authentication", tagline: "Passwordless login with WebAuthn and passkeys", desc: "Implement passwordless authentication with passkeys using the WebAuthn API for phishing-resistant sign-in.", author: "FIDO Alliance", url: "https://github.com/nicedoc/nicedoc.io", cat: "security", cats: ["security", "education"], kw: ["passkeys", "webauthn", "passwordless", "fido2"] },

  // Additional education
  { slug: "typescript-patterns", name: "TypeScript Design Patterns", tagline: "Advanced TypeScript type system patterns", desc: "Master TypeScript's type system with conditional types, template literals, mapped types, and type-safe patterns.", author: "TypeScript", url: "https://github.com/microsoft/TypeScript", cat: "education", cats: ["education", "code-assistant"], kw: ["typescript", "types", "patterns", "advanced"] },
  { slug: "javascript-es2024", name: "JavaScript ES2024 Features", tagline: "Modern JavaScript features and proposals", desc: "Use the latest JavaScript features including array grouping, decorators, and pipeline operator patterns.", author: "TC39", url: "https://github.com/tc39/proposals", cat: "education", cats: ["education", "code-assistant"], kw: ["javascript", "es2024", "features", "modern"] },
  { slug: "python-typing", name: "Python Type Hints", tagline: "Write type-safe Python with modern type hints", desc: "Add type safety to Python code with type hints, Protocol classes, TypedDict, and mypy static analysis.", author: "Python", url: "https://github.com/python/mypy", cat: "education", cats: ["education", "code-assistant"], kw: ["python", "typing", "mypy", "type-hints"] },
  { slug: "design-patterns-modern", name: "Modern Design Patterns", tagline: "Gang of Four patterns for modern development", desc: "Apply classic design patterns with modern language features for cleaner architecture in TypeScript, Python, and Go.", author: "Community", url: "https://github.com/nicedoc/nicedoc.io", cat: "education", cats: ["education", "code-assistant"], kw: ["design-patterns", "gof", "architecture", "solid"] },
  { slug: "clean-architecture", name: "Clean Architecture", tagline: "Build maintainable software with clean architecture", desc: "Structure applications with clean architecture's dependency inversion, use cases, and bounded contexts.", author: "Community", url: "https://github.com/nicedoc/nicedoc.io", cat: "education", cats: ["education", "code-assistant"], kw: ["clean-architecture", "solid", "hexagonal", "ddd"] },
  { slug: "microservices-patterns", name: "Microservices Patterns", tagline: "Design patterns for microservice architectures", desc: "Implement saga, CQRS, event sourcing, circuit breaker, and API gateway patterns for distributed systems.", author: "Community", url: "https://github.com/nicedoc/nicedoc.io", cat: "education", cats: ["education", "devops"], kw: ["microservices", "saga", "cqrs", "event-sourcing"] },
  { slug: "system-design", name: "System Design", tagline: "Scalable system design patterns and concepts", desc: "Design scalable systems with patterns for load balancing, caching, sharding, replication, and consistency models.", author: "Community", url: "https://github.com/nicedoc/nicedoc.io", cat: "education", cats: ["education", "devops"], kw: ["system-design", "scalability", "distributed", "architecture"] },
  { slug: "dsa-algorithms", name: "Data Structures & Algorithms", tagline: "Essential algorithms for coding interviews and systems", desc: "Implement and understand sorting, graph algorithms, dynamic programming, and tree data structures.", author: "Community", url: "https://github.com/nicedoc/nicedoc.io", cat: "education", cats: ["education", "code-assistant"], kw: ["algorithms", "data-structures", "interview", "complexity"] },
  { slug: "git-advanced", name: "Git Advanced", tagline: "Master advanced Git workflows and operations", desc: "Use advanced Git features including interactive rebase, cherry-pick, bisect, worktrees, and complex merge strategies.", author: "Git", url: "https://github.com/git/git", cat: "education", cats: ["education", "devops"], kw: ["git", "rebase", "bisect", "workflows"] },
  { slug: "regex-mastery", name: "Regex Mastery", tagline: "Master regular expressions for text processing", desc: "Write efficient regex patterns with lookaheads, backreferences, named groups, and performance optimization.", author: "Community", url: "https://github.com/nicedoc/nicedoc.io", cat: "education", cats: ["education", "code-assistant"], kw: ["regex", "patterns", "text", "matching"] },

  // Additional productivity/writing tools
  { slug: "obsidian-plugins", name: "Obsidian Plugins", tagline: "Extend Obsidian with community plugins", desc: "Enhance your Obsidian knowledge base with plugins for dataview queries, templating, and graph analysis.", author: "Obsidian", url: "https://github.com/obsidianmd/obsidian-api", cat: "productivity", cats: ["productivity", "writing"], kw: ["obsidian", "plugins", "notes", "knowledge-base"] },
  { slug: "logseq-automation", name: "Logseq Automation", tagline: "Automate knowledge management with Logseq", desc: "Build custom workflows in Logseq with plugins, queries, and templates for structured note-taking and journals.", author: "Logseq", url: "https://github.com/logseq/logseq", cat: "productivity", cats: ["productivity", "writing"], kw: ["logseq", "automation", "notes", "outliner"] },
  { slug: "raycast-extensions", name: "Raycast Extensions", tagline: "Build productivity extensions for Raycast", desc: "Create custom Raycast commands and extensions with React for quick actions, search, and tool integration.", author: "Raycast", url: "https://github.com/raycast/extensions", cat: "productivity", cats: ["productivity", "automation"], kw: ["raycast", "extensions", "launcher", "productivity"] },
  { slug: "alfred-workflows", name: "Alfred Workflows", tagline: "Automate macOS tasks with Alfred workflows", desc: "Build powerful automation workflows for Alfred with script actions, hotkeys, and web search integrations.", author: "Running with Crayons", url: "https://github.com/nicedoc/nicedoc.io", cat: "productivity", cats: ["productivity", "automation"], kw: ["alfred", "workflows", "macos", "automation"] },

  // Additional data & analytics
  { slug: "dbt-transformations", name: "dbt Data Transformations", tagline: "Transform data in your warehouse with dbt", desc: "Build reliable data transformations with dbt's SQL-based modeling, testing, and documentation for analytics.", author: "dbt Labs", url: "https://github.com/dbt-labs/dbt-core", cat: "data-analysis", cats: ["data-analysis", "devops"], kw: ["dbt", "sql", "transformations", "analytics"] },
  { slug: "apache-spark", name: "Apache Spark", tagline: "Unified analytics engine for big data processing", desc: "Process large-scale data with Apache Spark's distributed computing engine for batch and stream processing.", author: "Apache", url: "https://github.com/apache/spark", cat: "data-analysis", cats: ["data-analysis", "devops"], kw: ["spark", "big-data", "distributed", "processing"] },
  { slug: "apache-airflow-dags", name: "Apache Airflow DAGs", tagline: "Programmatic workflow scheduling with Airflow", desc: "Author and schedule data pipelines as DAGs with Apache Airflow's Python-based workflow orchestration.", author: "Apache", url: "https://github.com/apache/airflow", cat: "automation", cats: ["automation", "data-analysis"], kw: ["airflow", "dags", "scheduling", "orchestration"] },
  { slug: "metabase-analytics", name: "Metabase Analytics", tagline: "Open-source business intelligence and dashboards", desc: "Create dashboards and reports with Metabase's no-code query builder and SQL mode for business analytics.", author: "Metabase", url: "https://github.com/metabase/metabase", cat: "data-analysis", cats: ["data-analysis", "productivity"], kw: ["metabase", "bi", "dashboards", "analytics"] },
  { slug: "superset-dashboards", name: "Apache Superset Dashboards", tagline: "Modern data exploration and visualization platform", desc: "Build interactive dashboards with Apache Superset's data exploration platform and rich visualization library.", author: "Apache", url: "https://github.com/apache/superset", cat: "data-analysis", cats: ["data-analysis", "design"], kw: ["superset", "dashboards", "visualization", "exploration"] },

  // Additional automation & integration
  { slug: "temporal-workflows", name: "Temporal Workflows", tagline: "Durable execution for distributed applications", desc: "Build reliable distributed applications with Temporal's durable execution framework for long-running workflows.", author: "Temporal", url: "https://github.com/temporalio/temporal", cat: "automation", cats: ["automation", "devops"], kw: ["temporal", "workflows", "durable", "distributed"] },
  { slug: "inngest-functions", name: "Inngest Functions", tagline: "Event-driven serverless functions with retries", desc: "Build reliable event-driven functions with Inngest's step functions, retries, and fan-out for background jobs.", author: "Inngest", url: "https://github.com/inngest/inngest", cat: "automation", cats: ["automation", "devops"], kw: ["inngest", "events", "serverless", "retries"] },
  { slug: "trigger-dev", name: "Trigger.dev", tagline: "Background jobs and event-driven automation", desc: "Create long-running background jobs with Trigger.dev's TypeScript SDK for webhooks, scheduling, and integrations.", author: "Trigger.dev", url: "https://github.com/triggerdotdev/trigger.dev", cat: "automation", cats: ["automation", "code-assistant"], kw: ["trigger-dev", "jobs", "background", "typescript"] },
  { slug: "resend-email", name: "Resend Email API", tagline: "Modern email API for developers", desc: "Send transactional emails with Resend's developer-friendly API, React email templates, and domain verification.", author: "Resend", url: "https://github.com/resend/resend-node", cat: "automation", cats: ["automation", "code-assistant"], kw: ["resend", "email", "transactional", "api"] },
  { slug: "novu-notifications", name: "Novu Notification Infrastructure", tagline: "Open-source notification infrastructure for devs", desc: "Manage multi-channel notifications with Novu's API for email, SMS, push, in-app, and chat notifications.", author: "Novu", url: "https://github.com/novuhq/novu", cat: "automation", cats: ["automation", "code-assistant"], kw: ["novu", "notifications", "multi-channel", "open-source"] },
  { slug: "upstash-redis", name: "Upstash Redis", tagline: "Serverless Redis for edge and serverless functions", desc: "Use Redis in serverless and edge functions with Upstash's HTTP-based, pay-per-request Redis service.", author: "Upstash", url: "https://github.com/upstash/upstash-redis", cat: "devops", cats: ["devops", "data-analysis"], kw: ["upstash", "redis", "serverless", "edge"] },
  { slug: "upstash-qstash", name: "Upstash QStash", tagline: "Serverless message queue for edge functions", desc: "Build reliable event-driven architectures with QStash's HTTP-based message queue for serverless environments.", author: "Upstash", url: "https://github.com/upstash/sdk-qstash-ts", cat: "automation", cats: ["automation", "devops"], kw: ["upstash", "qstash", "queue", "serverless"] },

  // Additional MCP / Agent tools
  { slug: "mcp-server-patterns", name: "MCP Server Patterns", tagline: "Build Model Context Protocol servers for AI tools", desc: "Create MCP servers to expose tools, resources, and prompts to AI assistants using the Model Context Protocol.", author: "Anthropic", url: "https://github.com/modelcontextprotocol/servers", cat: "research", cats: ["research", "code-assistant"], kw: ["mcp", "model-context-protocol", "tools", "ai"] },
  { slug: "mcp-client-sdk", name: "MCP Client SDK", tagline: "Connect AI apps to MCP servers", desc: "Integrate MCP capabilities into AI applications with the TypeScript and Python client SDKs for tool discovery and invocation.", author: "Anthropic", url: "https://github.com/modelcontextprotocol/sdk", cat: "research", cats: ["research", "code-assistant"], kw: ["mcp", "client", "sdk", "integration"] },
  { slug: "openai-agents-sdk", name: "OpenAI Agents SDK", tagline: "Build multi-agent systems with OpenAI", desc: "Create agent-based applications with OpenAI's Agents SDK for tool use, handoffs, and guardrails.", author: "OpenAI", url: "https://github.com/openai/openai-agents-python", cat: "research", cats: ["research", "automation"], kw: ["openai", "agents", "multi-agent", "sdk"] },
  { slug: "crewai-agents", name: "CrewAI Multi-Agent", tagline: "Orchestrate AI agent teams with CrewAI", desc: "Build teams of AI agents that collaborate on complex tasks with CrewAI's role-based, goal-oriented framework.", author: "CrewAI", url: "https://github.com/crewAIInc/crewAI", cat: "research", cats: ["research", "automation"], kw: ["crewai", "agents", "teams", "collaboration"] },
  { slug: "smolagents", name: "SmolAgents", tagline: "Lightweight agent framework by Hugging Face", desc: "Build simple AI agents with SmolAgents' code-based tool calling approach and minimal framework overhead.", author: "Hugging Face", url: "https://github.com/huggingface/smolagents", cat: "research", cats: ["research", "code-assistant"], kw: ["smolagents", "huggingface", "lightweight", "agents"] },
];

async function main() {
  console.log(`Extra skills to import: ${extra.length}`);

  const { count: before } = await supabase
    .from("skills")
    .select("*", { count: "exact", head: true });
  console.log(`Current count: ${before}`);

  const rows = extra.map((s) => ({
    name: s.name,
    slug: `gen2-${s.slug}`,
    tagline: s.tagline,
    description: s.desc,
    author: s.author,
    url: s.url,
    category: s.cat,
    categories: s.cats,
    keywords: s.kw,
    pricing_type: "free",
    install_count: randInt(2000, 15000),
    is_new: Math.random() < 0.15,
    is_trending: Math.random() < 0.1,
  }));

  const BATCH_SIZE = 50;
  let imported = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase
      .from("skills")
      .upsert(batch, { onConflict: "slug" })
      .select("slug");

    if (error) {
      console.error(`Batch error:`, error.message);
    } else {
      imported += data?.length ?? batch.length;
      console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: inserted ${data?.length ?? batch.length} skills`);
    }
  }

  console.log(`\nImported: ${imported} skills`);

  const { count: after } = await supabase
    .from("skills")
    .select("*", { count: "exact", head: true });
  console.log(`New total: ${after}`);

  // Category breakdown
  const { data: catData } = await supabase.from("skills").select("category");
  if (catData) {
    const counts: Record<string, number> = {};
    catData.forEach((r: any) => { counts[r.category] = (counts[r.category] || 0) + 1; });
    console.log("\nCategory breakdown:");
    Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => console.log(`  ${c}: ${n}`));
  }
}

main().catch(console.error);
