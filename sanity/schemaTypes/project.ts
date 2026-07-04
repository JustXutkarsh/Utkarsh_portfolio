import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Projects",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({ name: "summary", type: "text", rows: 3 }),
    defineField({ name: "created", type: "datetime", validation: (Rule) => Rule.required() }),
    defineField({ name: "homepage", type: "boolean", initialValue: true }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "imageUrl", title: "Static Image URL", type: "string" }),
    defineField({ name: "mainImage", type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }] }),
    defineField({ name: "categories", type: "array", of: [{ type: "reference", to: [{ type: "category" }] }] }),
    defineField({ name: "subcategories", type: "array", of: [{ type: "reference", to: [{ type: "category" }] }] }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }, { type: "image", fields: [{ name: "alt", type: "string" }] }] }),
    defineField({ name: "links", type: "array", of: [{ type: "object", fields: [{ name: "label", type: "string" }, { name: "url", type: "url" }] }] }),
  ],
  preview: { select: { title: "title", media: "mainImage", subtitle: "summary" } },
});
