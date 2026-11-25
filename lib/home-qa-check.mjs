/**
 * ponytail: homepage must not ship painted goo anchors.
 * Run: node lib/home-qa-check.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const home = readFileSync(join(root, "components/HomeExperience.tsx"), "utf8");
const css = readFileSync(join(root, "app/globals.css"), "utf8");

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

console.log("ok: no painted goo anchors; intro goo-picture kept");
