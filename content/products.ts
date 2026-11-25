import type { CategoryId } from "@/content/categories";
import { productSpecOverrides } from "@/content/product-spec-overrides";
import type { Product, SpecsStatus } from "@/content/products.types";
import type { Localized } from "@/lib/i18n";
import productMeta from "@/content/products.json";
import wpSync from "@/content/wp-sync.json";

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

function joinIntro(block?: WpLocaleBlock): string {
  if (!block?.paragraphs?.length) return "";
  return block.paragraphs
    .filter((p) => !p.includes("First Column") && !p.includes("ستون اول"))
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

function buildProduct(slug: string): Product | null {
  const meta = productMeta.find((p) => p.slug === slug);
  const sync = (wpSync.products as Record<string, WpProduct>)[slug];
  if (!meta && !sync) return null;

  const category =
    GROUP_TO_CATEGORY[meta?.group ?? ""] ??
    ("industrial" as CategoryId);

  const override = productSpecOverrides[slug];

  const name: Localized<string> = {
    fa: sync?.fa?.title ?? meta?.titleFa ?? slug,
    en: sync?.en?.title ?? meta?.titleFa ?? slug,
    tr: sync?.en?.title ?? meta?.titleFa ?? slug,
  };

  const introFa = joinIntro(sync?.fa) || meta?.excerpt?.slice(0, 280) || "";
  const introEn = joinIntro(sync?.en) || meta?.body?.slice(0, 280) || introFa;

  const features: Localized<string[]> = override?.features ?? {
    fa: sync?.fa?.lists ?? [],
    en: sync?.en?.lists?.length ? sync.en.lists : sync?.fa?.lists ?? [],
    tr: sync?.en?.lists?.length ? sync.en.lists : sync?.fa?.lists ?? [],
  };

  const { table, status } = specsFromSync(slug, sync);

  const images =
    (wpSync.mediaBySlug as Record<string, string[]>)[slug] ??
    meta?.images ??
    [];

  return {
    slug,
    category,
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
            (p) => !p.includes("ستون اول") && p.length > 20,
          ),
          en:
            sync.en?.paragraphs?.filter(
              (p) => !p.includes("First Column") && p.length > 20,
            ) ?? sync.fa.paragraphs,
          tr:
            sync.en?.paragraphs?.filter(
              (p) => !p.includes("First Column") && p.length > 20,
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

/** Related products under a home scrub scene — skip very short intros. */
export function productsForHomeScene(scene: NonNullable<Product["homeScene"]>) {
  return products.filter(
    (p) => p.homeScene === scene && p.intro.fa.length > 80,
  );
}