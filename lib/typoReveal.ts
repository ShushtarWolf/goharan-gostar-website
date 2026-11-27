import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollOpts = {
  trigger?: Element;
  start?: string;
  end?: string;
};

function reducedMotion(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isRtl(el: HTMLElement): boolean {
  return getComputedStyle(el).direction === "rtl";
}

function fillKind(el: HTMLElement): "start-rtl" | "start-ltr" {
  return isRtl(el) ? "start-rtl" : "start-ltr";
}

const FILL_DURATION = 1.2;
const LINE_STAGGER = 0.2;
const SIBLING_STAGGER = 0.18;

function afterFonts(fn: () => void) {
  const run = () => requestAnimationFrame(() => requestAnimationFrame(fn));
  if (typeof document === "undefined") return;
  if (document.fonts && document.fonts.status !== "loaded") {
    void document.fonts.ready.then(run);
    return;
  }
  run();
}

function typoSiblingIndex(el: HTMLElement, trigger?: Element): number {
  const root = trigger ?? el.parentElement;
  if (!root) return 0;
  const all = Array.from(root.querySelectorAll<HTMLElement>("[data-typo]"));
  const i = all.indexOf(el);
  return i < 0 ? 0 : i;
}

function elementInView(el: Element, viewportRatio = 0.8): boolean {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight * viewportRatio && r.bottom > 0;
}

/** CSS --typo-fill animation; survives a blocked GSAP ticker and late layout. */
function animateFill(host: HTMLElement, delay = 0) {
  host.classList.remove("is-revealing");
  host.style.animation = "none";
  host.style.setProperty("--typo-fill", "0%");
  void host.offsetWidth;
  host.style.animation = "";
  host.style.animationDelay = `${delay}s`;
  host.classList.add("is-revealing");
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

/** Group laid-out words into visual lines, each a shrink-wrapped fill host. */
function wrapVisualLines(el: HTMLElement): HTMLElement[] {
  if (el.dataset.typoFillLines === "1") {
    return Array.from(el.querySelectorAll<HTMLElement>(":scope > .typo-fill-host"));
  }
  const text = el.textContent ?? "";
  if (!text.trim()) return [];

  el.textContent = "";
  for (const part of text.split(/(\s+)/)) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      el.appendChild(document.createTextNode(part));
      continue;
    }
    const span = document.createElement("span");
    span.className = "typo-measure-word";
    span.textContent = part;
    el.appendChild(span);
  }

  const lines: string[] = [];
  let lineText = "";
  let lineTop: number | null = null;
  const flush = () => {
    const trimmed = lineText.replace(/\s+$/u, "").replace(/^\s+/u, "");
    if (trimmed) lines.push(trimmed);
    lineText = "";
  };

  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      lineText += node.textContent ?? "";
      continue;
    }
    if (!(node instanceof HTMLElement)) continue;
    const top = Math.round(node.offsetTop);
    if (lineTop !== null && top !== lineTop) flush();
    lineTop = top;
    lineText += node.textContent ?? "";
  }
  flush();

  if (!lines.length) lines.push(text.trim());

  el.textContent = "";
  el.dataset.typoFillLines = "1";
  const align = getComputedStyle(el).textAlign;
  const hosts: HTMLElement[] = [];
  for (const line of lines) {
    const host = document.createElement("span");
    host.className = "typo-fill-host";
    host.dataset.fill = fillKind(el);
    host.textContent = line;
    if (align === "center" || align === "-webkit-center") {
      host.style.marginInline = "auto";
    } else if (align === "right" || align === "end") {
      host.style.marginInlineStart = "auto";
    } else if (align === "left" || align === "start") {
      host.style.marginInlineEnd = "auto";
    }
    el.appendChild(host);
    hosts.push(host);
  }
  return hosts;
}

function prepareLineFill(host: HTMLElement): HTMLElement | null {
  if (host.dataset.typoFill === "1") {
    return host.querySelector<HTMLElement>(".typo-fill-ink");
  }
  const text = host.textContent ?? "";
  if (!text.trim()) return null;

  const kind = (host.dataset.fill as "start-rtl" | "start-ltr") || fillKind(host);
  host.textContent = "";
  host.classList.add("typo-fill-host");
  host.dataset.fill = kind;

  const ghost = document.createElement("span");
  ghost.className = "typo-fill-ghost";
  ghost.textContent = text;

  const ink = document.createElement("span");
  ink.className = "typo-fill-ink";
  ink.dataset.fill = kind;
  ink.setAttribute("aria-hidden", "true");
  ink.textContent = text;

  const glow = document.createElement("span");
  glow.className = "typo-fill-glow";
  glow.dataset.fill = kind;
  glow.setAttribute("aria-hidden", "true");
  glow.textContent = text;

  host.append(ghost, ink, glow);
  host.dataset.typoFill = "1";
  return ink;
}

function prepareTypoElement(el: HTMLElement): HTMLElement[] {
  const hosts = wrapVisualLines(el);
  return hosts.filter((host) => prepareLineFill(host));
}

function wireFillScroll(el: HTMLElement, opts?: ScrollOpts) {
  const hosts = prepareTypoElement(el);
  if (!hosts.length) return;
  const trigger = opts?.trigger ?? el;
  const base = typoSiblingIndex(el, opts?.trigger) * SIBLING_STAGGER;
  const play = () => {
    hosts.forEach((host, i) => animateFill(host, base + i * LINE_STAGGER));
  };
  playWhenInView(trigger, play);
}

function wireFillFrameScrub(
  copy: HTMLElement,
  track: HTMLElement,
  onScrub?: (progress: number) => void,
) {
  gsap.set(copy, { opacity: 1 });

  ScrollTrigger.create({
    trigger: track,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.35,
    invalidateOnRefresh: true,
    onUpdate: (self: ScrollTrigger) => onScrub?.(self.progress),
    onRefresh: (self: ScrollTrigger) => onScrub?.(self.progress),
  });

  afterFonts(() => {
    const targets = Array.from(
      copy.querySelectorAll<HTMLElement>("[data-typo]"),
    );
    const groups = targets.map((el) => prepareTypoElement(el));
    const hosts = groups.flat();
    if (!hosts.length) return;

    const play = () => {
      // Lead delay so the clipped first paint is visible on load.
      let cursor = 0;
      groups.forEach((group) => {
        group.forEach((host, i) => {
          animateFill(host, 0.15 + cursor + i * LINE_STAGGER);
        });
        cursor += SIBLING_STAGGER + Math.max(0, group.length - 1) * LINE_STAGGER;
      });
    };

    playWhenInView(copy, play);
  });
}

/**
 * Start-of-line typography fill (RTL: right-to-left, LTR: left-to-right).
 * Multi-line headings fill one line after another.
 */
export function wireTypoScroll(el: HTMLElement, opts?: ScrollOpts) {
  if (reducedMotion()) return;
  afterFonts(() => wireFillScroll(el, opts));
}

/**
 * Frame track scrub — CSS sticky stage holds the canvas; NO GSAP pin.
 * Typography uses the same start-of-line fill as the rest of the site.
 */
export function wireTypoFrameScrub(
  copy: HTMLElement,
  track: HTMLElement,
  onScrub?: (progress: number) => void,
) {
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
  wireFillFrameScrub(copy, track, onScrub);
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
