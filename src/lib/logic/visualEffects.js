// Svelte adaptations of Aceternity UI's free 3D Card and Glowing Effect.
// https://ui.aceternity.com/components/3d-card-effect
// https://ui.aceternity.com/components/glowing-effect
export function interactiveSurface(node, { tilt = false } = {}) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  let frame;
  function reset() {
    cancelAnimationFrame(frame);
    ["--rx", "--ry", "--shine", "--glow"].forEach((key) => node.style.removeProperty(key));
  }
  function move(event) {
    if (motion.matches || !fine.matches) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const { left, top, width, height } = node.getBoundingClientRect();
      const x = (event.clientX - left) / width, y = (event.clientY - top) / height;
      node.style.setProperty("--mx", `${x * 100}%`);
      node.style.setProperty("--my", `${y * 100}%`);
      node.style.setProperty("--glow", "1");
      node.style.setProperty("--angle", `${Math.atan2(y - .5, x - .5) * 180 / Math.PI + 90}deg`);
      if (tilt) {
        node.style.setProperty("--rx", `${-(y - .5) * 9}deg`);
        node.style.setProperty("--ry", `${(x - .5) * 12}deg`);
        node.style.setProperty("--shine", ".16");
      }
    });
  }
  node.addEventListener("pointermove", move);
  node.addEventListener("pointerleave", reset);
  motion.addEventListener("change", reset);
  return { destroy() { reset(); node.removeEventListener("pointermove", move); node.removeEventListener("pointerleave", reset); motion.removeEventListener("change", reset); } };
}
