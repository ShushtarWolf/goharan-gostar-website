import { typo } from "@/components/layout/typography";

type Props = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
};

/** Cinematic hero band — same structure as homepage `structure` / CTA sections. */
export default function InnerPageHero({ title, eyebrow, subtitle }: Props) {
  return (
    <section className={`relative flex min-h-[42vh] items-center overflow-hidden bg-graphite-soft md:min-h-[48vh] ${typo.sectionX} ${typo.sectionY}`}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite via-graphite/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,168,232,0.12),transparent_55%)]" />
      <div className="relative z-10 mx-auto w-full max-w-3xl text-center [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
        {eyebrow ? (
          <p data-typo className={`mb-4 ${typo.eyebrowCyan}`}>
            {eyebrow}
          </p>
        ) : null}
        <h1 data-typo className={typo.heroTitle}>
          {title}
        </h1>
        {subtitle ? (
          <p data-typo className={`max-w-xl mx-auto ${typo.stackMd} ${typo.bodyOnDark}`}>
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}