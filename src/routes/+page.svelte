<script>
  import { onDestroy, onMount, tick } from "svelte";
  import { fetchHomeData, projectImage } from "$lib/logic/data.js";
  import KineticStory from "$lib/components/KineticStory.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import gsap from "gsap";
  import { MorphSVGPlugin } from "gsap/MorphSVGPlugin.js";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  let content;
  let projects = [];
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
    gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);
    if (reducedMotion) return;

    motionContext = gsap.context(() => {
      const hero = gsap.timeline({ delay: heroDelay, defaults: { ease: "power4.out" } });
      const nameWave = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.15 });
      const morphTimeline = gsap.timeline({
        paused: true,
        repeat: -1,
        defaults: { duration: 1.35, ease: "expo.inOut" },
      });
      ["#heroSpeech", "#heroRocket", "#heroLightning", "#heroGrid", "#heroBulb", "#heroCoilTarget"].forEach((target) => {
        morphTimeline.to("#heroMorph", { morphSVG: target });
      });
      nameWave
        .to(".heroLetter", {
          yPercent: -10,
          rotate: (index) => index % 2 ? 4 : -4,
          duration: 0.38,
          stagger: 0.045,
          ease: "power2.out",
        })
        .to(".heroLetter", {
          yPercent: 0,
          rotate: 0,
          duration: 0.42,
          stagger: 0.045,
          ease: "power2.inOut",
        }, "-=0.22");
      hero
        .from(".heroLetter", { autoAlpha: 0, yPercent: 125, rotate: 7, duration: 0.85, stagger: 0.045 })
        .from(".heroKicker", { autoAlpha: 0, y: 18, duration: 0.55 }, 0.2)
        .from(".heroSupport", { autoAlpha: 0, y: 34, duration: 0.8 }, 0.48)
        .from(".heroText, .heroMeta", { autoAlpha: 0, y: 22, duration: 0.65, stagger: 0.08 }, 0.62)
        .from(".terminalWindow", { autoAlpha: 0, y: 42, scale: 0.97, duration: 0.85 }, 0.72)
        .from(".heroShape", { autoAlpha: 0, scale: 0, rotate: -90, duration: 0.8, stagger: 0.12 }, 0.28)
        .from(".heroCoil", { autoAlpha: 0, scale: 0.75, rotate: -12, duration: 0.65 }, 0.18)
        .to("#heroMorph", { strokeDashoffset: 0, duration: 1.15, ease: "power2.inOut" }, 0.28)
        .from(".heroSignalBar", { autoAlpha: 0, scaleX: 0, duration: 0.5, stagger: 0.08 }, 0.58)
        .call(() => {
          nameWave.play(0);
          morphTimeline.play(0);
        });

      gsap.to(".heroCoil", { y: 12, rotate: 4, duration: 2.8, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".heroSignalBar", { x: (index) => index % 2 ? 8 : -8, duration: 1.4, ease: "sine.inOut", repeat: -1, stagger: 0.14, yoyo: true });

      gsap.to(".heroWordMask:first-child .heroWord", {
        xPercent: -12,
        scrollTrigger: { trigger: "#welcomeHeader", start: "top top", end: "bottom top", scrub: 0.7 },
      });
      gsap.to(".heroWordMask:last-child .heroWord", {
        xPercent: 12,
        scrollTrigger: { trigger: "#welcomeHeader", start: "top top", end: "bottom top", scrub: 0.7 },
      });

      gsap.utils.toArray(".revealSection").forEach((section) => {
        const titleWords = section.querySelectorAll(".sectionWord");
        const revealItems = section.querySelectorAll(".experienceRow, .projectFeature, .certificateItem, .aboutLine");
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

      gsap.utils.toArray(".projectFeature .projectImage").forEach((image) => {
        gsap.from(image, {
          autoAlpha: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: image, start: "top 88%", once: true },
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
        <p class="brand heroKicker">{content.hero.brand} · AI ENGINEER</p>
        <h1 class="kineticName" aria-label={content.hero.name}>
          {#each words(content.hero.name) as word}
            <span class="heroWordMask"><span class="heroWord">{#each Array.from(word) as letter}<span class="heroLetter">{letter}</span>{/each}</span></span>
          {/each}
        </h1>
        <span class="heroShape heroShapeOne" aria-hidden="true"></span>
        <span class="heroShape heroShapeTwo" aria-hidden="true"></span>
        <span class="heroCoil" aria-hidden="true">
          <svg viewBox="0 0 100 220" role="presentation">
            <defs>
              <linearGradient id="heroCoilGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#90ead6" />
                <stop offset="0.52" stop-color="#ff9bea" />
                <stop offset="1" stop-color="#ff8068" />
              </linearGradient>
            </defs>
            <g class="heroMorphTargets">
              <path id="heroCoilTarget" d="M54 9C20 18 21 43 55 49C88 55 88 79 54 86C21 93 22 119 58 127C91 135 89 159 57 171C34 180 39 199 58 208" />
              <path id="heroSpeech" d="M15 45Q15 20 40 20H80Q105 20 105 45V120Q105 145 80 145H58L30 185V145H40Q15 145 15 120Z" />
              <path id="heroRocket" d="M58 12C82 34 92 68 87 108L100 132L78 126L69 166H47L38 126L16 132L28 108C23 68 34 34 58 12ZM58 62A13 13 0 1 0 58 88A13 13 0 1 0 58 62ZM48 176L58 208L68 176Z" />
              <path id="heroLightning" d="M70 10L24 112H56L44 205L98 87H66Z" />
              <path id="heroGrid" d="M14 24H48V78H14ZM68 24H102V78H68ZM14 98H48V152H14ZM68 98H102V152H68ZM38 172H78V206H38Z" />
              <path id="heroBulb" d="M58 12C27 12 10 35 10 65C10 88 23 102 38 116V145H78V116C93 102 106 88 106 65C106 35 89 12 58 12ZM39 163H77M43 181H73M49 199H67" />
            </g>
            <use class="heroCoilGlow" href="#heroMorph" />
            <path id="heroMorph" class="heroMorphPath" pathLength="1" d="M54 9C20 18 21 43 55 49C88 55 88 79 54 86C21 93 22 119 58 127C91 135 89 159 57 171C34 180 39 199 58 208" />
          </svg>
        </span>
        <span class="heroSignal" aria-hidden="true"><i class="heroSignalBar"></i><i class="heroSignalBar"></i><i class="heroSignalBar"></i></span>
        <h2 class="heroSupport">{content.hero.title}</h2>
        <p class="heroText">{content.hero.subtitle}</p>
        <div class="heroMeta">
          <span>{content.hero.location}</span>
        </div>
        <div class="terminalWindow" aria-label="AI engineering terminal signature">
          <div class="terminalChrome"><span></span><span></span><span></span></div>
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
    </PageHeader>

    <KineticStory skills={skillsAsEntries(content.skills).flatMap(([, items]) => items)} />

    <section id="aboutSection" class="revealSection editorialBand creamBand">
      <h1 class="sectionTitle" aria-label="AI systems, end to end">{#each words("AI systems, end to end") as word}<span class="sectionWordMask"><span class="sectionWord">{word}</span></span>{/each}</h1>
      <div id="aboutLayout">
        {#each aboutText(content.about) as paragraph, index}
          <p class:leadAbout={index === 0} class="aboutLine"><span>0{index + 1}</span>{paragraph}</p>
        {/each}
      </div>
    </section>

    <section id="experienceSection" class="revealSection editorialBand darkBand">
      <h1 class="sectionTitle" aria-label="Engineering experience">{#each words("Engineering experience") as word}<span class="sectionWordMask"><span class="sectionWord">{word}</span></span>{/each}</h1>
      <div class="experienceList">
        {#each content.experience as item, index}
          <article class="experienceRow">
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
      <h1 class="sectionTitle" aria-label="Featured AI projects">{#each words("Featured AI projects") as word}<span class="sectionWordMask"><span class="sectionWord">{word}</span></span>{/each}</h1>
      <div class="projectShowcase">
        {#each projects.filter((post) => post.homepage) as post, index}
          <article id={post.slug.current} class:projectReverse={index % 2 === 1} class="projectFeature">
            <div class="projectMedia">
              <img class="projectImage" loading="lazy" fetchpriority="low" src={projectImage(post)} alt={post.mainImage?.alt || post.title} />
            </div>
            <div class="projectCopy">
              <div class="projectMeta"><span>0{index + 1}</span><time>{formatMonthYear(post.created)}</time></div>
              <div id="postCategories">
                {#if post.featured}<p id="featured">Featured</p>{/if}
                {#each getCategories(post).visible as category}<p>{category.title}</p>{/each}
                {#if getCategories(post).hiddenCount > 0}<p>+{getCategories(post).hiddenCount}</p>{/if}
              </div>
              <h2 class="projectTitle">{post.title}</h2>
              <p class="summary">{post.summary}</p>
              <a class="projectLink" href={`/projects/${post.slug.current}`} data-sveltekit-reload>Explore project <span>↗</span></a>
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

  :global(#welcomeHeader h1) {
    color: #f5f1df;
    font-family: "Rubik", sans-serif;
    font-size: clamp(5rem, 13.5vw, 12.5rem);
    font-weight: 700;
    line-height: 0.76;
    margin: 0;
    text-transform: none;
  }

  .kineticName {
    display: grid;
    gap: 0.18em;
    position: relative;
    z-index: 1;
  }

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
    margin-left: auto;
    text-align: right;
  }

  .heroSupport {
    background: transparent !important;
    color: #f5f1df;
    display: block;
    font-family: "Rubik", sans-serif !important;
    font-size: clamp(1.3rem, 3vw, 2.6rem) !important;
    font-weight: 500;
    line-height: 1.08 !important;
    margin: clamp(2rem, 5vh, 3.5rem) 0 0 !important;
    max-width: 780px;
    padding: 0 !important;
    text-align: left !important;
  }

  .heroShape {
    display: block;
    pointer-events: none;
    position: absolute;
    z-index: 2;
  }

  .heroShapeOne {
    background: transparent;
    border: clamp(0.45rem, 1vw, 0.9rem) solid var(--color-accent);
    border-radius: 50%;
    box-sizing: border-box;
    height: clamp(2.5rem, 6vw, 5.5rem);
    right: 7%;
    top: 31%;
    width: clamp(2.5rem, 6vw, 5.5rem);
  }

  .heroShapeTwo {
    background: #ff7f67;
    height: clamp(1rem, 2.6vw, 2.3rem);
    left: 45%;
    rotate: 45deg;
    top: 18%;
    width: clamp(1rem, 2.6vw, 2.3rem);
  }

  .heroCoil {
    display: block;
    height: clamp(5.5rem, 11vw, 10rem);
    left: 26%;
    pointer-events: none;
    position: absolute;
    top: 10%;
    transform-origin: center;
    width: clamp(2.8rem, 5.5vw, 5rem);
    z-index: 2;
  }

  .heroCoil svg {
    display: block;
    height: 100%;
    overflow: visible;
    width: 100%;
  }

  .heroMorphTargets {
    display: none;
  }

  .heroCoilGlow,
  .heroMorphPath {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .heroCoilGlow {
    filter: blur(8px);
    opacity: 0.38;
    stroke: #ff9bea;
    stroke-width: 20;
  }

  .heroMorphPath {
    stroke: url(#heroCoilGradient);
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    stroke-width: 15;
  }

  .heroSignal {
    bottom: 34%;
    display: grid;
    gap: 0.35rem;
    pointer-events: none;
    position: absolute;
    right: 18%;
    rotate: 12deg;
    z-index: 2;
  }

  .heroSignalBar {
    background: linear-gradient(90deg, #90ead6, #ff9bea);
    border-radius: 999px;
    display: block;
    height: clamp(0.55rem, 1.2vw, 1rem);
    transform-origin: center;
    width: clamp(2.6rem, 5vw, 4.5rem);
  }

  .heroSignalBar:nth-child(2) { margin-left: 1rem; width: clamp(3.5rem, 6.5vw, 5.8rem); }
  .heroSignalBar:nth-child(3) { margin-left: 0.35rem; }

  .heroText,
  .heroMeta {
    color: #f5f1df;
    margin: 1rem auto 0;
    max-width: 880px;
    text-align: center;
  }

  .heroText {
    color: #c9c7bb;
    font-size: clamp(1rem, 2vw, 1.35rem);
    line-height: 1.6;
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
    background: var(--color-card);
    border: 1px solid var(--color-card-outline);
    border-radius: 999px;
    padding: 0.55rem 0.75rem;
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
  .projectShowcase{display:grid;gap:clamp(6rem,12vw,12rem);margin:auto;width:min(1180px,92%)}.projectFeature{align-items:center;display:grid;gap:clamp(2rem,5vw,5rem);grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr)}.projectReverse .projectMedia{box-shadow:-.55rem .55rem 0 #ff9bea;order:2}.projectMedia{--media-pad:clamp(.45rem,1vw,.9rem);aspect-ratio:16/10;background:#0c1320;border:1px solid #0a0b0a;box-shadow:.55rem .55rem 0 #90ead6;box-sizing:border-box;overflow:hidden;position:relative}.projectMedia .projectImage{border-radius:0;display:block;height:calc(100% - (var(--media-pad) * 2));inset:var(--media-pad);max-height:none;max-width:none;object-fit:contain;object-position:center;position:absolute;width:calc(100% - (var(--media-pad) * 2))}.projectMeta{align-items:center;border-bottom:1px solid #0a0b0a;display:flex;font-family:var(--font-mono);font-size:.7rem;justify-content:space-between;padding-bottom:.8rem}.projectTitle{color:#0a0b0a;font-family:"Rubik",sans-serif;font-size:clamp(2.8rem,6vw,6rem);line-height:.86;margin:1.2rem 0;text-transform:uppercase}.summary{font-size:clamp(1rem,1.6vw,1.2rem);line-height:1.5;margin:0 0 2rem}.projectLink,.recordLink,.certificateCopy a{border-bottom:2px solid currentColor;color:inherit;display:inline-flex;font-family:var(--font-mono);font-size:.78rem;gap:1rem;padding:.5rem 0;text-transform:uppercase}.projectLink span{color:#ff6f59}.projectCopy #postCategories{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:1rem;width:auto}.projectCopy #postCategories p{background:#0a0b0a;color:#f5f1df;font-family:var(--font-mono);font-size:.65rem;margin:0;padding:.4rem .55rem;text-transform:uppercase}.projectCopy #postCategories #featured{background:#ff8068!important;color:#0a0b0a}
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

    :global(#welcomeHeader h1) {
      font-size: clamp(3.8rem, 19vw, 6.4rem);
      line-height: 0.82;
    }

    .brand,
    .heroSupport,
    .heroText {
      text-align: left !important;
    }

    .heroShapeOne {
      right: 2%;
      top: 28%;
    }

    .heroShapeTwo {
      left: 55%;
      top: 15%;
    }

    .heroCoil {
      left: auto;
      right: 5%;
      top: 16%;
    }

    .heroSignal {
      bottom: 44%;
      right: 6%;
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
			padding-top: 14rem;
		}

    .terminalBody {
      max-height: 14rem;
    }

		.achievementIntro h1 {
			font-size: clamp(3rem, 13vw, 4.4rem);
		}
	}

	@media (max-width: 320px) {
		:global(#welcomeHeader h1) {
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
    .heroLetter,
    .heroCoil,
    .heroMorphPath,
    .heroSignalBar {
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

  @media (min-width: 1024px) {
    .sectionTitle { padding-left: 0; padding-right: 0; }
  }
</style>
