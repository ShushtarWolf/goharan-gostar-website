/**
 * Slim runner for Codrops GooeyStickyMenu WebGL on GXPORE.
 * Fixed bottom menu + picture strands. No ScrollSmoother / settings panel / letter titles.
 *
 * Scene sticky without painted boxes: optional [data-goo-hold] elements lean the
 * menu toward the active scene. Never pass holds as .goo-picture — WebGL paints those opaque.
 */
import gsap from "gsap";
import { Goo, GLASS } from "./goo.js";
import { Strands, MenuMotion, SETTINGS, closestToBox } from "./strands.js";
import { applyMaterial } from "./materials.js";

applyMaterial("gxpore", SETTINGS, GLASS);

/**
 * @param {{ canvas: HTMLCanvasElement, menu: HTMLElement, pictures: HTMLElement[], holds?: HTMLElement[] }} opts
 * @returns {() => void} cleanup
 */
export function runGooey({ canvas, menu, pictures, holds = [] }) {
  if (!Goo.supported() || !pictures.length) return () => {};

  const images = pictures
    .map((el) => (el.tagName === "IMG" ? el : el.querySelector("img")))
    .filter(Boolean);

  if (!images.length) return () => {};

  let goo;
  try {
    goo = new Goo(canvas, images);
  } catch (err) {
    console.warn("[gooey]", err);
    return () => {};
  }

  menu.classList.add("is-drawn");
  document.documentElement.classList.add("is-goo");

  const strands = new Strands(pictures.length);
  const motion = new MenuMotion();
  const boxes = pictures.map(() => ({
    x: 0,
    y: 0,
    hx: 0,
    hy: 0,
    zoom: 1,
    focusY: 0.5,
  }));
  const rest = { x: 0, y: 0, hx: 0, hy: 0 };
  const visible = [];
  let leanX = 0;
  let leanY = 0;
  /** Extra lean toward scene holds (not painted). */
  let holdLeanX = 0;
  let holdLeanY = 0;

  gsap.set(menu, { x: 0, y: 0 });
  const setX = gsap.quickSetter(menu, "x", "px");
  const setY = gsap.quickSetter(menu, "y", "px");

  const measureMenu = () => {
    const m = menu.getBoundingClientRect();
    Object.assign(rest, {
      x: m.left + m.width / 2 - leanX,
      y: m.top + m.height / 2 - leanY,
      hx: m.width / 2,
      hy: m.height / 2,
    });
  };

  const onResize = () => {
    measureMenu();
    goo.resize();
  };
  window.addEventListener("resize", onResize);
  measureMenu();
  goo.resize();

  const findPicture = (i, round, out) => {
    closestToBox(boxes[i], rest, GLASS.soften[0] * rest.hy * round, out);
    return true;
  };

  let lastScroll = window.scrollY;
  const frame = () => {
    const dt = Math.min(gsap.ticker.deltaRatio(60) / 60, 1 / 30);
    const scrollY = window.scrollY;
    const speed = Math.min(Math.abs(scrollY - lastScroll) / Math.max(dt, 1e-3), 4000);
    lastScroll = scrollY;

    measureMenu();
    visible.length = 0;
    pictures.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const b = boxes[i];
      b.x = r.left + r.width / 2;
      b.y = r.top + r.height / 2;
      b.hx = r.width / 2;
      b.hy = r.height / 2;
      if (b.y + b.hy > -goo.height * 0.2 && b.y - b.hy < goo.height * 1.2) {
        visible.push(i);
      }
    });

    // Lean menu toward nearest on-screen scene hold (no WebGL paint).
    let best = null;
    let bestDist = Infinity;
    for (const el of holds) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > goo.height) continue;
      const hx = r.left + r.width / 2;
      const hy = r.top + r.height / 2;
      const dx = hx - rest.x;
      const dy = hy - rest.y;
      const d = Math.hypot(dx, dy);
      if (d < bestDist) {
        bestDist = d;
        best = { dx, dy, d };
      }
    }
    const reach = Math.max(rest.hy * 8, 280);
    const wantX = best && best.d < reach ? best.dx * 0.12 * (1 - best.d / reach) : 0;
    const wantY = best && best.d < reach ? best.dy * 0.18 * (1 - best.d / reach) : 0;
    holdLeanX += (wantX - holdLeanX) * Math.min(1, dt * 8);
    holdLeanY += (wantY - holdLeanY) * Math.min(1, dt * 8);

    strands.update(dt, rest, speed, findPicture);
    motion.update(dt, rest, [strands]);

    const x = motion.menu.x - rest.x + holdLeanX;
    const y = motion.menu.y - rest.y + holdLeanY;
    if (Math.abs(x - leanX) > 0.01 || Math.abs(y - leanY) > 0.01) {
      leanX = x;
      leanY = y;
      setX(x);
      setY(y);
    }

    goo.render({
      boxes,
      visible,
      strands,
      strings: [],
      letters: [],
      titles: [],
      motion,
    });
  };

  gsap.ticker.add(frame);
  frame();

  return () => {
    gsap.ticker.remove(frame);
    window.removeEventListener("resize", onResize);
    menu.classList.remove("is-drawn");
    document.documentElement.classList.remove("is-goo");
    gsap.set(menu, { clearProps: "transform" });
  };
}

export async function bootGooey({ canvas, menu, pictures, holds = [] }) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  await Promise.all(
    pictures.map((el) => {
      const img = el.tagName === "IMG" ? el : el.querySelector("img");
      return img?.decode?.().catch(() => {}) ?? Promise.resolve();
    }),
  );
  return runGooey({ canvas, menu, pictures, holds });
}
