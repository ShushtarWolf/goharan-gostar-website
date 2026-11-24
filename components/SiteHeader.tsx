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

export default function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-graphite/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 md:px-6">
        <a href={href(locale)} className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/logo-fa.png")}
            alt={ui.brand}
            className="h-8 w-auto md:h-9"
          />
        </a>

        {/* Always-visible top links — no hamburger */}
        <nav className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto text-sm text-mist/85 md:gap-6">
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

        <div className="flex items-center gap-2 text-xs tracking-wide">
          {locales.map((l) => (
            <a
              key={l}
              href={href(l)}
              className={
                l === locale
                  ? "text-cyan"
                  : "text-mist/50 transition hover:text-mist"
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
