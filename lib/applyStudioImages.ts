import studioManifest from "@/content/product-studio-images.json";
import type { ProductMedia } from "@/content/products.types";

type StudioEntry = {
  default: string;
  srcSet?: string;
  avifSrcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  method?: string;
};

const manifest = studioManifest as Record<string, StudioEntry>;

export function applyStudioToMedia(media: ProductMedia[]): ProductMedia[] {
  return media.map((m) => {
    const studio = manifest[m.src];
    if (!studio) return m;
    return {
      ...m,
      src: studio.default,
      srcSet: studio.srcSet ?? m.srcSet,
      avifSrcSet: studio.avifSrcSet ?? m.avifSrcSet,
      sizes: studio.sizes ?? m.sizes,
      width: studio.width ?? m.width,
      height: studio.height ?? m.height,
    };
  });
}