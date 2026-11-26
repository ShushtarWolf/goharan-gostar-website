import { asset } from "@/lib/asset";
import type { Locale } from "@/lib/i18n";

function localePath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  const suffix = clean ? `/${clean}/` : "/";
  return `/${locale}${suffix}`;
}

/** Locale-aware path for Next.js `router.push` (basePath is applied by the router). */
export function routerPath(locale: Locale, path = ""): string {
  return localePath(locale, path);
}

/** Locale-aware `<a href>` including GitHub Pages basePath. */
export function href(locale: Locale, path = ""): string {
  return asset(localePath(locale, path));
}
