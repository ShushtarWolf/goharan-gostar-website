import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Split element text into word spans (RTL-safe space split). */
export function splitIntoWords(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? "";
  el.textContent = "";
  gsap.set(el, { fontKerning: "none" });

  const wordEls: HTMLElement[] = [];
  for (const part of text.split(/(\s+)/)) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      el.appendChild(document.createTextNode(part));
      continue;
    }
    const span = document.createElement("span");
    span.className = "typo-word";
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity";
    span.textContent = part;
    el.appendChild(span);
    wordEls.push(span);
  }
  return wordEls;
}

/**
 * OnScrollTypoAnimations index4 — enter version of the demo's 3D word fly:
 * words arrive from depth (z / rotationX from center) with back.out.
 * (Demo itself pins + scrubs words away; we use the same motion language on enter.)
 */
export function wireTypoEnter(el: HTMLElement) {
  const words = splitIntoWords(el);
  if (!words.length) return;

  const n = words.length;
  gsap.set(el, { perspective: 1000 });
  gsap.set(words, {
    transformStyle: "preserve-3d",
    transformOrigin: "50% 50%",
    opacity: 0,
    z: -1000,
    rotationX: (i: number) => Math.abs(i - n / 2) * 15,
    y: 24,
  });

  gsap.to(words, {
    opacity: 1,
    z: 0,
    rotationX: 0,
    y: 0,
    duration: 1.2,
    ease: "back.out(2)",
    stagger: { each: 0.03, from: "center" },
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });
}

/** Matching photo load: clip + lift, same scroll cadence. */
export function wirePhotoEnter(imgs: HTMLElement[]) {
  if (!imgs.length) return;
  gsap.set(imgs, {
    opacity: 0,
    y: 56,
    scale: 0.94,
    clipPath: "inset(10% 8% 10% 8%)",
  });
  gsap.to(imgs, {
    opacity: 1,
    y: 0,
    scale: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    duration: 1.15,
    ease: "power3.out",
    stagger: 0.12,
    scrollTrigger: {
      trigger: imgs[0]!.parentElement ?? imgs[0],
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });
}
