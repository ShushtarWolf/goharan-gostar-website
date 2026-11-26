import { ui } from "@/content/ui";
import { href } from "@/lib/paths";
import { t, type Locale } from "@/lib/i18n";
import TransitionLink from "@/components/motion/TransitionLink";

const LINKS: { key: keyof typeof ui.nav; path: string }[] = [
  { key: "products", path: "products" },
  { key: "industries", path: "industries" },
  { key: "applications", path: "applications" },
  { key: "about", path: "about" },
  { key: "faq", path: "faq" },
  { key: "catalogs", path: "catalogs" },
  { key: "material", path: "sintered-porous-plastic" },
  { key: "career", path: "career" },
  { key: "responsibility", path: "responsibility" },
  { key: "contact", path: "contact" },
];

export default function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-white/10 bg-graphite px-6 pb-28 pt-10 text-center md:px-12">
      <nav
        aria-label="Footer"
        className="mx-auto flex max-w-3xl flex-wrap justify-center gap-x-5 gap-y-2 text-xs tracking-wide text-mist/55"
      >
        {LINKS.map((item) => (
          <TransitionLink
            key={item.path}
            href={href(locale, item.path)}
            className="transition hover:text-cyan"
          >
            {t(ui.nav[item.key], locale)}
          </TransitionLink>
        ))}
      </nav>
      <p className="mt-8 text-xs tracking-wide text-mist/45">
        {t(ui.footer, locale)}
      </p>
    </footer>
  );
}