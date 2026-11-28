import InnerMarkdownPage from "@/components/content/InnerMarkdownPage";
import { aboutPage } from "@/content/about";
import { ui } from "@/content/ui";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { typo } from "@/components/layout/typography";
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
      {t(aboutPage.intro, locale).map((p) => (
        <p key={p.slice(0, 24)} data-typo data-reveal>
          {p}
        </p>
      ))}
      {aboutPage.sections.map((section) => (
        <section key={section.id} id={section.id} className="pt-6 md:pt-10">
          <h2 data-typo className={`mb-4 ${typo.subsectionTitle}`}>
            {t(section.title, locale)}
          </h2>
          {section.bullets ? (
            <ul className="space-y-3">
              {t(section.bullets, locale).map((b) => (
                <li
                  key={b.slice(0, 24)}
                  data-reveal
                  className="border-t border-cyan/30 pt-3"
                >
                  {b}
                </li>
              ))}
            </ul>
          ) : section.paragraphs ? (
            <div className="space-y-6">
              {t(section.paragraphs, locale).map((p) => (
                <p key={p.slice(0, 24)} data-reveal>
                  {p}
                </p>
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </InnerMarkdownPage>
  );
}
