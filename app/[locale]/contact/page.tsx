import InnerMarkdownPage from "@/components/content/InnerMarkdownPage";
import { typo } from "@/components/layout/typography";
import TransitionLink from "@/components/motion/TransitionLink";
import { ui } from "@/content/ui";
import { href } from "@/lib/paths";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <InnerMarkdownPage title={t(ui.contact.title, locale)} eyebrow={ui.brand}>
      <p data-typo data-reveal>
        {t(ui.contact.iran, locale)}
      </p>
      <p data-reveal>
        Tel:{" "}
        <a className="text-cyan transition hover:text-mist" href={`tel:${ui.contact.phoneIran}`}>
          {ui.contact.phoneIran}
        </a>
      </p>
      <p data-typo data-reveal>
        {t(ui.contact.turkey, locale)}
      </p>
      <p data-reveal>
        Tel:{" "}
        <a
          className="text-cyan transition hover:text-mist"
          href={`tel:${ui.contact.phoneTurkey}`}
        >
          {ui.contact.phoneTurkey}
        </a>
      </p>
      <p data-reveal>
        Email:{" "}
        <a
          className="text-cyan transition hover:text-mist"
          href={`mailto:${ui.contact.email}`}
          dir="ltr"
        >
          {ui.contact.email}
        </a>
      </p>
      <TransitionLink
        href={href(locale, "catalogs")}
        className={`mt-4 inline-block ${typo.linkCta}`}
      >
        {t(ui.nav.catalogs, locale)}
      </TransitionLink>
    </InnerMarkdownPage>
  );
}