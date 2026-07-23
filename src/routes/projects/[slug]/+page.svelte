<script>
  import { projectImage } from "$lib/logic/data.js";
  import { renderBody, formatDateTime } from "$lib/logic/formatter";

  export let data;

  const project = data.project;
  const categories = project.categories || [];
  const technologies = project.subcategories || [];
</script>

<svelte:head>
  <title>{project.title} | Utkarsh Pandey</title>
  <meta name="description" content={project.summary || `${project.title} by Utkarsh Pandey`} />
</svelte:head>

<main class="projectPage">
  <section class="projectHero">
    <div class="projectUtility">
      <a href="/#projectsSection">← Back to projects</a>
      <time>{formatDateTime(project.created)}</time>
    </div>

    <div class="projectLead">
      <div class="projectIntro">
        <p class="eyebrow">AI PROJECT RECORD</p>
        <h1>{project.title}</h1>
        <p class="projectSummary">{project.summary}</p>

        <div class="tagRail" aria-label="Project categories">
          {#if project.featured}<span class="tag featured">Featured</span>{/if}
          {#each categories as category}<span class="tag">{category.title}</span>{/each}
        </div>

        {#if project.links?.length}
          <div class="projectActions">
            {#each project.links as link}
              <a class="actionLink" href={link.url} target="_blank" rel="noopener noreferrer">{link.label} <span>↗</span></a>
            {/each}
          </div>
        {/if}
      </div>

      <figure class="projectVisual">
        <img class="projectImage" src={projectImage(project)} alt={project.mainImage?.alt || project.title} fetchpriority="high" />
        <figcaption>System view · {project.title}</figcaption>
      </figure>
    </div>
  </section>

  <section class="projectBuild" aria-label={`${project.title} build notes`}>
    <p class="buildLabel">01 / BUILD NOTES</p>
    <div class="projectDetails">
      <div class="bodyCopy">{@html renderBody(project.body || [])}</div>
      {#if technologies.length}
        <aside class="technologyList">
          <p>TOOLS IN THE SYSTEM</p>
          <ul>{#each technologies as technology}<li>{technology.title}</li>{/each}</ul>
        </aside>
      {/if}
    </div>
  </section>
</main>

<style>
  .projectPage{background:#f5f1df;color:#0a0b0a;min-height:100svh}.projectHero{box-sizing:border-box;min-height:100svh;padding:clamp(8rem,12vw,11rem) max(4vw,calc((100vw - 1180px)/2)) clamp(4rem,8vw,8rem)}.projectUtility{align-items:center;border-bottom:2px solid #0a0b0a;display:flex;font-family:var(--font-mono);font-size:.72rem;justify-content:space-between;padding-bottom:.85rem;text-transform:uppercase}.projectUtility a{color:inherit;text-decoration:none}.projectUtility a:hover,.actionLink:hover{color:#176d5d}.projectLead{align-items:center;display:grid;gap:clamp(2.5rem,6vw,6rem);grid-template-columns:minmax(0,.95fr) minmax(320px,1.05fr);padding-top:clamp(2rem,6vh,5rem)}.eyebrow,.buildLabel,.technologyList p,.projectVisual figcaption{color:#176d5d;font-family:var(--font-mono);font-size:.72rem;font-weight:700;margin:0;text-transform:uppercase}.projectIntro h1{font-family:"Rubik",sans-serif;font-size:clamp(4rem,9vw,9.5rem);line-height:.78;margin:1.4rem 0 1.8rem;text-transform:uppercase}.projectSummary{font-size:clamp(1.1rem,1.8vw,1.45rem);line-height:1.45;margin:0;max-width:43rem}.tagRail{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:2rem}.tag{background:#0a0b0a;color:#f5f1df;font-family:var(--font-mono);font-size:.68rem;padding:.5rem .65rem;text-transform:uppercase}.tag.featured{background:#ff8068;color:#0a0b0a}.projectActions{display:flex;flex-wrap:wrap;gap:1.5rem;margin-top:2.5rem}.actionLink{border-bottom:2px solid currentColor;color:#0a0b0a;font-family:var(--font-mono);font-size:.78rem;padding:.5rem 0;text-decoration:none;text-transform:uppercase}.actionLink span{color:#ff6f59}.projectVisual{--media-pad:clamp(.5rem,1vw,1rem);aspect-ratio:16/10;background:#0c1320;border:1px solid #0a0b0a;box-shadow:.8rem .8rem 0 #90ead6;box-sizing:border-box;margin:0;overflow:hidden;position:relative}.projectVisual .projectImage{border-radius:0;display:block;height:calc(100% - (var(--media-pad) * 2));inset:var(--media-pad);max-height:none;max-width:none;object-fit:contain;object-position:center;position:absolute;width:calc(100% - (var(--media-pad) * 2))}.projectVisual figcaption{background:#f5f1df;bottom:0;color:#0a0b0a;left:0;padding:.45rem .65rem;position:absolute}.projectBuild{background:#0a0b0a;color:#f5f1df;min-height:55svh;padding:clamp(4rem,8vw,8rem) max(4vw,calc((100vw - 1180px)/2))}.buildLabel{color:#90ead6}.projectDetails{border-top:1px solid #3d3f39;display:grid;gap:clamp(2rem,7vw,8rem);grid-template-columns:minmax(0,1fr) minmax(230px,.52fr);margin-top:2rem;padding-top:2rem}.bodyCopy{font-size:clamp(1.2rem,2vw,1.7rem);line-height:1.5;max-width:48rem}.bodyCopy :global(p){margin:0}.technologyList{border-left:1px solid #3d3f39;padding-left:clamp(1.25rem,3vw,3rem)}.technologyList p{color:#90ead6}.technologyList ul{font-family:"Rubik",sans-serif;font-size:clamp(1.35rem,2.4vw,2.2rem);line-height:1.05;list-style:none;margin:1.2rem 0 0;padding:0}.technologyList li{border-bottom:1px solid #3d3f39;padding:.55rem 0}.technologyList li::before{color:#ff8068;content:"+ ";font-family:var(--font-mono)}
  @media(max-width:760px){.projectHero{padding:12.75rem 1.25rem 4.5rem}.projectUtility{align-items:center;flex-wrap:wrap;gap:.75rem}.projectUtility a{align-items:center;background:#0a0b0a;color:#f5f1df;display:inline-flex;min-height:44px;padding:0 .75rem}.projectUtility a:hover{color:#90ead6}.projectUtility time{margin-left:auto;max-width:9rem;text-align:right}.projectLead{display:grid;gap:2.5rem;grid-template-columns:1fr;padding-top:2.25rem}.projectIntro h1{font-size:clamp(3.2rem,16vw,5rem);line-height:.82}.projectSummary{font-size:1rem}.projectVisual{box-shadow:.45rem .45rem 0 #90ead6}.projectBuild{min-height:50svh;padding:4rem 1.25rem}.projectDetails{grid-template-columns:1fr}.technologyList{border-left:0;border-top:1px solid #3d3f39;padding-left:0;padding-top:1.5rem}.bodyCopy{font-size:1.1rem}.projectActions{gap:1rem;margin-top:2rem}}
</style>
