"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

const SCRAMBLE =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>/+=";
const COLORS = ["#00a8e8", "#5ec8f0", "#e8eef5", "#7dd3fc"];

function scramblePool() {
  return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]!;
}

type Props = {
  href: string;
  title: string;
  body: string;
};

/**
 * Combo: Codrops MagneticButtons index5 (magnetic pull)
 * + LineTextHoverAnimations (char scramble + underline line).
 * Uses pointer events so fingers work on mobile.
 */
export default function RelatedMagneticLink({ href, title, body }: Props) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const chars = useMemo(() => Array.from(title), [title]);

  useEffect(() => {
    const root = rootRef.current;
    const lineEl = lineRef.current;
    if (!root || !lineEl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const spans = charRefs.current.filter(Boolean) as HTMLSpanElement[];
    const xTo = gsap.quickTo(root, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(root, "y", { duration: 0.55, ease: "power3.out" });
    const pull = 0.28;
    let scrambling = false;
    let scrambleTimer: gsap.core.Tween | null = null;

    const restore = () => {
      spans.forEach((span, i) => {
        gsap.killTweensOf(span);
        span.textContent = chars[i]!;
        span.style.color = "";
      });
      scrambling = false;
    };

    const runScramble = () => {
      if (scrambling) return;
      scrambling = true;
      scrambleTimer?.kill();
      spans.forEach((span, i) => {
        const original = chars[i]!;
        if (original === " ") return;
        gsap.killTweensOf(span);
        gsap.fromTo(
          span,
          { opacity: 0.4 },
          {
            duration: 0.035,
            opacity: 1,
            ease: "none",
            repeat: 3,
            repeatRefresh: true,
            delay: i * 0.028,
            onRepeat: () => {
              span.textContent = scramblePool();
              span.style.color =
                COLORS[Math.floor(Math.random() * COLORS.length)]!;
            },
            onComplete: () => {
              span.textContent = original;
              span.style.color = "";
            },
          },
        );
      });
      scrambleTimer = gsap.delayedCall(0.028 * spans.length + 0.3, () => {
        scrambling = false;
      });
    };

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      xTo((e.clientX - (rect.left + rect.width / 2)) * pull);
      yTo((e.clientY - (rect.top + rect.height / 2)) * pull);
    };

    const onEnter = () => {
      runScramble();
      gsap.to(lineEl, { scaleX: 1, duration: 0.45, ease: "power3.out" });
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
      gsap.to(lineEl, { scaleX: 0, duration: 0.35, ease: "power2.inOut" });
      restore();
    };

    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      scrambleTimer?.kill();
      gsap.killTweensOf(root);
      gsap.killTweensOf(lineEl);
      spans.forEach((s) => gsap.killTweensOf(s));
      gsap.set(root, { clearProps: "transform" });
    };
  }, [chars]);

  return (
    <a
      ref={rootRef}
      href={href}
      className="relative mx-auto mt-12 block max-w-2xl will-change-transform md:mt-14"
      style={{ touchAction: "manipulation" }}
    >
      <span className="sr-only">{title}</span>
      <span
        aria-hidden
        className="block text-3xl font-medium leading-tight tracking-tight text-mist md:text-5xl md:leading-[1.15]"
      >
        {chars.map((ch, i) => (
          <span
            key={`${ch}-${i}`}
            ref={(el) => {
              charRefs.current[i] = el;
            }}
            className={ch === " " ? "inline-block w-[0.35em]" : "inline-block"}
          >
            {ch}
          </span>
        ))}
      </span>
      <span
        ref={lineRef}
        aria-hidden
        className="mt-3 block h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-cyan to-transparent"
      />
      <span className="mt-5 block text-base leading-8 text-mist/55 md:text-lg md:leading-9">
        {body}
      </span>
    </a>
  );
}
