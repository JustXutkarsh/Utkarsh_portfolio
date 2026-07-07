<script>
  import { onDestroy, onMount, tick } from "svelte";
  import { goto } from "$app/navigation";
  import { portfolioContent } from "$lib/content/portfolio.js";
  import { scrollTo } from "$lib/logic/globalFunctions.js";

  let open = false;
  let query = "";
  let activeIndex = 0;
  let input;
  let toast = "";
  let toastTimer;

  const email = portfolioContent.socials.find((item) => item.label === "Email")?.url?.replace("mailto:", "") || "utkarshp034@gmail.com";
  const social = (label) => portfolioContent.socials.find((item) => item.label === label)?.url;
  const baseActions = [
    { label: "Jump to Home", hint: "/", run: () => goto("/") },
    { label: "Jump to Projects", hint: "#projects", run: () => jump("#projectsSection") },
    { label: "Jump to AI Stack", hint: "#skills", run: () => jump("#skillsSection") },
    { label: "Copy email to clipboard", hint: email, run: copyEmail },
    { label: "Open GitHub", hint: "github.com/JustXutkarsh", run: () => window.open(social("GitHub"), "_blank", "noopener,noreferrer") },
    { label: "Open LinkedIn", hint: "linkedin.com/in/utkarsh-pandey2005", run: () => window.open(social("LinkedIn"), "_blank", "noopener,noreferrer") },
    { label: "Open Resume", hint: "/resume.pdf", run: () => window.open(social("Resume"), "_blank", "noopener,noreferrer") },
    { label: "Toggle light/dark theme", hint: "theme", run: toggleTheme },
    ...portfolioContent.projects.map((project) => ({
      label: `Open ${project.title}`,
      hint: project.summary,
      run: () => goto(`/projects/${project.slug.current}`),
    })),
  ];

  $: filtered = baseActions
    .map((action) => ({ action, score: score(action, query) }))
    .filter((item) => item.score > -1)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.action);

  $: if (activeIndex >= filtered.length) activeIndex = 0;

  function score(action, term) {
    const target = `${action.label} ${action.hint}`.toLowerCase();
    const needle = term.trim().toLowerCase();
    if (!needle) return 1;
    if (target.includes(needle)) return 10 + needle.length;
    let cursor = 0;
    for (const char of needle) {
      cursor = target.indexOf(char, cursor);
      if (cursor === -1) return -1;
      cursor += 1;
    }
    return 2;
  }

  async function jump(selector) {
    if (location.pathname !== "/") {
      await goto("/");
      await tick();
    }
    scrollTo(selector);
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function copyEmail() {
    try {
      await navigator.clipboard?.writeText(email);
    } catch {
      const area = document.createElement("textarea");
      area.value = email;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    showToast("email copied");
  }

  function toggleTheme() {
    const current = document.documentElement.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    showToast(`${next} mode`);
  }

  function showToast(message) {
    toast = message;
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast = "", 1400);
  }

  async function openPalette() {
    open = true;
    query = "";
    activeIndex = 0;
    await tick();
    input?.focus();
  }

  function closePalette() {
    open = false;
  }

  async function runActive() {
    const action = filtered[activeIndex];
    if (!action) return;
    closePalette();
    await action.run();
  }

  function keydown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openPalette();
      return;
    }
    if (!open) return;
    if (event.key === "Escape") closePalette();
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!filtered.length) return;
      activeIndex = (activeIndex + 1) % filtered.length;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!filtered.length) return;
      activeIndex = (activeIndex - 1 + filtered.length) % filtered.length;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      runActive();
    }
  }

  function applyStoredTheme() {
    const stored = localStorage.getItem("theme");
    if (stored) document.documentElement.dataset.theme = stored;
  }

  onMount(() => {
    applyStoredTheme();
    window.addEventListener("keydown", keydown);
    window.addEventListener("open-command-palette", openPalette);
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("open-command-palette", openPalette);
    }
    clearTimeout(toastTimer);
  });
</script>

{#if open}
  <div class="paletteBackdrop" role="presentation" on:click={closePalette}>
    <div class="palette" role="dialog" aria-modal="true" aria-label="Command palette" tabindex="-1" on:click|stopPropagation on:keydown|stopPropagation>
      <div class="paletteInput">
        <span>cmd</span>
        <input
          bind:this={input}
          bind:value={query}
          aria-label="Search commands"
          placeholder="type a command or project..."
          on:keydown={(event) => {
            if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(event.key)) {
              event.stopPropagation();
              keydown(event);
            }
          }}
        />
      </div>
      <div class="paletteList" role="listbox" aria-label="Available commands">
        {#each filtered as action, index}
          <button
            type="button"
            class:active={index === activeIndex}
            role="option"
            aria-selected={index === activeIndex}
            on:mouseenter={() => activeIndex = index}
            on:click={() => { activeIndex = index; runActive(); }}
          >
            <strong>{action.label}</strong>
            <span>{action.hint}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}

{#if toast}
  <div class="paletteToast" role="status">{toast}</div>
{/if}

<style>
  .paletteBackdrop {
    background: rgba(0, 0, 0, 0.44);
    display: grid;
    inset: 0;
    padding: 1rem;
    place-items: start center;
    position: fixed;
    z-index: 4000;
  }

  .palette {
    background: color-mix(in srgb, var(--color-background), black 20%);
    border: 1px solid color-mix(in srgb, var(--color-accent), transparent 42%);
    border-radius: 18px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
    font-family: var(--font-mono);
    margin-top: min(18vh, 7rem);
    max-width: 720px;
    overflow: hidden;
    width: min(100%, 720px);
  }

  .paletteInput {
    align-items: center;
    border-bottom: 1px solid var(--color-card-outline);
    display: flex;
    gap: 0.75rem;
    padding: 0.9rem 1rem;
  }

  .paletteInput span {
    color: var(--color-accent);
    font-size: 0.78rem;
    text-transform: uppercase;
  }

  .paletteInput input {
    background: transparent;
    border: 0;
    color: var(--color-text);
    flex: 1;
    font: inherit;
    min-width: 0;
    outline: 0;
  }

  .paletteList {
    max-height: min(58vh, 430px);
    overflow-y: auto;
    padding: 0.45rem;
  }

  .paletteList button {
    background: transparent;
    border: 0;
    border-radius: 12px;
    color: var(--color-text);
    cursor: pointer;
    display: grid;
    gap: 0.25rem;
    padding: 0.75rem;
    text-align: left;
    width: 100%;
  }

  .paletteList button.active {
    background: color-mix(in srgb, var(--color-accent), transparent 82%);
    outline: 1px solid color-mix(in srgb, var(--color-accent), transparent 34%);
  }

  .paletteList span {
    color: var(--alt-text);
    font-size: 0.78rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .paletteToast {
    background: var(--color-accent);
    border-radius: 999px;
    bottom: 1rem;
    color: var(--color-basic);
    font-family: var(--font-mono);
    font-size: 0.85rem;
    left: 50%;
    padding: 0.65rem 0.9rem;
    position: fixed;
    transform: translateX(-50%);
    z-index: 4100;
  }
</style>
