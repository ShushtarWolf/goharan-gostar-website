"use client";

import RelatedMagneticLink from "@/components/RelatedMagneticLink";
import ProductResponsiveImage from "@/components/products/ProductResponsiveImage";
import type { ProductMedia } from "@/content/products.types";
import { asset } from "@/lib/asset";
import { productTransitionName } from "@/lib/motion/viewTransition";

type Props = {
  href: string;
  slug: string;
  title: string;
  body: string;
  image?: string;
  media?: ProductMedia;
};

export default function ProductListItem({
  href,
  slug,
  title,
  body,
  image,
  media,
}: Props) {
  const short =
    body.length > 140
      ? `${body.slice(0, 137).replace(/\s+\S*$/, "")}…`
      : body;
  const vtName = productTransitionName(slug);
  const heroMedia: ProductMedia | undefined =
    media ?? (image ? { src: image } : undefined);

  return (
    <div data-reveal className="space-y-4">
      {heroMedia ? (
        <div className="product-studio-frame mx-auto w-full max-w-lg px-3 py-2">
          {heroMedia.srcSet ? (
            <ProductResponsiveImage
              media={heroMedia}
              slug={slug}
              hero
              loading="lazy"
              className="product-studio-img mx-auto block h-52 w-full object-contain sm:h-56"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              data-photo
              src={asset(heroMedia.src)}
              alt=""
              loading="lazy"
              decoding="async"
              className="product-studio-img mx-auto block h-52 w-full object-contain sm:h-56"
              style={{ viewTransitionName: vtName }}
            />
          )}
        </div>
      ) : null}
      <RelatedMagneticLink href={href} title={title} body={short} />
    </div>
  );
}