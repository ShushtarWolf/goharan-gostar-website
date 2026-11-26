import PageShell from "@/components/layout/PageShell";
import InnerPageHero from "@/components/layout/InnerPageHero";
import PageContent from "@/components/layout/PageContent";
import { typo } from "@/components/layout/typography";
import { catalogIntro, catalogs } from "@/content/site-pages";
import { ui } from "@/content/ui";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function CatalogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <PageShell>
      <InnerPageHero eyebrow={ui.brand} title={t(ui.nav.catalogs, locale)} />
      <PageContent>
        <p data-typo data-reveal className={typo.bodyOnDark}>
          {t(catalogIntro, locale)}
        </p>
        <ul className="mt-10 space-y-4">
          {catalogs.map((c) => (
            <li key={c.href} data-reveal>
              <a
                href={c.href}
                className={`${typo.linkCta} text-lg hover:text-mist`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(c.label, locale)}
              </a>
            </li>
          ))}
        </ul>
      </PageContent>
    </PageShell>
  );
}