import PageShell from "@/components/layout/PageShell";
import InnerPageHero from "@/components/layout/InnerPageHero";
import PageContent from "@/components/layout/PageContent";
import ProductsCatalog from "@/components/products/ProductsCatalog";
import { ui } from "@/content/ui";
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
    <PageShell>
      <InnerPageHero
        eyebrow={ui.brand}
        title={t(ui.productsPage.title, locale)}
      />
      <PageContent width="6xl" variant="soft">
        <ProductsCatalog locale={locale} />
      </PageContent>
    </PageShell>
  );
}