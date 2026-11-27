import TransitionLink from "@/components/motion/TransitionLink";
import { href } from "@/lib/paths";
import type { Locale } from "@/lib/i18n";

const COPY = {
  start: {
    fa: "پیش‌نمایش: پر شدن از ابتدای خط",
    en: "Preview: fill from the start of the line",
    tr: "Önizleme: satırın başından dolma",
  },
  center: {
    fa: "پیش‌نمایش: باز شدن از وسط به دو طرف",
    en: "Preview: open from the center outward",
    tr: "Önizleme: ortadan iki yana açılma",
  },
  otherStart: { fa: "از ابتدا", en: "From start", tr: "Baştan" },
  otherCenter: { fa: "از وسط", en: "From center", tr: "Ortadan" },
  home: { fa: "سایت اصلی", en: "Main site", tr: "Ana site" },
} as const;

export default function MotionPreviewBanner({
  locale,
  mode,
}: {
  locale: Locale;
  mode: "start" | "center";
}) {
  const other = mode === "start" ? "center" : "start";
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center px-3 pt-3">
      <div className="pointer-events-auto flex max-w-[min(100%,36rem)] flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs text-mist shadow-lg backdrop-blur-md md:text-sm">
        <span className="font-medium">{COPY[mode][locale]}</span>
        <span className="text-mist/40" aria-hidden>
          ·
        </span>
        <TransitionLink
          href={href(locale, `preview/motion-${other}`)}
          locale={locale}
          path={`preview/motion-${other}`}
          className="text-cyan transition hover:text-mist"
        >
          {other === "start" ? COPY.otherStart[locale] : COPY.otherCenter[locale]}
        </TransitionLink>
        <TransitionLink
          href={href(locale)}
          locale={locale}
          path=""
          className="text-mist/70 transition hover:text-mist"
        >
          {COPY.home[locale]}
        </TransitionLink>
      </div>
    </div>
  );
}
