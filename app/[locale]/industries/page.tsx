import IndustriesIndex from "@/components/industries/IndustriesIndex";
import InnerPageHero from "@/components/layout/InnerPageHero";
import PageContent from "@/components/layout/PageContent";
import PageShell from "@/components/layout/PageShell";
import { ui } from "@/content/ui";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <PageShell>
      <InnerPageHero
        eyebrow={ui.brand}
        title={t(ui.industriesPage.title, locale)}
        subtitle={t(ui.industriesPage.subtitle, locale)}
      />
      <PageContent width="6xl" variant="soft">
        <IndustriesIndex locale={locale} />
      </PageContent>
    </PageShell>
  );
}