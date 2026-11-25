"use client";

import { industries } from "@/content/industries";
import { productsByIndustry } from "@/content/products";
import { ui } from "@/content/ui";
import { href } from "@/lib/paths";
import { t, type Locale } from "@/lib/i18n";
import { typo } from "@/components/layout/typography";
import TransitionLink from "@/components/motion/TransitionLink";

export default function IndustriesIndex({ locale }: { locale: Locale }) {
  return (
    <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {industries.map((ind) => {
        const count = productsByIndustry(ind.id).length;
        return (
          <TransitionLink
            key={ind.id}
            href={href(locale, `industries/${ind.id}`)}
            locale={locale}
            path={`industries/${ind.id}`}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-start transition hover:border-cyan/35 hover:bg-white/[0.06]"
          >
            <h2 className={`${typo.eyebrowCyan} mb-3`}>{t(ind.name, locale)}</h2>
            <p className={`${typo.bodyOnDark} text-mist/70`}>{t(ind.intro, locale)}</p>
            <p className="mt-5 text-xs tracking-wide text-mist/45">
              {count} {t(ui.industriesPage.productCount, locale)}
            </p>
          </TransitionLink>
        );
      })}
    </div>
  );
}