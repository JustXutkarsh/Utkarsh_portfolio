import { defineField, defineType } from "sanity";

export default defineType({
  name: "seo",
  title: "SEO",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});
