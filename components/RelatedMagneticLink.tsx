"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { withViewTransition } from "@/lib/motion/viewTransition";
import { stripBasePathForRouter } from "@/lib/motion/routerHref";

const SCRAMBLE_LATIN =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>/+=";
const SCRAMBLE_FA =
  "ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی۱۲۳۴۵۶۷۸۹";
const COLORS = ["#00a8e8", "#5ec8f0", "#e8eef5", "#7dd3fc"];

function scramblePool(forFa: boolean) {
  const pool = forFa ? SCRAMBLE_FA : SCRAMBLE_LATIN;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

type Props = {
  href: string;
  title: string;
  body: string;
};

/**
 * Magnetic pull + underline + scramble on hover.
 * Title/body use data-typo so homepage index4 enter matches the rest of the page.
 */
export default function RelatedMagneticLink({ href, title, body }: Props) {
  const router = useRouter();
  const rootRef = useRef<HTMLAnchorElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  const isFa = useMemo(() => /[\u0600-\u06FF]/.test(title), [title]);

  useEffect(() => {
    const root = rootRef.current;
    const lineEl = lineRef.current;
    const titleEl = titleRef.current;
    if (!root || !lineEl || !titleEl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const xTo = gsap.quickTo(root, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(root, "y", { duration: 0.55, ease: "power3.out" });
    const pull = 0.28;
    let scrambling = false;
    let scrambleTimer: gsap.core.Tween | null = null;

    const wordSpans = () =>
      Array.from(titleEl.querySelectorAll<HTMLElement>(".typo-word"));

    const ensureOrig = (span: HTMLElement) => {
      if (!span.dataset.orig) span.dataset.orig = span.textContent ?? "";
      return span.dataset.orig;
    };

    const restore = () => {
      wordSpans().forEach((span) => {
        gsap.killTweensOf(span);
        span.textContent = ensureOrig(span);
        span.style.color = "";
      });
      scrambling = false;
    };

    const runScramble = () => {
      if (scrambling) return;
      const spans = wordSpans();
      if (!spans.length) return;
      scrambling = true;
      scrambleTimer?.kill();
      spans.forEach((span, i) => {
        const original = ensureOrig(span);
        if (!original || /^\s+$/.test(original)) return;
        gsap.killTweensOf(span);
        gsap.fromTo(
          span,
          { opacity: 0.45 },
          {
            duration: 0.035,
            opacity: 1,
            ease: "none",
            repeat: 3,
            repeatRefresh: true,
            delay: i * 0.03,
            onRepeat: () => {
              span.textContent = isFa
                ? scrambledWord(original, true)
                : scramblePool(false);
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
      scrambleTimer = gsap.delayedCall(0.03 * spans.length + 0.35, () => {
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
      wordSpans().forEach((s) => gsap.killTweensOf(s));
      gsap.set(root, { clearProps: "transform" });
    };
  }, [isFa, title]);

  return (
    <a
      ref={rootRef}
      href={href}
      className="relative mx-auto block max-w-2xl will-change-transform"
      style={{ touchAction: "manipulation" }}
      onClick={(e) => {
        if (
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) {
          return;
        }
        e.preventDefault();
        withViewTransition(() => {
          router.push(stripBasePathForRouter(href));
        });
      }}
    >
      <span className="sr-only">{title}</span>
      <span
        ref={titleRef}
        data-typo
        aria-hidden
        className="font-display block text-2xl font-semibold leading-snug tracking-tight text-mist md:text-4xl md:leading-[1.2]"
      >
        {title}
      </span>
      <span
        ref={lineRef}
        aria-hidden
        className="mt-3 block h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-cyan to-transparent"
      />
      <span
        data-typo
        className="mt-3 block text-sm leading-7 text-mist/55 md:mt-4 md:text-base md:leading-8"
      >
        {body}
      </span>
    </a>
  );
}

function scrambledWord(source: string, forFa: boolean) {
  return Array.from(source)
    .map((ch) =>
      ch === " " || ch === "\u200c" ? ch : scramblePool(forFa),
    )
    .join("");
}
