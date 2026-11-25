import ProductDetailView from "@/components/products/ProductDetailView";
import { products, getProduct } from "@/content/products";
import { isLocale, locales, type Locale } from "@/lib/i18n";
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

  return <ProductDetailView product={product} locale={locale} />;
}