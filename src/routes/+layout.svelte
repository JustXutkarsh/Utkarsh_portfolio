<script>
  import "$lib/styles/fonts.css";
  import "$lib/styles/global.css";

  import Header from "$lib/components/Header.svelte";
  import Cursor from "$lib/components/Cursor.svelte";
  import AIBackground from "$lib/components/AIBackground.svelte";
  import { portfolioContent } from "$lib/content/portfolio.js";
  import { onMount } from "svelte";
  import { injectAnalytics } from "@vercel/analytics/sveltekit";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
  import { initGSAP } from "$lib/logic/globalFunctions";

  let { children } = $props();
  let content;
  let smoothWrapper;
  const socials = portfolioContent.socials;

  onMount(async () => {
    await initGSAP();
    injectAnalytics();
    injectSpeedInsights();

    const gsapModule = await import("gsap");
    const { ScrollSmoother } = await import("gsap/ScrollSmoother");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    const gsap = gsapModule.default;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    ScrollSmoother.create({
      wrapper: smoothWrapper,
      content,
      smooth: 1,
      effects: true,
    });
  });
</script>

<svelte:head>
  <title>Utkarsh Pandey | AI Engineer</title>
  <link rel="icon" href="/favicon.svg" />
  <meta property="og:title" content="Utkarsh Pandey | AI Engineer" />
  <meta property="og:description" content="Portfolio of Utkarsh Pandey, an AI Engineer building LLM, RAG, machine learning, and production AI systems." />
  <meta name="description" content="Utkarsh Pandey is an AI Engineer focused on LLMs, RAG, machine learning, agents, and production AI systems." />
  <meta property="og:url" content="https://justxutkarsh.dev" />
  <meta property="og:type" content="website" />
  <meta content="#2259c5" name="theme-color" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Utkarsh Pandey | AI Engineer" />
  <meta name="twitter:description" content="AI Engineer building production intelligent systems with LLMs, RAG, ML, and scalable backend APIs." />
</svelte:head>

<link rel="preload" href="/fonts/Althite.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/Lexend.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/Rubik.woff2" as="font" type="font/woff2" crossorigin />

<AIBackground />
<Header />
<Cursor />

<div id="smooth-wrapper" bind:this={smoothWrapper}>
  <div bind:this={content} id="content">
    {@render children?.()}
    <footer class="footer card">
      <p class="altText">JustXutkarsh • Utkarsh Pandey • AI Engineer • Pune, India</p>
      <div class="socials">
        {#each socials as social}
          <a href={social.url} target={social.url.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{social.label}</a>
        {/each}
      </div>
    </footer>
  </div>
</div>

<style>
  .footer {
    aspect-ratio: unset;
    border-radius: 0;
    margin-bottom: 0;
    padding: 1.5rem;
    text-align: center;
    width: 100%;
  }

  .socials {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    padding: 1rem;
  }
</style>
