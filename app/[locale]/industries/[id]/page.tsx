import IndustryCatalog from "@/components/industries/IndustryCatalog";
import InnerPageHero from "@/components/layout/InnerPageHero";
import PageContent from "@/components/layout/PageContent";
import PageShell from "@/components/layout/PageShell";
import {
  getIndustry,
  industries,
  type IndustryId,
} from "@/content/industries";
import { ui } from "@/content/ui";
import { isLocale, locales, t, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    industries.map((ind) => ({ locale, id: ind.id })),
  );
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const industry = getIndustry(id);
  if (!industry) notFound();

  return (
    <PageShell>
      <InnerPageHero title={t(industry.name, locale)} eyebrow={ui.brand} />
      <PageContent width="6xl" variant="soft">
        <IndustryCatalog locale={locale} industryId={industry.id as IndustryId} />
      </PageContent>
    </PageShell>
  );
}