<script>
  import { onMount } from "svelte";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { portfolioContent } from "$lib/content/portfolio.js";
  import { interactiveSurface } from "$lib/logic/visualEffects.js";

  export let projects = portfolioContent.projects;
  let root;
  let mode = "idea";
  let unfolding = 0;
  let transfer = 0;
  $: shape = Math.max(unfolding, transfer);
  let selected = 1;
  let morph;
  let motionAllowed = false;
  const progress = { value: 0 };
  const phases = [
    { name: "Retrieve", slug: "skyvision", detail: "Find the right context", color: "#90ead6" },
    { name: "Reason", slug: "agentic-research-pro", detail: "Connect the evidence", color: "#f5f1df" },
    { name: "Ship", slug: "astram", detail: "Make it useful", color: "#ff8068" },
  ];
  $: fragments = phases.map((phase) => ({ ...phase, project: projects.find((p) => p.slug?.current === phase.slug) || portfolioContent.projects.find((p) => p.slug.current === phase.slug) }));

  // Identical path commands let GSAP unfold the ribbons without a morphing plugin.
  function ribbon(index, amount) {
    const x = 104 + index * 27;
    const right = 426 - index * 27;
    const bottom = 282 - index * 20;
    const radius = (right - x) / 2;
    const idea = [x, 48, x, 178, x, bottom - 25, 265 - radius * .55, bottom, 265, bottom, 265 + radius * .55, bottom, right, bottom - 25, right, 178, right, 48];
    const y = 139 + index * 21;
    const system = [24, y, 62, y, 117, y - 65, 178, y - 65, 265, y, 352, y + 65, 413, y + 65, 468, y, 506, y];
    const p = idea.map((value, i) => value + (system[i] - value) * amount);
    return `M${p[0]},${p[1]} L${p[2]},${p[3]} C${p[4]},${p[5]} ${p[6]},${p[7]} ${p[8]},${p[9]} C${p[10]},${p[11]} ${p[12]},${p[13]} ${p[14]},${p[15]} L${p[16]},${p[17]}`;
  }

  function choose(next) {
    mode = next;
    morph?.kill();
    const value = next === "system" ? 1 : 0;
    if (!motionAllowed) {
      progress.value = unfolding = value;
      return;
    }
    morph = gsap.to(progress, { value, duration: 0.85, ease: "power3.inOut", onUpdate: () => unfolding = progress.value });
  }

  onMount(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let context;
    const configure = () => {
      context?.revert();
      morph?.kill();
      transfer = 0;
      motionAllowed = !preference.matches;
      progress.value = unfolding = mode === "system" ? 1 : 0;
      if (!motionAllowed) return;
      try {
        gsap.registerPlugin(ScrollTrigger);
        context = gsap.context(() => {}, root);
        context.add(() => {
          gsap.from(".ribbon", { strokeDashoffset: 0.8, opacity: 0.4, duration: 0.85, stagger: 0.035, ease: "power3.out" });
          gsap.from(".assembly", { rotation: -5, scale: 0.94, duration: 1, ease: "power3.out" });
          gsap.to(".handoff", { y: 30, ease: "none", scrollTrigger: { trigger: root, start: "bottom 60%", end: "bottom top", scrub: 0.6, onUpdate: (self) => transfer = self.progress } });
        });
      } catch {
        context?.revert();
        motionAllowed = false;
      }
    };
    configure();
    preference.addEventListener("change", configure);
    return () => {
      motionAllowed = false;
      morph?.kill();
      context?.revert();
      preference.removeEventListener("change", configure);
    };
  });
</script>

<section class="engine" bind:this={root} aria-label="The Idea Engine">
  <div class="engineHeading"><span>THE IDEA ENGINE</span><span>UTK / 01</span></div>
  <div class="viewport" use:interactiveSurface={{ tilt: true }}>
    <div class="perspective">
      <svg class="handoff" viewBox="0 0 530 320" fill="none" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="engineMint" x1="100" y1="45" x2="410" y2="290" gradientUnits="userSpaceOnUse"><stop stop-color="#e2fff2"/><stop offset=".27" stop-color="#90ead6"/><stop offset=".52" stop-color="#388776"/><stop offset=".73" stop-color="#90ead6"/><stop offset="1" stop-color="#397f70"/></linearGradient>
          <linearGradient id="engineCoral" x1="140" y1="45" x2="370" y2="280" gradientUnits="userSpaceOnUse"><stop stop-color="#ffd6bd"/><stop offset=".3" stop-color="#ff9980"/><stop offset=".56" stop-color="#9d4031"/><stop offset=".8" stop-color="#ff8068"/><stop offset="1" stop-color="#c85c46"/></linearGradient>
          <linearGradient id="engineEdge" x1="80" y1="40" x2="425" y2="300" gradientUnits="userSpaceOnUse"><stop stop-color="#477b68"/><stop offset=".5" stop-color="#102d25"/><stop offset="1" stop-color="#061a15"/></linearGradient>
          <linearGradient id="engineGlint"><stop stop-color="#f5fff4" stop-opacity=".75"/><stop offset=".45" stop-color="#f5fff4" stop-opacity=".06"/><stop offset="1" stop-color="#f5fff4" stop-opacity=".32"/></linearGradient>
          <radialGradient id="engineShadow"><stop stop-color="#000" stop-opacity=".8"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
        </defs>
        <path d="M18 34H512 M18 300H512 M32 20V310 M498 20V310" stroke="#f5f1df" stroke-opacity=".08" stroke-dasharray="2 8"/>
        <ellipse cx="275" cy="297" rx={158 + shape * 77} ry="20" fill="url(#engineShadow)"/>
        <g class="assembly"><g class="sculpture" style={`transform:rotate(${-7 * (1 - shape)}deg);transform-origin:265px 166px`}>
          {#each [0, 1, 2, 3, 4] as index}
            <path d={ribbon(index, shape)} transform="translate(7 10)" stroke="#000" stroke-opacity=".45" stroke-width="27"/>
            <path d={ribbon(index, shape)} transform="translate(5 7)" stroke="url(#engineEdge)" stroke-width="24"/>
            <path d={ribbon(index, shape)} stroke={index === 4 ? "#883e2e" : "#234f42"} stroke-width="22"/>
            <path class="ribbon" d={ribbon(index, shape)} pathLength="1" stroke={index === 4 ? "url(#engineCoral)" : "url(#engineMint)"} stroke-width="18" stroke-linecap="butt" stroke-dasharray="1 1"/>
            <path d={ribbon(index, shape)} transform="translate(-3 -3)" stroke="url(#engineGlint)" stroke-width="1.5"/>
          {/each}
        </g></g>
        <g opacity={shape}>
          {#each phases as phase, i}
            <g transform={`translate(${86 + i * 179} ${[160, 181, 215][i]})`}>
              <rect x="-64" y="-21" width="128" height="46" rx="23" fill="#000" opacity=".5" transform="translate(3 5)"/>
              <rect x="-64" y="-23" width="128" height="46" rx="23" fill="#0b1712" stroke={phase.color} stroke-opacity={selected === i ? "1" : ".6"} stroke-width={selected === i ? "2" : "1"}/>
              <text y="6" text-anchor="middle" fill={phase.color} font-size="20" font-family="Rubik, sans-serif">{phase.name}</text>
            </g>
          {/each}
          <path d="M174 126l10 6-10 6z M184 126l10 6-10 6z M344 226l10 6-10 6z M354 226l10 6-10 6z" fill="#f5f1df"/>
        </g>
        <g opacity={1 - shape} stroke="#f5f1df" stroke-opacity=".45">
          <path d="M109 61H50V105 M384 261H480V222"/>
          <circle cx="109" cy="61" r="3" fill="#90ead6"/><circle cx="384" cy="261" r="3" fill="#ff8068"/>
        </g>
      </svg>
    </div>
    <div class="objectCaption" aria-live="polite"><span>{mode === "idea" ? "01 / A POSSIBILITY" : "02 / A WORKING SYSTEM"}</span><span>{mode === "idea" ? "Context → connection → creation" : "Retrieve → Reason → Ship"}</span></div>
  </div>
  <div class="controls" role="group" aria-label="Idea Engine view">
    <button type="button" aria-pressed={mode === "idea"} on:click={() => choose("idea")}><span aria-hidden="true">01</span> See the idea</button>
    <button type="button" aria-pressed={mode === "system"} on:click={() => choose("system")}><span aria-hidden="true">02</span> See the system</button>
  </div>
  <nav class="fragments" aria-label="Projects behind the Idea Engine">
    {#each fragments as fragment, i}
      <div class="fragment" class:active={selected === i} style={`--phase:${fragment.color}`}>
        <button class="projectSelect" type="button" aria-pressed={selected === i} aria-controls="enginePreview" on:mouseenter={() => selected = i} on:focus={() => selected = i} on:click={() => selected = i}>
          <span class="fragmentPhase">0{i + 1} / {fragment.name}</span><strong>{fragment.project.title}</strong>
        </button>
        <a class="caseLink" href={`/projects/${fragment.project.slug.current}`} aria-label={`Open ${fragment.project.title} case study`} on:mouseenter={() => selected = i} on:focus={() => selected = i}>↗</a>
      </div>
    {/each}
  </nav>
  <p class="instructions">Select a project to inspect · ↗ opens its case study</p>
  <div class="preview" id="enginePreview" aria-live="polite">
    {#each fragments as fragment, i}
      <div class="previewItem" class:current={selected === i} aria-hidden={selected !== i}><span>{fragment.detail}</span><p>{fragment.project.summary}</p></div>
    {/each}
  </div>
</section>

<style>
  .engine{min-width:0;color:#f5f1df;position:relative}
  .engineHeading{display:flex;justify-content:space-between;font:.72rem var(--font-mono);letter-spacing:.1em;color:#bac2b5;padding:0 .4rem}
  .engineHeading span:first-child{color:#90ead6}
  .viewport{position:relative;perspective:1000px}
  .perspective{transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .55s cubic-bezier(.2,.8,.2,1);transform-style:preserve-3d}
  svg{display:block;width:100%;height:clamp(240px,37vh,310px);overflow:visible}
  .objectCaption{display:flex;justify-content:space-between;gap:1rem;color:#bbc2b5;font:.65rem var(--font-mono);line-height:1.5;padding:.1rem .4rem .85rem}
  .objectCaption span:first-child{color:#ffa18c}
  .controls{display:flex;border-top:1px solid #f5f1df30;border-bottom:1px solid #f5f1df30}
  .controls button{display:flex;justify-content:center;align-items:center;gap:.65rem;min-height:48px;flex:1;background:transparent;border:0;border-radius:0;color:#bbc2b5;font:.85rem var(--font-mono);cursor:pointer;transition:color .2s,background .2s}
  .controls button + button{border-left:1px solid #f5f1df20}
  .controls button span{font-size:.65rem;color:#90ead6}
  .controls button[aria-pressed="true"]{background:#90ead612;color:#e1fff3;box-shadow:inset 0 -2px #90ead6}
  .controls button:hover{color:#f5f1df;background:#20322b}
  .fragments{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem;margin-top:.85rem}
  .fragment{display:flex;align-items:stretch;border-left:2px solid transparent;min-width:0;transition:background .2s,border-color .2s}
  .fragment.active{border-color:var(--phase);background:#f5f1df08}
  .projectSelect{border:0;cursor:pointer;background:transparent;color:#b7bfb1;padding:.7rem .5rem;text-align:left;min-width:0;flex:1}
  .fragment.active .projectSelect{color:#f5f1df}
  .fragmentPhase{color:var(--phase);font:.64rem var(--font-mono);text-transform:uppercase}
  strong{display:block;font:500 .9rem "Rubik",sans-serif;line-height:1.3;margin-top:.4rem;overflow-wrap:anywhere}
  .caseLink{display:grid;place-items:center;align-self:center;min-height:44px;min-width:28px;color:var(--phase);font-size:1.15rem}
  .caseLink:hover{background:#90ead612}
  button:focus-visible,a:focus-visible{outline:2px solid #ff8068;outline-offset:3px}
  .instructions{font:.63rem var(--font-mono);line-height:1.5;color:#bbc2b5;margin:.6rem .4rem 0}
  .preview{display:grid;box-sizing:border-box;padding:.8rem .4rem 0}
  .previewItem{grid-area:1/1;visibility:hidden}
  .previewItem.current{visibility:visible}
  .previewItem>span{font:.7rem var(--font-mono);color:#90ead6}
  .previewItem p{font-size:.85rem;line-height:1.5;color:#c2c7bb;margin:.4rem 0 0}
  @media(max-width:760px){svg{height:auto}.engineHeading{font-size:.68rem}.objectCaption{font-size:.6rem;flex-wrap:wrap;gap:.2rem}.fragments{gap:.2rem}.projectSelect{padding:.65rem .35rem}.fragmentPhase{font-size:.62rem}strong{font-size:.82rem}.caseLink{min-width:24px}.controls button{font-size:.78rem}.instructions{font-size:.6rem}}
  @media(prefers-reduced-motion:reduce){.perspective{transform:none;transition:none}.controls button,.fragment{transition:none}}
</style>
