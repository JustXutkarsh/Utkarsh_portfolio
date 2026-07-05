<script>
  import { onDestroy, onMount } from "svelte";

  let visible = false;
  let shownLines = [];
  let timers = [];
  const lines = [
    "$ initializing portfolio...",
    "$ loading agent_pipeline.py... done",
    "$ connecting to sanity cms... done",
    "$ starting server... ready",
  ];

  function close() {
    visible = false;
    sessionStorage.setItem("justxutkarshBootSeen", "1");
  }

  onMount(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sessionStorage.getItem("justxutkarshBootSeen")) return;
    visible = true;
    window.addEventListener("keydown", close, { once: true });
    if (reduced) {
      shownLines = lines;
      timers.push(window.setTimeout(close, 250));
      return;
    }
    lines.forEach((line, index) => {
      timers.push(window.setTimeout(() => shownLines = [...shownLines, line], 180 + index * 280));
    });
    timers.push(window.setTimeout(close, 1600));
  });

  onDestroy(() => {
    timers.forEach(clearTimeout);
    if (typeof window !== "undefined") window.removeEventListener("keydown", close);
  });
</script>

{#if visible}
  <button class="bootOverlay" type="button" on:click={close} on:keydown={close} aria-label="Skip boot sequence">
    <div class="bootWindow">
      {#each shownLines as line}
        <p>{line}</p>
      {/each}
      <span>press any key / click to skip</span>
    </div>
  </button>
{/if}

<style>
  .bootOverlay {
    background: color-mix(in srgb, var(--color-background), black 34%);
    border: 0;
    color: var(--color-text);
    cursor: pointer;
    display: grid;
    font-family: var(--font-mono);
    inset: 0;
    padding: 1.2rem;
    place-items: center;
    position: fixed;
    text-align: left;
    z-index: 5000;
  }

  .bootWindow {
    background: color-mix(in srgb, var(--color-background), black 22%);
    border: 1px solid color-mix(in srgb, var(--color-accent), transparent 45%);
    border-radius: 18px;
    box-shadow: 0 0 40px color-mix(in srgb, var(--color-accent), transparent 80%);
    max-width: 680px;
    min-height: 160px;
    padding: 1.25rem;
    width: min(100%, 680px);
  }

  .bootWindow p {
    margin: 0 0 0.7rem;
  }

  .bootWindow span {
    color: var(--alt-text);
    display: block;
    font-size: 0.78rem;
    margin-top: 1rem;
  }
</style>
