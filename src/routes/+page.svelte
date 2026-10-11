<script>
  import { onDestroy, onMount, tick } from "svelte";
  import { fetchHomeData, projectImage } from "$lib/logic/data.js";
  import KineticStory from "$lib/components/KineticStory.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import GitHubActivity from "$lib/components/GitHubActivity.svelte";
  import { interactiveSurface } from "$lib/logic/visualEffects.js";
  import { scrollTo } from "$lib/logic/globalFunctions.js";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  let content;
  let projects = [];
  $: homeProjects = projects.filter((post) => post.homepage);
  let terminalRows = [];
  let terminalLiveText = "";
  let terminalReady = false;
  let terminalInput = "";
  let terminalInputEl;
  let cleanup = [];
  let motionContext;

  const MAX_CATEGORIES = 2;
  const words = (text) => text.split(" ");
  const terminalLines = [
    "$ training catboost_model.pkl... ROC-AUC: 0.819",
    "$ agent_pipeline: 7/7 agents online",
    "$ ranking candidates... accuracy: 91.96%",
    "$ deploying ai_receptionist... booking calls autonomously",
  ];
  const getCategories = (post) => {
    const visible = post.categories?.slice(0, MAX_CATEGORIES) || [];
    return { visible, hiddenCount: (post.categories?.length || 0) - visible.length };
  };
  const skillsAsEntries = (skills) => Array.isArray(skills)
    ? skills.map((group) => [group.title, group.skills])
    : Object.entries(skills || {});
  const aboutText = (about) => Array.isArray(about)
    ? about.map((item) => typeof item === "string" ? item : item.children?.map((child) => child.text).join("")).filter(Boolean)
    : [];
  const sortAchievements = (achievements = []) => {
    const hasFlipkart = achievements.some((item) => item.title?.toLowerCase().includes("flipkart grid"));
    return achievements.filter((item) => !(hasFlipkart && item.title?.toLowerCase().includes("hackerearth traffic prediction"))).sort((a, b) => {
    const aTime = Date.parse(`1 ${a.milestoneDate || ""}`) || 0;
    const bTime = Date.parse(`1 ${b.milestoneDate || ""}`) || 0;
    return bTime - aTime;
    });
  };
  const achievementProof = (achievement) => {
    const title = achievement.title?.toLowerCase() || "";
    if (title.includes("flipkart")) return "35,000+";
    if (title.includes("mariadb")) return "TOP 70";
    if (title.includes("vibehack")) return "#2 / 600+";
    if (title.includes("intercollege")) return "#6 / 200+";
    if (title.includes("smart india")) return "STAGE 2";
    return "RECOGNIZED";
  };
  const formatMonthYear = (isoString) => new Date(isoString).toLocaleString(undefined, { month: "short", year: "numeric" });

  function startTerminal(reducedMotion) {
    if (reducedMotion) {
      terminalRows = terminalLines;
      terminalReady = true;
      return;
    }
    let lineIndex = 0;
    let charIndex = 0;
    let timer;
    const step = () => {
      const line = terminalLines[lineIndex];
      terminalLiveText = line.slice(0, charIndex);
      if (charIndex < line.length) {
        charIndex += 1;
        timer = window.setTimeout(step, 12);
        return;
      }
      terminalRows = [...terminalRows, line];
      terminalLiveText = "";
      lineIndex += 1;
      charIndex = 0;
      if (lineIndex >= terminalLines.length) {
        terminalReady = true;
        return;
      }
      timer = window.setTimeout(step, 180);
    };
    step();
    cleanup.push(() => window.clearTimeout(timer));
  }

  function terminalLinks(names) {
    return names.map((name) => {
      const project = projects.find((item) => item.title === name);
      return project ? { label: project.title, href: `/projects/${project.slug.current}`, hint: project.summary } : null;
    }).filter(Boolean);
  }

  function submitTerminal() {
    const command = terminalInput.trim();
    if (!command) return;
    terminalRows = [...terminalRows, `$ ${command}`];
    terminalInput = "";
    const lower = command.toLowerCase();
    if (lower === "whoami") {
      terminalRows = [...terminalRows, "Utkarsh Pandey: AI engineer building LLM, RAG, agent, ML, and production automation systems."];
    } else if (lower === "skills") {
      terminalRows = [...terminalRows, "LLMs · RAG · multi-agent systems · vector search · ML forecasting · FastAPI · full-stack product delivery"];
    } else if (lower === "projects") {
      terminalRows = [...terminalRows, "projects:"];
      terminalRows = [...terminalRows, ...terminalLinks(projects.map((item) => item.title))];
    } else if (lower === "contact") {
      terminalRows = [...terminalRows, "contact:", { label: "utkarshp034@gmail.com", href: "mailto:utkarshp034@gmail.com" }, { label: "GitHub", href: "https://github.com/JustXutkarsh" }, { label: "LinkedIn", href: "https://www.linkedin.com/in/utkarsh-pandey2005/" }];
    } else if (lower === "help") {
      terminalRows = [...terminalRows, "available commands: whoami, skills, projects, contact, help"];
    } else {
      terminalRows = [...terminalRows, `command not found: ${command}. try 'help'`];
    }
    tick().then(() => terminalInputEl?.focus({ preventScroll: true }));
  }

  function setupMotion(reducedMotion, heroDelay = 0) {
    gsap.registerPlugin(ScrollTrigger);
    if (reducedMotion) return;

    motionContext = gsap.context(() => {
      const hero = gsap.timeline({ delay: heroDelay, defaults: { ease: "power4.out" } });
      hero
        .from(".heroLetter", { yPercent: 110, duration: 0.9, stagger: 0.028 })
        .from(".heroKicker", { autoAlpha: 0, y: 12, duration: 0.5 }, 0.1)
        .from(".heroSupport, .heroText, .heroMeta", { autoAlpha: 0, y: 18, duration: 0.65, stagger: 0.07 }, 0.35)
        .from(".heroActions", { autoAlpha: 0, y: 14, duration: 0.6 }, 0.6)
        .from(".heroActivity", { autoAlpha: 0, y: 20, duration: 0.8 }, 0.55)
        .from(".terminalWindow", { autoAlpha: 0, y: 24, duration: 0.75 }, 0.7);

      gsap.utils.toArray(".revealSection").forEach((section) => {
        const titleWords = section.querySelectorAll(".sectionWord");
        const revealItems = section.querySelectorAll(".experienceRow, .certificateItem, .aboutLine");
        if (titleWords.length) {
          gsap.from(titleWords, {
            yPercent: 120,
            rotate: 5,
            duration: 0.9,
            stagger: 0.055,
            ease: "power4.out",
            scrollTrigger: { trigger: section, start: "top 82%", once: true },
          });
        }
        if (revealItems.length) {
          gsap.from(revealItems, {
            autoAlpha: 0,
            y: 54,
            scale: 0.975,
            duration: 0.75,
            stagger: 0.075,
            ease: "power3.out",
            scrollTrigger: { trigger: revealItems[0], start: "top 88%", once: true },
          });
        }
      });

      gsap.utils.toArray(".projectFeature").forEach((card) => {
        gsap.from(card, {
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 92%", once: true },
        });
      });

      gsap.utils.toArray(".experienceRow").forEach((row, index) => {
        gsap.from(row, { xPercent: index % 2 ? 8 : -8, scrollTrigger: { trigger: row, start: "top bottom", end: "top 55%", scrub: 0.7 } });
      });

      const achievementSection = document.querySelector("#achievementsSection");
      const achievementRail = document.querySelector(".achievementRail");
      if (achievementSection && achievementRail) {
        const distance = () => Math.max(0, achievementRail.scrollWidth - window.innerWidth);
        const railTween = gsap.to(achievementRail, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: achievementSection,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray(".achievementScene").forEach((scene) => {
          gsap.from(scene.querySelector(".achievementProof"), {
            xPercent: 10,
            rotate: -2,
            scrollTrigger: { trigger: scene, containerAnimation: railTween, start: "left right", end: "center center", scrub: 0.7 },
          });
          gsap.from(scene.querySelectorAll(".achievementChip, .achievementShape, .achievementBadge"), {
            autoAlpha: 0,
            scale: 0.45,
            rotate: 18,
            stagger: 0.1,
            scrollTrigger: { trigger: scene, containerAnimation: railTween, start: "left 85%", end: "center 55%", scrub: 0.7 },
          });
        });
      }
    });
    cleanup.push(() => motionContext?.revert());

    ScrollTrigger.refresh();
  }

  onMount(async () => {
    content = await fetchHomeData();
    projects = [...(content.projects || [])].sort((a, b) => {
      if ((b.featured === true) !== (a.featured === true)) return (b.featured === true) - (a.featured === true);
      return new Date(b.created) - new Date(a.created);
    });
    await tick();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    startTerminal(reducedMotion);
    const heroDelay = sessionStorage.getItem("justxutkarshBootSeen") ? 0.12 : 1.7;
    setupMotion(reducedMotion, heroDelay);
    if (window.location.hash) scrollTo(window.location.hash);
  });

  onDestroy(() => cleanup.forEach((fn) => fn()));
</script>

<svelte:head>
  <title>Utkarsh Pandey | AI Engineer</title>
</svelte:head>

{#if content}
  <div id="portfolio">
    <PageHeader id="welcomeHeader">
      <svg class="heroSpotlight" viewBox="0 0 3787 2842" fill="none" aria-hidden="true">
        <g filter="url(#portfolioSpotlight)"><ellipse cx="1924.71" cy="273.501" rx="1924.71" ry="273.501" transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)" fill="#90ead6" fill-opacity="0.21" /></g>
        <defs><filter id="portfolioSpotlight" x="0" y="0" width="3787" height="2842" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="151" /></filter></defs>
      </svg>
      <div class="headerContent">
        <p class="brand heroKicker">{content.hero.brand} · AI ENGINEER <span class="heroAvailability"><i></i> OPEN TO COLLABORATE</span></p>
        <div class="heroComposition">
        <div class="heroIdentity">
        <h1 class="kineticName" aria-label={content.hero.name}>
          {#each words(content.hero.name) as word}
            <span class="heroWordMask"><span class="heroWord" aria-hidden="true">{#each Array.from(word) as letter}<span class="heroLetter">{letter}</span>{/each}</span></span>
          {/each}
        </h1>
        <h2 class="heroSupport">{content.hero.title}</h2>
        <p class="heroText">{content.hero.subtitle}</p>
        <div class="heroMeta">
          <span>{content.hero.location}</span>
        </div>
        <div class="heroActions">
          <a class="heroAction interactable" href="#projectsSection" on:click|preventDefault={() => scrollTo("#projectsSection")}>Explore my work <span>↘</span></a>
          <a class="heroContact interactable" href="mailto:utkarshp034@gmail.com">Let's build something <span>↗</span></a>
        </div>
        </div>
        <div class="heroActivity"><GitHubActivity /></div>
        </div>
        <div class="heroLab">
        <div class="terminalWindow" aria-label="AI engineering terminal signature">
          <div class="terminalChrome"><span></span><span></span><span></span><p>utkarsh@portfolio:~ <span>type "help" ↵</span></p></div>
          <div class="terminalBody" role="button" tabindex="0" on:click={() => terminalInputEl?.focus({ preventScroll: true })} on:keydown={(event) => {
            if (event.key === "Enter" || event.key === " ") terminalInputEl?.focus({ preventScroll: true });
          }}>
            {#each terminalRows as row}
              {#if typeof row === "string"}
                <p>{row}</p>
              {:else}
                <p><a href={row.href}>{row.label}</a>{#if row.hint}<span> — {row.hint}</span>{/if}</p>
              {/if}
            {/each}
            {#if terminalLiveText}
              <p>{terminalLiveText}<span class="terminalCursor">|</span></p>
            {/if}
            {#if terminalReady}
              <form class="terminalPrompt" on:submit|preventDefault={submitTerminal}>
                <label for="heroTerminalInput">$</label>
                <input id="heroTerminalInput" bind:this={terminalInputEl} bind:value={terminalInput} autocomplete="off" spellcheck="false" aria-label="Type terminal command" />
                <span class="terminalCursor">|</span>
              </form>
            {/if}
          </div>
        </div>
        </div>
        <div class="heroFootnote"><span>RESEARCH. ENGINEER. SHIP.</span><a href="#aboutSection" on:click|preventDefault={() => scrollTo("#aboutSection")}>SCROLL TO DISCOVER ↓</a></div>
      </div>
    </PageHeader>

    <KineticStory skills={skillsAsEntries(content.skills).flatMap(([, items]) => items)} />

    <section id="aboutSection" class="revealSection editorialBand creamBand">
      <p class="sectionEyebrow">01 / THE ENGINEER BEHIND THE SYSTEMS</p>
      <h1 class="sectionTitle" aria-label="AI systems, end to end">{#each words("AI systems, end to end") as word}<span class="sectionWordMask"><span class="sectionWord">{word}</span></span>{/each}</h1>
      <div id="aboutLayout">
        {#each aboutText(content.about) as paragraph, index}
          <p class:leadAbout={index === 0} class="aboutLine"><span>0{index + 1}</span>{paragraph}</p>
        {/each}
      </div>
    </section>

    <section id="experienceSection" class="revealSection editorialBand darkBand">
      <p class="sectionEyebrow">02 / BUILT IN THE REAL WORLD</p>
      <h1 class="sectionTitle" aria-label="Engineering experience">{#each words("Engineering experience") as word}<span class="sectionWordMask"><span class="sectionWord">{word}</span></span>{/each}</h1>
      <div class="experienceList">
        {#each content.experience as item, index}
          <article class="experienceRow" use:interactiveSurface>
            <span class="surfaceGlow" aria-hidden="true"></span>
            <span class="rowNumber">0{index + 1}</span>
            <div class="experienceHeading"><p>{item.period}</p><h2>{item.role}</h2><h3>{item.company}</h3></div>
            <ul>
              {#each item.points || [] as point}
                <li>{point}</li>
              {/each}
            </ul>
          </article>
        {/each}
      </div>
    </section>

    <section id="projectsSection" class="revealSection editorialBand creamBand">
      <p class="sectionEyebrow">03 / SELECTED WORK · FROM IDEA TO IMPACT</p>
      <h1 class="sectionTitle" aria-label="Featured AI projects">{#each words("Featured AI projects") as word}<span class="sectionWordMask"><span class="sectionWord">{word}</span></span>{/each}</h1>
      <div class="projectIntro">
        <p>Research, retrieval, reasoning.<br /><strong>Ideas engineered into working systems.</strong></p>
        <span>{String(homeProjects.length).padStart(2, "0")} PROJECTS / ENDLESS CURIOSITY</span>
      </div>
      <nav class="projectIndex" aria-label="Jump to an AI project">
        {#each homeProjects as post, index}
          <a href={`#${post.slug.current}`} on:click|preventDefault={() => scrollTo(`#${post.slug.current}`)}><span>{String(index + 1).padStart(2, "0")}</span>{post.title}<span aria-hidden="true">↘</span></a>
        {/each}
      </nav>
      <div class="projectShowcase">
        {#each homeProjects as post, index}
          <article id={post.slug.current} aria-labelledby={`title-${post.slug.current}`} style={`--project-accent:${["#90ead6", "#ff9bea", "#ff8068"][index % 3]}`} class:projectReverse={index % 2 === 1} class="projectFeature">
            <div class="projectMedia" use:interactiveSurface={{ tilt: true }}>
              <span class="projectFrameLabel"><span class="frameDots" aria-hidden="true">● ● ●</span> {post.slug.current}.ai <span>↗</span></span>
              <span class="projectOrbit" aria-hidden="true"></span>
              <span class="projectVisualNumber" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <a class="projectArtwork" href={`/projects/${post.slug.current}`} data-sveltekit-reload aria-label={`Explore ${post.title}`}>
                <img class="projectImage" loading="lazy" fetchpriority="low" src={projectImage(post)} alt={post.mainImage?.alt || post.title} />
                <span class="artworkHint">OPEN CASE STUDY ↗</span>
              </a>
              <div class="projectVisualFooter"><span>BUILT TO SOLVE</span><span>{post.categories?.[0]?.title || "Applied AI"}</span></div>
              <span class="projectGlare" aria-hidden="true"></span>
            </div>
            <div class="projectCopy">
              <div class="projectMeta"><span>{post.featured ? "★ FEATURED BUILD" : "APPLIED AI / SELECTED WORK"}</span><time datetime={post.created}>{formatMonthYear(post.created)}</time></div>
              <div class="projectCategories">
                {#each getCategories(post).visible as category}<p>{category.title}</p>{/each}
                {#if getCategories(post).hiddenCount > 0}<p>+{getCategories(post).hiddenCount}</p>{/if}
              </div>
              <h2 id={`title-${post.slug.current}`} class="projectTitle">{post.title}</h2>
              <p class="summary">{post.summary}</p>
              {#if post.subcategories?.length}
                <ul class="projectTech" aria-label={`${post.title} technologies and capabilities`}>
                  {#each post.subcategories as technology}<li>{technology.title}</li>{/each}
                </ul>
              {/if}
              <div class="projectActions">
                <a class="projectLink" href={`/projects/${post.slug.current}`} data-sveltekit-reload aria-label={`Read the ${post.title} case study`}>Explore project <span aria-hidden="true">↗</span></a>
                {#each post.links || [] as link}
                  {#if link.label === "GitHub"}<a class="projectSource" href={link.url} target="_blank" rel="noreferrer" aria-label={`View ${post.title} source on GitHub`}>Source code <span aria-hidden="true">↗</span></a>{/if}
                {/each}
              </div>
            </div>
          </article>
        {/each}
      </div>
    </section>

    <section id="achievementsSection" class="horizontalAchievements darkBand" aria-label="Achievement timeline">
      <div class="achievementRail">
        <header class="achievementPanel achievementIntro">
          <h1>BUILT.<br /><span>TESTED.</span><br />RECOGNIZED.</h1>
          <span class="scrollCue">SCROLL TO EXPLORE →</span>
          <i class="introRing" aria-hidden="true"></i><i class="introSpark" aria-hidden="true"></i>
        </header>
        {#each sortAchievements(content.achievements) as achievement, index}
          <article class={`achievementPanel achievementScene achievementScene${index % 3}`}>
            <div class="achievementVisual" aria-hidden="true">
              <strong class="achievementProof" class:proofLong={achievementProof(achievement).length > 7}>{achievementProof(achievement)}</strong>
              <div class="achievementChips">
                <span class="achievementChip">{achievement.milestoneDate}</span>
                <span class="achievementChip">{String(index + 1).padStart(2, "0")} / {String(sortAchievements(content.achievements).length).padStart(2, "0")}</span>
              </div>
              <i class="achievementShape shapeRing"></i><i class="achievementShape shapeSpark"></i>
            </div>
            <div class="achievementCopy">
              <div class="achievementIndex"><span>0{index + 1}</span><p>{achievement.milestoneDate}</p></div>
              <div class="achievementBadge">
                {#if achievement.logoPath}
                  <img class="achievementLogo" src={achievement.logoPath} alt={`${achievement.logo} logo`} loading="lazy" />
                {:else if achievement.logo}
                  <span class={`brandLogo ${achievement.logo.toLowerCase()}`}>{achievement.logo}</span>
                {:else if achievement.icon}
                  <span class="trophy">{achievement.icon}</span>
                {/if}
              </div>
              <h2>{achievement.milestoneTitle || achievement.title || achievement}</h2>
              {#if achievement.detail}<p class="achievementDetail">{achievement.detail}</p>{/if}
              {#if achievement.href}
                <a class="recordLink" href={achievement.href} target="_blank" rel="noopener noreferrer">{achievement.hrefLabel || "Open record"} ↗</a>
              {/if}
            </div>
          </article>
        {/each}
      </div>
    </section>

    <section id="certificationsSection" class="revealSection editorialBand creamBand">
      <p class="sectionEyebrow">05 / CONTINUOUSLY LEARNING</p>
      <h1 class="sectionTitle" aria-label="Certifications">{#each words("Certifications") as word}<span class="sectionWordMask"><span class="sectionWord">{word}</span></span>{/each}</h1>
      <div class="certificateList">
        {#each content.certifications || [] as certificate, index}
          <article class="certificateItem">
            <span class="rowNumber">0{index + 1}</span>
            <div class="certificateCopy"><h2>{certificate.title}</h2><p>{certificate.issuer}</p><a href={certificate.href} target="_blank" rel="noopener noreferrer">View certificate ↗</a></div>
            {#if certificate.image}<a class="certificateMedia" href={certificate.href} target="_blank" rel="noopener noreferrer"><img class="certPreview" src={certificate.image} alt={certificate.title} loading="lazy" /></a>{/if}
          </article>
        {/each}
      </div>
    </section>
  </div>
{/if}

<style>
  :global(#welcomeHeader) {
    background: #080807;
    box-sizing: border-box;
    height: auto;
    min-height: 100svh;
    padding: clamp(7rem, 12vh, 9rem) 0 clamp(4rem, 8vh, 6rem);
  }

  :global(#welcomeHeader .headerContent) {
    margin: auto;
    width: min(1180px, 92%);
  }

  .brand {
    color: var(--color-accent);
    font-family: var(--font-mono);
    font-size: clamp(0.72rem, 1.2vw, 0.9rem);
    font-weight: 700;
    letter-spacing: 0;
    margin: 0 0 1.2rem;
    text-align: left;
    text-transform: uppercase;
  }

  :global(#welcomeHeader) .kineticName {
    color: #f5f1df;
    font-family: "Rubik", sans-serif;
    font-size: clamp(4rem, 8.2vw, 8rem);
    font-weight: 500;
    letter-spacing: -0.055em;
    line-height: 1;
    margin: 0;
    text-align: left;
    text-transform: none;
  }

  .kineticName {
    display: grid;
    gap: 0;
    position: relative;
    z-index: 1;
  }

  .heroComposition { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(0,1fr); align-items:center; gap:clamp(2rem,4vw,4rem); }
  .heroIdentity,.heroActivity { min-width:0; }
  @media(max-width:980px) { .heroComposition { grid-template-columns:1fr; gap:3rem; } .heroActivity { max-width:540px; width:100%; } }

  .heroWordMask,
  .sectionWordMask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.08em;
  }

  .heroWord {
    display: block;
    transform-origin: left bottom;
    white-space: nowrap;
  }

  .heroLetter {
    display: inline-block;
    transform-origin: 50% 100%;
    will-change: transform;
  }

  .heroWordMask:last-child .heroWord {
    color: #90ead6;
    font-family: Georgia, "Times New Roman", serif;
    font-style: italic;
    font-weight: 400;
    letter-spacing: -0.025em;
    text-align: left;
  }

  .heroSupport {
    background: transparent !important;
    color: #f5f1df;
    display: block;
    font-family: "Lexend", sans-serif !important;
    font-size: clamp(1.25rem, 2.1vw, 2rem) !important;
    font-weight: 400;
    line-height: 1.3 !important;
    letter-spacing: -0.035em;
    margin: 1.5rem 0 0 !important;
    max-width: 640px;
    padding: 0 !important;
    text-align: left !important;
  }

  .heroText,
  .heroMeta {
    color: #f5f1df;
    margin: 1rem auto 0;
    max-width: 880px;
    text-align: center;
  }

  .heroText {
    color: #c9c7bb;
    font-size: clamp(1rem, 1.45vw, 1.15rem);
    line-height: 1.55;
    margin-left: 0;
    max-width: 760px;
    text-align: left;
  }

  .heroMeta {
    justify-content: flex-start;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-left: 0;
    text-align: left;
  }

  .heroMeta span {
    color: #9a9c90;
    font-family: var(--font-mono);
    font-size: 0.7rem;
  }

  .terminalWindow {
    background: #0e0e0c;
    border: 1px solid color-mix(in srgb, var(--color-accent), transparent 55%);
    border-radius: 18px;
    box-shadow: 0 0 34px color-mix(in srgb, var(--color-accent), transparent 84%);
    margin: clamp(2rem, 6vh, 4rem) 0 0 auto;
    max-width: 820px;
    overflow: hidden;
    text-align: left;
  }

  .terminalChrome {
    align-items: center;
    border-bottom: 1px solid var(--color-card-outline);
    display: flex;
    gap: 0.45rem;
    padding: 0.75rem 1rem;
  }

  .terminalChrome span {
    background: var(--color-accent);
    border-radius: 50%;
    height: 0.72rem;
    opacity: 0.85;
    width: 0.72rem;
  }

  .terminalBody {
    background: transparent;
    border: 0;
    box-shadow: none;
    color: #f5f1df;
    display: block;
    font-family: var(--font-mono);
    font-size: clamp(0.78rem, 2vw, 1rem);
    line-height: 1.6;
    margin: 0;
    max-height: 18rem;
    min-height: 9rem;
    overflow-y: auto;
    padding: 1rem;
  }

  .terminalBody p {
    margin: 0 0 0.35rem;
  }

  .terminalBody a {
    color: var(--color-accent);
    text-decoration: none;
  }

  .terminalBody span {
    color: #a9aaa0;
  }

  .terminalPrompt {
    align-items: center;
    display: flex;
    gap: 0.45rem;
    margin-top: 0.35rem;
  }

  .terminalPrompt label {
    color: var(--color-accent);
  }

  .terminalPrompt input {
    background: transparent;
    border: 0;
    color: var(--color-text);
    flex: 1;
    font: inherit;
    min-width: 0;
    outline: 0;
  }

  .terminalCursor {
    animation: blink 1s steps(2, start) infinite;
    color: var(--color-accent);
  }

  .editorialBand{box-sizing:border-box;padding-bottom:clamp(5rem,10vw,10rem);position:relative}.creamBand{background:#f5f1df;color:#0a0b0a}.darkBand{background:#0a0b0a;color:#f5f1df}

  .sectionTitle {
    color: inherit;
    display: flex;
    flex-wrap: wrap;
    font-family: "Rubik", sans-serif;
    font-size: clamp(2.8rem, 8vw, 7.5rem);
    font-weight: 700;
    gap: 0 0.22em;
    justify-content: flex-start;
    line-height: 0.88;
    margin: auto;
    padding: clamp(4rem, 10vw, 8rem) 0 clamp(2rem, 5vw, 4rem);
    text-align: left;
    text-transform: uppercase;
    width: min(1120px, 92%);
    white-space: normal;
  }

  .sectionWord {
    display: block;
    transform-origin: left bottom;
  }

  #aboutLayout{display:grid;gap:0;margin:auto;width:min(1120px,92%)}.aboutLine{border-top:1px solid #0a0b0a;display:grid;font-size:clamp(1.1rem,2.2vw,1.6rem);grid-template-columns:3rem 1fr;line-height:1.5;margin:0;padding:clamp(1.5rem,3vw,2.7rem) 0}.aboutLine span,.rowNumber{font-family:var(--font-mono);font-size:.7rem}.leadAbout{font-family:"Rubik",sans-serif;font-size:clamp(1.8rem,4vw,3.8rem);font-weight:500;line-height:1.08}
  .experienceList{margin:auto;width:min(1120px,92%)}.experienceRow{border-top:1px solid #4a4b46;display:grid;gap:clamp(1rem,3vw,3rem);grid-template-columns:3rem minmax(240px,.85fr) 1.15fr;padding:clamp(2rem,5vw,4.5rem) 0}.experienceHeading p{color:#90ead6;font-family:var(--font-mono);font-size:.72rem;margin:0}.experienceHeading h2{font-family:"Rubik",sans-serif;font-size:clamp(2rem,4.5vw,4.2rem);line-height:.95;margin:.5rem 0}.experienceHeading h3{color:#ff9bea;font-size:clamp(1rem,1.8vw,1.35rem);margin:0}.experienceRow ul{font-size:clamp(.95rem,1.5vw,1.15rem);line-height:1.55;margin:0;padding-left:1.2rem}.darkBand .rowNumber{color:#90ead6}
  .projectIntro,.projectIndex { margin:0 auto; width:min(1180px,92%); }
  .projectIntro { align-items:flex-end; display:flex; gap:2rem; justify-content:space-between; padding-bottom:2rem; }
  .projectIntro p { font-size:clamp(1rem,1.6vw,1.2rem); line-height:1.5; margin:0; }
  .projectIntro strong { font-weight:500; }
  .projectIntro > span { font-family:var(--font-mono); font-size:.6rem; letter-spacing:.06em; }
  .projectIndex { display:flex; flex-wrap:wrap; gap:.5rem; padding-bottom:2.5rem; }
  .projectIndex a { align-items:center; border:1px solid #0a0b0a40; color:#0a0b0a; display:flex; font-family:var(--font-mono); font-size:.65rem; gap:.75rem; padding:.8rem; transition:background .2s,transform .2s; }
  .projectIndex a span:first-child { opacity:.5; }
  .projectIndex a:hover,.projectIndex a:focus-visible { background:#90ead6; transform:translateY(-3px); }
  .projectShowcase { display:grid; gap:clamp(2rem,5vw,4rem); margin:auto; width:min(1180px,92%); }
  .projectFeature { align-items:center; background:#0a0b0a; border:1px solid #343631; color:#f5f1df; display:grid; gap:clamp(1.5rem,3vw,3rem); grid-template-columns:minmax(0,1.1fr) minmax(0,1fr); padding:clamp(1rem,2.5vw,2rem); position:relative; }
  .projectFeature::before { background:var(--project-accent); content:""; height:4px; left:-1px; position:absolute; top:-1px; width:72px; }
  .projectMedia { aspect-ratio:1.05; background:radial-gradient(ellipse at 50% 40%,#90ead615,transparent 65%),repeating-linear-gradient(0deg,transparent 0 39px,#f5f1df08 39px 40px),repeating-linear-gradient(90deg,transparent 0 39px,#f5f1df08 39px 40px),#111411; border:1px solid #f5f1df24; box-sizing:border-box; overflow:hidden; position:relative; }
  .projectReverse .projectMedia { order:2; }
  .projectOrbit { border:1px solid var(--project-accent); border-radius:50%; height:78%; left:11%; opacity:.35; position:absolute; top:12%; transform:rotate(-25deg) scaleY(.8); width:78%; }
  .projectOrbit::after { border:1px dashed var(--project-accent); border-radius:50%; content:""; inset:-12%; position:absolute; }
  .projectVisualNumber { bottom:1.5rem; color:var(--project-accent); font-family:"Rubik",sans-serif; font-size:clamp(7rem,15vw,13rem); font-weight:700; line-height:1; opacity:.1; position:absolute; right:.5rem; }
  .projectArtwork { border:1px solid #f5f1df35; box-shadow:8px 8px 0 var(--project-accent),0 25px 50px #0008; display:block; inset:18% 18% 18%; position:absolute; transform:rotate(-6deg) translateZ(25px); transition:transform .4s; }
  .projectMedia:hover .projectArtwork,.projectMedia:focus-within .projectArtwork { transform:rotate(0deg) translateZ(35px) scale(1.04); }
  .projectMedia .projectImage { border-radius:0; display:block; height:100%; max-height:none; max-width:none; object-fit:contain; width:100%; }
  .artworkHint { background:#0a0b0a; bottom:0; color:var(--project-accent); font-family:var(--font-mono); font-size:.5rem; left:0; padding:.7rem; position:absolute; right:0; text-align:center; }
  .projectVisualFooter { bottom:1rem; color:#f5f1dfb3; display:flex; font-family:var(--font-mono); font-size:.5rem; gap:1rem; justify-content:space-between; left:1rem; position:absolute; right:1rem; text-transform:uppercase; }
  .projectVisualFooter span:last-child { color:var(--project-accent); }
  .projectCopy { min-width:0; padding:.5rem 0; }
  .projectMeta { align-items:center; border-bottom:1px solid #f5f1df35; color:var(--project-accent); display:flex; font-family:var(--font-mono); font-size:.55rem; gap:.5rem; justify-content:space-between; padding-bottom:1rem; }
  .projectMeta time { color:#f5f1dfb3; white-space:nowrap; }
  .projectTitle { color:#f5f1df; font-family:"Rubik",sans-serif; font-size:clamp(2.5rem,4.6vw,4.5rem); line-height:.96; margin:1.25rem 0; overflow-wrap:anywhere; text-transform:uppercase; }
  .summary { color:#d0cec4; font-size:clamp(1rem,1.4vw,1.1rem); line-height:1.6; margin:0 0 1.5rem; }
  .projectCategories { display:flex; flex-wrap:wrap; gap:.75rem; margin-top:1.25rem; }
  .projectCategories p { color:var(--project-accent); font-family:var(--font-mono); font-size:.6rem; margin:0; text-transform:uppercase; }
  .projectCategories p + p::before { content:"/"; margin-right:.75rem; opacity:.5; }
  .projectTech { display:flex; flex-wrap:wrap; gap:.4rem; list-style:none; margin:0 0 2rem; padding:0; }
  .projectTech li { border:1px solid #f5f1df28; color:#f5f1dfb3; font-family:var(--font-mono); font-size:.58rem; padding:.5rem .6rem; }
  .projectActions { align-items:center; display:flex; flex-wrap:wrap; gap:1.25rem; }
  .projectLink { align-items:center; background:var(--project-accent); color:#0a0b0a; display:inline-flex; font-family:var(--font-mono); font-size:.68rem; gap:1.25rem; padding:1rem; text-transform:uppercase; }
  .projectLink span { color:inherit; }
  .projectSource { color:#f5f1dfb3; font-family:var(--font-mono); font-size:.6rem; padding:.8rem 0; }
  .projectSource:hover { color:var(--project-accent); }
  .projectIndex a:focus-visible,.projectArtwork:focus-visible,.projectActions a:focus-visible { outline:2px solid #ff8068; outline-offset:5px; }
  .recordLink,.certificateCopy a { border-bottom:2px solid currentColor; color:inherit; display:inline-flex; font-family:var(--font-mono); font-size:.78rem; gap:1rem; padding:.5rem 0; text-transform:uppercase; }
  .horizontalAchievements{height:100svh;overflow:hidden;position:relative}.achievementRail{display:flex;height:100%;width:max-content}.achievementPanel{box-sizing:border-box;min-width:100vw;padding:clamp(6rem,9vw,9rem) max(4vw,calc((100vw - 1120px)/2));position:relative}.achievementIntro{display:flex;flex-direction:column;justify-content:center;overflow:hidden}.achievementIntro h1{color:#f5f1df;font-family:"Rubik",sans-serif;font-size:clamp(4.5rem,10vw,9rem);line-height:.76;margin:2rem 0;text-transform:uppercase}.achievementIntro h1 span{color:#ff8068}.sceneLabel,.scrollCue{color:#90ead6;font-family:var(--font-mono);font-size:.72rem;position:relative;z-index:2}.scrollCue{margin-top:2rem}.introRing{border:clamp(1rem,2vw,2rem) solid #90ead6;border-radius:50%;height:clamp(9rem,19vw,18rem);position:absolute;right:10vw;top:18%;transform:rotate(-18deg);width:clamp(9rem,19vw,18rem)}.introSpark,.shapeSpark{height:5rem;position:absolute;width:5rem}.introSpark{bottom:13%;right:29%}.introSpark::before,.introSpark::after,.shapeSpark::before,.shapeSpark::after{background:#ff9bea;content:"";left:50%;position:absolute;top:50%;transform:translate(-50%,-50%)}.introSpark::before,.shapeSpark::before{height:100%;width:18%}.introSpark::after,.shapeSpark::after{height:18%;width:100%}
  .achievementScene{align-items:center;display:grid;gap:clamp(2rem,6vw,7rem);grid-template-columns:minmax(0,1.08fr) minmax(320px,.92fr)}.achievementVisual{height:min(66vh,620px);overflow:hidden;position:relative}.achievementProof{color:#90ead6;font-family:"Rubik",sans-serif;font-size:clamp(5rem,13vw,12rem);left:0;line-height:.8;position:absolute;top:42%;transform:translateY(-50%);white-space:nowrap}.achievementChips{display:flex;flex-direction:column;left:8%;position:absolute;top:14%;transform:rotate(-3deg)}.achievementChip{background:#ff9bea;box-shadow:.55rem .55rem 0 #171714;color:#080807;font-family:"Rubik",sans-serif;font-size:clamp(1rem,2.1vw,2rem);font-weight:600;padding:.55rem 1rem;width:max-content}.achievementChip+ .achievementChip{background:#ff8068;margin-left:4rem;margin-top:-.15rem;transform:rotate(5deg)}.achievementShape{display:block;position:absolute}.shapeRing{border:clamp(.8rem,1.5vw,1.35rem) solid #f5f1df;border-radius:50%;bottom:7%;height:clamp(6rem,12vw,11rem);right:7%;width:clamp(6rem,12vw,11rem)}.shapeSpark{bottom:5%;left:13%;transform:rotate(14deg)}.achievementScene1 .achievementProof{color:#ff9bea}.achievementScene1 .achievementChip{background:#90ead6}.achievementScene1 .achievementChip+ .achievementChip{background:#ff8068}.achievementScene1 .shapeRing{border-color:#ff8068}.achievementScene2 .achievementProof{color:#ff8068}.achievementScene2 .achievementChip{background:#ff9bea}.achievementScene2 .achievementChip+ .achievementChip{background:#90ead6}.achievementScene2 .shapeRing{border-color:#90ead6}
  .achievementCopy{border-left:1px solid #363732;padding-left:clamp(1.5rem,4vw,4rem)}.achievementIndex{align-items:center;display:flex;font-family:var(--font-mono);justify-content:space-between}.achievementIndex span{color:#ff8068;font-size:clamp(2rem,4vw,4rem)}.achievementIndex p{color:#90ead6;font-size:.72rem;text-transform:uppercase}.achievementScene h2{color:#f5f1df;font-family:"Rubik",sans-serif;font-size:clamp(2.5rem,5vw,5rem);line-height:.88;margin:clamp(1.5rem,4vh,3rem) 0 1rem;max-width:720px;text-transform:uppercase}.achievementDetail{font-size:clamp(1rem,1.6vw,1.2rem);line-height:1.5;max-width:620px}.achievementBadge{align-items:center;display:flex;min-height:4rem;margin-top:1.5rem}.recordLink{margin-top:1rem}

  .achievementProof {
    font-size: clamp(4rem, 5.4vw, 7rem);
    left: auto;
    right: 0;
    text-align: right;
  }

  .achievementProof.proofLong {
    font-size: clamp(3.5rem, 4.2vw, 6rem);
  }

  .achievementPanel {
    flex: 0 0 100vw;
    overflow: hidden;
    width: 100vw;
  }

  .achievementLogo {
    aspect-ratio: 220 / 64;
    border-radius: 0;
    display: block;
    height: auto !important;
    object-fit: contain;
    position: static !important;
    scale: 1 !important;
    width: min(12rem, 100%) !important;
  }

  .trophy {
    font-size: 2rem;
  }

  .brandLogo {
    border-radius: 0;
    color: white;
    display: inline-flex;
    font-weight: 900;
    letter-spacing: 0;
    padding: 0.25rem 0.55rem;
  }

  .brandLogo.flipkart {
    background: #2874f0;
  }

  .brandLogo.mariadb {
    background: #003545;
  }

  .certificateList{margin:auto;width:min(1120px,92%)}.certificateItem{align-items:center;border-top:1px solid #0a0b0a;display:grid;gap:clamp(1rem,4vw,4rem);grid-template-columns:3rem minmax(280px,1fr) minmax(240px,.65fr);padding:clamp(2rem,4vw,3.5rem) 0}.certificateCopy h2{color:#0a0b0a;font-family:"Rubik",sans-serif;font-size:clamp(1.8rem,3.6vw,3.5rem);line-height:.95;margin:0 0 .75rem}.certificateCopy p{line-height:1.45;margin:0 0 1rem}.certificateMedia{background:#fff;display:block;overflow:hidden}.certPreview{aspect-ratio:16/10;border-radius:0;height:auto;object-fit:contain;position:static;width:100%}

  @media (max-width: 760px) {
    :global(#welcomeHeader) {
      padding-top: 12.75rem;
    }

    :global(#welcomeHeader) .kineticName {
      font-size: clamp(3.2rem, 17vw, 6.4rem);
      line-height: 1;
    }

    .brand,
    .heroSupport,
    .heroText {
      text-align: left !important;
    }

    .sectionTitle {
      font-size: clamp(2.65rem, 14vw, 4.7rem);
      padding-top: 5rem;
    }

    .terminalWindow {
      border-radius: 14px;
    }

    .achievementScene {
      padding-bottom: 1.5rem;
      padding-top: 10rem;
    }

    .achievementProof {
      left: 0;
      right: auto;
      text-align: left;
    }

    .achievementProof.proofLong {
      font-size: clamp(3.2rem, 15vw, 4.5rem);
    }

    .aboutLine{grid-template-columns:2rem 1fr}.experienceRow{grid-template-columns:2rem 1fr}.experienceRow ul{grid-column:2}.projectFeature{grid-template-columns:1fr}.projectReverse .projectMedia{order:0}.projectTitle{font-size:clamp(2.7rem,13vw,4.2rem)}.achievementPanel{padding-left:1.25rem;padding-right:1.25rem}.achievementIntro h1{font-size:clamp(3.5rem,16vw,5.4rem)}.introRing{opacity:.35;right:-18%;top:18%}.achievementScene{align-content:center;gap:.75rem;grid-template-columns:1fr}.achievementVisual{height:34svh}.achievementProof{font-size:clamp(4.2rem,20vw,6rem);top:52%}.achievementChips{left:2%;top:12%}.achievementChip{font-size:.9rem}.achievementChip+ .achievementChip{margin-left:2rem}.shapeRing{bottom:0;right:2%}.shapeSpark{bottom:2%;left:4%}.achievementCopy{border-left:0;border-top:1px solid #363732;padding-left:0;padding-top:1rem}.achievementIndex span{font-size:1.5rem}.achievementBadge{min-height:2.5rem;margin-top:.5rem}.achievementScene h2{font-size:clamp(2.15rem,10vw,3.4rem);margin:.6rem 0}.achievementDetail{font-size:.9rem;line-height:1.35}.certificateItem{align-items:start;grid-template-columns:2rem 1fr}.certificateMedia{grid-column:2}.certificateCopy h2{font-size:clamp(2rem,10vw,3rem)}
  }

	@media (max-width: 430px) {
		:global(#welcomeHeader) {
			padding-top: 12rem;
		}

    .terminalBody {
      max-height: 14rem;
    }

		.achievementIntro h1 {
			font-size: clamp(3rem, 13vw, 4.4rem);
		}
	}

	@media (max-width: 320px) {
		:global(#welcomeHeader) .kineticName {
			font-size: clamp(3rem, 18vw, 3.6rem);
		}
	}

  @media (min-width: 761px) and (max-width: 1180px) {
    :global(#welcomeHeader) {
      padding-top: 8.75rem;
    }

    .projectFeature{grid-template-columns:1.05fr .95fr}
  }

  @media (prefers-reduced-motion: reduce) {
    .heroLetter {
      opacity: 1 !important;
      transform: none !important;
    }

    .terminalCursor {
      animation: none;
    }

    .horizontalAchievements{height:auto;overflow:visible}.achievementRail{display:grid;height:auto;width:100%}.achievementPanel,.achievementIntro{min-height:80svh;min-width:0}.achievementPanel::after{left:4%;right:4%;top:auto;width:auto}
  }

  @keyframes blink {
    50% { opacity: 0; }
  }

  .heroSpotlight { animation: spotlightIn 1.8s ease-out both; position:absolute; width:110%; height:140%; left:-35%; top:-45%; opacity:.65; pointer-events:none; }
  .heroAvailability { float:right; display:inline-flex; align-items:center; gap:.6rem; color:#f5f1df; font-size:.62rem; font-weight:400; }
  .heroAvailability i { background:#90ead6; width:6px; height:6px; border-radius:50%; box-shadow:0 0 14px #90ead6; }
  .heroActions { align-items:center; display:flex; flex-wrap:wrap; gap:1.5rem; margin-top:1.75rem; }
  .heroActions a { display:inline-flex; align-items:center; gap:2rem; font-family:var(--font-mono); font-size:.75rem; padding:1rem 1.25rem; }
  .heroAction { background:#90ead6; border:1px solid #90ead6; color:#080807; box-shadow:.3rem .3rem 0 #ff9bea; }
  .heroAction:hover,.heroAction:focus-visible { background:#b6ffe8; color:#080807; box-shadow:.45rem .45rem 0 #ff8068; }
  .heroContact { color:#f5f1df; border-bottom:1px solid #f5f1df50; padding-inline:0!important; }
  .heroContact:hover,.heroContact:focus-visible { color:#90ead6; }
  .heroLab { margin-top:3rem; max-width:760px; }
  .heroLab .terminalWindow { box-sizing:border-box; margin:0; max-width:none; width:100%; border-radius:6px; }
  .terminalChrome p { color:#92978c; flex:1; font-family:var(--font-mono); font-size:.6rem; margin:0 0 0 .5rem; }
  .terminalChrome p span { background:none; color:#90ead6; float:right; height:auto; width:auto; }
  .terminalChrome > span:nth-child(1) { background:#ff8068; }
  .terminalChrome > span:nth-child(2) { background:#ff9bea; }
  .heroLab .terminalBody { min-height:12rem; font-size:clamp(.7rem,1vw,.85rem); }
  .heroLab .terminalPrompt input { color:#f5f1df; }
  .heroFootnote { align-items:center; border-top:1px solid #f5f1df25; color:#9a9c90; display:flex; font-family:var(--font-mono); font-size:.6rem; justify-content:space-between; letter-spacing:.05em; margin-top:2rem; padding-top:1.2rem; }
  .heroFootnote a { color:#90ead6; }
  .sectionEyebrow { box-sizing:border-box; font-family:var(--font-mono); font-size:.66rem; letter-spacing:.07em; margin:auto; padding-top:clamp(4rem,8vw,7rem); width:min(1120px,92%); }
  .darkBand .sectionEyebrow { color:#90ead6; }
  .editorialBand .sectionTitle { padding-top:1.5rem; }
  .editorialBand { overflow-x:clip; }
  .experienceRow { position:relative; isolation:isolate; }
  .surfaceGlow { border:1px solid transparent; position:absolute; inset:0; pointer-events:none; opacity:var(--glow,0); transition:opacity .35s; border-image:conic-gradient(from var(--angle,0deg),transparent 0%,#90ead6 15%,#ff9bea 25%,#ff8068 35%,transparent 50%) 1; z-index:-1; }
  .experienceRow::after { content:""; position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse at var(--mx,50%) var(--my,50%),#90ead612,transparent 55%); opacity:var(--glow,0); transition:opacity .35s; z-index:-1; }
  .projectMedia { transform:perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)); transition:transform .25s ease-out,box-shadow .25s; transform-style:preserve-3d; }
  .projectFrameLabel { position:absolute; left:0; right:0; top:0; background:#111411; color:var(--project-accent); display:flex; align-items:center; justify-content:space-between; padding:.8rem 1rem; font-family:var(--font-mono); font-size:.55rem; letter-spacing:.05em; z-index:2; }
  .frameDots { color:#f5f1df65; font-size:.45rem; letter-spacing:.2em; }
  .projectGlare { position:absolute; inset:0; z-index:3; pointer-events:none; background:radial-gradient(circle at var(--mx,50%) var(--my,50%),#f5f1df,transparent 65%); opacity:var(--shine,0); transition:opacity .3s; }
  .projectLink span { display:inline-block; transition:transform .2s; }
  .projectLink:hover span { transform:translate(4px,-4px); }
  .certificateItem { transition:border-color .3s; }
  .certificateItem:hover { border-color:#176d5d; }
  @keyframes spotlightIn { from { opacity:0; transform:translate(-12%,-12%) scale(.8); } to { opacity:.65; transform:none; } }
  @media(max-width:760px) {
    .projectIntro { align-items:flex-start; flex-direction:column; gap:1rem; }
    .projectIndex { gap:.4rem; }
    .projectIndex a { font-size:.58rem; gap:.5rem; padding:.7rem; }
    .projectMedia { aspect-ratio:1.15; }
    .projectFeature { gap:1.75rem; }
    .projectTitle { font-size:clamp(2.3rem,11vw,3.5rem); }
    .projectCopy { padding:.5rem; }
    .heroAvailability { display:none; }
    .heroActions { gap:1rem; }
    .heroActions a { font-size:.65rem; gap:.8rem; padding:.9rem; }
    .heroFootnote { font-size:.48rem; gap:1rem; }
    .heroSpotlight { width:180%; left:-70%; }
  }
  @media(prefers-reduced-motion:reduce) { .heroSpotlight { animation:none; } .projectMedia,.projectArtwork,.projectIndex a,.projectGlare,.projectLink span,.surfaceGlow,.experienceRow::after { transition:none; } .projectMedia { transform:none; } }

  @media (min-width: 1024px) {
    .sectionTitle { padding-left: 0; padding-right: 0; }
  }
</style>
