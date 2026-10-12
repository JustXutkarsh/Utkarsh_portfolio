<script>
  import { onMount } from "svelte";
  let cursor;

  onMount(() => {
    const preference = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame;
    const hide = () => { cancelAnimationFrame(frame); cursor.style.opacity = "0"; };
    const move = (event) => {
      if (!preference.matches || event.pointerType !== "mouse") { hide(); return; }
      cancelAnimationFrame(frame);
      const interactive = event.target.closest?.("a, button, input, [role='button']");
      frame = requestAnimationFrame(() => {
        cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
        cursor.style.opacity = "1";
        cursor.classList.toggle("overLink", Boolean(interactive));
      });
    };
    const key = (event) => { if (event.key === "Tab") hide(); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", hide);
    window.addEventListener("keydown", key);
    document.addEventListener("pointerleave", hide);
    preference.addEventListener("change", hide);
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", hide);
      window.removeEventListener("keydown", key);
      document.removeEventListener("pointerleave", hide);
      preference.removeEventListener("change", hide);
    };
  });
</script>

<div bind:this={cursor} class="pointer-wrapper" aria-hidden="true"><span></span></div>

<style>
  .pointer-wrapper{position:fixed;inset:0 auto auto 0;opacity:0;pointer-events:none;z-index:9999}
  span{display:block;width:8px;height:8px;border:1px solid #90ead6;border-radius:50%;transform:translate(-50%,-50%);background:transparent;transition:width .2s,height .2s,border-color .2s}
  .overLink span{width:24px;height:24px;border-color:#ff8068;background:#ff806808}
  @media(hover:none),(pointer:coarse),(prefers-reduced-motion:reduce){.pointer-wrapper{display:none}}
</style>
