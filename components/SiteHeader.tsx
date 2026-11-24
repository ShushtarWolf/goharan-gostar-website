"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ui } from "@/content/ui";
import { href } from "@/lib/paths";
import { t, type Locale, locales } from "@/lib/i18n";
import { asset } from "@/lib/asset";

const NAV = [
  { key: "home" as const, path: "" },
  { key: "products" as const, path: "products" },
  { key: "applications" as const, path: "applications" },
  { key: "about" as const, path: "about" },
  { key: "contact" as const, path: "contact" },
];

/**
 * Glossy sticky nav inspired by Codrops Gooey Sticky Menu —
 * site colors only (graphite / cyan / mist), floated down, elastic scroll motion.
 */
export default function SiteHeader({ locale }: { locale: Locale }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = Math.min(Math.abs(y - lastY), 48);
        lastY = y;
        // Gooey squash/stretch on scroll velocity, then elastic settle.
        gsap.to(bar, {
          scaleY: 1 + dy * 0.0035,
          scaleX: 1 - dy * 0.0012,
          duration: 0.12,
          ease: "power1.out",
          overwrite: "auto",
          onComplete: () => {
            gsap.to(bar, {
              scaleY: 1,
              scaleX: 1,
              duration: 0.85,
              ease: "elastic.out(1, 0.45)",
              overwrite: "auto",
            });
          },
        });
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Soft liquid sheen loop on the gloss layer
    const sheen = bar.querySelector<HTMLElement>("[data-sheen]");
    let sheenTween: gsap.core.Tween | undefined;
    if (sheen) {
      sheenTween = gsap.to(sheen, {
        xPercent: 120,
        duration: 4.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      sheenTween?.kill();
      gsap.killTweensOf(bar);
    };
  }, []);

  return (
    <header className="sticky top-6 z-50 px-3 md:top-8 md:px-4">
      <div
        ref={barRef}
        className="gooey-nav relative mx-auto flex h-14 max-w-5xl origin-center items-center gap-4 overflow-hidden rounded-full border border-white/10 px-4 will-change-transform md:h-16 md:gap-6 md:px-7"
        style={{
          background:
            "linear-gradient(180deg, rgba(30,36,48,0.72) 0%, rgba(12,14,18,0.82) 100%)",
          backdropFilter: "blur(22px) saturate(1.6)",
          WebkitBackdropFilter: "blur(22px) saturate(1.6)",
          boxShadow: [
            "0 0 0 1px rgba(0,168,232,0.12)",
            "inset 0 1px 0 0 rgba(255,255,255,0.18)",
            "inset 0 -1px 0 0 rgba(0,0,0,0.45)",
            "0 18px 48px -12px rgba(0,0,0,0.65)",
            "0 6px 16px -4px rgba(0,168,232,0.12)",
          ].join(", "),
        }}
      >
        {/* Glossy sheen sweep */}
        <span
          data-sheen
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
        />

        <a href={href(locale)} className="relative z-10 flex shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/logo-fa.png")}
            alt={ui.brand}
            className="h-8 w-auto md:h-9"
          />
        </a>

        <nav className="relative z-10 flex min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto text-sm leading-none text-mist/80 md:gap-7">
          {NAV.map((item) => (
            <a
              key={item.key}
              href={href(locale, item.path)}
              className="whitespace-nowrap transition hover:text-cyan"
            >
              {t(ui.nav[item.key], locale)}
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex shrink-0 items-center gap-3 text-xs leading-none tracking-wide">
          {locales.map((l) => (
            <a
              key={l}
              href={href(l)}
              className={
                l === locale
                  ? "text-cyan"
                  : "text-mist/45 transition hover:text-mist"
              }
              hrefLang={l}
            >
              {l.toUpperCase()}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
