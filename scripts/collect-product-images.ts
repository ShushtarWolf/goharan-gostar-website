import { products } from "@/content/products";
import catalogDoc from "@/content/catalog.json";
import productMeta from "@/content/products.json";
import wpSync from "@/content/wp-sync.json";
import { mergeProductImagesRaw } from "@/lib/mergeProductImages";

type CatalogProduct = { slug: string; image?: string };

const catalogBySlug = new Map(
  (catalogDoc.products as CatalogProduct[]).map((p) => [p.slug, p]),
);

const SLUGS = [
  ...new Set([
    ...productMeta.map((p: { slug: string }) => p.slug),
    ...Object.keys(wpSync.products as object),
    ...(catalogDoc.products as CatalogProduct[]).map((p) => p.slug),
  ]),
];

const paths = new Set<string>();
for (const slug of SLUGS) {
  const catalog = catalogBySlug.get(slug);
  const meta = productMeta.find((p: { slug: string }) => p.slug === slug);
  const wpImages = (wpSync.mediaBySlug as Record<string, string[]>)[slug];
  const baseImages = [
    ...(catalog?.image ? [catalog.image] : []),
    ...(wpImages ?? (meta as { images?: string[] })?.images ?? []),
  ].filter((src, i, arr) => arr.indexOf(src) === i);
  const { images } = mergeProductImagesRaw(slug, baseImages);
  for (const im of images) paths.add(im);
}

process.stdout.write(JSON.stringify([...paths].sort(), null, 0));