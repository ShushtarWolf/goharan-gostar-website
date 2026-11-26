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
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-center">
        {images.map((src, i) => (
          <figure
            key={src}
            className={`w-full ${i === 0 ? "max-w-xl" : "max-w-md"} border-white/0 bg-transparent`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-photo
              src={asset(src)}
              alt=""
              className={`product-feather-img h-auto w-full object-contain ${
                i === 0
                  ? "max-h-96 p-2 sm:max-h-[28rem]"
                  : "max-h-80 p-3 sm:max-w-md"
              }`}
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