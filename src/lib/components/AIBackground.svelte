<script>
  import { onMount } from "svelte";

  let canvas;

  onMount(() => {
    const ctx = canvas.getContext("2d");
    const pointer = { x: 0.5, y: 0.5 };
    let width = 0;
    let height = 0;
    let nodes = [];
    let frame;
    let lastDraw = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scale = Math.min(window.devicePixelRatio || 1, 1.5);

    function resize() {
      width = canvas.width = window.innerWidth * scale;
      height = canvas.height = window.innerHeight * scale;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      nodes = Array.from({ length: Math.min(48, Math.floor(window.innerWidth / 26)) }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22 * scale,
        vy: (Math.random() - 0.5) * 0.22 * scale,
        r: (i % 5 === 0 ? 2.4 : 1.4) * scale,
      }));
    }

    function draw(time = 0) {
      frame = requestAnimationFrame(draw);
      if (!reduced && time - lastDraw < 33) return;
      lastDraw = time;
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = dark ? "#111929" : "#e4edff";
      ctx.fillRect(0, 0, width, height);

      const px = pointer.x * width;
      const py = pointer.y * height;
      const scroll = window.scrollY * 0.05 * scale;

      nodes.forEach((node) => {
        if (!reduced) {
          node.x += node.vx + (px - node.x) * 0.0008;
          node.y += node.vy + (py - node.y) * 0.0008 + Math.sin((node.x + scroll) * 0.002) * 0.05;
        }
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 135 * scale) {
            const alpha = 1 - dist / (135 * scale);
            ctx.strokeStyle = dark ? `rgba(161,243,222,${alpha * 0.16})` : `rgba(34,89,197,${alpha * 0.14})`;
            ctx.lineWidth = scale;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        const active = Math.hypot(node.x - px, node.y - py) < 160 * scale;
        ctx.fillStyle = active
          ? dark ? "rgba(255,139,113,0.85)" : "rgba(34,89,197,0.8)"
          : dark ? "rgba(161,243,222,0.48)" : "rgba(40,47,85,0.32)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, active ? node.r * 1.8 : node.r, 0, Math.PI * 2);
        ctx.fill();
      });

    }

    function move(event) {
      pointer.x = event.clientX / window.innerWidth;
      pointer.y = event.clientY / window.innerHeight;
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  });
</script>

<canvas bind:this={canvas} id="ai-background" aria-hidden="true"></canvas>

<style>
  #ai-background {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }
</style>
