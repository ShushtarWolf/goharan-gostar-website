import { asset } from "@/lib/asset";
import type { Locale } from "@/lib/i18n";

/** Locale-aware internal path (includes GitHub Pages basePath via asset()). */
export function href(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  const suffix = clean ? `/${clean}/` : "/";
  return asset(`/${locale}${suffix}`);
}
