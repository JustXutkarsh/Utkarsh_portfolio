export type Hero = {
  name: string;
  brand: string;
  title: string;
  subtitle: string;
  location?: string;
  education?: string;
  graduation?: string;
};

export type Project = {
  title: string;
  slug: { current: string };
  summary?: string;
  homepage?: boolean;
  featured?: boolean;
  created?: string;
  imageUrl?: string;
  mainImage?: { alt?: string; asset?: { _id?: string; _ref?: string; url?: string } };
  categories?: { title: string }[];
  subcategories?: { title: string }[];
  body?: unknown[];
  links?: { label: string; url: string }[];
};

export type Experience = {
  company: string;
  role: string;
  period?: string;
  points?: string[];
};

export type HomeData = {
  hero: Hero;
  about: string[] | unknown[];
  experience: Experience[];
  projects: Project[];
  skills: Record<string, string[]> | { title: string; skills: string[] }[];
  achievements: string[] | { title: string }[];
  certifications?: { title: string; issuer: string; href: string; image?: string }[];
  socials: { label: string; url: string }[];
};
