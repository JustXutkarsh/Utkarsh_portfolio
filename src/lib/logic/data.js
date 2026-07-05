import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { portfolioContent } from "$lib/content/portfolio.js";

const hasSanityConfig = Boolean(import.meta.env.VITE_SANITY_PROJECT_ID);
export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || "xvksarfe";
export const dataset = import.meta.env.VITE_SANITY_DATASET || "production";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-07-04",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function getImage(ref) {
  if (!ref) return "";
  if (typeof ref === "string" && ref.startsWith("/")) return ref;
  return builder.image(ref).quality(78).format("webp").fit("max").url();
}

export function projectImage(project) {
  return project?.imageUrl || getImage(project?.mainImage?.asset?._id || project?.mainImage?.asset?._ref);
}

export function getImageSize(ref) {
  if (!ref) return "";
  const parts = ref.split("-");
  if (parts.length < 4) return "";
  return parts[2].split("x");
}

export function getAsset(ref) {
  const [, id, ext] = ref.split("-");
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`;
}

export async function fetchHomeData() {
  if (!hasSanityConfig) return portfolioContent;
  try {
    const data = await client.fetch(`{
      "hero": *[_type == "hero"][0],
      "about": *[_type == "about"][0].body,
      "experience": *[_type == "experience"]|order(orderRank asc),
      "projects": *[_type == "post"]|order(featured desc, created desc){title,slug,imageUrl,mainImage{asset->{_id,url},alt},categories[]->{title},homepage,featured,subcategories[]->{title},created,body,links,summary},
      "skills": *[_type == "skillCategory"]|order(orderRank asc){title,skills},
      "achievements": *[_type == "achievement"]|order(orderRank asc){title,detail,icon,logo,logoPath,metrics[]{label,value,suffix,precision},milestoneDate,milestoneTitle,milestoneDetail},
      "certifications": *[_type == "certification"]|order(orderRank asc){title,issuer,href,image},
      "socials": *[_type == "socialLink"]|order(orderRank asc){label,url}
    }`);
    if (data?.hero && data?.projects?.length) return data;
  } catch {
    // Local content keeps the portfolio usable before Sanity is configured.
  }
  return portfolioContent;
}

export async function fetchProjects() {
  if (!hasSanityConfig) return portfolioContent.projects;
  try {
    const projects = await client.fetch('*[_type == "post"]{title,slug,imageUrl,mainImage{asset->{_id,url},alt},categories[]->{title},homepage,featured,subcategories[]->{title},created,body,links,summary}|order(featured desc, created desc)');
    if (projects?.length) return projects;
  } catch {}
  return portfolioContent.projects;
}

export async function fetchProject(slug) {
  if (!hasSanityConfig) return portfolioContent.projects.find((project) => project.slug.current === slug);
  try {
    const project = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{title,slug,imageUrl,mainImage{asset->{_id,url},alt},categories[]->{title},subcategories[]->{title},featured,created,body,links,summary}`,
      { slug },
    );
    if (project) return project;
  } catch {}
  return portfolioContent.projects.find((project) => project.slug.current === slug);
}
