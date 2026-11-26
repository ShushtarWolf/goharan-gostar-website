import InnerMarkdownPage from "@/components/content/InnerMarkdownPage";
import { responsibilityNote } from "@/content/site-pages";
import { ui } from "@/content/ui";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function ResponsibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <InnerMarkdownPage
      title={t(ui.nav.responsibility, locale)}
      eyebrow={ui.brand}
    >
      <p data-typo data-reveal>
        {t(responsibilityNote, locale)}
      </p>
    </InnerMarkdownPage>
  );
}