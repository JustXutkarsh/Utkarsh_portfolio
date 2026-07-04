import { fetchProject } from "$lib/logic/data.js";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  const project = await fetchProject(params.slug);
  if (!project) throw error(404, "Not found");
  return { project };
}
