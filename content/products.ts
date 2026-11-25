import type { CategoryId } from "@/content/categories";
import catalogDoc from "@/content/catalog.json";
import {
  industryToCategory,
  type IndustryId,
} from "@/content/industries";
import { productSpecOverrides } from "@/content/product-spec-overrides";
import type { Product, SpecsStatus } from "@/content/products.types";
import type { Localized } from "@/lib/i18n";
import productMeta from "@/content/products.json";
import wpSync from "@/content/wp-sync.json";

type CatalogProduct = {
  slug: string;
  nameFa: string;
  nameLatin: string;
  descriptionEn: string;
  descriptionFa: string;
  image?: string;
  industries: IndustryId[];
};

const catalogBySlug = new Map(
  (catalogDoc.products as CatalogProduct[]).map((p) => [p.slug, p]),
);

type WpLocaleBlock = {
  title?: string;
  paragraphs?: string[];
  lists?: string[];
  link?: string;
};

type WpProduct = {
  slug: string;
  fa?: WpLocaleBlock;
  en?: WpLocaleBlock;
  wpPath?: { fa?: string; en?: string };
  tables?: { fa?: string[][]; en?: string[][] };
};

const GROUP_TO_CATEGORY: Record<string, CategoryId> = {
  industrial: "industrial",
  medical: "medical-devices",
  laboratory: "laboratory-filtration",
  writing: "writing-instruments",
  "air-care": "air-care",
  water: "water-filtration",
  "oil-gas": "oil-gas",
};

function isPlaceholderTable(table: string[][] | undefined): boolean {
  if (!table?.length) return true;
  const flat = table.flat().join(" ");
  return (
    flat.includes("ستون اول") ||
    flat.includes("First Column") ||
    flat.includes("ردیف اول")
  );
}

function mentionsPrice(text: string): boolean {
  return /قیمت|price\b|competitive price|reasonable price|\$\s*\d/i.test(text);
}

function joinIntro(block?: WpLocaleBlock): string {
  if (!block?.paragraphs?.length) return "";
  return block.paragraphs
    .filter(
      (p) =>
        !p.includes("First Column") &&
        !p.includes("ستون اول") &&
        !mentionsPrice(p),
    )
    .slice(0, 2)
    .join("\n\n");
}

function specsFromSync(
  slug: string,
  sync?: WpProduct,
): { table: Localized<string[][]> | null; status: SpecsStatus } {
  const override = productSpecOverrides[slug];
  if (override?.specsTable) {
    return {
      table: override.specsTable,
      status: override.specsStatus ?? "ok",
    };
  }
  const fa = sync?.tables?.fa;
  const en = sync?.tables?.en;
  if (fa && !isPlaceholderTable(fa)) {
    return {
      table: { fa, tr: en ?? fa, en: en ?? fa },
      status: "ok",
    };
  }
  if (fa && isPlaceholderTable(fa)) {
    return {
      table: override?.specsTable ?? {
        fa,
        tr: sync?.tables?.en ?? fa,
        en: en ?? fa,
      },
      status: "placeholder",
    };
  }
  return { table: null, status: "none" };
}

function categoryFromIndustries(industries: IndustryId[]): CategoryId {
  for (const id of industries) {
    const c = industryToCategory[id];
    if (c) return c;
  }
  return "industrial";
}

function buildProduct(slug: string): Product | null {
  const meta = productMeta.find((p) => p.slug === slug);
  const sync = (wpSync.products as Record<string, WpProduct>)[slug];
  const catalog = catalogBySlug.get(slug);
  if (!meta && !sync && !catalog) return null;

  const industries = catalog?.industries ?? [];
  const category =
    GROUP_TO_CATEGORY[meta?.group ?? ""] ??
    categoryFromIndustries(industries);

  const override = productSpecOverrides[slug];

  const name: Localized<string> = {
    fa:
      sync?.fa?.title ??
      catalog?.nameFa ??
      meta?.titleFa ??
      catalog?.nameLatin ??
      slug,
    en: sync?.en?.title ?? catalog?.nameLatin ?? meta?.titleFa ?? slug,
    tr: sync?.en?.title ?? catalog?.nameLatin ?? meta?.titleFa ?? slug,
  };

  const introFa =
    joinIntro(sync?.fa) ||
    catalog?.descriptionFa?.slice(0, 420) ||
    meta?.excerpt?.slice(0, 280) ||
    "";
  const introEn =
    joinIntro(sync?.en) ||
    catalog?.descriptionEn?.slice(0, 420) ||
    meta?.body?.slice(0, 280) ||
    introFa;

  const filterList = (items: string[] | undefined) =>
    (items ?? []).filter((line) => !mentionsPrice(line));

  const features: Localized<string[]> = override?.features ?? {
    fa: filterList(sync?.fa?.lists),
    en: filterList(sync?.en?.lists?.length ? sync.en.lists : sync?.fa?.lists),
    tr: filterList(sync?.en?.lists?.length ? sync.en.lists : sync?.fa?.lists),
  };

  const { table, status } = specsFromSync(slug, sync);

  const wpImages = (wpSync.mediaBySlug as Record<string, string[]>)[slug];
  const images = [
    ...(catalog?.image ? [catalog.image] : []),
    ...(wpImages ?? meta?.images ?? []),
  ].filter((src, i, arr) => arr.indexOf(src) === i);

  return {
    slug,
    category,
    industries:
      industries.length > 0
        ? industries
        : ([
            Object.entries(industryToCategory).find(
              ([, c]) => c === category,
            )?.[0] as IndustryId | undefined,
          ].filter(Boolean) as IndustryId[]),
    homeScene: override?.homeScene,
    name,
    intro: {
      fa: introFa,
      en: introEn,
      tr: introEn,
    },
    body: sync?.fa?.paragraphs?.length
      ? {
          fa: sync.fa.paragraphs.filter(
            (p) =>
              !p.includes("ستون اول") && p.length > 20 && !mentionsPrice(p),
          ),
          en:
            sync.en?.paragraphs?.filter(
              (p) =>
                !p.includes("First Column") &&
                p.length > 20 &&
                !mentionsPrice(p),
            ) ?? sync.fa.paragraphs,
          tr:
            sync.en?.paragraphs?.filter(
              (p) =>
                !p.includes("First Column") &&
                p.length > 20 &&
                !mentionsPrice(p),
            ) ?? sync.fa.paragraphs,
        }
      : undefined,
    features,
    images,
    specsTable: table,
    specsStatus: override?.specsStatus ?? status,
    wpPath: {
      fa: sync?.wpPath?.fa,
      en: sync?.wpPath?.en ?? meta?.wpUrl?.replace("https://goharangostar.com", ""),
    },
  };
}

const SLUGS = [
  ...new Set([
    ...productMeta.map((p) => p.slug),
    ...Object.keys(wpSync.products as object),
    ...(catalogDoc.products as CatalogProduct[]).map((p) => p.slug),
  ]),
].sort();

export const products: Product[] = SLUGS.map(buildProduct).filter(
  (p): p is Product => p !== null,
);

export type { Product, SpecsStatus };

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function productsByCategory(category: CategoryId | "all") {
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
}

export function productsByIndustry(industry: IndustryId | "all") {
  if (industry === "all") return products;
  return products.filter((p) => p.industries.includes(industry));
}

/** Related products under a home scrub scene — skip very short intros. */
export function productsForHomeScene(scene: NonNullable<Product["homeScene"]>) {
  return products.filter(
    (p) => p.homeScene === scene && p.intro.fa.length > 80,
  );
}