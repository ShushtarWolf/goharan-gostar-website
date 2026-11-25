import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Sections that pin + play index4 enter (not frame canvases). */
export const SCENE_PIN_END = "+=75%";

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

/**
 * Codrops index4 enter on scroll — long scrub so motion is visible
 * while the block is still on screen. Stays readable after enter.
 * Scroll back up reverses.
 */
export function wireTypoScroll(el: HTMLElement) {
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
        trigger: el,
        start: "top 92%",
        end: "top 28%",
        scrub: 0.65,
        invalidateOnRefresh: true,
      },
    },
  );
}

/**
 * Pin a static scene so enter plays while the section holds —
 * readable for most of the pin (no blank mid-scene exit).
 */
export function wireTypoScenePin(
  section: HTMLElement,
  copy: HTMLElement,
  end = "+=70%",
) {
  const targets = Array.from(
    copy.querySelectorAll<HTMLElement>("[data-typo]"),
  );
  const words = targets.flatMap((el) => splitIntoWords(el));
  if (!words.length) {
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end,
      pin: true,
      anticipatePin: 1,
    });
    return;
  }

  const n = words.length;
  gsap.set(copy, { perspective: 1200, opacity: 1 });
  gsap.set(words, {
    transformStyle: "preserve-3d",
    transformOrigin: "50% 50%",
    opacity: 0,
    z: -1100,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end,
      pin: true,
      scrub: 0.45,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  tl.fromTo(
    words,
    {
      opacity: 0,
      z: -1100,
      y: 40,
      rotationX: (i: number) => wordSpin(i, n, 1),
    },
    {
      opacity: 1,
      z: 0,
      y: 0,
      rotationX: 0,
      ease: "none",
      stagger: { each: 0.03, from: "center" },
      duration: 0.22,
    },
    0,
  );
  // Hold readable — no fly-away blanking this scene.
  tl.to({}, { duration: 0.78 });
}

/**
 * Index4 inside a pinned frame scene.
 * Hero (eager): text visible at load, late fly-away.
 * Later scenes: 3D enter at pin start, hold, then fly-away.
 */
export function wireTypoPinExit(
  copy: HTMLElement,
  trigger: HTMLElement,
  end: string,
  onScrub?: (progress: number) => void,
  opts?: { enterFromDepth?: boolean },
) {
  const enterFromDepth = opts?.enterFromDepth === true;
  const targets = Array.from(
    copy.querySelectorAll<HTMLElement>("[data-typo]"),
  );
  const words = targets.flatMap((el) => splitIntoWords(el));
  gsap.set(copy, { perspective: 1200, opacity: 1 });

  const pinBase = {
    trigger,
    start: "top top",
    end,
    pin: true,
    scrub: 0.35,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self: ScrollTrigger) => onScrub?.(self.progress),
    onRefresh: (self: ScrollTrigger) => onScrub?.(self.progress),
  };

  if (!words.length) {
    ScrollTrigger.create(pinBase);
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

  const tl = gsap.timeline({ scrollTrigger: pinBase });

  if (enterFromDepth) {
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
        duration: 0.16,
      },
      0,
    );
    tl.to({}, { duration: 0.64 });
  } else {
    tl.to({}, { duration: 0.8 });
  }

  tl.to(words, {
    opacity: 0,
    z: -1000,
    y: -12,
    rotationX: (i: number) => wordSpin(i, n, -1),
    ease: "none",
    stagger: { each: 0.02, from: "center" },
    duration: 0.2,
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
