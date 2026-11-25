"use client";

import SiteFooter from "@/components/SiteFooter";
import { href } from "@/lib/paths";
import type { Locale } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides duplicate footer on homepage (HomeExperience renders its own). */
export function OptionalSiteFooter({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "";
  const home = href(locale).replace(/\/$/, "");
  const path = pathname.replace(/\/$/, "");
  if (path === home) return null;
  return <SiteFooter locale={locale} />;
}

export function MainChrome({ children }: { children: ReactNode }) {
  return <div className="pb-36 md:pb-40">{children}</div>;
}