import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "justxutkarsh_portfolio",
  title: "JustXutkarsh Portfolio",
  projectId: process.env.VITE_SANITY_PROJECT_ID || "xvksarfe",
  dataset: process.env.VITE_SANITY_DATASET || "production",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
