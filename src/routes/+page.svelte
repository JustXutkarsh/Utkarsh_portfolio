<script>
  import { onDestroy, onMount, tick } from "svelte";
  import { fetchHomeData, projectImage } from "$lib/logic/data.js";
  import { formatDateTime } from "$lib/logic/formatter";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  let content;
  let projects = [];
  let metrics = [];
  let milestones = [];
  let terminalRows = [];
  let terminalLiveText = "";
  let terminalReady = false;
  let terminalInput = "";
  let terminalInputEl;
  let cleanup = [];

  const MAX_CATEGORIES = 2;
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
  const getMetrics = (achievements = []) => achievements.flatMap((item) => (item.metrics || []).map((metric) => ({ ...metric, source: item.title })));
  const getMilestones = (achievements = []) => achievements
    .filter((item) => item.milestoneTitle || item.milestoneDetail)
    .map((item) => ({ date: item.milestoneDate, title: item.milestoneTitle || item.title, detail: item.milestoneDetail || item.detail }))
    .sort((a, b) => Date.parse(`1 ${b.date}`) - Date.parse(`1 ${a.date}`));
  const formatMetric = (value, precision = 0, suffix = "") => {
    const number = Number(value || 0);
    const formatted = number.toLocaleString("en-US", {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
    return `${formatted}${suffix || ""}`;
  };

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
        tick().then(() => terminalInputEl?.focus());
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
    tick().then(() => terminalInputEl?.focus());
  }

  function setupMotion(reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".heroReveal", {
      autoAlpha: 0,
      y: reducedMotion ? 0 : 18,
      duration: reducedMotion ? 0.01 : 0.5,
      stagger: reducedMotion ? 0 : 0.08,
      ease: "power2.out",
    });

    gsap.utils.toArray(".revealSection").forEach((section) => {
      gsap.from(section, {
        autoAlpha: 0,
        y: reducedMotion ? 0 : 24,
        duration: reducedMotion ? 0.01 : 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 82%", once: true },
      });
    });

    gsap.utils.toArray(".statNumber").forEach((node) => {
      const target = Number(node.dataset.value || 0);
      const precision = Number(node.dataset.precision || 0);
      const suffix = node.dataset.suffix || "";
      ScrollTrigger.create({
        trigger: node,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const state = { value: 0 };
          gsap.to(state, {
            value: target,
            duration: reducedMotion ? 0.01 : 1.1,
            ease: "power2.out",
            onUpdate: () => node.textContent = formatMetric(state.value, precision, suffix),
            onComplete: () => node.textContent = formatMetric(target, precision, suffix),
          });
        },
      });
    });

    const line = document.querySelector(".timelineProgress");
    if (line) {
      gsap.fromTo(line, { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".timeline", start: "top 75%", end: "bottom 35%", scrub: reducedMotion ? false : true },
      });
    }

    gsap.utils.toArray(".timelineItem").forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: "top 72%",
        once: true,
        onEnter: () => item.classList.add("isActive"),
      });
    });
    ScrollTrigger.refresh();
  }

  function setupProjectTilt(reducedMotion) {
    if (reducedMotion) return;
    gsap.utils.toArray(".projectCard").forEach((card) => {
      const move = (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, { rotateY: x * 12, rotateX: y * -12, transformPerspective: 900, duration: 0.25, ease: "power2.out" });
      };
      const leave = () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.35, ease: "power2.out" });
      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);
      cleanup.push(() => {
        card.removeEventListener("mousemove", move);
        card.removeEventListener("mouseleave", leave);
      });
    });
  }

  function animateIn(e) {
    const info = e.currentTarget.querySelector(".info");
    const img = e.currentTarget.querySelector("#mainImage");
    gsap.to(info, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
    gsap.to(img, { filter: "blur(10px)", duration: 0.3, ease: "power2.out" });
  }

  function animateOut(e) {
    const info = e.currentTarget.querySelector(".info");
    const img = e.currentTarget.querySelector("#mainImage");
    gsap.to(info, { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.out" });
    gsap.to(img, { filter: "blur(0px)", duration: 0.3, ease: "power2.out" });
  }

  onMount(async () => {
    content = await fetchHomeData();
    metrics = getMetrics(content.achievements);
    milestones = getMilestones(content.achievements);
    projects = [...(content.projects || [])].sort((a, b) => {
      if ((b.featured === true) !== (a.featured === true)) return (b.featured === true) - (a.featured === true);
      return new Date(b.created) - new Date(a.created);
    });
    await tick();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    startTerminal(reducedMotion);
    setupMotion(reducedMotion);
    setupProjectTilt(reducedMotion);
  });

  onDestroy(() => cleanup.forEach((fn) => fn()));
</script>

<svelte:head>
  <title>Utkarsh Pandey | AI Engineer</title>
</svelte:head>

{#if content}
  <div id="content">
    <PageHeader id="welcomeHeader">
      <div class="headerContent">
        <p class="brand">{content.hero.brand}</p>
        <h1 class="emphasis heroReveal">{content.hero.name}</h1>
        <h2 class="emphasis heroReveal">{content.hero.title}</h2>
        <p class="heroText heroReveal">{content.hero.subtitle}</p>
        <div class="heroMeta heroReveal">
          <span>{content.hero.location}</span>
        </div>
        <div class="terminalWindow heroReveal" aria-label="AI engineering terminal signature">
          <div class="terminalChrome"><span></span><span></span><span></span></div>
          <div class="terminalBody" role="button" tabindex="0" on:click={() => terminalInputEl?.focus()} on:keydown={(event) => {
            if (event.key === "Enter" || event.key === " ") terminalInputEl?.focus();
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
    </PageHeader>

    <section id="statsSection" class="revealSection">
      <div class="statsGrid">
        {#each metrics as metric}
          <Card className="textCard statCard noBounce instantShow">
            <p class="metricLabel">{metric.label}</p>
            <p class="statNumber" data-value={metric.value} data-precision={metric.precision || 0} data-suffix={metric.suffix || ""}>
              {formatMetric(0, metric.precision || 0, metric.suffix)}
            </p>
          </Card>
        {/each}
      </div>
    </section>

    <section id="aboutSection" class="revealSection">
      <h1 class="sectionTitle">- AI systems, end to end -</h1>
      <Card hasSlug={false} className="aboutCard noBounce instantShow">
        <div id="aboutLayout">
          {#each aboutText(content.about) as paragraph}
            <p>{paragraph}</p>
          {/each}
        </div>
      </Card>
    </section>

    <section id="experienceSection" class="revealSection">
      <h1 class="sectionTitle">- Engineering experience -</h1>
      <div class="sectionGrid">
        {#each content.experience as item}
          <Card className="textCard noBounce instantShow">
            <p class="eyebrow">{item.period}</p>
            <h2>{item.role}</h2>
            <h3>{item.company}</h3>
            <ul>
              {#each item.points || [] as point}
                <li>{point}</li>
              {/each}
            </ul>
          </Card>
        {/each}
      </div>
    </section>

    <section id="projectsSection" class="revealSection">
      <h1 class="sectionTitle">- Featured AI projects -</h1>
      <div class="flexCards">
        {#each projects.filter((post) => post.homepage) as post}
          <Card id={post.slug.current} className="projectCard noBounce instantShow">
            <div class="imageArea" on:mouseenter={animateIn} on:mouseleave={animateOut} role="button" tabindex="0">
              <img id="mainImage" loading="lazy" fetchpriority="low" src={projectImage(post)} alt={post.mainImage?.alt || post.title} />
              <div class="info">
                <div class="infoContent">
                  <div>
                    <p id="date">{formatDateTime(post.created)}</p>
                    <div id="postCategories">
                      {#if post.featured}<div><p id="featured">Featured</p></div>{/if}
                      {#each getCategories(post).visible as category}<div><p>{category.title}</p></div>{/each}
                      {#if getCategories(post).hiddenCount > 0}<div><p>+{getCategories(post).hiddenCount}</p></div>{/if}
                    </div>
                    <h1 class="projectTitle">{post.title}</h1>
                    <p class="summary">{post.summary}</p>
                  </div>
                  <Button id="readmore" slug={post.slug.current} text="Read More" />
                </div>
              </div>
            </div>
          </Card>
        {/each}
      </div>
    </section>

    <section id="skillsSection" class="revealSection">
      <h1 class="sectionTitle">- AI capability stack -</h1>
      <div class="sectionGrid">
        {#each skillsAsEntries(content.skills) as [group, skills]}
          <Card className="textCard skillCard noBounce instantShow">
            <h2>{group}</h2>
            <div class="skillList">
              {#each skills as skill}
                <span>{skill}</span>
              {/each}
            </div>
          </Card>
        {/each}
      </div>
    </section>

    <section id="timelineSection" class="revealSection">
      <h1 class="sectionTitle">- Milestone timeline -</h1>
      <div class="timeline">
        <div class="timelineTrack"><div class="timelineProgress"></div></div>
        {#each milestones as milestone}
          <article class="timelineItem">
            <span class="timelineDot"></span>
            <p class="metricLabel">{milestone.date}</p>
            <h2>{milestone.title}</h2>
            <p>{milestone.detail}</p>
          </article>
        {/each}
      </div>
    </section>

    <section id="achievementsSection" class="revealSection">
      <h1 class="sectionTitle">- Achievements -</h1>
      <div class="sectionGrid achievementGrid">
          {#each content.achievements as achievement}
            <Card className="textCard achievementCard noBounce instantShow">
            <div class="achievementBadge">
              {#if achievement.logoPath}
                <img class="achievementLogo" src={achievement.logoPath} alt={`${achievement.logo} logo`} loading="lazy" />
              {:else if achievement.logo}
                <span class={`brandLogo ${achievement.logo.toLowerCase()}`}>{achievement.logo}</span>
              {:else if achievement.icon}
                <span class="trophy">{achievement.icon}</span>
              {/if}
            </div>
            <h2>{achievement.title || achievement}</h2>
            {#if achievement.detail}
              <p>{achievement.detail}</p>
            {/if}
            {#if achievement.href}
              <a class="certLink" href={achievement.href} target="_blank" rel="noopener noreferrer">{achievement.hrefLabel || "View Details"}</a>
            {/if}
          </Card>
          {/each}
      </div>
    </section>

    <section id="certificationsSection" class="revealSection">
      <h1 class="sectionTitle">- Certifications -</h1>
      <div class="sectionGrid">
        {#each content.certifications || [] as certificate}
          <Card className="textCard certCard noBounce instantShow">
            {#if certificate.image}
              <a href={certificate.href} target="_blank" rel="noopener noreferrer">
                <img class="certPreview" src={certificate.image} alt={certificate.title} loading="lazy" />
              </a>
            {/if}
            <h2>{certificate.title}</h2>
            <p>{certificate.issuer}</p>
            <a class="certLink" href={certificate.href} target="_blank" rel="noopener noreferrer">View Certificate</a>
          </Card>
        {/each}
        </div>
    </section>
  </div>
{/if}

<style>
  :global(#welcomeHeader) {
    box-sizing: border-box;
    height: auto;
    min-height: 100svh;
    padding: clamp(7rem, 12vh, 9rem) 0 clamp(3rem, 7vh, 5rem);
  }

  :global(#welcomeHeader .headerContent) {
    margin: auto;
    width: min(1180px, 92%);
  }

  .brand {
    color: var(--color-secondary);
    font-size: 1rem;
    font-weight: 900;
    letter-spacing: 0;
    margin: 0 0 0.6rem;
    text-align: center;
  }

  :global(#welcomeHeader h1) {
    font-size: clamp(4rem, 9vw, 8.5rem);
    line-height: 0.95;
    margin: 0;
    text-align: left;
  }

  :global(#welcomeHeader h2) {
    display: inline-block;
    font-size: clamp(1.35rem, 3vw, 2.75rem);
    line-height: 1.12;
    margin: clamp(1.4rem, 4vh, 2.4rem) 0 0;
    max-width: min(100%, 980px);
  }

  .heroText,
  .heroMeta {
    margin: 1rem auto 0;
    max-width: 880px;
    text-align: center;
  }

  .heroText {
    color: var(--color-text);
    font-size: clamp(1rem, 2vw, 1.35rem);
    line-height: 1.6;
  }

  .heroMeta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
  }

  .heroMeta span,
  .skillList span {
    background: var(--color-card);
    border: 1px solid var(--color-card-outline);
    border-radius: 999px;
    padding: 0.55rem 0.75rem;
  }

  .terminalWindow {
    background: color-mix(in srgb, var(--color-background), black 18%);
    border: 1px solid color-mix(in srgb, var(--color-accent), transparent 55%);
    border-radius: 18px;
    box-shadow: 0 0 34px color-mix(in srgb, var(--color-accent), transparent 84%);
    margin: clamp(1.5rem, 5vh, 3rem) auto 0;
    max-width: 760px;
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
    color: var(--color-text);
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
    color: var(--alt-text);
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

  .statsGrid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    margin: auto;
    width: min(1100px, 92%);
  }

  :global(.statCard) {
    padding: 1.1rem;
  }

  .metricLabel {
    color: var(--alt-text);
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0;
    margin: 0;
    text-transform: uppercase;
  }

  .statNumber {
    color: var(--color-accent);
    font-family: var(--font-mono);
    font-size: clamp(1.75rem, 4vw, 2.8rem);
    font-weight: 800;
    line-height: 1;
    margin: 0.75rem 0 0;
  }

  #aboutLayout,
  :global(.textCard) {
    font-size: 1.05rem;
    line-height: 1.7;
  }

  :global(.textCard) {
    aspect-ratio: unset;
    min-height: 0;
  }

  :global(.textCard h2),
  :global(.textCard h3) {
    margin: 0.2rem 0;
  }

  .eyebrow {
    color: var(--color-primary);
    font-weight: 900;
    margin: 0;
  }

  .sectionGrid {
    display: grid;
    gap: 1.4rem;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
    margin: auto;
    width: min(1100px, 92%);
  }

  .sectionTitle {
    font-family: "Althite";
    font-size: 2rem;
    margin: auto;
    padding: 20px;
    text-align: center;
    white-space: normal;
  }

  .imageArea {
    container-type: inline-size;
    aspect-ratio: 16 / 11;
    height: auto;
    width: 100%;
  }

  :global(.projectCard) {
    aspect-ratio: unset;
    box-sizing: border-box;
    min-height: 0;
    outline-color: color-mix(in srgb, var(--color-card-outline), var(--color-accent) 18%);
    transform-style: preserve-3d;
    transition: box-shadow 180ms ease, outline-color 180ms ease;
    will-change: transform;
  }

  :global(.projectCard:hover) {
    box-shadow: 0 0 34px color-mix(in srgb, var(--color-accent), transparent 78%);
    outline-color: var(--color-accent);
  }

  #mainImage {
    width: 100%;
  }

  .info {
    align-items: center;
    background: linear-gradient(to bottom, var(--color-hovercard) 35%, transparent);
    border-radius: 20px;
    height: 92%;
    justify-content: center;
    left: 0;
    opacity: 0;
    overflow: hidden;
    padding: 4%;
    position: absolute;
    scale: 0.95;
    text-align: center;
    top: 0;
    width: 92%;
    z-index: 3;
  }

  .infoContent {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    scale: 0.9;
    width: 100%;
  }

  .projectTitle {
    font-size: 14cqw;
    margin: 0;
    text-align: left;
    width: 100%;
    word-wrap: break-word;
  }

  .summary {
    font-size: 4cqw;
    text-align: left;
  }

  .skillList {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
  }

  .achievementGrid {
    align-items: stretch;
  }

  :global(.achievementCard),
  :global(.certCard) {
    overflow: hidden;
  }

  .achievementBadge {
    min-height: 2rem;
  }

  .achievementLogo {
    aspect-ratio: 220 / 64;
    border-radius: 8px;
    display: block;
    height: auto !important;
    object-fit: contain;
    position: static !important;
    scale: 1 !important;
    width: min(10rem, 100%) !important;
  }

  .trophy {
    font-size: 2rem;
  }

  .brandLogo {
    border-radius: 6px;
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

  .timeline {
    margin: auto;
    max-width: 900px;
    position: relative;
    width: min(92%, 900px);
  }

  .timelineTrack {
    background: var(--color-card-outline);
    bottom: 1rem;
    left: 0.45rem;
    position: absolute;
    top: 1rem;
    width: 2px;
  }

  .timelineProgress {
    background: var(--color-accent);
    height: 100%;
    transform-origin: top;
    width: 100%;
  }

  .timelineItem {
    margin-left: 2.4rem;
    padding: 0 0 2rem;
    position: relative;
  }

  .timelineDot {
    background: var(--color-card);
    border: 2px solid var(--color-card-outline);
    border-radius: 50%;
    height: 0.9rem;
    left: -2.4rem;
    position: absolute;
    top: 0.25rem;
    transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
    width: 0.9rem;
  }

  :global(.timelineItem.isActive) .timelineDot {
    background: var(--color-accent);
    border-color: var(--color-accent);
    box-shadow: 0 0 20px color-mix(in srgb, var(--color-accent), transparent 35%);
  }

  .timelineItem h2 {
    margin: 0.25rem 0;
  }

  .timelineItem p:last-child {
    margin: 0;
  }

  .certPreview {
    aspect-ratio: 16 / 10;
    border-radius: 10px;
    height: auto;
    object-fit: cover;
    position: static;
    width: 100%;
  }

  .certLink {
    display: inline-block;
    margin-top: 0.5rem;
  }

  @media (max-width: 760px) {
    :global(#welcomeHeader) {
      padding-top: 12.75rem;
    }

    :global(#welcomeHeader h1),
    :global(#welcomeHeader h2) {
      text-align: center;
    }

    :global(#welcomeHeader h1) {
      font-size: clamp(3.4rem, 16vw, 5.6rem);
    }

    :global(#welcomeHeader h2) {
      font-size: clamp(1.2rem, 7vw, 1.75rem);
    }

    .terminalWindow {
      border-radius: 14px;
    }

    .statsGrid,
    .sectionGrid {
      grid-template-columns: 1fr;
    }

    .projectTitle {
      font-size: clamp(2rem, 13cqw, 3.4rem);
    }
  }

  @media (max-width: 430px) {
    :global(#welcomeHeader) {
      padding-top: 14rem;
    }

    .terminalBody {
      max-height: 14rem;
    }
  }

  @media (min-width: 761px) and (max-width: 1180px) {
    :global(#welcomeHeader) {
      padding-top: 8.75rem;
    }

    .sectionGrid,
    .statsGrid {
      width: min(94%, 1100px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .terminalCursor {
      animation: none;
    }

    :global(.projectCard) {
      transform: none !important;
      transition: none;
    }
  }

  @keyframes blink {
    50% { opacity: 0; }
  }

  @media (min-width: 1024px) {
    .sectionTitle {
      font-size: 4rem;
      padding: 40px;
    }
  }
</style>
