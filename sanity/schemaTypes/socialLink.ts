import { defineField, defineType } from "sanity";

export default defineType({
  name: "socialLink",
  title: "Social Links",
  type: "document",
  fields: [
    defineField({ name: "label", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "url", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "orderRank", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "label", subtitle: "url" } },
});
