import { defineField, defineType } from "sanity";

export default defineType({
  name: "achievement",
  title: "Achievements",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "detail", type: "text", rows: 2 }),
    defineField({ name: "icon", type: "string" }),
    defineField({ name: "logo", type: "string" }),
    defineField({ name: "logoPath", type: "string" }),
    defineField({ name: "orderRank", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "title" } },
});
