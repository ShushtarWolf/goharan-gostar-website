"use client";

import { getIndustry } from "@/content/industries";
import { productsByIndustry } from "@/content/products";
import { ui } from "@/content/ui";
import { href } from "@/lib/paths";
import { t, type Locale } from "@/lib/i18n";
import { typo } from "@/components/layout/typography";
import ProductListItem from "@/components/products/ProductListItem";
import TransitionLink from "@/components/motion/TransitionLink";
import type { IndustryId } from "@/content/industries";

export default function IndustryCatalog({
  locale,
  industryId,
}: {
  locale: Locale;
  industryId: IndustryId;
}) {
  const industry = getIndustry(industryId);
  const list = productsByIndustry(industryId);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        <TransitionLink href={href(locale, "industries")} className={typo.linkCta}>
          {t(ui.industriesPage.all, locale)}
        </TransitionLink>
        <TransitionLink
          href={href(locale, "products")}
          locale={locale}
          path="products"
          className={`${typo.linkCta} text-mist/55 hover:text-cyan`}
        >
          {t(ui.nav.products, locale)}
        </TransitionLink>
      </div>

      {industry ? (
        <p className={`mx-auto mt-8 max-w-2xl text-center ${typo.bodyOnDark}`}>
          {t(industry.intro, locale)}
        </p>
      ) : null}

      <div className="mt-14 space-y-12 md:space-y-16">
        {!list.length ? (
          <p className={`text-center ${typo.bodyOnDark}`}>
            {t(ui.productsPage.empty, locale)}
          </p>
        ) : (
          list.map((p) => (
            <ProductListItem
              key={p.slug}
              slug={p.slug}
              href={href(locale, `products/${p.slug}`)}
              title={t(p.name, locale)}
              body={t(p.intro, locale)}
              image={p.images?.[0]}
              media={p.media?.[0]}
            />
          ))
        )}
      </div>
    </>
  );
}