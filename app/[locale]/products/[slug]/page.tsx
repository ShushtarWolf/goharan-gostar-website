import { products, getProduct } from "@/content/products";
import { ui } from "@/content/ui";
import { href } from "@/lib/paths";
import { isLocale, locales, t, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    products.map((p) => ({ locale, slug: p.slug })),
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const product = getProduct(slug);
  if (!product) notFound();

  const specs = product.specsTable ? t(product.specsTable, locale) : null;
  const features = t(product.features, locale);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <a href={href(locale, "products")} className="text-sm text-cyan hover:underline">
        {t(ui.productDetail.back, locale)}
      </a>

      <h1 className="mt-6 text-3xl font-semibold text-mist md:text-4xl">
        {t(product.name, locale)}
      </h1>

      <section className="mt-10">
        <h2 className="text-lg font-medium text-cyan">
          {t(ui.productDetail.intro, locale)}
        </h2>
        <p className="mt-3 text-base leading-8 text-mist/80">
          {t(product.intro, locale)}
        </p>
      </section>

      {features.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-medium text-cyan">
            {t(ui.productDetail.features, locale)}
          </h2>
          <ul className="mt-3 list-disc space-y-2 pe-5 text-mist/80">
            {features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      {specs && specs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-medium text-cyan">
            {t(ui.productDetail.specs, locale)}
          </h2>
          {product.specsStatus === "placeholder" && (
            <p className="mt-2 text-sm text-mist/50">
              {t(ui.productDetail.placeholderNote, locale)}
            </p>
          )}
          <div className="mt-4 overflow-x-auto border border-white/10">
            <table className="min-w-full text-sm">
              <tbody>
                {specs.map((row, i) => (
                  <tr
                    key={i}
                    className={i === 0 ? "bg-white/5 font-medium text-mist" : "text-mist/75"}
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="border-t border-white/10 px-3 py-2 whitespace-nowrap"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
