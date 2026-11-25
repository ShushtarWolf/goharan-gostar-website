"use client";

import { useEffect, useRef } from "react";
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
          const pics = [
            ...document.querySelectorAll<HTMLElement>(".goo-picture"),
          ];
          if (pics.length) resolve(pics);
          else requestAnimationFrame(tick);
        };
        tick();
      });

    const start = async () => {
      const { bootGooey } = await import("@/lib/gooey/runGooey.js");
      const pictures = await waitForPictures();
      if (cancelled || !pictures.length) return;
      const stop = await bootGooey({ canvas, menu, pictures });
      if (cancelled) {
        stop();
        return;
      }
      cleanup = stop;
    };

    void start();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="goo pointer-events-none fixed inset-0 z-40 h-full w-full"
        aria-hidden
      />
      <nav
        ref={menuRef}
        aria-label="Primary"
        className="menu fixed bottom-6 left-1/2 z-50 flex h-14 w-[min(100%-1.5rem,44rem)] -translate-x-1/2 items-center gap-2 rounded-full px-3 md:bottom-8 md:h-16 md:gap-5 md:px-6"
        style={{
          background:
            "linear-gradient(180deg, rgba(30,40,55,0.45), rgba(12,14,18,0.55))",
          boxShadow:
            "0 12px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.2)",
          backdropFilter: "blur(18px) saturate(1.4)",
        }}
      >
        <a href={href(locale)} className="flex shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/logo-fa.png")}
            alt={ui.brand}
            className="h-7 w-auto md:h-8"
          />
        </a>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-2.5 overflow-x-auto text-[12px] leading-none text-white/80 md:gap-6 md:text-sm">
          {NAV.map((item) => (
            <a
              key={item.key}
              href={href(locale, item.path)}
              className="menu__link shrink-0 whitespace-nowrap transition hover:text-white"
            >
              {t(ui.nav[item.key], locale)}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2.5 text-[11px] leading-none tracking-wide md:gap-3 md:text-xs">
          {locales.map((l) => (
            <a
              key={l}
              href={href(l)}
              className={
                l === locale
                  ? "text-cyan"
                  : "text-white/45 transition hover:text-white"
              }
              hrefLang={l}
            >
              {l.toUpperCase()}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
