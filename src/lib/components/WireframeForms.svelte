<script>
  import { onMount } from "svelte";

  // Svelte adaptation of ThreeUI Community Wireframe Forms (MIT, Meng To).
  // https://threeui.com/ui-elements/wireframe-forms
  let canvas;
  let shape = "sphere";
  let paused = false;
  let reducedMotion = false;
  let updateShape = () => {};

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = motion.matches;
    let points = [], edges = [], width = 0, frame = 0, last = 0;
    let angleX = 0.3, angleY = 0.4, visible = false;
    const pointer = { x: 0, y: 0 };

    function geometry() {
      points = []; edges = [];
      if (shape === "cube") {
        points = [[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1],[-1,-1,-1],[1,1,-1],[1,-1,1],[-1,1,1]];
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            if (Math.hypot(...points[i].map((v, k) => v - points[j][k])) < 2.1) edges.push([i, j]);
          }
        }
      } else {
        const t = (1 + Math.sqrt(5)) / 2;
        const vertices = [[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]];
        points = [...vertices, ...vertices.map((p) => p.map((v) => v * 0.5))];
        for (let i = 0; i < 12; i++) {
          for (let j = i + 1; j < 12; j++) {
            if (Math.hypot(...vertices[i].map((v, k) => v - vertices[j][k])) < 2.1) edges.push([i,j],[i+12,j+12]);
          }
          edges.push([i,i+12]);
        }
      }
      draw();
    }

    function project([px, py, pz]) {
      const turn = angleY + pointer.x * 0.5, tilt = angleX + pointer.y * 0.35;
      const x = px * Math.cos(turn) - pz * Math.sin(turn);
      const z = pz * Math.cos(turn) + px * Math.sin(turn);
      const y = py * Math.cos(tilt) - z * Math.sin(tilt);
      const depth = z * Math.cos(tilt) + py * Math.sin(tilt);
      const scale = width * 0.17 * (8 / (8 + depth));
      return { x: x * scale + width / 2, y: y * scale + width / 2, z: depth };
    }

    function draw() {
      ctx.clearRect(0, 0, width, width);
      const projected = points.map(project);
      edges.forEach(([a, b], i) => {
        const p = projected[a], q = projected[b];
        const alpha = Math.max(0.15, 0.6 - (p.z + q.z) * 0.1);
        ctx.strokeStyle = i % 7 === 0 ? `rgba(255,155,234,${alpha})` : `rgba(144,234,214,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
      });
      projected.forEach((p, i) => {
        ctx.fillStyle = i % 5 === 0 ? "#ff8068" : "#90ead6";
        ctx.beginPath(); ctx.arc(p.x,p.y, p.z < 0 ? 3 : 2, 0, Math.PI * 2); ctx.fill();
      });
      ctx.strokeStyle = "rgba(245,241,223,0.1)";
      ctx.beginPath(); ctx.arc(width/2,width/2,width*.43,0,Math.PI*2); ctx.stroke();
      for (let i=0; i<4; i++) {
        const t = i * Math.PI/2;
        ctx.beginPath();
        ctx.moveTo(width/2+Math.cos(t)*width*.41,width/2+Math.sin(t)*width*.41);
        ctx.lineTo(width/2+Math.cos(t)*width*.45,width/2+Math.sin(t)*width*.45); ctx.stroke();
      }
    }

    function animate(time) {
      frame = 0;
      if (!visible || paused || motion.matches || document.hidden) return;
      if (time-last >= 32) {
        const delta = Math.min(time-last,64); last = time;
        angleY += delta * .00028; angleX += delta * .0001; draw();
      }
      frame = requestAnimationFrame(animate);
    }
    function resume() { reducedMotion=motion.matches; if (frame) cancelAnimationFrame(frame); frame=0; last=performance.now(); draw(); if (visible && !paused && !motion.matches && !document.hidden) frame=requestAnimationFrame(animate); }
    function resize() {
      width = canvas.getBoundingClientRect().width;
      const dpr = Math.min(window.devicePixelRatio || 1,2);
      canvas.width = canvas.height = width * dpr; ctx.setTransform(dpr,0,0,dpr,0,0); draw();
    }
    function move(event) {
      if (motion.matches) return;
      const rect=canvas.getBoundingClientRect();
      pointer.x=(event.clientX-rect.left)/rect.width-.5; pointer.y=(event.clientY-rect.top)/rect.height-.5; draw();
    }
    function reset() { pointer.x=pointer.y=0; draw(); }
    updateShape = () => { geometry(); resume(); };
    const resizeObserver=new ResizeObserver(resize);
    const observer=new IntersectionObserver(([entry]) => { visible=entry.isIntersecting; resume(); });
    geometry(); resizeObserver.observe(canvas); observer.observe(canvas);
    canvas.addEventListener("pointermove",move); canvas.addEventListener("pointerleave",reset);
    document.addEventListener("visibilitychange",resume); motion.addEventListener("change",resume);
    return () => {
      cancelAnimationFrame(frame); resizeObserver.disconnect(); observer.disconnect();
      canvas.removeEventListener("pointermove",move); canvas.removeEventListener("pointerleave",reset);
      document.removeEventListener("visibilitychange",resume); motion.removeEventListener("change",resume);
    };
  });
</script>

<div class="wireframe">
  <p class="wireframeLabel"><span></span> THINK IN SYSTEMS <span>01 / {paused || reducedMotion ? "STILL" : "LIVE"}</span></p>
  <canvas bind:this={canvas} aria-label="Rotating nested 3D wireframe form">An interactive geometric sculpture of connected vertices.</canvas>
  <div class="wireframeControls">
    <span>MOVE TO EXPLORE</span>
    <button type="button" aria-label="Switch wireframe shape" on:click={() => { shape=shape==="sphere"?"cube":"sphere"; updateShape(); }}>{shape === "sphere" ? "Sphere" : "Cube"} ↗</button>
    <button type="button" aria-label={paused ? "Play wireframe animation" : "Pause wireframe animation"} aria-pressed={paused} disabled={reducedMotion} on:click={() => { paused=!paused; updateShape(); }}>{reducedMotion ? "Still" : paused?"Play":"Pause"}</button>
  </div>
</div>

<style>
  .wireframe { color:#90ead6; font-family:var(--font-mono); position:relative; }
  canvas { width:100%; aspect-ratio:1; display:block; }
  .wireframeLabel { align-items:center; display:flex; gap:.6rem; font-size:.6rem; letter-spacing:.07em; margin:0; }
  .wireframeLabel span:first-child { background:#90ead6; border-radius:50%; width:5px; height:5px; box-shadow:0 0 12px #90ead6; }
  .wireframeLabel span:last-child { margin-left:auto; color:#9a9c90; }
  .wireframeControls { align-items:center; border-top:1px solid #f5f1df20; display:flex; gap:.5rem; padding-top:.8rem; }
  .wireframeControls > span { color:#9a9c90; font-size:.5rem; letter-spacing:.05em; margin-right:auto; }
  button { background:transparent; border:1px solid #90ead640; color:#90ead6; cursor:pointer; font:inherit; font-size:.6rem; min-height:36px; padding:.5rem .6rem; }
  button:hover,button:focus-visible { background:#90ead620; outline:1px solid #90ead6; }
  button:disabled { opacity:.5; cursor:default; }
</style>
