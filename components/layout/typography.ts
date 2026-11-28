/** Shared type and spacing scale — 3 heading sizes, one spacing ladder. */
export const typo = {
  /** h1 — Kalameh Bold (700) on fa via `.font-locale-fa .typo-hero`. */
  heroTitle:
    "typo-hero font-display text-4xl font-semibold leading-[1.15] tracking-tight text-mist md:text-6xl lg:text-7xl",
  /** h2 */
  sectionTitle:
    "typo-section font-display text-3xl font-semibold leading-snug tracking-tight text-mist md:text-5xl md:leading-[1.2]",
  /** h3 / card titles */
  subsectionTitle:
    "typo-sub font-display text-lg font-medium text-cyan md:text-xl",
  eyebrowCyan:
    "text-[11px] font-medium tracking-[0.35em] text-cyan md:text-xs",
  eyebrowNavy:
    "text-[11px] font-medium tracking-[0.3em] text-navy md:text-xs",
  bodyOnDark:
    "text-base leading-9 text-mist/65 md:text-lg md:leading-10",
  bodyOnDarkSm:
    "text-base leading-8 text-mist/80 md:text-lg md:leading-9",
  linkCta:
    "text-sm tracking-[0.15em] text-cyan transition hover:text-mist",
  categoryLabel:
    "text-[11px] font-medium tracking-[0.35em] text-cyan md:text-xs",
  sectionX: "px-6 md:px-12",
  sectionY: "py-20 md:py-28",
  sectionYLg: "py-28 md:py-36",
  stackSm: "mt-4 md:mt-5",
  stackMd: "mt-6 md:mt-8",
  stackLg: "mt-8 md:mt-10",
  stackXl: "mt-10 md:mt-12",
  /** Home-only spacing. Do not use on other pages. */
  homeYLg: "py-40 md:py-56",
  homeRelatedY: "pb-40 pt-24 md:pb-52 md:pt-32",
  /** Home mission lead: large, quiet type (not a shouty heading). */
  homeMission:
    "typo-section font-display text-2xl font-normal leading-[1.55] tracking-normal text-mist/80 md:text-4xl md:leading-[1.5]",
} as const;
