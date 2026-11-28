import { ui } from "@/content/ui";
import { href } from "@/lib/paths";
import { t, type Locale } from "@/lib/i18n";
import TransitionLink from "@/components/motion/TransitionLink";

export default function SiteFooter({ locale }: { locale: Locale }) {
  const home = href(locale);
  const links: { label: string; url: string; internal?: boolean }[] = [
    { label: t(ui.footerNav.news, locale), url: `${href(locale, "knowledge")}#news`, internal: true },
    { label: t(ui.footerNav.knowledge, locale), url: href(locale, "knowledge"), internal: true },
    { label: t(ui.footerNav.products, locale), url: href(locale, "products"), internal: true },
    { label: t(ui.footerNav.departments, locale), url: `${home}#solutions` },
    { label: t(ui.footerNav.careers, locale), url: href(locale, "career"), internal: true },
  ];
  const c = ui.contact;
  const fc = ui.footerContact;

  return (
    <footer className="border-t border-white/10 bg-graphite px-6 pb-28 pt-12 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <p className="font-display text-xl font-semibold text-mist">
            {t(ui.company, locale)}
          </p>
          <p className="mt-1 text-xs tracking-[0.3em] text-cyan">{ui.brand}</p>
          <nav
            aria-label="Footer"
            className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-mist/70"
          >
            {links.map((item) =>
              item.internal ? (
                <TransitionLink
                  key={item.url}
                  href={item.url}
                  className="transition hover:text-cyan"
                >
                  {item.label}
                </TransitionLink>
              ) : (
                <a key={item.url} href={item.url} className="transition hover:text-cyan">
                  {item.label}
                </a>
              ),
            )}
          </nav>
        </div>

        <div className="text-sm leading-8 text-mist/70">
          <p className="mb-2 text-[11px] font-medium tracking-[0.35em] text-cyan md:text-xs">
            {t(fc.heading, locale)}
          </p>
          <p>{t(fc.headOffice, locale)}</p>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            {fc.phonesIran.map((phone) => (
              <li key={phone}>
                <a href={`tel:${phone}`} dir="ltr" className="transition hover:text-cyan">
                  {phone}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4">{t(fc.turkey, locale)}</p>
          <p>
            <a href={`tel:${c.phoneTurkey}`} dir="ltr" className="transition hover:text-cyan">
              {c.phoneTurkey}
            </a>
          </p>
          <p className="mt-4">
            <a href={`mailto:${c.email}`} dir="ltr" className="transition hover:text-cyan">
              {c.email}
            </a>
          </p>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs tracking-wide text-mist/45">
        {t(ui.footer, locale)}
      </p>
    </footer>
  );
}
