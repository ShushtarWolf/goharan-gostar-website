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
 * Codrops index4 scrub — enter on arrival, stay readable while the line
 * is still on screen, exit only as it leaves past the top.
 */
export function wireTypoScroll(el: HTMLElement) {
  const words = splitIntoWords(el);
  if (!words.length) return;

  const n = words.length;
  gsap.set(el, { perspective: 1000 });
  gsap.set(words, {
    transformStyle: "preserve-3d",
    transformOrigin: "50% 50%",
    opacity: 0,
    z: -900,
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: el,
        // Exit only when the line itself has left the viewport —
        // old end:"top 8%" made short intro/CTA lines vanish while
        // the section (and photos) were still fully on screen.
        start: "top 88%",
        end: "bottom top",
        scrub: 0.5,
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
        duration: 0.18,
      },
      0,
    )
    // Hold readable for most of the travel through the viewport.
    .to({}, { duration: 0.64 })
    .to(words, {
      opacity: 0,
      z: -900,
      y: -16,
      rotationX: (i: number) => wordSpin(i, n, -1),
      ease: "none",
      stagger: { each: 0.025, from: "center" },
      duration: 0.18,
    });
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
  gsap.set(copy, { perspective: 1000, opacity: 1 });

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
    z: enterFromDepth ? -900 : 0,
    y: enterFromDepth ? 24 : 0,
    rotationX: 0,
  });

  const tl = gsap.timeline({ scrollTrigger: pinBase });

  if (enterFromDepth) {
    tl.fromTo(
      words,
      {
        opacity: 0,
        z: -900,
        y: 24,
        rotationX: (i: number) => wordSpin(i, n, 1),
      },
      {
        opacity: 1,
        z: 0,
        y: 0,
        rotationX: 0,
        ease: "none",
        stagger: { each: 0.02, from: "center" },
        duration: 0.14,
      },
      0,
    );
    tl.to({}, { duration: 0.66 });
  } else {
    // Hero: readable from first paint; exit only late in the pin.
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
      end: "top 40%",
      scrub: 0.55,
      invalidateOnRefresh: true,
    },
  });
}

/** @deprecated use wireTypoScroll */
export const wireTypoEnter = wireTypoScroll;
