"use client";

import ProductGallery from "@/components/ProductGallery";
import AnimatedSpecsTable from "@/components/motion/AnimatedSpecsTable";
import TransitionLink from "@/components/motion/TransitionLink";
import PageContent from "@/components/layout/PageContent";
import InnerPageHero from "@/components/layout/InnerPageHero";
import PageShell from "@/components/layout/PageShell";
import { typo } from "@/components/layout/typography";
import type { Product } from "@/content/products.types";
import { ui } from "@/content/ui";
import { href } from "@/lib/paths";
import { t, type Locale } from "@/lib/i18n";

export default function ProductDetailView({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const specs = product.specsTable ? t(product.specsTable, locale) : null;
  const features = t(product.features, locale);
  const intro = t(product.intro, locale);

  return (
    <PageShell>
      <InnerPageHero
        eyebrow={ui.brand}
        title={t(product.name, locale)}
        subtitle={intro.slice(0, 200) + (intro.length > 200 ? "…" : "")}
      />
      <PageContent>
        <TransitionLink href={href(locale, "products")} className={typo.linkCta}>
          {t(ui.productDetail.back, locale)}
        </TransitionLink>

        {product.media && product.media.length > 0 ? (
          <ProductGallery
            media={product.media}
            slug={product.slug}
            locale={locale}
          />
        ) : null}

        <section className="mt-12" data-reveal>
          <h2 data-typo className={typo.subsectionTitle}>
            {t(ui.productDetail.intro, locale)}
          </h2>
          <p data-typo className={`mt-4 ${typo.bodyOnDarkSm}`}>
            {intro}
          </p>
          {product.body && t(product.body, locale).length > 1 ? (
            <div className="mt-6 space-y-4">
              {t(product.body, locale)
                .slice(1)
                .map((para) => (
                  <p key={para.slice(0, 32)} data-typo className={typo.bodyOnDark}>
                    {para}
                  </p>
                ))}
            </div>
          ) : null}
        </section>

        {features.length > 0 ? (
          <section className="mt-12" data-reveal>
            <h2 data-typo className={typo.subsectionTitle}>
              {t(ui.productDetail.features, locale)}
            </h2>
            <ul className="mt-4 list-disc space-y-2 pe-5 text-mist/80">
              {features.map((f) => (
                <li key={f} data-typo>
                  {f}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {specs && specs.length > 0 ? (
          <section className="mt-12">
            <h2 data-typo className={typo.subsectionTitle}>
              {t(ui.productDetail.specs, locale)}
            </h2>
            <AnimatedSpecsTable
              specs={specs}
              placeholderNote={
                product.specsStatus === "placeholder"
                  ? t(ui.productDetail.placeholderNote, locale)
                  : undefined
              }
            />
          </section>
        ) : null}
      </PageContent>
    </PageShell>
  );
}