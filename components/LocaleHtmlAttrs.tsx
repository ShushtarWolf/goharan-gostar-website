"use client";

import { useEffect } from "react";
import { localeDir, type Locale } from "@/lib/i18n";

export default function LocaleHtmlAttrs({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDir(locale);
  }, [locale]);
  return null;
}
