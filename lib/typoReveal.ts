import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Split element text into word spans (RTL-safe space split). */
export function splitIntoWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.typoSplit === "1") {
    return Array.from(el.querySelectorAll<HTMLElement>(".typo-word"));
  }
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
  el.dataset.typoSplit = "1";
  return wordEls;
}

function wordSpin(i: number, n: number, sign = 1) {
  return sign * Math.abs(i - (n - 1) / 2) * 14;
}

/**
 * Codrops OnScrollTypoAnimations index4 — scrub-linked 3D word fly.
 * Enter as the line arrives, stay readable while in view, exit only as it leaves.
 */
export function wireTypoScroll(el: HTMLElement) {
  const words = splitIntoWords(el);
  if (!words.length) return;

  const n = words.length;
  gsap.set(el, { perspective: 1000 });
  gsap.set(words, {
    transformStyle: "preserve-3d",
    transformOrigin: "50% 50%",
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: el,
        // Full travel through the viewport so short lines don't vanish mid-read.
        start: "top 92%",
        end: "top 8%",
        scrub: 0.55,
        invalidateOnRefresh: true,
      },
    })
    .fromTo(
      words,
      {
        opacity: 0,
        z: -900,
        y: 28,
        rotationX: (i: number) => wordSpin(i, n, 1),
      },
      {
        opacity: 1,
        z: 0,
        y: 0,
        rotationX: 0,
        ease: "none",
        stagger: { each: 0.025, from: "center" },
        duration: 0.28,
      },
      0,
    )
    // Hold fully readable through the middle of the scrub range.
    .to({}, { duration: 0.44 })
    .to(
      words,
      {
        opacity: 0,
        z: -900,
        y: -16,
        rotationX: (i: number) => wordSpin(i, n, -1),
        ease: "none",
        stagger: { each: 0.025, from: "center" },
        duration: 0.28,
      },
    );
}

/**
 * Index4 exit inside an already-pinned frame scene.
 * Words start readable (hero/scene text visible on load), then scrub away late.
 */
export function wireTypoPinExit(
  copy: HTMLElement,
  trigger: HTMLElement,
  end: string,
  onScrub?: (progress: number) => void,
) {
  const targets = Array.from(
    copy.querySelectorAll<HTMLElement>("[data-typo]"),
  );
  const words = targets.flatMap((el) => splitIntoWords(el));
  gsap.set(copy, { perspective: 1000, opacity: 1 });
  if (!words.length) {
    ScrollTrigger.create({
      trigger,
      start: "top top",
      end,
      pin: true,
      scrub: 0.35,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => onScrub?.(self.progress),
      onRefresh: (self) => onScrub?.(self.progress),
    });
    return;
  }

  const n = words.length;
  gsap.set(words, {
    transformStyle: "preserve-3d",
    transformOrigin: "50% 50%",
    opacity: 1,
    z: 0,
    y: 0,
    rotationX: 0,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: "top top",
      end,
      pin: true,
      scrub: 0.35,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => onScrub?.(self.progress),
      onRefresh: (self) => onScrub?.(self.progress),
    },
  });

  // Hold readable through most of the pin (~72%), then index4 fly-away.
  tl.to({}, { duration: 0.72 });
  tl.to(words, {
    opacity: 0,
    z: -1000,
    y: -12,
    rotationX: (i: number) => wordSpin(i, n, -1),
    ease: "none",
    stagger: { each: 0.02, from: "center" },
    duration: 0.28,
  });
}

/** Matching photo load: clip + lift, scrub cadence with nearby copy. */
export function wirePhotoEnter(imgs: HTMLElement[]) {
  if (!imgs.length) return;
  gsap.set(imgs, {
    opacity: 0,
    y: 48,
    scale: 0.96,
    clipPath: "inset(8% 6% 8% 6%)",
  });
  gsap.to(imgs, {
    opacity: 1,
    y: 0,
    scale: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    ease: "none",
    stagger: 0.08,
    scrollTrigger: {
      trigger: imgs[0]!.parentElement ?? imgs[0],
      start: "top 88%",
      end: "top 45%",
      scrub: 0.55,
      invalidateOnRefresh: true,
    },
  });
}

/** One-shot section reveal — opacity/transform only, matches homepage easing. */
export function wireContentReveal(els: HTMLElement[]) {
  if (!els.length) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(els, { clearProps: "opacity,transform" });
    return;
  }
  gsap.set(els, { opacity: 0, y: 28, willChange: "transform, opacity" });
  els.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 92%",
        toggleActions: "play none none none",
        once: true,
      },
      onComplete: () => {
        gsap.set(el, { clearProps: "willChange" });
      },
    });
  });
}

/** @deprecated use wireTypoScroll */
export const wireTypoEnter = wireTypoScroll;
