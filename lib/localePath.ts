import { asset } from "@/lib/asset";
import type { Locale } from "@/lib/i18n";
import { isLocale, locales } from "@/lib/i18n";

/** Replace locale segment in the current pathname, preserving the rest of the route. */
export function switchLocaleHref(pathname: string, target: Locale): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  let path = pathname || "/";
  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || "/";
  }
  const parts = path.split("/").filter(Boolean);
  const first = parts[0];
  if (first && isLocale(first)) {
    parts[0] = target;
  } else {
    parts.unshift(target);
  }
  const joined = `/${parts.join("/")}/`;
  return asset(joined);
}

export function localeLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    fa: "فارسی",
    tr: "Türkçe",
    en: "English",
  };
  return labels[locale];
}

export function localeShort(locale: Locale): string {
  return locale.toUpperCase();
}

export { locales };