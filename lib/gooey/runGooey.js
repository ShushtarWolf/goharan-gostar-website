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
import { gooeyDebug } from "./debug.js";

applyMaterial("gxpore", SETTINGS, GLASS);

/**
 * @param {{ canvas: HTMLCanvasElement, menu: HTMLElement, pictures: HTMLElement[], holds?: HTMLElement[] }} opts
 * @returns {() => void} cleanup
 */
export function runGooey({ canvas, menu, pictures, holds = [] }) {
  gooeyDebug("stage", "runGooey");
  if (!pictures.length) {
    gooeyDebug("error", "no .goo-picture elements");
    return () => {};
  }
  if (!Goo.supported(canvas)) {
    gooeyDebug("webgl2", "NOT available");
    gooeyDebug("error", "WebGL2 context could not be created");
    return () => {};
  }

  const images = pictures
    .map((el) => (el.tagName === "IMG" ? el : el.querySelector("img")))
    .filter(Boolean);

  if (!images.length) {
    gooeyDebug("error", "no <img> in pictures");
    return () => {};
  }

  // Device-pixel cap: 2, dropped to 1 if the GPU resets or never paints at 2.
  let maxDpr = 2;
  let goo = null;
  let lost = false;
  let losses = 0;
  let failedFrames = 0;
  let painted = false;

  const describe = () => {
    if (!goo) return;
    const gl = goo.gl;
    let renderer = "";
    try {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      renderer = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    } catch {}
    gooeyDebug("webgl2", "yes");
    gooeyDebug("renderer", renderer);
    gooeyDebug("sdf format", goo.sdf?.name || (goo.sdf?.packed ? "RGBA8 packed" : String(goo.sdf?.internal)));
    gooeyDebug("precision", goo.precision);
    gooeyDebug("canvas", `${canvas.width}x${canvas.height} css ${goo.width}x${goo.height} dpr ${goo.dpr.toFixed(2)} (cap ${maxDpr})`);
    gooeyDebug("maxFragUniformVec", gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
  };

  const create = () => {
    try {
      goo = new Goo(canvas, images, { maxDpr });
      gooeyDebug("stage", "Goo created");
      gooeyDebug("error", goo.lastError || "none");
      describe();
      return true;
    } catch (err) {
      goo = null;
      console.warn("[gooey]", err);
      gooeyDebug("stage", "Goo init FAILED");
      gooeyDebug("error", String(err && err.message ? err.message : err).slice(0, 400));
      return false;
    }
  };

  if (!create()) return () => {};

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
    goo?.resize();
  };
  window.addEventListener("resize", onResize);
  measureMenu();
  goo.resize();

  // Show the CSS glass pill whenever the canvas isn't verifiably painting.
  const showFallback = () => {
    menu.classList.remove("is-drawn");
    document.documentElement.classList.remove("is-goo");
    painted = false;
  };

  // iOS can reset the GPU (memory pressure, backgrounding, a long frame): recover.
  const onLost = (e) => {
    e.preventDefault();
    lost = true;
    losses += 1;
    if (losses >= 2) maxDpr = 1;
    showFallback();
    gooeyDebug("context", `LOST x${losses}`);
  };
  const onRestored = () => {
    lost = false;
    gooeyDebug("context", `restored (losses ${losses})`);
    failedFrames = 0;
    if (create()) {
      goo.resize();
    }
  };
  canvas.addEventListener("webglcontextlost", onLost, false);
  canvas.addEventListener("webglcontextrestored", onRestored, false);

  const findPicture = (i, round, out) => {
    closestToBox(boxes[i], rest, GLASS.soften[0] * rest.hy * round, out);
    return true;
  };

  let lastScroll = window.scrollY;
  const frame = () => {
    if (lost || !goo) return;
    try {
      step();
    } catch (err) {
      gooeyDebug("error", "frame: " + String(err && err.message ? err.message : err).slice(0, 300));
    }
  };
  const step = () => {
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

    const ok = goo.render({
      boxes,
      visible,
      strands,
      strings: [],
      letters: [],
      titles: [],
      motion,
    });
    // Keep the CSS glass pill until a real WebGL frame has painted, so labels
    // stay readable on iOS when the canvas would otherwise be fully transparent.
    if (ok && !painted) {
      menu.classList.add("is-drawn");
      document.documentElement.classList.add("is-goo");
      painted = true;
      gooeyDebug("painted", `yes (draw #${goo.draws}, ${Math.round(performance.now())}ms after nav start)`);
    } else if (!ok) {
      failedFrames += 1;
      if (painted) showFallback();
      if (failedFrames % 30 === 0) {
        gooeyDebug("painted", `no (${failedFrames} frames, draws ${goo.draws || 0})`);
        if (goo.lastError) gooeyDebug("error", goo.lastError);
      }
      // Never painted at DPR 2 after ~2s: rebuild lighter at DPR 1.
      if (failedFrames === 120 && maxDpr > 1) {
        maxDpr = 1;
        gooeyDebug("quality", "retry at dpr 1");
        create();
        goo?.resize();
      }
    } else {
      failedFrames = 0;
    }
  };

  gsap.ticker.add(frame);
  frame();

  return () => {
    gsap.ticker.remove(frame);
    window.removeEventListener("resize", onResize);
    canvas.removeEventListener("webglcontextlost", onLost, false);
    canvas.removeEventListener("webglcontextrestored", onRestored, false);
    menu.classList.remove("is-drawn");
    document.documentElement.classList.remove("is-goo");
    gsap.set(menu, { clearProps: "transform" });
  };
}

// Wait for one picture to be usable as a texture, at most `ms`.
function whenLoaded(img, ms) {
  if (img.complete && img.naturalWidth > 0) {
    return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
  }
  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer);
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
      resolve();
    };
    const timer = setTimeout(done, ms);
    img.addEventListener("load", done);
    img.addEventListener("error", done);
  });
}

export async function bootGooey({ canvas, menu, pictures, holds = [] }) {
  const t0 = performance.now();
  gooeyDebug("stage", "boot");
  gooeyDebug("ua", navigator.userAgent.slice(0, 160));
  gooeyDebug("devicePixelRatio", window.devicePixelRatio);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  gooeyDebug("reducedMotion", reduced ? "ON (gooey skipped, as in 68fb0a7)" : "off");
  // Same gate as the original 68fb0a7 navbar.
  if (reduced) return () => {};
  gooeyDebug("pictures", pictures.length);
  gooeyDebug("stage", "loading pictures");
  const imgOf = (el) => (el.tagName === "IMG" ? el : el.querySelector("img"));
  // The liquid needs the photos as textures before it can draw. Lazy photos only start
  // downloading once they are on screen, so on a phone network WebGL used to start
  // (and the CSS pill stayed) exactly while the photos passed the bar. Fetch them now.
  for (const el of pictures) {
    const img = imgOf(el);
    if (img && img.loading === "lazy" && !img.complete) img.loading = "eager";
  }
  await Promise.all(pictures.map((el) => (imgOf(el) ? whenLoaded(imgOf(el), 15000) : null)));
  const ready = pictures.filter((el) => {
    const img = imgOf(el);
    return img && img.complete && img.naturalWidth > 0;
  });
  gooeyDebug("pictures", `${ready.length}/${pictures.length} loaded in ${Math.round(performance.now() - t0)}ms`);
  gooeyDebug("stage", "pictures ready");
  if (!ready.length) {
    gooeyDebug("error", "no picture loaded");
    return () => {};
  }
  const stop = runGooey({ canvas, menu, pictures: ready, holds });
  gooeyDebug("init ms", Math.round(performance.now() - t0));
  return stop;
}
