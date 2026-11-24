import { categories } from "@/content/categories";
import { products } from "@/content/products";
import { ui } from "@/content/ui";
import { href } from "@/lib/paths";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-semibold text-mist md:text-4xl">
        {t(ui.productsPage.title, locale)}
      </h1>

      {/* Top chips only — no hamburger */}
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        <a
          href={href(locale, "products")}
          className="whitespace-nowrap border border-cyan bg-cyan/10 px-4 py-2 text-sm text-cyan"
        >
          {t(ui.productsPage.all, locale)}
        </a>
        {categories.map((c) => (
          <a
            key={c.id}
            href={`${href(locale, "products")}#${c.id}`}
            className="whitespace-nowrap border border-white/15 px-4 py-2 text-sm text-mist/80 transition hover:border-cyan/50 hover:text-cyan"
          >
            {t(c.name, locale)}
          </a>
        ))}
      </div>

      <div className="mt-12 space-y-14">
        {categories.map((c) => {
          const list = products.filter((p) => p.category === c.id);
          if (!list.length) return null;
          return (
            <section key={c.id} id={c.id}>
              <h2 className="mb-5 text-xl font-medium text-cyan">{t(c.name, locale)}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => (
                  <a
                    key={p.slug}
                    href={href(locale, `products/${p.slug}`)}
                    className="border border-white/10 bg-graphite-soft p-5 transition hover:border-cyan/40"
                  >
                    <h3 className="text-base font-semibold text-mist">
                      {t(p.name, locale)}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-mist/65">
                      {t(p.intro, locale)}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
