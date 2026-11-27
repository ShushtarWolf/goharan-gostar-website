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
    <div className="pointer-events-none fixed bottom-24 end-3 z-[80] md:bottom-28">
      <div className="pointer-events-auto flex max-w-[13.5rem] flex-col items-stretch gap-1 rounded-2xl border border-white/15 bg-black/75 px-3 py-2 text-[11px] leading-snug text-mist shadow-lg backdrop-blur-md">
        <span className="font-medium">{COPY[mode][locale]}</span>
        <span className="flex flex-wrap gap-x-2 gap-y-0.5">
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
        </span>
      </div>
    </div>
  );
}
