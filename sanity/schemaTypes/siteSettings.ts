import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", initialValue: "Utkarsh Pandey | AI Engineer" }),
    defineField({ name: "brand", type: "string", initialValue: "JustXutkarsh" }),
    defineField({ name: "email", type: "string", initialValue: "justxutkarsh@gmail.com" }),
    defineField({ name: "location", type: "string", initialValue: "Pune, India" }),
  ],
  preview: { select: { title: "title", subtitle: "brand" } },
});
