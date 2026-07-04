<script>
  import { onMount } from "svelte";
  import { fetchProjects, projectImage } from "$lib/logic/data.js";
  import { formatDateTime } from "$lib/logic/formatter";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import gsap from "gsap";

  let posts = [];
  let selectedCategory = "All";
  const MAX_CATEGORIES = 2;

  $: allCategories = ["All", ...new Set(posts.flatMap((p) => p.categories?.map((c) => c.title) || []))];
  $: filteredPosts = selectedCategory === "All" ? posts : posts.filter((post) => post.categories?.some((cat) => cat.title === selectedCategory));

  const getCategories = (post) => {
    const visible = post.categories?.slice(0, MAX_CATEGORIES) || [];
    return { visible, hiddenCount: (post.categories?.length || 0) - visible.length };
  };

  function animateIn(e) {
    gsap.to(e.currentTarget.querySelector(".info"), { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
    gsap.to(e.currentTarget.querySelector("#mainImage"), { filter: "blur(10px)", duration: 0.3, ease: "power2.out" });
  }

  function animateOut(e) {
    gsap.to(e.currentTarget.querySelector(".info"), { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.out" });
    gsap.to(e.currentTarget.querySelector("#mainImage"), { filter: "blur(0px)", duration: 0.3, ease: "power2.out" });
  }

  onMount(async () => {
    posts = await fetchProjects();
  });
</script>

<svelte:head>
  <title>Project Archive | Utkarsh Pandey</title>
</svelte:head>

<div id="content">
  <PageHeader id="welcomeHeader">
    <div class="headerContent">
      <h1 class="emphasis">AI Project Archive</h1>
    </div>
  </PageHeader>

  <section id="projectsSection">
    <h1 class="sectionTitle">- {selectedCategory} -</h1>
    <div class="categoryFilters">
      {#each allCategories as category}
        <Button text={category} active={selectedCategory === category} disableNavigation={true} on:click={() => (selectedCategory = category)} />
      {/each}
    </div>

    <div class="flexCards">
      {#each filteredPosts as post}
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
                </div>
                <Button id="readmore" slug={post.slug.current} text="Read More" />
              </div>
            </div>
          </div>
        </Card>
      {/each}
    </div>
  </section>
</div>

<style>
  .categoryFilters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
    margin: 0 auto 2rem;
    width: min(900px, 92%);
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

  .info {
    background: linear-gradient(to bottom, var(--color-hovercard) 35%, transparent);
    border-radius: 20px;
    height: 92%;
    left: 0;
    opacity: 0;
    overflow: hidden;
    padding: 4%;
    position: absolute;
    scale: 0.95;
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
  }

  @media (max-width: 760px) {
    .imageArea {
      height: 82vw;
      width: 82vw;
    }
  }

  @media (min-width: 1024px) {
    .sectionTitle {
      font-size: 4rem;
      padding: 40px;
    }
  }
</style>
