import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { Howl } from "howler";
import { goto } from "$app/navigation";

export function initGSAP() {
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollToPlugin);
}

export function isMobile() {
  return window.innerWidth <= 1024;
}

export function isDarkMode() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

const sounds = {
  click: new Howl({ src: ["/sounds/click.mp3"], volume: 0.1 }),
  hover: new Howl({ src: ["/sounds/hover.mp3"], volume: 0.1 }),
  openLink: new Howl({ src: ["/sounds/openlink.mp3"], volume: 0.1 }),
  openCard: new Howl({ src: ["/sounds/opencard.mp3"], volume: 0.1 }),
  cardHover: new Howl({ src: ["/sounds/cardhover.mp3"], volume: 0.1 }),
  closeCard: new Howl({ src: ["/sounds/closecard.mp3"], volume: 0.1}),
  cardClick: new Howl({ src: ["/sounds/cardclick.mp3"], volume: 0.1}),
};

export function playSound(name, options = {}) {
  const sound = sounds[name];
  if (!sound) return;

  if (options.rate) sound.rate(options.rate);
  if (options.volume !== undefined) sound.volume(options.volume);

  sound.play();
}

export function getCSSVariable(variable) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
}

export function scrollTo(place) {
  const target = document.querySelector(place);
  if (!target) { goto(`/${place}`); return; }
  const offset = (document.querySelector("#header")?.getBoundingClientRect().bottom || 0) + 16;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const smoother = ScrollSmoother?.get();
  if (smoother) { smoother.scrollTo(target, !reduced, `top ${offset}px`); return; }
  if (!reduced) {
    gsap.to(window, { duration: 0.65, scrollTo: { y: target, offsetY: offset }, ease: "power2.inOut" });
  } else {
    window.scrollTo(0, Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset));
  }
}
