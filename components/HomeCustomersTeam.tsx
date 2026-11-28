import { asset } from "@/lib/asset";
import { homeCopy } from "@/content/home";
import { t, type Locale } from "@/lib/i18n";
import { typo } from "@/components/layout/typography";

export default function HomeCustomersTeam({ locale }: { locale: Locale }) {
  return (
    <section
      data-typo-scene
      className={`relative bg-mist text-ink ${typo.sectionX} py-32 md:py-44`}
    >
      <span
        data-goo-hold
        aria-hidden
        className="pointer-events-none absolute bottom-24 left-1/2 h-2 w-28 -translate-x-1/2"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="overflow-hidden text-center">
          <h2 data-typo className={`${typo.sectionTitle} !text-ink`}>
            {t(homeCopy.customersTitle, locale)}
          </h2>
        </div>
        <ul
          className={`${typo.stackXl} flex flex-wrap items-center justify-center gap-x-12 gap-y-10 md:gap-x-20`}
        >
          {homeCopy.customers.map((logo) => (
            <li
              key={logo.src}
              className="flex h-20 shrink-0 items-center justify-center md:h-24"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(logo.src)}
                alt={t(logo.alt, locale)}
                className="customer-logo max-h-full w-auto max-w-[11rem] object-contain md:max-w-[14rem]"
              />
            </li>
          ))}
        </ul>

        <div className="mt-24 overflow-hidden pt-8 text-center md:mt-32 md:pt-12">
          <h2 data-typo className={`${typo.sectionTitle} !text-ink`}>
            {t(homeCopy.teamTitle, locale)}
          </h2>
        </div>
        <ul
          className={`${typo.stackXl} grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-6 md:gap-x-8 md:gap-y-16 lg:grid-cols-5`}
        >
          {homeCopy.team.map((member) => (
            <li
              key={member.name.en}
              className="flex flex-col items-center px-1 text-center max-md:last:col-span-2 md:col-span-2 md:[&:nth-child(4)]:col-start-2 lg:col-span-1 lg:[&:nth-child(4)]:col-start-auto"
            >
              <p className="font-display text-base font-medium leading-snug text-ink text-balance md:text-lg">
                {t(member.name, locale)}
              </p>
              <p className="mt-1.5 text-sm leading-6 text-ink/55">
                {t(member.role, locale)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
