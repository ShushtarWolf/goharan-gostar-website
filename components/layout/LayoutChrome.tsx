"use client";

import SiteFooter from "@/components/SiteFooter";
import type { Locale } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Path after the locale segment, ignoring optional GitHub Pages basePath. */
function pathAfterLocale(pathname: string, locale: Locale): string[] {
  const parts = (pathname || "/").replace(/\/$/, "").split("/").filter(Boolean);
  const idx = parts.indexOf(locale);
  return idx >= 0 ? parts.slice(idx + 1) : parts;
}

/** Hides duplicate footer on homepage (HomeExperience renders its own). */
export function OptionalSiteFooter({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "";
  const rest = pathAfterLocale(pathname, locale);
  if (rest.length === 0) return null;
  return <SiteFooter locale={locale} />;
}

export function MainChrome({ children }: { children: ReactNode }) {
  return <div className="pb-36 md:pb-40">{children}</div>;
}
