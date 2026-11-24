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

      {/* Top chips only — no hamburger, no borders */}
      <div className="mt-8 flex gap-5 overflow-x-auto pb-2 text-sm">
        <a
          href={href(locale, "products")}
          className="whitespace-nowrap text-cyan"
        >
          {t(ui.productsPage.all, locale)}
        </a>
        {categories.map((c) => (
          <a
            key={c.id}
            href={`${href(locale, "products")}#${c.id}`}
            className="whitespace-nowrap text-mist/70 transition hover:text-cyan"
          >
            {t(c.name, locale)}
          </a>
        ))}
      </div>

      <div className="mt-14 space-y-16">
        {categories.map((c) => {
          const list = products.filter((p) => p.category === c.id);
          if (!list.length) return null;
          return (
            <section key={c.id} id={c.id}>
              <h2 className="mb-8 text-sm tracking-wide text-cyan">
                {t(c.name, locale)}
              </h2>
              <div className="flex flex-col gap-8">
                {list.map((p) => (
                  <a
                    key={p.slug}
                    href={href(locale, `products/${p.slug}`)}
                    className="group block max-w-2xl transition"
                  >
                    <h3 className="text-xl font-semibold text-mist transition group-hover:text-cyan md:text-2xl">
                      {t(p.name, locale)}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-mist/65">
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
