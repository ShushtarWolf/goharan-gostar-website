import type { ProductMedia } from "@/content/products.types";
import ProductResponsiveImage from "@/components/products/ProductResponsiveImage";
import { t, type Locale } from "@/lib/i18n";
import { ui } from "@/content/ui";

export default function ProductGallery({
  media,
  slug,
  locale = "fa",
}: {
  media: ProductMedia[];
  slug?: string;
  locale?: Locale;
}) {
  if (!media.length) return null;

  return (
    <section className="mt-10">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-center">
        {media.map((m, i) => {
          const isHero = i === 0;
          const credit = m.credit ? t(m.credit, locale) : null;
          return (
            <figure
              key={`${m.src}-${i}`}
              className={`w-full ${isHero ? "max-w-xl" : "max-w-md"} border-white/0 bg-transparent`}
            >
              <ProductResponsiveImage
                media={m}
                slug={slug}
                hero={isHero}
                loading={isHero ? "eager" : "lazy"}
                className={`product-feather-img h-auto w-full object-contain ${
                  isHero
                    ? "max-h-96 p-2 sm:max-h-[28rem]"
                    : "max-h-80 p-3 sm:max-w-md"
                }`}
              />
              {credit ? (
                <figcaption
                  className="mt-2 text-center text-[11px] leading-snug text-mist/45"
                  data-typo
                >
                  {t(ui.productDetail.imageCredit, locale)}: {credit}
                </figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>
    </section>
  );
}