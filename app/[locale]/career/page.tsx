import InnerMarkdownPage from "@/components/content/InnerMarkdownPage";
import TransitionLink from "@/components/motion/TransitionLink";
import { typo } from "@/components/layout/typography";
import { careerNote } from "@/content/site-pages";
import { ui } from "@/content/ui";
import { href } from "@/lib/paths";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function CareerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <InnerMarkdownPage title={t(ui.nav.career, locale)} eyebrow={ui.brand}>
      <p data-typo data-reveal>
        {t(careerNote, locale)}
      </p>
      <TransitionLink
        href={href(locale, "contact")}
        className={`mt-6 inline-block ${typo.linkCta}`}
      >
        {t(ui.ctaContact, locale)}
      </TransitionLink>
    </InnerMarkdownPage>
  );
}