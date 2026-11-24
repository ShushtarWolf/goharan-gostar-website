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

/** Aceternity-style dark ridge/groove shadow navbar (no mega-menu). */
export default function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="sticky top-0 z-50 px-3 pt-3 md:px-4 md:pt-4">
      <div
        className="mx-auto flex h-14 max-w-6xl items-center gap-4 rounded-2xl border border-white/[0.06] bg-[#0a0a0c]/90 px-4 backdrop-blur-xl md:h-16 md:gap-6 md:px-6"
        style={{
          boxShadow: [
            "0 0 0 1px rgba(0,0,0,0.85)",
            "inset 0 1px 0 0 rgba(255,255,255,0.08)",
            "inset 0 -1px 0 0 rgba(0,0,0,0.65)",
            "inset 0 0 0 1px rgba(255,255,255,0.03)",
            "0 12px 40px -8px rgba(0,0,0,0.75)",
            "0 4px 12px -2px rgba(0,0,0,0.55)",
          ].join(", "),
        }}
      >
        <a href={href(locale)} className="flex shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/logo-fa.png")}
            alt={ui.brand}
            className="h-8 w-auto md:h-9"
          />
        </a>

        <nav className="flex min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto text-sm leading-none text-mist/80 md:gap-7">
          {NAV.map((item) => (
            <a
              key={item.key}
              href={href(locale, item.path)}
              className="whitespace-nowrap transition hover:text-white"
            >
              {t(ui.nav[item.key], locale)}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 text-xs leading-none tracking-wide">
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
