<script>
  import { onMount } from "svelte";
  import gsap from "gsap";
  import { scrollTo, playSound, getCSSVariable } from "$lib/logic/globalFunctions.js";
  import { portfolioContent } from "$lib/content/portfolio.js";

  let header;
  let logoHeader;
  const socials = portfolioContent.socials;

  function iconPath(label) {
    if (label === "GitHub") return "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.2-3.37-1.2-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.04 1.53 1.04.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.99c.85 0 1.7.11 2.5.34 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z";
    if (label === "LinkedIn") return "M6.94 8.7H4.16V20h2.78V8.7ZM5.55 7.16a1.61 1.61 0 1 0 0-3.22 1.61 1.61 0 0 0 0 3.22ZM20 20h-2.78v-5.5c0-1.31-.03-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V20H10.5V8.7h2.67v1.54h.04a2.92 2.92 0 0 1 2.63-1.45c2.81 0 3.33 1.85 3.33 4.26V20H20Z";
    if (label === "Email") return "M3.5 5.5h17A1.5 1.5 0 0 1 22 7v10a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 17V7a1.5 1.5 0 0 1 1.5-1.5Zm.9 2.1 7.6 5.15 7.6-5.15";
    return "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M8 13h8M8 17h8M8 9h2";
  }

  onMount(() => {
    const links = header.querySelectorAll("a, button");

    links.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        playSound("hover");
        gsap.to(item, { scale: 0.94, duration: 0.2, ease: "power2.out" });
      });
      item.addEventListener("mouseleave", () => {
        gsap.to(item, { scale: 1, duration: 0.2, ease: "power2.out" });
      });
      item.addEventListener("mousedown", () => playSound("openLink"));
    });

    logoHeader.addEventListener("mouseenter", () => {
      gsap.to(logoHeader, {
        color: getCSSVariable("--color-secondary"),
        rotate: 6,
        duration: 0.25,
      });
    });
    logoHeader.addEventListener("mouseleave", () => {
      gsap.to(logoHeader, {
        color: getCSSVariable("--color-primary"),
        rotate: 0,
        duration: 0.25,
      });
    });
  });
</script>

<header bind:this={header} id="header" class="card noBounce" aria-label="Primary navigation">
  <a bind:this={logoHeader} id="logoHeader" href="/" aria-label="JustXutkarsh home">
    <svg viewBox="0 0 96 96" aria-hidden="true">
      <path d="M24 16v34c0 15.5 9.8 25 24 25s24-9.5 24-25V16" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" />
      <path d="M24 29h-9m57 0h9M48 75v9" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <circle cx="24" cy="16" r="6" fill="currentColor" />
      <circle cx="72" cy="16" r="6" fill="currentColor" />
      <circle cx="48" cy="84" r="5" fill="currentColor" />
    </svg>
  </a>

  <nav class="buttons" aria-label="Sections">
    <a class="headerButton interactable" href="/"><span>Home</span></a>
    <button class="headerButton interactable" on:click={() => scrollTo("#projectsSection")}><span>Projects</span></button>
    <button class="headerButton interactable" on:click={() => scrollTo("#skillsSection")}><span>AI Stack</span></button>
    <a class="headerButton interactable" href="/archive"><span>Archive</span></a>
    <button class="commandHint interactable" aria-label="Open command palette" on:click={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}>⌘K</button>
  </nav>

  <div class="socials" aria-label="Social links">
    {#each socials as social}
      <a class="socialText interactable" href={social.url} target={social.url.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" aria-label={social.label}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={iconPath(social.label)} />
        </svg>
        <span>{social.label}</span>
      </a>
    {/each}
  </div>
</header>

<style>
  #header {
    background: color-mix(in srgb, var(--color-background), var(--color-card) 42%);
    border: 1px solid color-mix(in srgb, var(--color-primary), white 34%);
    box-shadow: 0 18px 55px color-mix(in srgb, var(--color-primary), transparent 70%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: clamp(0.6rem, 2vw, 1.25rem);
    aspect-ratio: unset;
    box-sizing: border-box;
    left: 50%;
    margin: 0;
    max-width: 1320px;
    min-height: 72px;
    padding: 0.65rem 1rem;
    position: fixed;
    right: auto;
    top: 1rem;
    transform: translateX(-50%);
    width: min(calc(100vw - 2rem), 1320px);
  }

  #logoHeader {
    color: var(--color-primary);
    flex: 0 0 auto;
    display: grid;
    height: 48px;
    place-items: center;
    width: 48px;
  }

  #logoHeader svg {
    height: 100%;
    width: 100%;
  }

  .buttons,
  .socials {
    display: flex !important;
    align-items: center;
    gap: 0.35rem;
    min-width: 0;
  }

  .buttons {
    flex: 1 1 auto;
    justify-content: center;
  }

  .socials {
    flex: 0 1 auto;
    justify-content: flex-end;
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    width: auto !important;
  }

  .headerButton,
  .socialText,
  .commandHint {
    align-items: center;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--title-text);
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-size: clamp(0.78rem, 1vw, 0.95rem);
    font-weight: 800;
    gap: 0.35rem;
    line-height: 1;
    padding: 0.62rem 0.75rem;
    white-space: nowrap;
    height: auto !important;
    min-width: 0;
    text-align: center;
    text-decoration: none;
    width: auto !important;
  }

  .socialText svg {
    color: var(--color-primary);
    flex: 0 0 auto;
    height: 1.05rem;
    width: 1.05rem;
  }

  .socialText path {
    fill: currentColor;
    stroke: currentColor;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  .headerButton:hover,
  .socialText:hover,
  .commandHint:hover,
  .headerButton:focus-visible,
  .socialText:focus-visible,
  .commandHint:focus-visible {
    background: var(--color-accent);
    color: var(--color-basic);
  }

  .commandHint {
    border: 1px solid color-mix(in srgb, var(--color-accent), transparent 44%);
    color: var(--color-accent);
    font-family: var(--font-mono);
    padding-inline: 0.58rem;
  }

  @media (max-width: 980px) {
    #header {
      align-items: center;
      bottom: auto;
      display: grid;
      grid-template-columns: auto 1fr;
      min-height: 0;
      row-gap: 0.45rem;
      top: 0.75rem;
      width: calc(100vw - 1rem);
    }

    .socials {
      grid-column: 1 / -1;
      justify-content: center;
      overflow-x: auto;
      padding-bottom: 0.1rem;
      scrollbar-width: none;
    }

    .buttons {
      display: flex !important;
      justify-content: flex-end;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .socials::-webkit-scrollbar,
    .buttons::-webkit-scrollbar {
      display: none;
    }
  }

  @media (max-width: 560px) {
    #header {
      border-radius: 18px;
      grid-template-columns: 1fr;
      padding: 0.55rem;
      row-gap: 0.4rem;
    }

    #logoHeader {
      height: 40px;
      justify-self: center;
      width: 40px;
    }

    .buttons {
      display: grid !important;
      gap: 0.35rem;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      justify-content: stretch;
      overflow: visible;
      width: 100%;
    }

    .socials {
      grid-column: auto;
      overflow: visible;
      width: 100% !important;
    }

    .headerButton,
    .socialText {
      font-size: 0.75rem;
      justify-content: center;
      padding: 0.5rem 0.35rem;
    }

    .socialText span {
      display: none;
    }
  }
</style>
