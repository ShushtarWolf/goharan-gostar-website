"use client";

import { useRef } from "react";
import { ui } from "@/content/ui";
import { href } from "@/lib/paths";
import { t, type Locale, locales } from "@/lib/i18n";
import { asset } from "@/lib/asset";
import GooeyCanvas from "@/components/GooeyCanvas";

const NAV = [
  { key: "home" as const, path: "" },
  { key: "products" as const, path: "products" },
  { key: "applications" as const, path: "applications" },
  { key: "about" as const, path: "about" },
  { key: "contact" as const, path: "contact" },
];

/**
 * Codrops Gooey Sticky Menu placement: fixed bottom, glossy liquid drawn on canvas,
 * HTML links sit on top. Site colors only (cyan / graphite) — no red.
 */
export default function SiteHeader({ locale }: { locale: Locale }) {
  const menuRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <GooeyCanvas menuRef={menuRef} />
      <nav
        ref={menuRef}
        aria-label="Primary"
        className="fixed bottom-6 left-1/2 z-50 flex h-14 w-[min(100%-1.5rem,42rem)] -translate-x-1/2 items-center gap-3 rounded-full bg-transparent px-4 md:bottom-8 md:h-16 md:gap-5 md:px-6"
      >
        <a href={href(locale)} className="flex shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/logo-fa.png")}
            alt={ui.brand}
            className="h-7 w-auto md:h-8"
          />
        </a>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-3 overflow-x-auto text-sm leading-none text-white/80 md:gap-6">
          {NAV.map((item) => (
            <a
              key={item.key}
              href={href(locale, item.path)}
              className="whitespace-nowrap transition hover:text-white"
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
