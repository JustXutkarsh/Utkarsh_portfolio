<script>
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { onDestroy, onMount } from "svelte";

  let fade;

  export let pageHeader;

  export let id = "";
  export let className = "";
  export let style = "";

  onMount(() => {
    if (className != "") {
      className = ` ${className}`;
    }
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    fade = gsap.to(pageHeader, {
      opacity: 0,
      scrollTrigger: {
        trigger: pageHeader,
        start: "bottom 25%",
        end: "bottom top",
        scrub: 0.5,
      },
    });
  });
  onDestroy(() => { fade?.scrollTrigger?.kill(); fade?.kill(); });
</script>

<div bind:this={pageHeader} {id} class="pageHeader{className}" {style}>
  <slot />
</div>

<style>
  div {
    overflow: hidden;
    position: relative;
  }
</style>
