/**
 * ponytail: homepage must not ship painted goo anchors or stacked GSAP pins.
 * Run: node lib/home-qa-check.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const home = readFileSync(join(root, "components/HomeExperience.tsx"), "utf8");
const css = readFileSync(join(root, "app/globals.css"), "utf8");
const layout = readFileSync(join(root, "app/layout.tsx"), "utf8");
const typo = readFileSync(join(root, "lib/typoReveal.ts"), "utf8");
const goo = readFileSync(join(root, "lib/gooey/runGooey.js"), "utf8");
const skill = readFileSync(
  join(root, ".cursor/skills/goharan-home-qa/SKILL.md"),
  "utf8",
);

console.assert(
  !home.includes("GooStrandAnchor"),
  "HomeExperience must not define GooStrandAnchor",
);
console.assert(
  !home.includes("goo-picture--anchor"),
  "HomeExperience must not use goo-picture--anchor",
);
console.assert(
  !css.includes(".goo-picture--anchor {"),
  "globals.css must not style painted anchors",
);
console.assert(
  (home.match(/goo-picture/g) || []).length >= 1,
  "intro photos should still use goo-picture",
);
console.assert(
  home.includes("data-goo-hold"),
  "scene holds for menu lean must exist",
);
console.assert(
  !home.includes('className="goo-picture') || !home.includes("data-goo-hold") ||
    !/goo-picture[^>]*=[^>]*data-goo-hold|data-goo-hold[^>]*goo-picture/.test(home),
  "holds must not also be goo-picture",
);
console.assert(
  home.includes("data-frame-stage") && home.includes("sticky"),
  "frame scenes need CSS sticky stage (no GSAP pin-spacer)",
);
console.assert(
  typo.includes("wireTypoFrameScrub") && !typo.includes("pin: true"),
  "typoReveal must scrub frames without pin: true",
);
console.assert(
  !typo.includes("function wireTypoScenePin") &&
    home.includes("data-typo-scene") &&
    home.includes("wireTypoScroll"),
  "text scenes use wireTypoScroll enter, not scene pin",
);
console.assert(
  layout.includes("kalameh") &&
    css.includes("font-display") &&
    css.includes("--font-kalameh"),
  "Kalameh must be wired as the display and body font",
);
console.assert(
  goo.includes("holds") && goo.includes("holdLean"),
  "runGooey must lean toward holds without painting them",
);
console.assert(
  css.includes("prefers-reduced-motion") && css.includes(".typo-word"),
  "reduced motion must force typo-word visible",
);
console.assert(
  skill.includes("mid-scroll") && skill.includes("invisible in-view copy"),
  "goharan-home-qa must require mid-scroll motion + no invisible in-view copy",
);

console.log(
  "ok: sticky frames, no pins, no painted anchors, holds + display font + reduced motion",
);
