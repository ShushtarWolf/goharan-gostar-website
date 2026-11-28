"use client";

import { useEffect, useRef } from "react";
import { ui } from "@/content/ui";
import { href } from "@/lib/paths";
import { t, type Locale } from "@/lib/i18n";
import TransitionLink from "@/components/motion/TransitionLink";
import LanguageMenu from "@/components/LanguageMenu";
import { asset } from "@/lib/asset";

const NAV = [
  { key: "products" as const, path: "products" },
  { key: "applications" as const, path: "applications" },
  { key: "about" as const, path: "about" },
  { key: "contact" as const, path: "contact" },
];

/**
 * Codrops GooeyStickyMenu WebGL (ported) — fixed bottom, gxpore cyan glass.
 * Canvas draws the liquid; this nav is transparent once goo is live.
 */
export default function SiteHeader({ locale }: { locale: Locale }) {
  const menuRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
  const menu = menuRef.current;
    const canvas = canvasRef.current;
    if (!menu || !canvas) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const waitForPictures = () =>
      new Promise<HTMLElement[]>((resolve) => {
        const tick = () => {
          if (cancelled) return;
          // Only real intro photos. Never paint holds as .goo-picture.
          const pics = [
            ...document.querySelectorAll<HTMLElement>(".goo-picture[data-goo-target]"),
          ].slice(0, 8); // textures only for the intro photos; other images are strand shapes
          // Every page block can hold a strand now, so pages without
          // intro photos boot too (photos, when present, get textures).
          resolve(pics);
        };
        tick();
      });

    const start = async () => {
      const { bootGooey } = await import("@/lib/gooey/runGooey.js");
      const pictures = await waitForPictures();
      if (cancelled) return;
      // Scene lean targets — not painted (see runGooey holds).
      const holds = Array.from(
        document.querySelectorAll<HTMLElement>("[data-goo-hold]"),
      );
      const stop = await bootGooey({ canvas, menu, pictures, holds });
      if (cancelled) {
        stop();
        return;
      }
      cleanup = stop;
    };

    start().catch((err) => {
      // Surfaced on the page only with ?gooeydebug=1
      void import("@/lib/gooey/debug.js").then(({ gooeyDebug }) =>
        gooeyDebug("error", "boot: " + String(err?.message ?? err).slice(0, 300)),
      );
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    import("gsap").then(({ default: gsap }) => {
      gsap.fromTo(
        menu,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", delay: 0.15 },
      );
    });
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="goo pointer-events-none fixed inset-0 z-40 h-full w-full [transform:translateZ(0)]"
        aria-hidden
      />
      <nav
        ref={menuRef}
        aria-label="Primary"
        className="menu fixed bottom-6 left-1/2 z-50 flex h-[3.75rem] w-[min(100%-0.75rem,44rem)] max-w-[calc(100vw-0.75rem)] -translate-x-1/2 items-center gap-1.5 rounded-full px-2.5 sm:h-14 sm:gap-2 sm:px-3 md:bottom-8 md:h-16 md:gap-5 md:px-6"
        style={{
          background:
            "linear-gradient(180deg, rgba(30,40,55,0.45), rgba(12,14,18,0.55))",
          boxShadow:
            "0 12px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.2)",
          backdropFilter: "blur(18px) saturate(1.4)",
        }}
      >
        <TransitionLink
          href={href(locale)}
          locale={locale}
          path=""
          aria-label={ui.brand}
          className="relative z-[1] flex shrink-0 touch-manipulation items-center rounded-md p-1 -m-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
        >
          <span className="sr-only">{t(ui.nav.home, locale)}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/logo-fa.png")}
            alt=""
            draggable={false}
            className="pointer-events-none h-6 w-auto select-none sm:h-7 md:h-8"
          />
        </TransitionLink>

        <div className="flex min-w-0 flex-1 items-center justify-evenly gap-1.5 text-[12px] font-medium leading-tight tracking-wide text-white sm:justify-center sm:gap-2 sm:text-[14px] md:gap-6 md:text-[15px] md:tracking-normal">
          {NAV.map((item) => (
            <TransitionLink
              key={item.key}
              href={href(locale, item.path)}
              locale={locale}
              path={item.path}
              className="menu__link relative z-[1] shrink-0 touch-manipulation whitespace-nowrap px-1.5 [text-shadow:0_1px_8px_rgba(0,0,0,0.85),0_0_2px_rgba(0,0,0,1)] transition hover:text-cyan sm:px-2 md:px-0.5"
            >
              {t(ui.nav[item.key], locale)}
            </TransitionLink>
          ))}
        </div>

        <LanguageMenu locale={locale} />
      </nav>
    </>
  );
}
