export const locales = ["fa", "tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fa";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "fa" ? "rtl" : "ltr";
}

export type Localized<T> = Record<Locale, T>;

export function t<T>(map: Localized<T>, locale: Locale): T {
  return map[locale] ?? map.fa;
}
