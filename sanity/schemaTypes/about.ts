import { defineField, defineType } from "sanity";

export default defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { prepare: () => ({ title: "About Utkarsh" }) },
});
