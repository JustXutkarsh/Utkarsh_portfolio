import { defineField, defineType } from "sanity";

export default defineType({
  name: "certification",
  title: "Certifications",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "issuer", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "href", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "image", type: "string" }),
    defineField({ name: "orderRank", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "title", subtitle: "issuer" } },
});
