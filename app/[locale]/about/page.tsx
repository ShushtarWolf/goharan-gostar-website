import InnerMarkdownPage from "@/components/content/InnerMarkdownPage";
import { aboutParagraphs } from "@/content/site-pages";
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
    <InnerMarkdownPage
      title={t(ui.nav.about, locale)}
      eyebrow={`${t(ui.company, locale)} · ${ui.brand}`}
    >
      {t(aboutParagraphs, locale).map((p) => (
        <p key={p.slice(0, 24)} data-typo data-reveal>
          {p}
        </p>
      ))}
    </InnerMarkdownPage>
  );
}