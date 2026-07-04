import { defineField, defineType } from "sanity";

export default defineType({
  name: "skillCategory",
  title: "Skills",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "orderRank", type: "number", initialValue: 0 }),
    defineField({ name: "skills", type: "array", of: [{ type: "string" }], validation: (Rule) => Rule.min(1) }),
  ],
  preview: { select: { title: "title" } },
});
