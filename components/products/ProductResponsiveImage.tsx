import { asset } from "@/lib/asset";
import type { ProductMedia } from "@/content/products.types";
import { productTransitionName } from "@/lib/motion/viewTransition";

function withBase(path: string) {
  return asset(path.startsWith("/") ? path : `/${path}`);
}

function mapSrcSet(srcSet?: string) {
  if (!srcSet) return undefined;
  return srcSet
    .split(", ")
    .map((part) => {
      const [u, w] = part.split(" ");
      return `${withBase(u)} ${w}`;
    })
    .join(", ");
}

type Props = {
  media: ProductMedia;
  slug?: string;
  className?: string;
  loading?: "lazy" | "eager";
  hero?: boolean;
};

export default function ProductResponsiveImage({
  media,
  slug,
  className = "",
  loading = "lazy",
  hero = false,
}: Props) {
  const vtName = hero && slug ? productTransitionName(slug) : undefined;
  const sizes = media.sizes ?? "(max-width: 640px) 92vw, 480px";
  const webpSet = mapSrcSet(media.srcSet);
  const avifSet = mapSrcSet(media.avifSrcSet);
  const imgProps = {
    "data-photo": true,
    alt: "",
    loading,
    decoding: "async" as const,
    className,
    width: media.width,
    height: media.height,
    style: vtName ? { viewTransitionName: vtName } : undefined,
  };

  if (avifSet && webpSet) {
    return (
      <picture>
        <source type="image/avif" srcSet={avifSet} sizes={sizes} />
        <source type="image/webp" srcSet={webpSet} sizes={sizes} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          {...imgProps}
          src={withBase(media.src)}
          srcSet={webpSet}
          sizes={sizes}
        />
      </picture>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...imgProps}
      src={withBase(media.src)}
      srcSet={webpSet}
      sizes={webpSet ? sizes : undefined}
    />
  );
}