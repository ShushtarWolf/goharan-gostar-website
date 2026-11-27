import LocaleHtmlAttrs from "@/components/LocaleHtmlAttrs";
import { MainChrome, OptionalSiteFooter } from "@/components/layout/LayoutChrome";
import SiteHeader from "@/components/SiteHeader";
import { isLocale, type Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const fontClass = locale === "fa" ? "font-locale-fa" : "font-locale-latin";

  return (
    <div className={fontClass}>
      <LocaleHtmlAttrs locale={locale} />
      <SiteHeader locale={locale} />
      <MainChrome>{children}</MainChrome>
      <OptionalSiteFooter locale={locale} />
    </div>
  );
}
