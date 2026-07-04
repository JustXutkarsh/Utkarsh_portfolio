import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Categories",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
  ],
  preview: { select: { title: "title" } },
});
