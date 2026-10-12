<script>
  import { onMount } from "svelte";
  import { scrollTo, playSound } from "$lib/logic/globalFunctions.js";
  import { portfolioContent } from "$lib/content/portfolio.js";

  let header;
  let logoHeader;
  let activeSection = "home";
  let scrollProgress = 0;
  const socials = portfolioContent.socials;

  function iconPath(label) {
    if (label === "GitHub") return "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.2-3.37-1.2-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.04 1.53 1.04.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.99c.85 0 1.7.11 2.5.34 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z";
    if (label === "LinkedIn") return "M6.94 8.7H4.16V20h2.78V8.7ZM5.55 7.16a1.61 1.61 0 1 0 0-3.22 1.61 1.61 0 0 0 0 3.22ZM20 20h-2.78v-5.5c0-1.31-.03-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V20H10.5V8.7h2.67v1.54h.04a2.92 2.92 0 0 1 2.63-1.45c2.81 0 3.33 1.85 3.33 4.26V20H20Z";
    if (label === "Email") return "M3.5 5.5h17A1.5 1.5 0 0 1 22 7v10a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 17V7a1.5 1.5 0 0 1 1.5-1.5Zm.9 2.1 7.6 5.15 7.6-5.15";
    return "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M8 13h8M8 17h8M8 9h2";
  }

  onMount(() => {
    const links = header.querySelectorAll("a, button");
    let frame;
    function updateNavigation() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        activeSection = "";
        for (const [id, key] of [["welcomeHeader", "home"], ["projectsSection", "projects"], ["achievementsSection", "achievements"]]) {
          const section = document.getElementById(id);
          if (!section) continue;
          const bounds = section.getBoundingClientRect();
          const line = header.getBoundingClientRect().bottom + 50;
          if (bounds.top <= line && bounds.bottom > line) activeSection = key;
        }
      });
    }
    window.addEventListener("scroll", updateNavigation, { passive: true });
    window.addEventListener("resize", updateNavigation);
    updateNavigation();

    const hover = () => playSound("hover");
    const open = () => playSound("openLink");
    links.forEach((item) => {
      item.addEventListener("mouseenter", hover);
      item.addEventListener("mousedown", open);
    });
    return () => { links.forEach((item) => { item.removeEventListener("mouseenter", hover); item.removeEventListener("mousedown", open); }); cancelAnimationFrame(frame); window.removeEventListener("scroll", updateNavigation); window.removeEventListener("resize", updateNavigation); };
  });
</script>

<header bind:this={header} id="header" class="card noBounce" aria-label="Primary navigation" style={`--progress:${scrollProgress}`}>
  <a bind:this={logoHeader} id="logoHeader" href="/" aria-label="JustXutkarsh home" on:click|preventDefault={() => scrollTo("#welcomeHeader")}>
    <svg viewBox="0 0 96 96" aria-hidden="true">
      <path d="M24 16v34c0 15.5 9.8 25 24 25s24-9.5 24-25V16" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" />
      <path d="M24 29h-9m57 0h9M48 75v9" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <circle cx="24" cy="16" r="6" fill="currentColor" />
      <circle cx="72" cy="16" r="6" fill="currentColor" />
      <circle cx="48" cy="84" r="5" fill="currentColor" />
    </svg>
  </a>

  <nav class="buttons" aria-label="Sections">
    <a class="headerButton interactable" class:active={activeSection === "home"} aria-current={activeSection === "home" ? "location" : undefined} href="/" on:click|preventDefault={() => scrollTo("#welcomeHeader")}><span class="navLabel" data-compact="Home">Home</span></a>
    <button class="headerButton interactable" class:active={activeSection === "projects"} aria-current={activeSection === "projects" ? "location" : undefined} on:click={() => scrollTo("#projectsSection")}><span class="navLabel" data-compact="Work">Projects</span></button>
    <button class="headerButton interactable" class:active={activeSection === "achievements"} aria-current={activeSection === "achievements" ? "location" : undefined} on:click={() => scrollTo("#achievementsSection")}><span class="navLabel" data-compact="Wins">Achievements</span></button>
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
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    background: #080807;
    border: 0;
    border-bottom: 1px solid #f5f1df26;
    border-radius: 0;
    box-shadow: none;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: clamp(0.6rem, 2vw, 1.25rem);
    aspect-ratio: unset;
    box-sizing: border-box;
    left: 50%;
    margin: 0;
    max-width: 1320px;
    min-height: 64px;
    padding: 0.45rem 0.75rem;
    position: fixed;
    right: auto;
    top: 1rem;
    transform: translateX(-50%);
    width: min(calc(100vw - 2rem), 1320px);
    overflow: visible;
    isolation: isolate;
  }

  #header::before { content:""; position:absolute; bottom:-1px; left:0; height:1px; width:calc(var(--progress,0) * 100%); background:#90ead6; pointer-events:none; }
  #logoHeader {
    color: #90ead6;
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
    border-radius: 0;
    background: transparent;
    color: #f5f1df;
    cursor: pointer;
    display: inline-flex;
    font-family: var(--font-mono);
    font-size: clamp(0.7rem, 0.85vw, 0.82rem);
    font-weight: 700;
    gap: 0.35rem;
    line-height: 1;
    padding: 0.62rem 0.75rem;
    white-space: nowrap;
    height: auto !important;
    min-width: 0;
    text-align: center;
    text-decoration: none;
    width: auto !important;
    text-transform: uppercase;
    transition: background 0.22s ease, color 0.22s ease;
  }

  .headerButton.active { color:#90ead6; background:transparent; box-shadow:inset 0 -1px #90ead6; }
  .headerButton { margin-left:0; }
  #header a:focus-visible,#header button:focus-visible { outline:2px solid #ff8068; outline-offset:3px; }

  .socialText svg {
    color: #90ead6;
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
    background: #90ead60c;
    box-shadow: none;
    color: #90ead6;
  }

  .commandHint {
    background: transparent;
    border: 1px solid #ff806850;
    color: #ff8068;
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
      border-radius: 0;
      grid-template-columns: 36px minmax(0,1fr);
      padding: 0.55rem;
      row-gap: 0.4rem;
      width: calc(100vw - 1.5rem);
    }

    #logoHeader {
      height: 36px;
      justify-self: start;
      width: 36px;
    }

    .buttons {
      display: grid !important;
      gap: 0.35rem;
      grid-template-columns: 0.9fr 1fr 1.45fr 0.62fr;
      justify-content: stretch;
      overflow: visible;
      width: 100%;
    }

    .socials {
      grid-column: 1 / -1;
      overflow: visible;
      width: 100% !important;
    }

    .headerButton,
    .socialText,
    .commandHint {
      font-size: 0.75rem;
      justify-content: center;
      padding: 0.5rem 0.35rem;
    }

    .socialText span {
      display: none;
    }
  }

  @media (max-width: 390px) {
    .headerButton,
    .commandHint {
      font-size: 0.68rem;
      padding-inline: 0.18rem;
    }

    .socialText {
      padding: 0.45rem 0.28rem;
    }
  }

  @media (max-width: 360px) {
    .headerButton .navLabel {
      font-size: 0;
    }

    .headerButton .navLabel::after {
      content: attr(data-compact);
      font-size: 0.62rem;
    }
  }

  @media (max-height: 480px) and (min-width: 561px) {
    #header {
      align-items: center;
      display: flex;
      gap: 0.4rem;
      grid-template-columns: none;
      min-height: 56px;
      padding: 0.35rem 0.55rem;
      width: calc(100vw - 1.5rem);
    }

    #logoHeader {
      height: 36px;
      width: 36px;
    }

    .buttons {
      flex: 1 1 auto;
      justify-content: center;
      overflow: visible;
      width: auto;
    }

    .socials {
      flex: 0 0 auto;
      grid-column: auto;
      justify-content: flex-end;
      overflow: visible;
      width: auto !important;
    }

    .socialText span {
      display: none;
    }

    .headerButton,
    .socialText,
    .commandHint {
      font-size: 0.62rem;
      padding: 0.42rem 0.38rem;
    }

    .socialText {
      padding-inline: 0.3rem;
    }
  }
</style>
