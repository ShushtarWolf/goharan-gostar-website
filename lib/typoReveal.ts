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
 * OnScrollTypoAnimations index4 vibe — inverted for *loading*:
 * words rise from rotationX / depth with center stagger (no pin).
 */
export function wireTypoEnter(el: HTMLElement) {
  const words = splitIntoWords(el);
  if (!words.length) return;

  gsap.set(el, { perspective: 1000 });
  gsap.set(words, {
    transformStyle: "preserve-3d",
    transformOrigin: "50% 50%",
    opacity: 0,
    rotationX: 58,
    z: -320,
    y: 36,
  });

  gsap.to(words, {
    opacity: 1,
    rotationX: 0,
    z: 0,
    y: 0,
    duration: 1.05,
    ease: "back.out(1.5)",
    stagger: { each: 0.035, from: "center" },
    scrollTrigger: {
      trigger: el,
      start: "top 82%",
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
