import { asset } from "@/lib/asset";
import { productTransitionName } from "@/lib/motion/viewTransition";

export default function ProductGallery({
  images,
  slug,
}: {
  images: string[];
  slug?: string;
}) {
  if (!images.length) return null;
  const vtName = slug ? productTransitionName(slug) : undefined;
  return (
    <section className="mt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        {images.map((src, i) => (
          <figure
            key={src}
            className="overflow-hidden border border-white/10 bg-white/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-photo
              src={asset(src)}
              alt=""
              className="h-auto max-h-72 w-full max-w-sm object-contain p-4"
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              style={
                i === 0 && vtName
                  ? { viewTransitionName: vtName }
                  : undefined
              }
            />
          </figure>
        ))}
      </div>
    </section>
  );
}