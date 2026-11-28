// A 2D-canvas stand-in for Goo, used when the browser has no WebGL2 or refuses its
// contexts (some iPhones refuse every one from the first). Same interface as Goo, so
// runGooey drives it with the very same strands, targets and menu motion: the strands
// grow, stretch, neck and snap exactly as they do in WebGL. The bar itself stays the CSS
// frosted pill (unchanged); this draws only what reaches out of it: each strand's two
// halves (with the foot at the thing and the drop at a snapped tip) and the flare where
// a strand rises out of the bar, in the bar's colour. One small strip at the bottom of
// the viewport, and nothing is drawn while no strand is out.

import { GLASS } from "./goo.js";

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const smoothstep = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const SAMPLES = 18;

// The pill's own colour over the page: its gradient's middle, at the alpha the canvas
// element carries (set in CSS so overlapping shapes don't darken each other).
const COLOR = "rgb(58,66,80)";
const OPACITY = "0.65";

export class CanvasGoo {
  constructor(canvas, _images, { maxDpr = 2, band = null, menuEl = null } = {}) {
    this.canvas = canvas;
    this.band = band;
    this.menuEl = menuEl;
    this.maxDpr = maxDpr;
    this.fallback = true;
    this.stage = "new";
    this.gl = null;
    this.sdf = { name: "none (2D canvas)" };
    this.precision = "2d";
    this.layer = { width: 0, height: 0 };
    this.draws = 0;
    this.lastDrawOk = false;
    this.top = 0;
    this.drewSome = true;
  }

  async init(nextFrame, onStage = () => {}) {
    onStage("context");
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("no 2D context");
    this.ctx = ctx;
    this.canvas.style.opacity = OPACITY;
    this.resize();
    this.stage = "ready";
    onStage("ready");
  }

  resize() {
    const viewH = document.documentElement.clientHeight || window.innerHeight || 1;
    this.viewH = viewH;
    const strip = this.band ? Math.min(Math.ceil(this.band() || 0), viewH) : viewH;
    this.canvas.style.top = "auto";
    this.canvas.style.bottom = "0px";
    this.canvas.style.height = strip + "px";
    this.width = this.canvas.clientWidth || window.innerWidth || 1;
    this.height = this.canvas.clientHeight || strip;
    this.top = Math.max(viewH - this.height, 0);
    this.dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);
    const w = Math.round(this.width * this.dpr);
    const h = Math.round(this.height * this.dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.drewSome = true; // clear on the next frame
  }

  // The bar as it's on screen (the CSS pill, with its lean): a capsule.
  pill(motion) {
    if (this.menuEl) {
      const r = this.menuEl.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, hx: r.width / 2, hy: r.height / 2 };
    }
    return motion.menu;
  }

  render({ boxes, visible, strands, motion }) {
    if (this.stage !== "ready") return false;
    const { ctx } = this;
    const u = motion.unit || 1;
    const live = [];
    for (const i of visible) {
      const s = strands.items[i];
      if (!s) continue;
      if (s.radius[0] > 0.05 || s.radius[2] > 0.05 || s.bead[0] > 0.05 || s.bead[1] > 0.05) live.push(i);
    }
    if (!live.length && !this.drewSome) {
      this.lastDrawOk = true;
      return true;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, -this.top * this.dpr);
    ctx.fillStyle = COLOR;
    const m = this.pill(motion);

    for (const i of live) {
      const s = strands.items[i];
      const b = boxes[i];
      const lenA = Math.hypot(s.t1.x, s.t1.y);
      // the thing's half: foot at its anchor on the thing's edge
      this.half(s.ax, s.ay, s.ax + s.t1.x, s.ay + s.t1.y, s.radius[0], s.radius[1], s.bead[0], (h) => {
        const n = 1 - clamp((h * lenA) / Math.max(s.foot[1], 1e-3), 0, 1);
        return s.foot[0] * n * n;
      });
      // the menu's half, rooted inside the bar
      this.half(s.bx, s.by, s.bx + s.t2.x, s.by + s.t2.y, s.radius[2], s.radius[3], s.bead[1], null);
      // where it rises out of the bar, it flares into it
      const k = 0.5 * GLASS.flare * u * s.foot[2];
      if (k > 0.3) this.flare(s, m, k);
      // the strand ends on the thing's edge, a little over its rim
      if (b && b.hx > 1) {
        const inset = 0.1 * u;
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillRect(b.x - b.hx + inset, b.y - b.hy + inset, 2 * (b.hx - inset), 2 * (b.hy - inset));
        ctx.restore();
      }
    }
    // the bar itself is the CSS pill: nothing of ours under it
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    const r = Math.min(m.hy, m.hx);
    ctx.roundRect
      ? ctx.roundRect(m.x - m.hx, m.y - m.hy, 2 * m.hx, 2 * m.hy, r)
      : ctx.rect(m.x - m.hx, m.y - m.hy, 2 * m.hx, 2 * m.hy);
    ctx.fill();
    ctx.restore();

    this.drewSome = live.length > 0;
    this.draws += 1;
    this.lastDrawOk = true;
    return true;
  }

  // Half a strand as sdStrand draws it (no cuts on touch): radius eases from ra at the anchor
  // to the neck's rb at the tip, which swells into a drop by bead; extra(h) widens it (the foot).
  half(ax, ay, tx, ty, ra, rb, bead, extra) {
    const dx = tx - ax;
    const dy = ty - ay;
    const len = Math.hypot(dx, dy);
    const { ctx } = this;
    const radius = (h) => {
      const swell = clamp((2.5 * bead) / Math.max(len, 1e-2), 1e-3, 1);
      const to = 1 - h;
      return Math.max(rb + (ra - rb) * to * to + bead * smoothstep(1 - swell, 1, h) + (extra ? extra(h) : 0), 0);
    };
    if (len < 0.5) {
      const r0 = radius(1);
      if (r0 > 0.05) {
        ctx.beginPath();
        ctx.arc(ax, ay, r0, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }
    const nx = -dy / len;
    const ny = dx / len;
    const left = [];
    const right = [];
    for (let k = 0; k <= SAMPLES; k++) {
      const h = k / SAMPLES;
      const r = radius(h);
      const px = ax + dx * h;
      const py = ay + dy * h;
      left.push(px + nx * r, py + ny * r);
      right.push(px - nx * r, py - ny * r);
    }
    ctx.beginPath();
    ctx.moveTo(left[0], left[1]);
    for (let k = 2; k < left.length; k += 2) ctx.lineTo(left[k], left[k + 1]);
    for (let k = right.length - 2; k >= 0; k -= 2) ctx.lineTo(right[k], right[k + 1]);
    ctx.closePath();
    ctx.fill();
    // round ends
    const r0 = radius(0);
    const r1 = radius(1);
    ctx.beginPath();
    if (r0 > 0.05) ctx.arc(ax, ay, r0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    if (r1 > 0.05) ctx.arc(tx, ty, r1, 0, Math.PI * 2);
    ctx.fill();
  }

  // A fillet where the strand's line leaves the bar's capsule: the liquid drawn up from the
  // bar's surface into the strand, k wide on each side.
  flare(s, m, k) {
    const inside = (x, y) => {
      const span = Math.max(m.hx - m.hy, 0);
      const qx = x - m.x - clamp(x - m.x, -span, span);
      return Math.hypot(qx, y - m.y) < m.hy;
    };
    const ex = s.bx + s.t2.x; // the menu half's tip
    const ey = s.by + s.t2.y;
    const fx = s.ax + s.t1.x;
    const fy = s.ay + s.t1.y;
    // the whole strand while it holds; the menu's half alone once it has snapped
    const [x0, y0, x1, y1] = s.joined ? [s.bx, s.by, s.ax, s.ay] : [s.bx, s.by, ex, ey];
    if (!inside(x0, y0) || inside(x1, y1)) return;
    let lo = 0;
    let hi = 1;
    for (let n = 0; n < 14; n++) {
      const mid = (lo + hi) / 2;
      if (inside(x0 + (x1 - x0) * mid, y0 + (y1 - y0) * mid)) lo = mid;
      else hi = mid;
    }
    const px = x0 + (x1 - x0) * hi;
    const py = y0 + (y1 - y0) * hi;
    // the capsule's outward normal there
    const span = Math.max(m.hx - m.hy, 0);
    const cx = m.x + clamp(px - m.x, -span, span);
    let nx = px - cx;
    let ny = py - m.y;
    const nl = Math.hypot(nx, ny) || 1;
    nx /= nl;
    ny /= nl;
    const tx = -ny;
    const ty = nx;
    // the strand's radius where it leaves the bar
    const r = Math.max(s.radius[2], s.radius[3], 0.5);
    void fx;
    void fy;
    const { ctx } = this;
    const dip = 0.5 * k; // the base sits a little inside the bar (hidden under the pill)
    ctx.beginPath();
    ctx.moveTo(px + tx * (r + k) - nx * dip, py + ty * (r + k) - ny * dip);
    ctx.quadraticCurveTo(px + tx * r, py + ty * r, px + tx * r + nx * k, py + ty * r + ny * k);
    ctx.lineTo(px - tx * r + nx * k, py - ty * r + ny * k);
    ctx.quadraticCurveTo(px - tx * r, py - ty * r, px - tx * (r + k) - nx * dip, py - ty * (r + k) - ny * dip);
    ctx.closePath();
    ctx.fill();
  }

  unchanged() {
    return false;
  }

  dispose() {
    this.stage = "disposed";
    try {
      this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } catch {}
    this.canvas.width = 1;
    this.canvas.height = 1;
  }
}
