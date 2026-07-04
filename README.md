# JustXutkarsh Portfolio

Premium SvelteKit portfolio for Utkarsh Pandey, positioned around AI engineering, LLM systems, RAG, machine learning, and production AI products.

## Stack

- SvelteKit + Vite
- Sanity CMS
- GSAP smooth motion
- Canvas neural-network background
- Static fallback content for instant local preview

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Sanity

Create or connect a Sanity project, then set:

```bash
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
SANITY_AUTH_TOKEN=your_write_token
```

Run the seed:

```bash
npm run sanity:seed
```

Start Studio:

```bash
npm run sanity:dev
```

## Deploy

Deploy the SvelteKit app to Vercel, Render, or any SvelteKit-compatible host. Add the same Sanity environment variables in the deployment dashboard.

## Content Model

Sanity schemas cover hero, about, experience, projects, achievements, skills, categories, navigation, social links, SEO, and site settings. The site falls back to local content until Sanity is configured.
