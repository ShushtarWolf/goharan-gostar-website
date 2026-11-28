import { homeExtra } from "@/content/home-extra";
import { href } from "@/lib/paths";
import { t, type Locale } from "@/lib/i18n";
import { typo } from "@/components/layout/typography";
import TransitionLink from "@/components/motion/TransitionLink";

/** Home sections after "Our solutions": collaboration steps, articles, Abadis Med banner. */
export default function HomeCollabArticlesAbadis({ locale }: { locale: Locale }) {
  const { collab, articles, abadis } = homeExtra;
  return (
    <>
      <section className={`relative bg-graphite-soft ${typo.sectionX} py-24 md:py-32`}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className={`mb-4 ${typo.eyebrowCyan}`}>{t(collab.eyebrow, locale)}</p>
            <h2 className={typo.sectionTitle}>{t(collab.title, locale)}</h2>
            <p className={`mx-auto max-w-2xl ${typo.stackMd} ${typo.bodyOnDark}`}>
              {t(collab.lead, locale)}
            </p>
          </div>
          <ol className={`${typo.stackXl} grid gap-8 md:grid-cols-3 md:gap-10`}>
            {collab.steps.map((step, i) => (
              <li key={step.title.en} className="border-t border-cyan/40 pt-5">
                <span className="text-sm tracking-[0.2em] text-cyan">
                  {(i + 1).toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold text-mist md:text-2xl">
                  {t(step.title, locale)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-mist/65 md:text-base md:leading-8">
                  {t(step.body, locale)}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <TransitionLink
              href={href(locale, "contact")}
              className="inline-block rounded-full border border-cyan px-8 py-3 text-sm font-medium text-cyan transition hover:bg-cyan hover:text-graphite"
            >
              {t(collab.cta, locale)}
            </TransitionLink>
          </div>
        </div>
      </section>

      <section className={`relative bg-graphite ${typo.sectionX} py-20 md:py-28`}>
        <div className="mx-auto max-w-3xl text-center">
          <p className={`mb-4 ${typo.eyebrowCyan}`}>{t(articles.eyebrow, locale)}</p>
          <h2 className={typo.sectionTitle}>{t(articles.title, locale)}</h2>
          <p className={`${typo.stackMd} ${typo.bodyOnDark}`}>{t(articles.body, locale)}</p>
          <TransitionLink
            href={href(locale, "knowledge")}
            className={`${typo.stackLg} inline-block ${typo.linkCta}`}
          >
            {t(articles.cta, locale)}
          </TransitionLink>
        </div>
      </section>

      <section className={`relative bg-graphite ${typo.sectionX} pb-24 md:pb-32`}>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-cyan/40 bg-gradient-to-br from-cyan/20 via-graphite-soft to-graphite px-6 py-14 text-center shadow-[0_0_80px_-20px_rgba(0,168,232,0.55)] md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-cyan/20 blur-3xl"
          />
          <div className="relative">
            <p className={`mb-4 ${typo.eyebrowCyan}`}>{t(abadis.eyebrow, locale)}</p>
            <h2 className={typo.sectionTitle}>{t(abadis.title, locale)}</h2>
            <p className={`mx-auto max-w-2xl ${typo.stackMd} text-lg leading-9 text-mist/85 md:text-xl md:leading-10`}>
              {t(abadis.body, locale)}
            </p>
            <a
              href={abadis.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${typo.stackLg} inline-block rounded-full bg-cyan px-8 py-3 text-sm font-semibold text-graphite transition hover:bg-mist md:text-base`}
            >
              <span dir="ltr">{t(abadis.cta, locale)}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
