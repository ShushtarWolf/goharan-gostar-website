"use client";

import { useEffect, useRef, type RefObject } from "react";

type Strand = {
  target: HTMLElement;
  /** 0..1 stretch; >1 broken halves retracting */
  t: number;
  broken: boolean;
  /** progress of snap retract 0..1 */
  snap: number;
  side: number; // -1 left / 1 right bias on menu
};

const CYAN = { r: 0, g: 168, b: 232 };
const GRAPHITE = { r: 18, g: 22, b: 30 };

function rgba(c: { r: number; g: number; b: number }, a: number) {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function dist(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.hypot(dx, dy);
}

/**
 * Canvas liquid under the fixed bottom nav: glossy cyan/graphite
 * strands that grip → stretch → snap (Codrops gooey motion language).
 */
export default function GooeyCanvas({
  menuRef,
}: {
  menuRef: RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const menu = menuRef.current;
    if (!canvas || !menu) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const strands = new Map<HTMLElement, Strand>();
    let raf = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const drawCapsule = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
    ) => {
      const rr = Math.min(r, h / 2, w / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    };

    /** Draw a tapered strand between two points (menu root → target foot). */
    const drawStrand = (
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      waist: number,
      foot: number,
      alpha: number,
    ) => {
      const len = dist(x0, y0, x1, y1) || 1;
      const nx = (x1 - x0) / len;
      const ny = (y1 - y0) / len;
      const px = -ny;
      const py = nx;

      // control points for a slight S-curve
      const mx = lerp(x0, x1, 0.45);
      const my = lerp(y0, y1, 0.45);

      ctx.beginPath();
      // left edge
      ctx.moveTo(x0 + px * waist * 1.6, y0 + py * waist * 1.6);
      ctx.quadraticCurveTo(
        mx + px * waist,
        my + py * waist,
        x1 + px * foot,
        y1 + py * foot,
      );
      // around foot
      ctx.quadraticCurveTo(x1, y1 + foot * 0.35, x1 - px * foot, y1 - py * foot);
      // right edge back
      ctx.quadraticCurveTo(
        mx - px * waist,
        my - py * waist,
        x0 - px * waist * 1.6,
        y0 - py * waist * 1.6,
      );
      ctx.closePath();

      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, rgba(CYAN, 0.85 * alpha));
      g.addColorStop(0.45, rgba(CYAN, 0.55 * alpha));
      g.addColorStop(1, rgba(GRAPHITE, 0.75 * alpha));
      ctx.fillStyle = g;
      ctx.fill();

      // gloss highlight along strand
      ctx.strokeStyle = rgba({ r: 255, g: 255, b: 255 }, 0.22 * alpha);
      ctx.lineWidth = Math.max(1, waist * 0.35);
      ctx.beginPath();
      ctx.moveTo(x0 + px * waist * 0.3, y0 + py * waist * 0.3);
      ctx.quadraticCurveTo(mx + px * waist * 0.2, my + py * waist * 0.2, x1, y1);
      ctx.stroke();
    };

    const tick = () => {
      if (!running) return;
      const W = window.innerWidth;
      const H = window.innerHeight;
      ctx.clearRect(0, 0, W, H);

      const mr = menu.getBoundingClientRect();
      const menuPad = 8;
      const mx = mr.left - menuPad;
      const my = mr.top - menuPad;
      const mw = mr.width + menuPad * 2;
      const mh = mr.height + menuPad * 2;

      // Liquid menu body (glossy capsule under the links)
      drawCapsule(mx, my, mw, mh, mh / 2);
      const body = ctx.createLinearGradient(mx, my, mx, my + mh);
      body.addColorStop(0, "rgba(40,52,68,0.92)");
      body.addColorStop(0.45, "rgba(0,168,232,0.55)");
      body.addColorStop(1, "rgba(12,14,18,0.95)");
      ctx.fillStyle = body;
      ctx.fill();

      // rim highlight
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.lineWidth = 1.25;
      drawCapsule(mx + 0.5, my + 0.5, mw - 1, mh - 1, mh / 2);
      ctx.stroke();

      // soft outer glow
      ctx.shadowColor = "rgba(0,168,232,0.35)";
      ctx.shadowBlur = 28;
      drawCapsule(mx, my, mw, mh, mh / 2);
      ctx.fillStyle = "rgba(0,168,232,0.08)";
      ctx.fill();
      ctx.shadowBlur = 0;

      if (!reduce) {
        const targets = document.querySelectorAll<HTMLElement>("[data-goo-target]");
        const menuTop = mr.top;
        const menuCx = mr.left + mr.width / 2;
        const unit = mh / 2;
        const touchGap = unit * 2.2;
        const maxLen = unit * 5.5;

        targets.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) return;
          // attach to bottom edge of target above the menu
          const tx = r.left + r.width / 2;
          const ty = r.bottom;
          const gap = menuTop - ty;
          if (gap < -unit || gap > maxLen * 1.4) {
            strands.delete(el);
            return;
          }

          let s = strands.get(el);
          if (!s) {
            if (gap > touchGap) return;
            s = {
              target: el,
              t: 0,
              broken: false,
              snap: 0,
              side: i % 2 === 0 ? -1 : 1,
            };
            strands.set(el, s);
          }

          const stretch = Math.max(0, gap) / maxLen;
          if (!s.broken) {
            s.t = Math.min(1.05, stretch);
            if (s.t >= 1) {
              s.broken = true;
              s.snap = 0;
            }
          } else {
            s.snap = Math.min(1, s.snap + 0.04);
            if (s.snap >= 1) {
              strands.delete(el);
              return;
            }
          }

          const rootX = menuCx + s.side * (mw * 0.28);
          const rootY = my + 4;
          const footX = tx + s.side * Math.min(40, r.width * 0.15);
          const footY = ty;

          if (!s.broken) {
            const waist = lerp(unit * 0.55, unit * 0.08, s.t);
            const foot = lerp(unit * 0.7, unit * 0.2, s.t);
            const alpha = lerp(1, 0.65, s.t);
            drawStrand(rootX, rootY, footX, footY, waist, foot, alpha);
          } else {
            // two retracting halves with bead tips
            const p = s.snap;
            const midX = lerp(rootX, footX, 0.35);
            const midY = lerp(rootY, footY, 0.35);
            const a = 1 - p;
            drawStrand(
              rootX,
              rootY,
              lerp(rootX, midX, 1 - p * 0.85),
              lerp(rootY, midY, 1 - p * 0.85),
              unit * 0.2 * a,
              unit * 0.12 * a,
              a,
            );
            drawStrand(
              footX,
              footY,
              lerp(footX, midX, 1 - p * 0.85),
              lerp(footY, midY, 1 - p * 0.85),
              unit * 0.18 * a,
              unit * 0.1 * a,
              a * 0.85,
            );
            // beads
            ctx.beginPath();
            ctx.arc(
              lerp(rootX, midX, 0.55 * (1 - p)),
              lerp(rootY, midY, 0.55 * (1 - p)),
              unit * 0.14 * a,
              0,
              Math.PI * 2,
            );
            ctx.fillStyle = rgba(CYAN, 0.7 * a);
            ctx.fill();
          }
        });

        // prune detached
        for (const [el, s] of strands) {
          if (!document.body.contains(el) && !s.broken) strands.delete(el);
        }
      }

      // top sheen on menu
      const sheen = ctx.createLinearGradient(mx, my, mx + mw, my + mh);
      sheen.addColorStop(0, "rgba(255,255,255,0)");
      sheen.addColorStop(0.35, "rgba(255,255,255,0.18)");
      sheen.addColorStop(0.55, "rgba(255,255,255,0)");
      sheen.addColorStop(1, "rgba(255,255,255,0)");
      drawCapsule(mx, my, mw, mh, mh / 2);
      ctx.fillStyle = sheen;
      ctx.fill();

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [menuRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40"
    />
  );
}
