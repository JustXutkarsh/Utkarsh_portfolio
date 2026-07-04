import { defineField, defineType } from "sanity";

export default defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({ name: "label", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "href", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "orderRank", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});
