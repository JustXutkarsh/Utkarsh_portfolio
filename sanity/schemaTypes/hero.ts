import { defineField, defineType } from "sanity";

export default defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  initialValue: {
    name: "Utkarsh Pandey",
    brand: "JustXutkarsh",
    title: "AI Engineer building production intelligent systems.",
    location: "Pune, India",
  },
  fields: [
    defineField({ name: "name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "brand", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "subtitle", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: "location", type: "string" }),
  ],
  preview: { select: { title: "name", subtitle: "title" } },
});
