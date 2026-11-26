"use client";

import { categories } from "@/content/categories";
import { products } from "@/content/products";
import { ui } from "@/content/ui";
import { href } from "@/lib/paths";
import { t, type Locale } from "@/lib/i18n";
import { typo } from "@/components/layout/typography";
import ProductListItem from "@/components/products/ProductListItem";
import TransitionLink from "@/components/motion/TransitionLink";

export default function ProductsCatalog({ locale }: { locale: Locale }) {
  return (
    <>
      <div className="mt-2 flex flex-wrap justify-center gap-4 md:gap-6">
        <TransitionLink href={href(locale, "products")} className={typo.linkCta}>
          {t(ui.productsPage.all, locale)}
        </TransitionLink>
        <TransitionLink
          href={href(locale, "industries")}
          locale={locale}
          path="industries"
          className={`${typo.linkCta} text-mist/55 hover:text-cyan`}
        >
          {t(ui.nav.industries, locale)}
        </TransitionLink>
        {categories.map((c) => (
          <a
            key={c.id}
            href={`${href(locale, "products")}#${c.id}`}
            className={`${typo.linkCta} text-mist/55 hover:text-cyan`}
          >
            {t(c.name, locale)}
          </a>
        ))}
      </div>

      <div className="mt-16 space-y-20 md:mt-20 md:space-y-28">
        {categories.map((c) => {
          const list = products.filter((p) => p.category === c.id);
          return (
            <section key={c.id} id={c.id} className="text-center">
              <p className={typo.categoryLabel}>{t(c.name, locale)}</p>
              {!list.length ? (
                <p className={`mt-6 ${typo.bodyOnDark}`}>
                  {t(ui.productsPage.empty, locale)}
                </p>
              ) : (
                <div className="mt-10 space-y-12 md:space-y-16">
                  {list.map((p) => (
                    <ProductListItem
                      key={p.slug}
                      slug={p.slug}
                      href={href(locale, `products/${p.slug}`)}
                      title={t(p.name, locale)}
                      body={t(p.intro, locale)}
                      image={p.images?.[0]}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}