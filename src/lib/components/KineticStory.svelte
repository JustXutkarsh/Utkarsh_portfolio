<script>
  import { onDestroy, onMount } from "svelte";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  export let skills = [];

  const phases = [
    { index: "01", title: "Retrieve", detail: "Ground answers in documents, embeddings, and live data." },
    { index: "02", title: "Reason", detail: "Coordinate models, tools, agents, and evaluation loops." },
    { index: "03", title: "Ship", detail: "Deploy observable APIs and products for real users." },
  ];
  let context;

  onMount(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    context = gsap.context(() => {
      const statement = gsap.timeline({
        scrollTrigger: { trigger: ".statementScene", start: "top top", end: "bottom bottom", scrub: 0.8, pin: ".statementStage", pinSpacing: false, anticipatePin: 1 },
      });
      statement
        .fromTo(".statementOne", { xPercent: -42 }, { xPercent: 0, ease: "none" }, 0)
        .fromTo(".statementTwo", { xPercent: 45 }, { xPercent: 0, ease: "none" }, 0)
        .fromTo(".statementThree", { xPercent: -32 }, { xPercent: 0, ease: "none" }, 0.12)
        .fromTo(".statementCopy", { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, ease: "power3.out" }, 0.42)
        .fromTo(".kineticRing", { scale: 0.3, rotate: -160 }, { scale: 1, rotate: 240, ease: "power2.out" }, 0.08)
        .fromTo(".kineticDiamond", { x: -160, rotate: 0 }, { x: 0, rotate: 225, ease: "power3.out" }, 0.22)
        .fromTo(".kineticSpark", { scale: 0, rotate: -90 }, { scale: 1, rotate: 120, ease: "back.out(1.8)" }, 0.34);

      const pipeline = gsap.timeline({
        scrollTrigger: { trigger: ".pipelineScene", start: "top top", end: "bottom bottom", scrub: 0.9, pin: ".pipelineStage", pinSpacing: false, anticipatePin: 1 },
      });
      pipeline
        .fromTo(".pipelineHeading", { yPercent: 110 }, { yPercent: 0, ease: "power3.out" }, 0)
        .fromTo(".pipelineProgress", { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0.06)
        .fromTo(".pipelineSignal", { left: "0%", rotate: 0 }, { left: "100%", rotate: 720, ease: "none" }, 0.06)
        .fromTo(".phase", { autoAlpha: 0.18, y: 42 }, { autoAlpha: 1, y: 0, stagger: 0.18, ease: "power2.out" }, 0.14)
        .to(".phase", { y: -24, stagger: 0.15, ease: "power2.inOut" }, 0.62)
        .fromTo(".pipelineResult", { autoAlpha: 0, scale: 0.75 }, { autoAlpha: 1, scale: 1, ease: "back.out(1.5)" }, 0.7);

      const capability = gsap.timeline({
        scrollTrigger: { trigger: ".capabilityScene", start: "top top", end: "bottom bottom", scrub: 0.8, pin: ".capabilityStage", pinSpacing: false, anticipatePin: 1 },
      });
      capability
        .fromTo(".capabilityTitle span", { yPercent: 120, rotate: 5 }, { yPercent: 0, rotate: 0, stagger: 0.08, ease: "power4.out" }, 0)
        .fromTo(".capabilityRowOne", { xPercent: 3 }, { xPercent: -34, ease: "none" }, 0)
        .fromTo(".capabilityRowTwo", { xPercent: -38 }, { xPercent: 1, ease: "none" }, 0)
        .to(".capabilityCross", { rotate: 320, ease: "none" }, 0);
    });
    ScrollTrigger.refresh();
  });

  onDestroy(() => context?.revert());
</script>

<section class="kineticStory" aria-label="AI engineering motion story">
  <div class="statementScene scrollScene">
    <div class="stickyStage statementStage">
      <p class="sceneEyebrow">APPLIED AI · IN MOTION</p>
      <h2 class="statement" aria-label="Retrieve, reason, ship">
        <span class="statementOne">RETRIEVE.</span>
        <span class="statementTwo">REASON.</span>
        <span class="statementThree">SHIP.</span>
      </h2>
      <p class="statementCopy">Intelligent systems become valuable when research, models, backend engineering, and product experience move as one.</p>
      <i class="kineticRing" aria-hidden="true"></i>
      <i class="kineticDiamond" aria-hidden="true"></i>
      <i class="kineticSpark" aria-hidden="true"></i>
    </div>
  </div>

  <div class="pipelineScene scrollScene">
    <div class="stickyStage pipelineStage">
      <p class="sceneEyebrow">PRODUCTION PIPELINE</p>
      <div class="headingMask"><h2 class="pipelineHeading">FROM SIGNAL<br />TO SYSTEM.</h2></div>
      <p class="pipelineResult">RELIABLE AI<br />FOR REAL USERS.</p>
      <div class="pipelineTrack" aria-hidden="true"><span class="pipelineProgress"></span><i class="pipelineSignal"></i></div>
      <div class="phaseGrid">
        {#each phases as phase}
          <article class="phase">
            <span>{phase.index}</span>
            <h3>{phase.title}</h3>
            <p>{phase.detail}</p>
          </article>
        {/each}
      </div>
    </div>
  </div>

  <div class="capabilityScene scrollScene">
    <div class="stickyStage capabilityStage">
      <p class="sceneEyebrow">THE CAPABILITY LAYER</p>
      <h2 class="capabilityTitle"><span>ENGINEERED</span><span>AT SPEED.</span></h2>
      <div class="capabilityRows" aria-label={skills.join(", ")}>
        <div class="capabilityRow capabilityRowOne" aria-hidden="true">
          {#each [...skills, ...skills] as skill}<span>{skill}</span>{/each}
        </div>
        <div class="capabilityRow capabilityRowTwo" aria-hidden="true">
          {#each [...skills].reverse().concat([...skills].reverse()) as skill}<span>{skill}</span>{/each}
        </div>
      </div>
      <i class="capabilityCross" aria-hidden="true"></i>
    </div>
  </div>
</section>

<style>
  .kineticStory{background:#0a0b0a;color:#f5f1df;isolation:isolate;position:relative}.scrollScene{height:220vh;position:relative}.stickyStage{box-sizing:border-box;height:100svh;overflow:hidden;padding:clamp(5rem,8vw,8rem) max(4vw,calc((100vw - 1180px)/2));position:relative}.sceneEyebrow{color:#90ead6;font-family:var(--font-mono);font-size:.78rem;font-weight:700;margin:0;text-transform:uppercase}.statement{font-family:"Rubik",sans-serif;font-size:clamp(4rem,13vw,12rem);font-weight:700;line-height:.73;margin:clamp(2rem,5vh,4rem) 0 0;text-transform:uppercase}.statement span{display:block;white-space:nowrap}.statementTwo{text-align:right}.statementCopy{bottom:7vh;font-size:clamp(1.05rem,2vw,1.55rem);line-height:1.45;margin:0;max-width:680px;position:absolute}.kineticRing,.kineticDiamond,.kineticSpark{display:block;position:absolute}.kineticRing{border:clamp(.6rem,1.3vw,1.2rem) solid #7cead5;border-radius:50%;height:clamp(4rem,8vw,7.5rem);right:9%;top:18%;width:clamp(4rem,8vw,7.5rem)}.kineticDiamond{background:#ff8068;height:clamp(2rem,4vw,3.8rem);left:49%;top:42%;width:clamp(2rem,4vw,3.8rem)}.kineticSpark{height:clamp(5rem,10vw,9rem);right:14%;top:61%;width:clamp(5rem,10vw,9rem)}.kineticSpark::before,.kineticSpark::after{background:#eaa7eb;content:"";height:100%;left:45%;position:absolute;top:0;width:10%}.kineticSpark::after{rotate:90deg}.pipelineStage{background:#f5f1df;color:#0a0b0a}.pipelineStage .sceneEyebrow{color:#176d5d}.headingMask{overflow:hidden}.pipelineHeading{font-family:"Rubik",sans-serif;font-size:clamp(4rem,11vw,10rem);line-height:.78;margin:clamp(2rem,5vh,4rem) 0 0;text-transform:uppercase}.pipelineTrack{background:#c7c4b7;height:3px;left:7%;position:absolute;right:7%;top:54%}.pipelineProgress{background:#0a0b0a;display:block;height:100%;transform-origin:left;width:100%}.pipelineSignal{background:#ff8068;border:3px solid #0a0b0a;height:1.6rem;position:absolute;top:50%;translate:-50% -50%;width:1.6rem}.phaseGrid{display:grid;gap:clamp(1rem,3vw,3rem);grid-template-columns:repeat(3,1fr);left:7%;position:absolute;right:7%;top:59%}.phase span{font-family:var(--font-mono);font-size:.7rem}.phase h3{font-family:"Rubik",sans-serif;font-size:clamp(1.6rem,3vw,3rem);margin:.35rem 0}.phase p{font-size:clamp(.8rem,1.2vw,1rem);line-height:1.45;margin:0;max-width:300px}.pipelineResult{color:#176d5d;font-family:"Rubik",sans-serif;font-size:clamp(2rem,5vw,4.5rem);font-weight:700;line-height:.85;margin:0;position:absolute;right:7%;text-align:right;top:18%}.capabilityStage{display:flex;flex-direction:column;justify-content:center}.capabilityTitle{display:grid;font-family:"Rubik",sans-serif;font-size:clamp(4rem,12vw,11rem);line-height:.75;margin:2rem 0 4rem;text-transform:uppercase}.capabilityTitle span{display:block;overflow:hidden}.capabilityTitle span:last-child{text-align:right}.capabilityRows{display:grid;gap:1rem;margin-left:-20vw;width:140vw}.capabilityRow{display:flex;gap:1rem;white-space:nowrap}.capabilityRow span{background:#90ead6;color:#080807;font-family:"Rubik",sans-serif;font-size:clamp(1.1rem,2.3vw,2rem);font-weight:700;padding:.55rem 1rem;text-transform:uppercase}.capabilityRowTwo span{background:#ff9bea}.capabilityCross{height:clamp(4rem,8vw,7rem);position:absolute;right:8%;top:17%;width:clamp(4rem,8vw,7rem)}.capabilityCross::before,.capabilityCross::after{background:#ff8068;content:"";height:100%;left:43%;position:absolute;width:14%}.capabilityCross::after{rotate:90deg}
  @media(max-width:760px){.scrollScene{height:170vh}.stickyStage{padding:10rem 4vw 6rem}.statement{font-size:clamp(3.4rem,18vw,5.8rem);line-height:.79}.statementCopy{bottom:13vh;width:88%}.kineticRing{right:5%;top:31%}.kineticDiamond{left:57%;top:45%}.kineticSpark{right:10%;top:59%}.pipelineHeading{font-size:clamp(3.5rem,17vw,5.5rem)}.pipelineResult{font-size:2rem;top:36%}.pipelineTrack{top:52%}.phaseGrid{gap:1rem;grid-template-columns:1fr;top:57%}.phase{display:grid;gap:.2rem;grid-template-columns:2rem 1fr}.phase h3{font-size:1.35rem;margin:0}.phase p{font-size:.72rem;grid-column:2}.capabilityTitle{font-size:clamp(2.8rem,14vw,4.2rem);gap:.15em}.capabilityRows{gap:.65rem}.capabilityRow{gap:.65rem}.capabilityCross{right:6%;top:24%}}
  .headingMask{max-width:59%}.pipelineHeading{font-size:clamp(4rem,8.2vw,8rem)}.pipelineResult{font-size:clamp(2rem,4.2vw,4rem);top:20%;width:34%}
  @media(min-width:761px){.headingMask{max-width:60%}.pipelineHeading{font-size:clamp(3.7rem,6.2vw,7rem);line-height:.82;margin:clamp(2rem,4vh,3.25rem) 0 0;white-space:nowrap}.pipelineResult{font-size:clamp(1.8rem,3.5vw,3.6rem);top:22%;width:30%}.pipelineTrack{top:64%}.phaseGrid{top:69%}}
  @media(max-width:760px){.headingMask{max-width:none}.pipelineHeading{font-size:clamp(2.8rem,11vw,4.5rem);line-height:.84;margin:2rem 0 0}.pipelineResult{font-size:1.35rem;line-height:.9;margin:1rem 0 1.25rem;position:relative;right:auto;text-align:left;top:auto;width:auto}.pipelineTrack{left:auto;margin:0 0 1.15rem;position:relative;right:auto;top:auto;width:100%}.phaseGrid{gap:.9rem;left:auto;position:relative;right:auto;top:auto}.phase{gap:.15rem}.phase h3{font-size:1.25rem}.phase p{font-size:.74rem;line-height:1.35;max-width:none}}
  @media(prefers-reduced-motion:reduce){.scrollScene{height:auto}.stickyStage{height:auto;min-height:100svh;position:relative}.statement span,.phase,.pipelineHeading,.pipelineResult,.capabilityTitle span{opacity:1!important;transform:none!important}}
</style>
