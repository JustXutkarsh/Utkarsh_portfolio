# Utkarsh Pandey | AI Engineer Portfolio

A production-focused portfolio presenting Utkarsh Pandey's work across applied AI, large language models, retrieval systems, AI agents, machine learning, automation, and full-stack product delivery.

The experience combines editorial visual design with a technically expressive interface: animated project storytelling, interactive terminal commands, a command palette, a canvas-based AI background, responsive project pages, and CMS-managed content.

## Portfolio Focus

- **AI engineering:** LLM applications, RAG, embeddings, vector search, multi-agent systems, model evaluation, and inference workflows
- **Machine learning:** forecasting, feature engineering, deep learning, multimodal retrieval, and production prediction pipelines
- **AI product delivery:** Python and FastAPI services, automation workflows, databases, cloud deployment, and usable frontend experiences
- **Engineering philosophy:** research, architecture, implementation, deployment, observability, and iteration with real users

## Experience Highlights

- **Autonix — Co-Founder & AI Systems Lead:** AI automation systems for service businesses, including a production AI receptionist built with Vapi, n8n, and Google Calendar
- **Own The Story — Engineering Contributor:** production web systems, product features, APIs, and full-stack delivery support

## Featured Projects

| Project | Area | Summary |
| --- | --- | --- |
| [ASTRAM](https://github.com/JustXutkarsh/Astram-traffic-intelligence-app) | LLM planning, forecasting, risk analysis | AI traffic intelligence system for congestion forecasting, operational recommendations, historical retrieval, diversion planning, and PDF reporting |
| [Agentic Research PRO](https://github.com/JustXutkarsh/Agentic-Resarch-Pro) | Multi-agent AI, RAG | Autonomous research pipeline combining Tavily search, scraping, chunking, embeddings, FAISS retrieval, reasoning, and cited report generation |
| MedMind AI | Healthcare AI | GPT-powered healthcare analysis with medical knowledge retrieval and Supabase-backed application data |
| [SkyVision](https://github.com/JustXutkarsh/SkyVision) | Multimodal AI, vector search | Natural-language and image-based travel search using CLIP embeddings, FastAPI, Streamlit, and MariaDB vector indexing |
| [Traffic Demand Prediction](https://github.com/JustXutkarsh/flipkartGrid) | Machine learning, forecasting | Feature-engineered traffic forecasting and prediction pipeline developed for the Flipkart GRID challenge |

## Achievements

- **Flipkart GRID / HackerEarth Traffic Prediction — Semifinalist:** qualified from 35,000+ teams with a best score of 91.96% accuracy; traffic classification ROC-AUC of 0.819
- **SkyVision — MariaDB Hackathon Finalist:** top 70 among 30,000+ international participants with 85% multimodal retrieval relevance
- **Lovable VibeHack 2025 — 2nd Place:** placed second among 600+ teams in the international Hack With India event
- **Intercollege Hackathon — 6th Place:** ranked sixth among 200+ teams across Pune colleges in a 12-hour hackathon
- **Smart India Hackathon 2025 — Stage 2:** developed a mobile GNSS and IMU-based collision-warning and autonomous-navigation concept with peer-to-peer data exchange

## Certifications

- [Supervised Machine Learning: Regression and Classification](static/certificates/coursera-supervised-ml.pdf) — DeepLearning.AI, Stanford University, Coursera
- [Using OpenAI APIs: Exploring APIs with the OpenAI Playground](static/certificates/skillsoft-openai-playground.png) — Skillsoft
- [Introduction to Model Context Protocol](static/certificates/anthropic-model-context-protocol.pdf) — Anthropic Education
- [VibeHack 2025 Certificate of Excellence](static/certificates/vibe-hack-2025.png) — Hack With India x Lovable
- [12-hour Intercollege Hackathon: 6th Position Across Pune Colleges](static/certificates/hackathon-winner.pdf)

The Smart India Hackathon concept deck is available separately in the achievement timeline: [view the SIH 2025 presentation](static/certificates/sih-2025-idea-presentation.pdf).

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Application | Svelte 5, SvelteKit 2, JavaScript, Vite 7 |
| Motion | GSAP 3, ScrollTrigger, ScrollSmoother, MorphSVGPlugin |
| Content | Sanity Studio, Sanity Client, GROQ, generated TypeScript content types |
| Visual system | Custom CSS, responsive SVG artwork, canvas-based neural network background, custom local fonts |
| Interaction | Keyboard-accessible command palette, interactive terminal, custom cursor, route transitions, reduced-motion support |
| Audio | Howler.js with optional interaction sound effects |
| Monitoring | Vercel Analytics, Vercel Speed Insights |
| Validation | SvelteKit production builds, Playwright-ready browser testing |
| Deployment | Vercel adapter with SvelteKit-compatible hosting support |

## Core Capabilities Presented

**Artificial Intelligence:** Large Language Models, RAG, prompt engineering, AI agents, embeddings, vector databases, model evaluation, and generative AI

**Machine Learning:** Deep learning, PyTorch, TensorFlow, Scikit-learn, XGBoost, Pandas, and NumPy

**Backend and data:** Python, FastAPI, Node.js, REST APIs, authentication, PostgreSQL, Supabase, ChromaDB, and Redis

**Infrastructure:** Docker, Git, GCP, Vercel, and Render

**Frontend:** React, SvelteKit, TypeScript, JavaScript, UI/UX, and Figma

## Product Features

- Responsive editorial interface for mobile, tablet, laptop, and wide desktop displays
- GSAP-driven hero typography, SVG morphing, section reveals, horizontal achievement storytelling, and project micro-interactions
- Interactive terminal with `whoami`, `skills`, `projects`, `contact`, and `help` commands
- Keyboard-accessible command palette with navigation, project search, social links, email copy, resume access, and theme control
- Individual project routes with static fallback content and Sanity-backed data
- One-time terminal boot sequence stored per browser session
- Dark and light theme support
- Reduced-motion behavior for accessibility
- SEO metadata, `robots.txt`, custom favicon, and optimized static assets

## Architecture

```text
src/
├── lib/
│   ├── components/       # Header, terminal, command palette, cursor, motion, and background UI
│   ├── content/          # Complete local fallback portfolio content
│   ├── logic/            # Sanity client, fallback resolution, images, audio, and shared behavior
│   └── sanity/           # GROQ queries and TypeScript content types
└── routes/
    ├── +layout.svelte    # Global navigation, smooth scrolling, analytics, and route transitions
    ├── +page.svelte      # Main portfolio experience
    └── projects/[slug]/  # Project detail routes

sanity/
└── schemaTypes/          # CMS schemas and validation

scripts/
└── seed-sanity.mjs       # Initial content seeding

static/
├── certificates/         # Certificate previews and source documents
├── images/               # Project artwork and supporting media
├── logos/                # Achievement organization marks
└── resume.pdf             # Current downloadable resume
```

## Sanity Content Model

The CMS includes schemas for:

- Hero
- About
- Experience
- Projects
- Achievements
- Certifications
- Skill categories
- Project categories
- Navigation
- Social links
- SEO
- Site settings

The site remains fully usable without Sanity credentials. When CMS configuration is unavailable or a request fails, it automatically falls back to [`src/lib/content/portfolio.js`](src/lib/content/portfolio.js).

## Local Development

### Requirements

- Node.js 20 or newer
- npm
- Optional Sanity project and write token for CMS editing/seeding

### Setup

```bash
git clone https://github.com/JustXutkarsh/Utkarsh_portfolio.git
cd Utkarsh_portfolio
npm install
cp .env.example .env
npm run dev
```

The application is available at the local URL printed by Vite, normally `http://localhost:5173`.

## Environment Variables

```env
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
SANITY_AUTH_TOKEN=your_write_token
```

`SANITY_AUTH_TOKEN` is required only for operations that write content, such as the seed script. Do not commit private tokens.

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the SvelteKit development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run sanity:dev` | Start Sanity Studio |
| `npm run sanity:build` | Build Sanity Studio |
| `npm run sanity:seed` | Seed the configured dataset with initial portfolio content |

## CMS Setup

1. Create or connect a Sanity project.
2. Add the environment variables above to `.env`.
3. Run `npm run sanity:seed` to create the initial documents.
4. Run `npm run sanity:dev` to edit content in Sanity Studio.
5. Restart the SvelteKit development server after changing environment variables.

## Deployment

The repository is configured with the Vercel adapter.

1. Import the GitHub repository into Vercel.
2. Add `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` to the project environment.
3. Add `SANITY_AUTH_TOKEN` only when the deployment process needs write access.
4. Use `npm run build` as the build command.
5. Deploy and verify the resume, certificate, project, and social links.

The application can also be hosted on another SvelteKit-compatible platform after selecting the appropriate adapter.

## Contact

- [GitHub](https://github.com/JustXutkarsh)
- [LinkedIn](https://www.linkedin.com/in/utkarsh-pandey2005/)
- [Email](mailto:utkarshp034@gmail.com)
- [Resume](static/resume.pdf)

## License

See [LICENSE](LICENSE) for repository licensing information.
