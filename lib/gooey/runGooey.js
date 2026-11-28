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
  if (typeof WebGL2RenderingContext === "undefined") {
    gooeyDebug("webgl2", "NOT available");
    gooeyDebug("error", "WebGL2 is not supported");
    return () => {};
  }

  const images = pictures
    .map((el) => (el.tagName === "IMG" ? el : el.querySelector("img")))
    .filter(Boolean);


  // iOS (iPhone, iPad incl. desktop-mode iPadOS): lighter canvas and textures, since a
  // long first frame or memory pressure there makes WebKit drop the WebGL context.
  const IOS =
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const MAX_TRIES = 3; // fresh canvases after a loss that never restores
  let maxDpr = IOS ? 1.5 : 2;
  const maxTexture = IOS ? 512 : Infinity;
  let cv = canvas; // the canvas in use (a fresh one replaces it after an unrecovered loss)
  let goo = null;
  let lost = false;
  let losses = 0;
  let restores = 0;
  let tries = 0;
  let failedFrames = 0;
  let painted = false;
  let gen = 0; // bumps to abandon an init in flight
  let lastStage = "none";
  let initStart = performance.now();
  let restoreTimer = 0;
  let retryTimer = 0;
  let disposed = false;
  const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));
  const canvasCount = () => document.querySelectorAll("canvas").length;

  gooeyDebug("ios", IOS ? "yes" : "no");
  gooeyDebug("painted", "no");
  gooeyDebug("restore attempts", 0);

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
    gooeyDebug("texture", `${goo.layer.width}x${goo.layer.height} x${images.length}`);
    gooeyDebug("canvas", `${cv.width}x${cv.height} css ${goo.width}x${goo.height} dpr ${goo.dpr.toFixed(2)} (cap ${maxDpr})`);
    gooeyDebug("canvases on page", canvasCount());
    gooeyDebug("maxFragUniformVec", gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
  };

  const showFallback = () => {
    menu.classList.remove("is-drawn");
    document.documentElement.classList.remove("is-goo");
    painted = false;
    gooeyDebug("painted", "no");
  };

  // Builds a Goo on the current canvas, spread over several frames.
  const build = async () => {
    const my = ++gen;
    const g = new Goo(cv, images, { maxDpr, maxTexture });
    goo = null;
    initStart = performance.now();
    failedFrames = 0;
    try {
      await g.init(nextFrame, (stage) => {
        lastStage = stage;
        gooeyDebug("stage", "init: " + stage);
      });
      if (my !== gen || disposed) {
        g.dispose();
        return;
      }
      goo = g;
      measureMenu();
      gooeyDebug("stage", "Goo created");
      gooeyDebug("init ms", Math.round(performance.now() - initStart));
      gooeyDebug("error", "none");
      describe();
    } catch (err) {
      if (my !== gen || disposed) return;
      const msg = String(err && err.message ? err.message : err).slice(0, 300);
      gooeyDebug("error", "init: " + msg);
      gooeyDebug("stage", "init FAILED at " + lastStage);
      console.warn("[gooey]", err);
      // A loss during init is handled by onLost; anything else: try a fresh canvas.
      // (the lost event is dispatched a little after isContextLost() turns true)
      const ctxLost = !!(g.gl && g.gl.isContextLost());
      if (!lost && !ctxLost) scheduleFresh();
    }
  };

  const onLost = (e) => {
    if (e.target !== cv) return;
    e.preventDefault(); // without this, webglcontextrestored never fires
    lost = true;
    losses += 1;
    gen += 1; // abandon an init in flight
    const stageAtLoss = goo ? (painted ? "drawing" : "drawn, not yet painted") : lastStage;
    gooeyDebug("context", `LOST x${losses}`);
    gooeyDebug("loss", `#${losses} at ${Math.round(performance.now() - initStart)}ms after init start; last stage: ${stageAtLoss}`);
    goo = null;
    showFallback();
    clearTimeout(restoreTimer);
    restoreTimer = setTimeout(() => {
      if (lost && !disposed) {
        gooeyDebug("context", `LOST x${losses}; no restore within 1.5s, new canvas`);
        scheduleFresh();
      }
    }, 1500);
  };

  const onRestored = (e) => {
    if (e.target !== cv || disposed) return;
    clearTimeout(restoreTimer);
    lost = false;
    restores += 1;
    gooeyDebug("restore attempts", restores);
    gooeyDebug("context", `restored after loss x${losses}`);
    maxDpr = 1;
    void build();
  };

  const listen = (el) => {
    el.addEventListener("webglcontextlost", onLost, false);
    el.addEventListener("webglcontextrestored", onRestored, false);
  };
  const unlisten = (el) => {
    el.removeEventListener("webglcontextlost", onLost, false);
    el.removeEventListener("webglcontextrestored", onRestored, false);
  };

  // A brand-new canvas and context at DPR 1, with backoff (0s, 3s, 6s), up to MAX_TRIES.
  // React keeps its own canvas: it's hidden, and ours sits next to it.
  const scheduleFresh = () => {
    if (disposed) return;
    if (tries >= MAX_TRIES) {
      gooeyDebug("stage", `gave up after ${tries} fresh canvases (CSS pill stays)`);
      return;
    }
    tries += 1;
    gooeyDebug("restore attempts", `${restores} restore, ${tries}/${MAX_TRIES} fresh canvas`);
    clearTimeout(retryTimer);
    retryTimer = setTimeout(() => {
      if (disposed) return;
      const fresh = canvas.cloneNode(false);
      fresh.removeAttribute("style");
      unlisten(cv);
      if (cv !== canvas) {
        try {
          cv.getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext();
        } catch {}
        cv.remove();
      }
      canvas.style.display = "none";
      canvas.after(fresh);
      cv = fresh;
      listen(cv);
      lost = false;
      maxDpr = 1;
      gooeyDebug("canvases on page", canvasCount());
      void build();
    }, tries === 1 ? 0 : 1500 * 2 ** (tries - 1));
  };

  // Everything the liquid can hold. The intro photos (painted from their texture layer) come
  // first; every other content block on the page (headings, paragraphs, images, cards,
  // buttons...) is a "ghost": a DOM-rect shape strands hold that the canvas never paints.
  // Strand state is per target and persists while the target exists.
  const strands = new Strands(0);
  const motion = new MenuMotion();
  const targets = []; // { el, layer, ghost, near, dead }
  const boxes = [];
  const byEl = new Map();
  const blankItem = () => new Strands(1).items[0];
  const addTarget = (el, layer) => {
    const t = { el, layer, ghost: layer < 0, near: false, dead: false };
    const box = { x: 0, y: -1e5, hx: 1, hy: 1, zoom: 1, focusY: 0.5, layer, ghost: layer < 0 };
    // reuse a slot whose element is gone and whose strand has fully let go
    let i = targets.findIndex((o, k) => o.dead && !strands.items[k].joined && !strands.items[k].springing);
    if (i < 0) {
      i = targets.length;
      targets.push(t);
      boxes.push(box);
      strands.items.push(blankItem());
    } else {
      byEl.delete(targets[i].el);
      targets[i] = t;
      boxes[i] = box;
      strands.items[i] = blankItem();
    }
    byEl.set(el, i);
    io?.observe(el);
  };

  // Only blocks near the bar are measured each frame (IntersectionObserver band).
  const io =
    typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              const i = byEl.get(e.target);
              if (i !== undefined) targets[i].near = e.isIntersecting;
            }
          },
          { rootMargin: "0px 0px 240px 0px", threshold: 0 },
        )
      : null;
  images.forEach((img, k) => addTarget(pictures[k], k));

  const BLOCKS =
    "h1,h2,h3,h4,h5,h6,p,img,picture,video,figure,button,a,li,blockquote,dt,dd,label,input,textarea,select,table,[data-goo-block]";
  const LEAVES = new Set(["IMG", "PICTURE", "VIDEO", "BUTTON", "INPUT", "TEXTAREA", "SELECT"]);
  const scan = () => {
    const root = document.querySelector("main") || document.body;
    const vh = window.innerHeight || 800;
    for (let i = 0; i < targets.length; i++) {
      if (!targets[i].dead && !targets[i].el.isConnected) {
        targets[i].dead = true;
        targets[i].near = false;
        io?.unobserve(targets[i].el);
      }
    }
    for (const el of root.querySelectorAll(BLOCKS)) {
      if (byEl.has(el)) continue;
      if (el.closest(".menu, #gooey-debug, canvas, [aria-hidden='true'], [data-goo-skip]")) continue;
      // the innermost block: a card that holds a heading and a paragraph lets those hold strands
      if (!LEAVES.has(el.tagName) && !el.matches("[data-goo-block]") && el.querySelector(BLOCKS)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 12 || r.height < 8 || r.height > vh * 1.5) continue;
      if (getComputedStyle(el).position === "fixed") continue;
      addTarget(el, -1);
    }
    gooeyDebug("blocks", `${targets.filter((t) => !t.dead).length} tracked, ${targets.filter((t) => t.near).length} near`);
  };
  scan();
  const scanTimer = setInterval(scan, 1200);
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

  listen(cv);
  void build();

  // At most MAX targets are drawn at once (the shader's limit): the held ones, then the
  // nearest to the bar. Others can't take hold until a slot frees up.
  const MAX_ACTIVE = 8;
  const active = new Set();
  const findPicture = (i, round, out, held) => {
    if (!held && !active.has(i)) return false;
    closestToBox(boxes[i], rest, GLASS.soften[0] * rest.hy * round, out);
    return true;
  };

  let lastScroll = window.scrollY;
  const frame = () => {
    if (lost || !goo || goo.stage !== "ready") return;
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
    active.clear();
    const held = [];
    const near = [];
    for (let i = 0; i < targets.length; i++) {
      const t = targets[i];
      const s = strands.items[i];
      const holding = s.joined || s.springing;
      if (!holding && (t.dead || !t.near)) continue;
      const b = boxes[i];
      if (t.dead || !t.el.isConnected) {
        // gone (page change): far away, so its strand snaps and draws back
        b.y = -1e5;
      } else {
        const r = t.el.getBoundingClientRect();
        b.x = r.left + r.width / 2;
        b.y = r.top + r.height / 2;
        b.hx = Math.max(r.width / 2, 0.5);
        b.hy = Math.max(r.height / 2, 0.5);
      }
      if (holding) held.push(i);
      else if (b.hx > 1 && b.y + b.hy > 0 && b.y - b.hy < goo.height) {
        const gx = Math.max(Math.abs(b.x - rest.x) - b.hx - rest.hx, 0);
        const gy = Math.max(Math.abs(b.y - rest.y) - b.hy - rest.hy, 0);
        near.push([gx * gx + gy * gy, i]);
      }
    }
    near.sort((a, b) => a[0] - b[0]);
    for (const i of held) if (active.size < MAX_ACTIVE) active.add(i);
    for (const [, i] of near) {
      if (active.size >= MAX_ACTIVE) break;
      active.add(i);
    }
    for (const i of active) visible.push(i);

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
      gooeyDebug("painted", `yes (draw #${goo.draws}, ${Math.round(performance.now() - initStart)}ms after init start)`);
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
        goo.dispose();
        void build();
        return;
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
    clearInterval(scanTimer);
    io?.disconnect();
    disposed = true;
    gen += 1;
    clearTimeout(restoreTimer);
    clearTimeout(retryTimer);
    unlisten(cv);
    if (cv !== canvas) {
      cv.remove();
      canvas.style.display = "";
    }
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
  gooeyDebug("load ms", Math.round(performance.now() - t0));
  return runGooey({ canvas, menu, pictures: ready, holds });
}
