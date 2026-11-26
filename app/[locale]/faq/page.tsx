import PageShell from "@/components/layout/PageShell";
import InnerPageHero from "@/components/layout/InnerPageHero";
import PageContent from "@/components/layout/PageContent";
import { typo } from "@/components/layout/typography";
import { faqItems } from "@/content/site-pages";
import { ui } from "@/content/ui";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <PageShell>
      <InnerPageHero eyebrow={ui.brand} title={t(ui.nav.faq, locale)} />
      <PageContent>
        <dl className="space-y-10">
          {faqItems.map((item) => (
            <div key={t(item.q, locale)} data-reveal className="border-b border-white/10 pb-10">
              <dt data-typo className={`${typo.sectionTitle} text-2xl md:text-3xl`}>
                {t(item.q, locale)}
              </dt>
              <dd data-typo className={`mt-4 ${typo.bodyOnDark}`}>
                {t(item.a, locale)}
              </dd>
            </div>
          ))}
        </dl>
      </PageContent>
    </PageShell>
  );
}