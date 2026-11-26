import PageShell from "@/components/layout/PageShell";
import InnerPageHero from "@/components/layout/InnerPageHero";
import PageContent from "@/components/layout/PageContent";
import { typo } from "@/components/layout/typography";
import { porousPlasticSections } from "@/content/site-pages";
import { ui } from "@/content/ui";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function PorousPlasticPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <PageShell>
      <InnerPageHero eyebrow={ui.brand} title={t(ui.nav.material, locale)} />
      <PageContent>
        <div className="space-y-12">
          {porousPlasticSections.map((s) => (
            <section key={t(s.title, locale)} data-reveal className="text-center">
              <h2 data-typo className={typo.sectionTitle}>
                {t(s.title, locale)}
              </h2>
              <p data-typo className={`mt-4 max-w-2xl mx-auto ${typo.bodyOnDark}`}>
                {t(s.body, locale)}
              </p>
            </section>
          ))}
        </div>
      </PageContent>
    </PageShell>
  );
}