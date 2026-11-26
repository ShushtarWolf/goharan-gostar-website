"use client";

import RelatedMagneticLink from "@/components/RelatedMagneticLink";
import { asset } from "@/lib/asset";
import { productTransitionName } from "@/lib/motion/viewTransition";

type Props = {
  href: string;
  slug: string;
  title: string;
  body: string;
  image?: string;
};

export default function ProductListItem({
  href,
  slug,
  title,
  body,
  image,
}: Props) {
  const short =
    body.length > 140
      ? `${body.slice(0, 137).replace(/\s+\S*$/, "")}…`
      : body;
  const vtName = productTransitionName(slug);

  return (
    <div data-reveal className="space-y-4">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          data-photo
          src={asset(image)}
          alt=""
          loading="lazy"
          decoding="async"
          className="goo-picture mx-auto block h-40 w-full max-w-md object-contain p-4 opacity-90"
          style={{ viewTransitionName: vtName }}
        />
      ) : null}
      <RelatedMagneticLink href={href} title={title} body={short} />
    </div>
  );
}