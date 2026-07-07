import "dotenv/config";
import { createClient } from "@sanity/client";
import { portfolioContent } from "../src/lib/content/portfolio.js";

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN;

if (!projectId || !token) {
  console.error("Set VITE_SANITY_PROJECT_ID and SANITY_AUTH_TOKEN before seeding.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-07-04",
  useCdn: false,
});

const block = (text) => ({
  _type: "block",
  style: "normal",
  children: [{ _type: "span", text, marks: [] }],
  markDefs: [],
});

const categoryTitles = [
  ...new Set(portfolioContent.projects.flatMap((project) => [
    ...(project.categories || []).map((item) => item.title),
    ...(project.subcategories || []).map((item) => item.title),
  ]).flat()),
];

const categoryId = (title) => `category-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

const docs = [
  { _id: "hero-main", _type: "hero", ...portfolioContent.hero },
  { _id: "about-main", _type: "about", body: portfolioContent.about.map(block) },
  { _id: "site-settings", _type: "siteSettings", title: "Utkarsh Pandey | AI Engineer", brand: "JustXutkarsh", email: "justxutkarsh@gmail.com", location: "Pune, India" },
  { _id: "seo-main", _type: "seo", title: "Utkarsh Pandey | AI Engineer", description: "AI Engineer building production intelligent systems with LLMs, RAG, ML, agents, and backend APIs." },
  ...categoryTitles.map((title) => ({ _id: categoryId(title), _type: "category", title, slug: { current: categoryId(title).replace("category-", "") } })),
  ...portfolioContent.experience.map((item, index) => ({ _id: `experience-${index}`, _type: "experience", orderRank: index, ...item })),
  ...Object.entries(portfolioContent.skills).map(([title, skills], index) => ({ _id: `skills-${index}`, _type: "skillCategory", title, skills, orderRank: index })),
  ...portfolioContent.achievements.map((item, index) => ({ _id: `achievement-${index}`, _type: "achievement", ...item, orderRank: index })),
  ...portfolioContent.certifications.map((item, index) => ({ _id: `certification-${index}`, _type: "certification", ...item, orderRank: index })),
  ...portfolioContent.socials.map((item, index) => ({ _id: `social-${index}`, _type: "socialLink", ...item, orderRank: index })),
  ...["Home:/", "Projects:#projectsSection", "AI Stack:#skillsSection"].map((item, index) => {
    const [label, href] = item.split(":");
    return { _id: `navigation-${index}`, _type: "navigation", label, href, orderRank: index };
  }),
  ...portfolioContent.projects.map((project, index) => ({
    _id: `project-${project.slug.current}`,
    _type: "post",
    ...project,
    body: project.body?.map((item) => ({
      ...item,
      markDefs: item.markDefs || [],
      children: item.children?.map((child) => ({ _type: "span", marks: [], ...child })),
    })),
    categories: project.categories?.map((item) => ({ _type: "reference", _ref: categoryId(item.title) })),
    subcategories: project.subcategories?.map((item) => ({ _type: "reference", _ref: categoryId(item.title) })),
    orderRank: index,
  })),
];

const transaction = docs
  .reduce((tx, doc) => tx.createOrReplace(doc), client.transaction())
  .delete("project-internx")
  .delete("experience-2");
await transaction.commit();
console.log(`Seeded ${docs.length} Sanity documents.`);
