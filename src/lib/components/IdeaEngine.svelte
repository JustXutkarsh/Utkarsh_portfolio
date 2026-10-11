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
    const x = 112 + index * 24;
    const right = 418 - index * 24;
    const bottom = 369 - index * 17;
    const idea = [x, 90, x, 248, x, bottom, 265, bottom, 265, bottom, right, bottom, right, bottom, right, 248, right, 90];
    const y = 221 + index * 7;
    const system = [48, y, 120, y, 165, y - 32, 210, y - 32, 260, y, 310, y + 32, 365, y + 32, 408, y, 482, y];
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
      <svg class="handoff" viewBox="0 0 530 420" fill="none" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="engineMint" x1="95" y1="75" x2="425" y2="375" gradientUnits="userSpaceOnUse"><stop stop-color="#f0fff6"/><stop offset=".3" stop-color="#90ead6"/><stop offset=".65" stop-color="#258a78"/><stop offset=".88" stop-color="#90ead6"/><stop offset="1" stop-color="#defaeb"/></linearGradient>
          <linearGradient id="engineCoral" x1="112" y1="90" x2="418" y2="365" gradientUnits="userSpaceOnUse"><stop stop-color="#ffb7a5"/><stop offset=".5" stop-color="#ff8068"/><stop offset="1" stop-color="#a33f32"/></linearGradient>
        </defs>
        <path d="M25 70H505 M25 350H505 M75 30V390 M455 30V390" stroke="#f5f1df" stroke-opacity=".09" stroke-dasharray="2 8"/>
        <ellipse cx="275" cy="389" rx="150" ry="12" fill="#000" opacity=".6"/>
        <g class="assembly" transform="translate(-66.25 -55) scale(1.25)"><g class="sculpture" style={`transform:rotate(${-9 * (1 - shape)}deg);transform-origin:265px 220px`}>
          {#each [0, 1, 2, 3, 4] as index}
            <path d={ribbon(index, shape)} transform="translate(9 12)" stroke="#123c34" stroke-width="18"/>
            <path class="ribbon" d={ribbon(index, shape)} pathLength="1" stroke={index === 4 ? "url(#engineCoral)" : "url(#engineMint)"} stroke-width="14" stroke-linecap="butt" stroke-dasharray="1 1"/>
            <path d={ribbon(index, shape)} transform="translate(-2 -3)" stroke="#f5f1df" stroke-opacity={index === 4 ? ".2" : ".45"} stroke-width="1"/>
          {/each}
        </g></g>
        <g opacity={shape}>
          {#each phases as phase, i}
            <circle cx={95 + i * 170} cy="236" r="27" fill="#080807" stroke={phase.color}/>
            <text x={95 + i * 170} y="241" text-anchor="middle" fill={phase.color} font-size="13" font-family="monospace">0{i + 1}</text>
            <text x={95 + i * 170} y="308" text-anchor="middle" fill={phase.color} font-size="19" font-family="sans-serif">{phase.name}</text>
          {/each}
          <path d="m160 236 7-5v10z m170 0 7-5v10z" fill="#f5f1df"/>
        </g>
        <g opacity={1 - shape} stroke="#f5f1df" stroke-opacity=".45">
          <path d="M110 94H55V140 M380 330H480V285"/>
          <circle cx="110" cy="94" r="3" fill="#90ead6"/><circle cx="380" cy="330" r="3" fill="#ff8068"/>
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
      <a href={`/projects/${fragment.project.slug.current}`} aria-describedby="enginePreview" class:active={selected === i} style={`--phase:${fragment.color}`} on:mouseenter={() => selected = i} on:focus={() => selected = i}>
        <span class="phase">0{i + 1} / {fragment.name}<span aria-hidden="true">↗</span></span>
        <strong>{fragment.project.title}</strong>
      </a>
    {/each}
  </nav>
  <div class="preview" id="enginePreview" aria-live="polite"><span>{fragments[selected].detail}</span><p>{fragments[selected].project.summary}</p></div>
</section>

<style>
  .engine{min-width:0;color:#f5f1df;position:relative}
  .engineHeading{display:flex;justify-content:space-between;font: .6rem var(--font-mono);letter-spacing:.13em;color:#a7afa4;padding:0 .4rem}
  .engineHeading span:first-child{color:#90ead6}
  .viewport{position:relative;perspective:900px}
  .perspective{transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .5s ease-out;transform-style:preserve-3d}
  svg{display:block;width:100%;height:clamp(230px,34vh,310px);overflow:visible}
  .objectCaption{display:flex;justify-content:space-between;gap:1rem;color:#a7afa4;font:.52rem var(--font-mono);padding:.2rem .4rem 1.25rem}
  .objectCaption span:first-child{color:#ff8068}
  .controls{display:flex;border-top:1px solid #f5f1df30;border-bottom:1px solid #f5f1df30}
  button{display:flex;justify-content:center;align-items:center;gap:.7rem;min-height:48px;flex:1;background:transparent;border:0;border-radius:0;color:#a7afa4;font:.7rem var(--font-mono);cursor:pointer;transition:color .2s,background .2s}
  button + button{border-left:1px solid #f5f1df30}
  button span{font-size:.55rem;opacity:.6}
  button[aria-pressed="true"]{background:#90ead6;color:#080807}
  button:hover{color:#f5f1df;background:#20322b}
  button[aria-pressed="true"]:hover{background:#b6ffe8;color:#080807}
  .fragments{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;margin-top:1.4rem}
  .fragments a{border-top:1px solid #f5f1df30;padding:.75rem 0 .5rem;color:#c7c7bd;min-width:0;transition:border-color .2s,color .2s}
  .phase{display:flex;justify-content:space-between;gap:.3rem;color:var(--phase);font:.55rem var(--font-mono);text-transform:uppercase}
  strong{display:block;font:500 .78rem "Rubik",sans-serif;line-height:1.35;margin-top:.5rem}
  .fragments a.active,.fragments a:hover{border-color:var(--phase);color:#f5f1df}
  button:focus-visible,a:focus-visible{outline:2px solid #ff8068;outline-offset:5px}
  .preview{min-height:75px;box-sizing:border-box;padding-top:.8rem}
  .preview>span{font:.56rem var(--font-mono);color:#90ead6}
  .preview p{font-size:.75rem;line-height:1.5;color:#a7afa4;margin:.4rem 0 0;max-width:480px}
  @media(max-width:760px){.engineHeading{font-size:.55rem}.viewport{max-width:440px;margin:auto}svg{height:auto}.objectCaption{font-size:.48rem}.fragments{gap:.6rem}strong{font-size:.72rem}.preview{min-height:110px}.preview p{font-size:.78rem}}
  @media(prefers-reduced-motion:reduce){.perspective{transform:none;transition:none}button,.fragments a{transition:none}}
</style>
