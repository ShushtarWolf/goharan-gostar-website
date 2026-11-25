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
  return sign * Math.abs(i - (n - 1) / 2) * 18;
}

type ScrollOpts = {
  trigger?: Element;
  start?: string;
  end?: string;
};

/**
 * Codrops index4 enter on scroll — long scrub so motion is visible
 * while the block is still on screen. Stays readable after enter.
 * Scroll back up reverses. No GSAP pin (prefer CSS sticky where needed).
 */
export function wireTypoScroll(el: HTMLElement, opts?: ScrollOpts) {
  const words = splitIntoWords(el);
  if (!words.length) return;

  const n = words.length;
  gsap.set(el, { perspective: 1200 });
  gsap.set(words, {
    transformStyle: "preserve-3d",
    transformOrigin: "50% 50%",
    opacity: 0,
    z: -1100,
  });

  gsap.fromTo(
    words,
    {
      opacity: 0,
      z: -1100,
      y: 48,
      rotationX: (i: number) => wordSpin(i, n, 1),
    },
    {
      opacity: 1,
      z: 0,
      y: 0,
      rotationX: 0,
      ease: "none",
      stagger: { each: 0.04, from: "center" },
      scrollTrigger: {
        trigger: opts?.trigger ?? el,
        start: opts?.start ?? "top 92%",
        end: opts?.end ?? "top 28%",
        scrub: 0.65,
        invalidateOnRefresh: true,
      },
    },
  );
}

/**
 * Frame track scrub — CSS sticky stage holds the canvas; NO GSAP pin.
 * Text enters early (or already visible), stays readable until a late exit.
 */
export function wireTypoFrameScrub(
  copy: HTMLElement,
  track: HTMLElement,
  onScrub?: (progress: number) => void,
  opts?: { enterFromDepth?: boolean },
) {
  const enterFromDepth = opts?.enterFromDepth === true;
  const targets = Array.from(
    copy.querySelectorAll<HTMLElement>("[data-typo]"),
  );
  const words = targets.flatMap((el) => splitIntoWords(el));
  gsap.set(copy, { perspective: 1200, opacity: 1 });

  const scrubBase = {
    trigger: track,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.35,
    invalidateOnRefresh: true,
    onUpdate: (self: ScrollTrigger) => onScrub?.(self.progress),
    onRefresh: (self: ScrollTrigger) => onScrub?.(self.progress),
  };

  if (!words.length) {
    ScrollTrigger.create(scrubBase);
    return;
  }

  const n = words.length;
  gsap.set(words, {
    transformStyle: "preserve-3d",
    transformOrigin: "50% 50%",
    opacity: enterFromDepth ? 0 : 1,
    z: enterFromDepth ? -1100 : 0,
    y: enterFromDepth ? 36 : 0,
    rotationX: 0,
  });

  const tl = gsap.timeline({ scrollTrigger: scrubBase });

  if (enterFromDepth) {
    // First ~12% of track — readable once the sticky stage fills the view.
    tl.fromTo(
      words,
      {
        opacity: 0,
        z: -1100,
        y: 36,
        rotationX: (i: number) => wordSpin(i, n, 1),
      },
      {
        opacity: 1,
        z: 0,
        y: 0,
        rotationX: 0,
        ease: "none",
        stagger: { each: 0.025, from: "center" },
        duration: 0.12,
      },
      0,
    );
    tl.to({}, { duration: 0.8 });
  } else {
    // Hero: visible for nearly the whole scrub.
    tl.to({}, { duration: 0.92 });
  }

  // Late fly-away only — never blank while the stage owns the viewport.
  tl.to(words, {
    opacity: 0,
    z: -1000,
    y: -12,
    rotationX: (i: number) => wordSpin(i, n, -1),
    ease: "none",
    stagger: { each: 0.02, from: "center" },
    duration: 0.08,
  });
}

/** Matching photo load: clip + lift, scrub with nearby copy. */
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
    ease: "none",
    stagger: 0.1,
    scrollTrigger: {
      trigger: imgs[0]!.parentElement ?? imgs[0],
      start: "top 90%",
      end: "top 35%",
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });
}

/** @deprecated use wireTypoScroll */
export const wireTypoEnter = wireTypoScroll;

/** @deprecated use wireTypoFrameScrub (sticky track, no pin) */
export const wireTypoPinExit = wireTypoFrameScrub;
