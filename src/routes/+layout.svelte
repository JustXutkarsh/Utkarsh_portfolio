<script>
  import "$lib/styles/fonts.css";
  import "$lib/styles/global.css";

  import Header from "$lib/components/Header.svelte";
  import Cursor from "$lib/components/Cursor.svelte";
  import AIBackground from "$lib/components/AIBackground.svelte";
  import BootSequence from "$lib/components/BootSequence.svelte";
  import CommandPalette from "$lib/components/CommandPalette.svelte";
  import { portfolioContent } from "$lib/content/portfolio.js";
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { injectAnalytics } from "@vercel/analytics/sveltekit";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
  import { initGSAP } from "$lib/logic/globalFunctions";

  let { children } = $props();
  let content;
  let smoothWrapper;
  let reducedMotion = $state(false);
  let routeTransitioning = $state(false);
  const socials = portfolioContent.socials;

  afterNavigate(() => {
    if (reducedMotion || typeof window === "undefined") return;
    routeTransitioning = true;
    window.setTimeout(() => routeTransitioning = false, 180);
  });

  onMount(async () => {
    await initGSAP();
    injectAnalytics();
    injectSpeedInsights();

    const gsapModule = await import("gsap");
    const { ScrollSmoother } = await import("gsap/ScrollSmoother");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    const gsap = gsapModule.default;
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    if (!reducedMotion && window.innerWidth > 760) {
      ScrollSmoother.create({ wrapper: smoothWrapper, content, smooth: 0.45, effects: false });
    }
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
<CommandPalette />
<BootSequence />
<Cursor />

<div id="smooth-wrapper" bind:this={smoothWrapper}>
  <div bind:this={content} id="content">
    <div class="routeFrame" class:routeTransitioning>
      {@render children?.()}
    </div>
    <footer class="footer card">
      <p class="altText">Utkarsh Pandey • Pune, India</p>
      <div class="footerLinks">
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
    box-sizing: border-box;
    margin-bottom: 0;
    padding: 1.5rem 1rem 2rem;
    text-align: center;
    width: 100%;
  }

  .footerLinks {
    display: flex;
    flex-wrap: wrap;
    gap: 0.9rem;
    justify-content: center;
    padding-top: 0.75rem;
  }

  .footerLinks a {
    display: inline-flex;
    line-height: 1;
  }

  .routeFrame {
    min-height: 70vh;
    opacity: 1;
    transition: opacity 180ms ease, transform 180ms ease;
  }

  .routeTransitioning {
    opacity: 0.2;
    transform: translateY(8px);
  }

  @media (prefers-reduced-motion: reduce) {
    .routeFrame {
      transition: none;
    }
  }
</style>
