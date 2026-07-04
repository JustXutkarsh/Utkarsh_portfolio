<script>
  import { onMount } from "svelte";
  import { fetchHomeData, projectImage } from "$lib/logic/data.js";
  import { formatDateTime } from "$lib/logic/formatter";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import gsap from "gsap";

  let content;
  let projects = [];

  const MAX_CATEGORIES = 2;
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
    projects = [...(content.projects || [])].sort((a, b) => {
      if ((b.featured === true) !== (a.featured === true)) return (b.featured === true) - (a.featured === true);
      return new Date(b.created) - new Date(a.created);
    });
  });
</script>

<svelte:head>
  <title>Utkarsh Pandey | AI Engineer</title>
</svelte:head>

{#if content}
  <div id="content">
    <PageHeader id="welcomeHeader">
      <div class="headerContent">
        <p class="brand">{content.hero.brand}</p>
        <h1 class="emphasis">{content.hero.name}</h1>
        <h2 class="emphasis">{content.hero.title}</h2>
        <p class="heroText">{content.hero.subtitle}</p>
        <div class="heroMeta">
          <span>{content.hero.location}</span>
        </div>
      </div>
    </PageHeader>

    <section id="aboutSection">
      <h1 class="sectionTitle">- AI systems, end to end -</h1>
      <Card hasSlug={false} className="aboutCard">
        <div id="aboutLayout">
          {#each aboutText(content.about) as paragraph}
            <p>{paragraph}</p>
          {/each}
        </div>
      </Card>
    </section>

    <section id="experienceSection">
      <h1 class="sectionTitle">- Engineering experience -</h1>
      <div class="sectionGrid">
        {#each content.experience as item}
          <Card className="textCard">
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

    <section id="projectsSection">
      <h1 class="sectionTitle">- Featured AI projects -</h1>
      <div class="flexCards">
        {#each projects.filter((post) => post.homepage) as post}
          <Card id={post.slug.current}>
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

    <section id="skillsSection">
      <h1 class="sectionTitle">- AI capability stack -</h1>
      <div class="sectionGrid">
        {#each skillsAsEntries(content.skills) as [group, skills]}
          <Card className="textCard skillCard">
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

    <section id="achievementsSection">
      <h1 class="sectionTitle">- Achievements -</h1>
      <div class="sectionGrid achievementGrid">
          {#each content.achievements as achievement}
          <Card className="textCard achievementCard">
            <div class="achievementBadge">
              {#if achievement.logo}
                <span class={`brandLogo ${achievement.logo.toLowerCase()}`}>{achievement.logo}</span>
              {:else if achievement.icon}
                <span class="trophy">{achievement.icon}</span>
              {/if}
            </div>
            <h2>{achievement.title || achievement}</h2>
            {#if achievement.detail}
              <p>{achievement.detail}</p>
            {/if}
          </Card>
          {/each}
      </div>
    </section>

    <section id="certificationsSection">
      <h1 class="sectionTitle">- Certifications -</h1>
      <div class="sectionGrid">
        {#each content.certifications || [] as certificate}
          <Card className="textCard certCard">
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
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
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
    height: 30vw;
    width: 30vw;
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
      padding-top: 10.5rem;
    }

    :global(#welcomeHeader h1),
    :global(#welcomeHeader h2) {
      text-align: center;
    }

    :global(#welcomeHeader h1) {
      font-size: clamp(4.2rem, 18vw, 6.2rem);
    }

    :global(#welcomeHeader h2) {
      font-size: clamp(1.2rem, 7vw, 1.75rem);
    }

    .imageArea {
      height: 82vw;
      width: 82vw;
    }

    .projectTitle {
      font-size: 17cqw;
    }
  }

  @media (min-width: 1024px) {
    .sectionTitle {
      font-size: 4rem;
      padding: 40px;
    }
  }
</style>
