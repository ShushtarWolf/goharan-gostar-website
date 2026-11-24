import { homeCopy } from "@/content/home";
import { ui } from "@/content/ui";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="text-3xl font-semibold text-mist md:text-4xl">
        {t(ui.nav.about, locale)}
      </h1>
      <p className="mt-3 text-cyan">{t(ui.company, locale)} · {ui.brand}</p>
      <p className="mt-8 text-base leading-8 text-mist/80">
        {t(homeCopy.introBody, locale)}
      </p>
    </main>
  );
}
