import { defineField, defineType } from "sanity";

export default defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({ name: "company", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "role", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "period", type: "string" }),
    defineField({ name: "orderRank", type: "number", initialValue: 0 }),
    defineField({ name: "points", type: "array", of: [{ type: "string" }], validation: (Rule) => Rule.min(1) }),
  ],
  preview: { select: { title: "role", subtitle: "company" } },
});
