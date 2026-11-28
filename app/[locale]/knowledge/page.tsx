import InnerMarkdownPage from "@/components/content/InnerMarkdownPage";
import TransitionLink from "@/components/motion/TransitionLink";
import { typo } from "@/components/layout/typography";
import { ui } from "@/content/ui";
import { href } from "@/lib/paths";
import { isLocale, t, type Locale, type Localized } from "@/lib/i18n";
import { notFound } from "next/navigation";

const GUIDES: { path: string; title: Localized<string> }[] = [
  { path: "sintered-porous-plastic", title: { fa: "پلاستیک متخلخل", tr: "Gözenekli plastik", en: "Porous plastic" } },
  { path: "faq", title: { fa: "سوالات متداول", tr: "Sık sorulan sorular", en: "FAQ" } },
  { path: "catalogs", title: { fa: "کاتالوگ‌ها", tr: "Kataloglar", en: "Catalogs" } },
  { path: "applications", title: { fa: "کاربرد قطعات متخلخل", tr: "Gözenekli parçaların kullanımı", en: "Uses of porous parts" } },
];

const NEWS_EMPTY: Localized<string> = {
  fa: "هنوز خبری منتشر نشده است.",
  tr: "Henüz haber yayımlanmadı.",
  en: "No news has been published yet.",
};
const ARTICLES_EMPTY: Localized<string> = {
  fa: "هنوز مقاله‌ای منتشر نشده است.",
  tr: "Henüz makale yayımlanmadı.",
  en: "No articles have been published yet.",
};

export default async function KnowledgePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <InnerMarkdownPage title={t(ui.navMain.knowledge, locale)} eyebrow={ui.brand}>
      <section id="guides">
        <ul className="space-y-4">
          {GUIDES.map((g) => (
            <li key={g.path} className="border-t border-white/10 pt-4">
              <TransitionLink
                href={href(locale, g.path)}
                className="text-lg text-mist transition hover:text-cyan"
              >
                {t(g.title, locale)}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </section>
      <section id="articles" className="pt-6">
        <h2 className={`mb-3 ${typo.subsectionTitle}`}>
          {locale === "fa" ? "مقالات" : locale === "tr" ? "Makaleler" : "Articles"}
        </h2>
        <p>{t(ARTICLES_EMPTY, locale)}</p>
      </section>
      <section id="news" className="pt-6">
        <h2 className={`mb-3 ${typo.subsectionTitle}`}>{t(ui.footerNav.news, locale)}</h2>
        <p>{t(NEWS_EMPTY, locale)}</p>
      </section>
    </InnerMarkdownPage>
  );
}
