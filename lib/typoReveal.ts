import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** default = current 3D word stagger. start/center are clip-fill preview modes. */
export type TypoMotionMode = "default" | "start" | "center";

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
  mode?: TypoMotionMode;
};

function reducedMotion(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isRtl(el: HTMLElement): boolean {
  return getComputedStyle(el).direction === "rtl";
}

function fillKind(el: HTMLElement, mode: "start" | "center"): string {
  if (mode === "center") return "center";
  return isRtl(el) ? "start-rtl" : "start-ltr";
}

function startClip(kind: string): string {
  // Keep horizontal units as % so GSAP interpolates a visible sweep.
  if (kind === "center") return "inset(-0.2em 50% -0.2em 50%)";
  if (kind === "start-ltr") return "inset(-0.2em 100% -0.2em 0%)";
  return "inset(-0.2em 0% -0.2em 100%)";
}

/** Preview fills are time-based (~1.2s). Scrub ranges were too short to see. */
const FILL_DURATION = 1.2;
const FILL_STAGGER = 0.22;
function typoSiblingIndex(el: HTMLElement, trigger?: Element): number {
  const root = trigger ?? el.parentElement;
  if (!root) return 0;
  const all = Array.from(root.querySelectorAll<HTMLElement>("[data-typo]"));
  const i = all.indexOf(el);
  return i < 0 ? 0 : i;
}

function fillAnimationName(kind: string): string {
  if (kind === "center") return "typo-fill-center";
  if (kind === "start-ltr") return "typo-fill-start-ltr";
  return "typo-fill-start-rtl";
}

/** CSS keyframe fill — survives a blocked GSAP ticker and late layout. */
function animateFill(ink: HTMLElement, kind: string, delay = 0) {
  gsap.killTweensOf(ink);
  ink.style.animation = "none";
  ink.style.clipPath = startClip(kind);
  // Force a reflow so the animation can restart on enter-back.
  void ink.offsetWidth;
  ink.style.clipPath = "";
  ink.style.animation = `${fillAnimationName(kind)} ${FILL_DURATION}s ${delay}s linear both`;
}

function elementInView(el: Element, viewportRatio = 0.8): boolean {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight * viewportRatio && r.bottom > 0;
}

/**
 * Play when the element is (or becomes) in view. IntersectionObserver plus
 * delayed layout / font kicks — a one-shot getBoundingClientRect at wire
 * time often missed the hero on the production page.
 */
function playWhenInView(el: Element, play: () => void) {
  let visible = false;
  const tryPlay = () => {
    if (visible) return;
    if (!elementInView(el, 0.92)) return;
    visible = true;
    play();
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !visible) {
          visible = true;
          play();
        } else if (!entry.isIntersecting) {
          visible = false;
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  io.observe(el);
  requestAnimationFrame(() => requestAnimationFrame(tryPlay));
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      requestAnimationFrame(tryPlay);
    });
  }
  window.addEventListener("load", tryPlay, { once: true });
}

/** Shrink-wrapped ghost + ink overlay so the clip follows the glyphs, not the box. */
function prepareLineFill(
  el: HTMLElement,
  mode: "start" | "center",
): HTMLElement | null {
  if (el.dataset.typoFill === "1") {
    return el.querySelector<HTMLElement>(".typo-fill-ink");
  }
  const text = el.textContent ?? "";
  if (!text.trim()) return null;

  const kind = fillKind(el, mode);
  const existingMax = getComputedStyle(el).maxWidth;
  el.textContent = "";
  el.classList.add("typo-fill-host");
  // Keep Tailwind max-w-* (e.g. hero max-w-3xl). Only cap at the parent when none is set.
  if (!existingMax || existingMax === "none") {
    el.style.maxWidth = "100%";
  }

  const ghost = document.createElement("span");
  ghost.className = "typo-fill-ghost";
  ghost.textContent = text;

  const ink = document.createElement("span");
  ink.className = "typo-fill-ink";
  ink.dataset.fill = kind;
  ink.setAttribute("aria-hidden", "true");
  ink.textContent = text;
  ink.style.clipPath = startClip(kind);

  el.append(ghost, ink);
  el.dataset.typoFill = "1";
  return ink;
}

function wireFillScroll(
  el: HTMLElement,
  mode: "start" | "center",
  opts?: ScrollOpts,
) {
  const ink = prepareLineFill(el, mode);
  if (!ink) return;
  const kind = ink.dataset.fill || fillKind(el, mode);
  ink.style.clipPath = startClip(kind);
  const trigger = opts?.trigger ?? el;
  const delay = typoSiblingIndex(el, opts?.trigger) * FILL_STAGGER;
  const play = () => animateFill(ink, kind, delay);
  playWhenInView(trigger, play);
}

function wireFillFrameScrub(
  copy: HTMLElement,
  track: HTMLElement,
  mode: "start" | "center",
  onScrub?: (progress: number) => void,
) {
  const targets = Array.from(
    copy.querySelectorAll<HTMLElement>("[data-typo]"),
  );
  const inks = targets
    .map((el) => prepareLineFill(el, mode))
    .filter((el): el is HTMLElement => !!el);

  gsap.set(copy, { opacity: 1 });
  inks.forEach((ink) => {
    const kind = ink.dataset.fill || fillKind(copy, mode);
    ink.style.clipPath = startClip(kind);
  });

  // Frame-sequence scrub is independent of typography fill.
  ScrollTrigger.create({
    trigger: track,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.35,
    invalidateOnRefresh: true,
    onUpdate: (self: ScrollTrigger) => onScrub?.(self.progress),
    onRefresh: (self: ScrollTrigger) => onScrub?.(self.progress),
  });

  if (!inks.length) return;

  const play = () => {
    inks.forEach((ink, i) => {
      const kind = ink.dataset.fill || fillKind(copy, mode);
      // Small lead delay so the clipped first paint is visible on load.
      animateFill(ink, kind, 0.15 + i * FILL_STAGGER);
    });
  };

  playWhenInView(copy, play);
}

/**
 * Codrops index4 enter on scroll — long scrub so motion is visible
 * while the block is still on screen. Stays readable after enter.
 * Scroll back up reverses. No GSAP pin (prefer CSS sticky where needed).
 */
export function wireTypoScroll(el: HTMLElement, opts?: ScrollOpts) {
  const mode = opts?.mode ?? "default";
  if (mode === "start" || mode === "center") {
    if (reducedMotion()) return;
    wireFillScroll(el, mode, opts);
    return;
  }

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
  opts?: { enterFromDepth?: boolean; mode?: TypoMotionMode },
) {
  const mode = opts?.mode ?? "default";
  if (mode === "start" || mode === "center") {
    if (reducedMotion()) {
      ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.35,
        invalidateOnRefresh: true,
        onUpdate: (self: ScrollTrigger) => onScrub?.(self.progress),
        onRefresh: (self: ScrollTrigger) => onScrub?.(self.progress),
      });
      return;
    }
    wireFillFrameScrub(copy, track, mode, onScrub);
    return;
  }

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

/** @deprecated use wireTypoFrameScrub (sticky track, no pin) */
export const wireTypoPinExit = wireTypoFrameScrub;
