import hqManifest from "@/content/product-hq-images.json";
import type { ProductMedia } from "@/content/products.types";
import { applyStudioToMedia } from "@/lib/applyStudioImages";

type HqEntry = {
  default: string;
  srcSet?: string;
  avifSrcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  credit?: { fa: string; en: string; tr: string } | null;
  placeholder?: boolean;
};

type HqSlug = {
  primary?: HqEntry | null;
  gallery?: HqEntry[];
};

const manifest = hqManifest as Record<string, HqSlug>;

function entryToMedia(e: HqEntry): ProductMedia {
  return {
    src: e.default,
    srcSet: e.srcSet,
    avifSrcSet: e.avifSrcSet,
    sizes: e.sizes,
    width: e.width,
    height: e.height,
    credit: e.credit ?? undefined,
    placeholder: e.placeholder,
  };
}

/** HQ + catalog paths before studio cutout mapping */
export function mergeProductImagesRaw(
  slug: string,
  baseImages: string[],
): { images: string[]; media: ProductMedia[] } {
  const hq = manifest[slug];
  if (!hq?.primary) {
    return {
      images: baseImages,
      media: baseImages.map((src) => ({ src })),
    };
  }

  const lead: ProductMedia[] = [entryToMedia(hq.primary)];
  for (const g of hq.gallery ?? []) {
    lead.push(entryToMedia(g));
  }

  const leadSrcs = new Set(lead.map((m) => m.src));
  const tail = baseImages.filter((src) => !leadSrcs.has(src));

  return {
    images: [...lead.map((m) => m.src), ...tail],
    media: [...lead, ...tail.map((src) => ({ src }))],
  };
}

export function mergeProductImages(
  slug: string,
  baseImages: string[],
): { images: string[]; media: ProductMedia[] } {
  const raw = mergeProductImagesRaw(slug, baseImages);
  const media = applyStudioToMedia(raw.media);
  return {
    images: media.map((m) => m.src),
    media,
  };
}